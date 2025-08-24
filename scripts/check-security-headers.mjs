#!/usr/bin/env node

/**
 * BelizeVibes Production Security Headers Validation Script
 * =========================================================
 * 
 * Enterprise-grade validation for production deployment readiness.
 * Checks development headers, production templates, and CI integration.
 * 
 * Usage: node scripts/check-headers.mjs [--ci] [--production]
 * 
 * Exit Codes:
 * 0 = All checks passed
 * 1 = Critical security issues found
 * 2 = Production templates missing
 */

import fs from 'fs';
import path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);
const isCIMode = args.includes('--ci');
const isProductionCheck = args.includes('--production');

console.log('🔒 BelizeVibes Security Headers Validation');
console.log('==========================================\n');

// Security validation state
let validationResults = {
    devHeaders: false,
    prodTemplates: false,
    secrets: true, // Assume safe until proven otherwise
    csp: false,
    hsts: false,
    criticalIssues: []
};

// 1. Development Headers Check (vite.config.ts)
// ==============================================
console.log('📋 Development Headers Check:');
console.log('-----------------------------');

const viteConfigPath = 'vite.config.ts';
if (fs.existsSync(viteConfigPath)) {
    const viteConfig = fs.readFileSync(viteConfigPath, 'utf-8');
    
    const requiredHeaders = [
        { header: 'X-Frame-Options', pattern: 'X-Frame-Options', critical: true },
        { header: 'X-Content-Type-Options', pattern: 'X-Content-Type-Options', critical: true },
        { header: 'Referrer-Policy', pattern: 'Referrer-Policy', critical: true },
        { header: 'Content-Security-Policy', pattern: 'Content-Security-Policy', critical: true },
        { header: 'Permissions-Policy', pattern: 'Permissions-Policy', critical: false }
    ];
    
    const foundHeaders = [];
    const missingHeaders = [];
    
    requiredHeaders.forEach(({ header, pattern, critical }) => {
        if (viteConfig.includes(pattern)) {
            foundHeaders.push({ header, critical });
        } else {
            missingHeaders.push({ header, critical });
            if (critical) {
                validationResults.criticalIssues.push(`Missing critical header in dev: ${header}`);
            }
        }
    });
    
    if (foundHeaders.length > 0) {
        console.log('✅ Development headers configured:');
        foundHeaders.forEach(({ header, critical }) => 
            console.log(`   - ${header} ${critical ? '(critical)' : '(optional)'}`));
        validationResults.devHeaders = foundHeaders.filter(h => h.critical).length >= 3;
    }
    
    if (missingHeaders.length > 0) {
        console.log('⚠️  Missing development headers:');
        missingHeaders.forEach(({ header, critical }) => 
            console.log(`   - ${header} ${critical ? '(CRITICAL)' : '(optional)'}`));
    }
    
    // Check CSP quality
    if (viteConfig.includes('Content-Security-Policy')) {
        if (viteConfig.includes('unsafe-inline') && viteConfig.includes('unsafe-eval')) {
            console.log('⚠️  CSP contains unsafe directives (acceptable for development)');
        }
        if (viteConfig.includes('supabase.co') && viteConfig.includes('stripe.com')) {
            console.log('✅ CSP includes required external domains');
            validationResults.csp = true;
        }
    }
    
} else {
    console.log('❌ vite.config.ts not found');
    validationResults.criticalIssues.push('vite.config.ts not found');
}

// 2. Production Templates Check
// =============================
console.log('\n🏭 Production Templates Check:');
console.log('------------------------------');

const productionTemplates = [
    { path: 'server/headers/nginx.conf', type: 'Nginx' },
    { path: 'server/headers/apache.htaccess', type: 'Apache' }
];

let templatesFound = 0;
productionTemplates.forEach(({ path, type }) => {
    if (fs.existsSync(path)) {
        const content = fs.readFileSync(path, 'utf-8');
        
        // Check for HSTS disabled by default
        const hstsDisabled = content.includes('HSTS_ENABLED=false') || 
                           content.includes('# add_header Strict-Transport-Security') ||
                           content.includes('# Header always set Strict-Transport-Security');
        
        // Check for CSP Report-Only mode
        const cspReportOnly = content.includes('Content-Security-Policy-Report-Only');
        
        console.log(`✅ ${type} template found: ${path}`);
        console.log(`   - HSTS disabled by default: ${hstsDisabled ? '✅' : '⚠️'}`);
        console.log(`   - CSP Report-Only mode: ${cspReportOnly ? '✅' : '⚠️'}`);
        
        if (hstsDisabled && cspReportOnly) {
            templatesFound++;
        }
    } else {
        console.log(`❌ ${type} template missing: ${path}`);
        validationResults.criticalIssues.push(`Production template missing: ${path}`);
    }
});

validationResults.prodTemplates = templatesFound === productionTemplates.length;

// 3. Secrets Safety Check
// =======================
console.log('\n🔐 Secrets Safety Check:');
console.log('------------------------');

// Check for .env.example (should exist)
if (fs.existsSync('.env.example')) {
    console.log('✅ .env.example file found');
} else {
    console.log('⚠️  .env.example file missing - create one for documentation');
    validationResults.criticalIssues.push('.env.example file missing');
}

// Check for .env files (should not be committed)
const envFiles = ['.env', '.env.local', '.env.production'];
let secretsExposed = false;

envFiles.forEach(envFile => {
    if (fs.existsSync(envFile)) {
        console.log(`⚠️  Found ${envFile} - ensure it's in .gitignore`);
        // Check if it's actually ignored by git
        try {
            const gitignore = fs.readFileSync('.gitignore', 'utf-8');
            if (!gitignore.includes('.env')) {
                console.log(`❌ ${envFile} not properly ignored in .gitignore`);
                validationResults.criticalIssues.push(`${envFile} not in .gitignore`);
                secretsExposed = true;
            }
        } catch (e) {
            console.log('❌ .gitignore file not found');
            validationResults.criticalIssues.push('.gitignore missing');
        }
    }
});

validationResults.secrets = !secretsExposed;

// 4. CI Integration Readiness
// ===========================
console.log('\n⚙️  CI Integration Check:');
console.log('-------------------------');

const githubWorkflowsDir = '.github/workflows';
if (fs.existsSync(githubWorkflowsDir)) {
    console.log('✅ GitHub workflows directory exists');
    
    // Check for security workflow
    const securityWorkflow = `${githubWorkflowsDir}/security.yml`;
    if (fs.existsSync(securityWorkflow)) {
        console.log('✅ Security workflow exists');
    } else {
        console.log('⚠️  Security workflow missing - recommend creating security.yml');
    }
} else {
    console.log('⚠️  No GitHub workflows directory - CI integration pending');
}

// 5. Final Assessment & Reporting
// ===============================
console.log('\n📊 Security Headers Status Report:');
console.log('==================================');

const statusItems = [
    { name: 'Development Headers', status: validationResults.devHeaders, critical: true },
    { name: 'Production Templates', status: validationResults.prodTemplates, critical: true },
    { name: 'Secrets Safety', status: validationResults.secrets, critical: true },
    { name: 'CSP Configuration', status: validationResults.csp, critical: false },
    { name: 'HSTS Planning', status: true, critical: false } // Always pass - disabled by design
];

statusItems.forEach(({ name, status, critical }) => {
    const icon = status ? '✅' : (critical ? '❌' : '⚠️');
    const severity = critical ? '(CRITICAL)' : '(optional)';
    console.log(`${icon} ${name}: ${status ? 'PASS' : 'FAIL'} ${critical ? severity : ''}`);
});

// Critical Issues Summary
if (validationResults.criticalIssues.length > 0) {
    console.log('\n🚨 Critical Issues Found:');
    console.log('=========================');
    validationResults.criticalIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
    });
}

// Rollout Guidance
console.log('\n📋 Security Headers Rollout Plan:');
console.log('==================================');
console.log('Phase 1: CSP Report-Only (Safe for staging)');
console.log('  - Deploy production templates with Report-Only CSP');
console.log('  - Monitor CSP reports for 2-4 weeks');
console.log('  - Fix any legitimate violations');
console.log('');
console.log('Phase 2: CSP Enforcement');
console.log('  - Switch from Report-Only to enforce mode');
console.log('  - Monitor for breaking changes');
console.log('  - Adjust policy as needed');
console.log('');
console.log('Phase 3: HSTS Enablement (Manual Decision)');
console.log('  - Plan subdomain HTTPS coverage');
console.log('  - Understand 12+ month commitment implications');
console.log('  - Enable HSTS with appropriate max-age');

// Exit codes for CI integration
let exitCode = 0;

if (validationResults.criticalIssues.length > 0) {
    exitCode = 1; // Critical security issues
} else if (!validationResults.prodTemplates) {
    exitCode = 2; // Production templates missing
}

if (isCIMode) {
    console.log(`\n🤖 CI Mode: Exiting with code ${exitCode}`);
    if (exitCode === 0) {
        console.log('✅ All security headers checks passed - ready for deployment');
    } else if (exitCode === 1) {
        console.log('❌ Critical security issues found - deployment blocked');
    } else if (exitCode === 2) {
        console.log('⚠️  Production templates missing - staging deployment only');
    }
}

if (exitCode !== 0) {
    console.log('\n📞 Need help?');
    console.log('Read docs/security/headers.md for detailed guidance');
}

process.exit(exitCode);