#!/usr/bin/env node

/**
 * Build Monitoring & Bundle Analysis Script
 * Phase 4: Build Optimization - BelizeVibes Production System
 * 
 * Monitors build performance, bundle sizes, and optimization opportunities
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const REPORTS_DIR = path.join(ROOT_DIR, 'build-reports');

// Bundle size thresholds (in KB)
const THRESHOLDS = {
  MAIN_BUNDLE: 800, // Current: ~791KB
  CHUNK_WARNING: 500,
  CHUNK_ERROR: 1000,
  TOTAL_SIZE: 2000
};

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

class BuildMonitor {
  constructor() {
    this.buildMetrics = {
      timestamp: new Date().toISOString(),
      buildTime: 0,
      bundleSize: 0,
      chunks: [],
      warnings: [],
      errors: [],
      optimization: {
        treeshaking: false,
        minification: false,
        gzip: false
      }
    };
  }

  async init() {
    console.log(`${colors.bright}${colors.blue}🚀 BelizeVibes Build Monitor - Phase 4 Optimization${colors.reset}\n`);
    
    // Ensure reports directory exists
    await this.ensureReportsDir();
    
    // Run build with timing
    await this.runBuildWithTiming();
    
    // Analyze bundle
    await this.analyzeBundleSize();
    
    // Generate report
    await this.generateReport();
    
    // Check thresholds
    this.checkThresholds();
  }

  async ensureReportsDir() {
    try {
      await fs.access(REPORTS_DIR);
    } catch {
      await fs.mkdir(REPORTS_DIR, { recursive: true });
      console.log(`📁 Created build reports directory: ${REPORTS_DIR}`);
    }
  }

  async runBuildWithTiming() {
    console.log(`${colors.cyan}⏱️  Building project with timing analysis...${colors.reset}`);
    
    const startTime = Date.now();
    
    try {
      const output = execSync('npm run build', { 
        cwd: ROOT_DIR, 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      this.buildMetrics.buildTime = Date.now() - startTime;
      
      console.log(`${colors.green}✅ Build completed in ${this.buildMetrics.buildTime}ms${colors.reset}`);
      
      // Parse build output for optimization info
      this.parseBuildOutput(output);
      
    } catch (error) {
      console.error(`${colors.red}❌ Build failed:${colors.reset}`, error.message);
      process.exit(1);
    }
  }

  parseBuildOutput(output) {
    // Check for optimization indicators in Vite output
    if (output.includes('transformed')) {
      this.buildMetrics.optimization.treeshaking = true;
    }
    if (output.includes('minified')) {
      this.buildMetrics.optimization.minification = true;
    }
    if (output.includes('gzip')) {
      this.buildMetrics.optimization.gzip = true;
    }
  }

  async analyzeBundleSize() {
    console.log(`${colors.cyan}📊 Analyzing bundle sizes...${colors.reset}`);
    
    try {
      const distFiles = await this.getDistFiles();
      let totalSize = 0;
      
      for (const file of distFiles) {
        if (file.name.endsWith('.js') || file.name.endsWith('.css')) {
          const sizeKB = (file.size / 1024).toFixed(2);
          totalSize += file.size;
          
          const chunkInfo = {
            name: file.name,
            size: file.size,
            sizeKB: parseFloat(sizeKB),
            type: file.name.endsWith('.js') ? 'js' : 'css',
            isMain: file.name.includes('index') && !file.name.includes('legacy'),
            path: file.path
          };
          
          this.buildMetrics.chunks.push(chunkInfo);
          
          // Log chunk info with color coding
          const color = this.getChunkColor(chunkInfo.sizeKB);
          console.log(`  ${color}📦 ${file.name}: ${sizeKB}KB${colors.reset}`);
        }
      }
      
      this.buildMetrics.bundleSize = totalSize;
      const totalKB = (totalSize / 1024).toFixed(2);
      
      console.log(`${colors.bright}${colors.blue}\n📈 Total bundle size: ${totalKB}KB${colors.reset}\n`);
    } catch (error) {
      console.error(`${colors.red}❌ Bundle analysis failed:${colors.reset}`, error.message);
    }
  }

  async getDistFiles() {
    const files = [];
    
    async function scanDir(dir, prefix = '') {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(prefix, entry.name);
        
        if (entry.isDirectory()) {
          await scanDir(fullPath, relativePath);
        } else {
          const stats = await fs.stat(fullPath);
          files.push({
            name: entry.name,
            path: relativePath,
            size: stats.size
          });
        }
      }
    }
    
    await scanDir(DIST_DIR);
    return files;
  }

  getChunkColor(sizeKB) {
    if (sizeKB > THRESHOLDS.CHUNK_ERROR) return colors.red;
    if (sizeKB > THRESHOLDS.CHUNK_WARNING) return colors.yellow;
    return colors.green;
  }

  checkThresholds() {
    console.log(`${colors.cyan}🎯 Checking performance thresholds...${colors.reset}\n`);
    
    const totalKB = this.buildMetrics.bundleSize / 1024;
    const mainChunk = this.buildMetrics.chunks.find(c => c.isMain);
    
    // Main bundle threshold
    if (mainChunk) {
      const status = mainChunk.sizeKB <= THRESHOLDS.MAIN_BUNDLE ? 'PASS' : 'WARN';
      const color = status === 'PASS' ? colors.green : colors.yellow;
      console.log(`${color}${status}: Main bundle ${mainChunk.sizeKB}KB (threshold: ${THRESHOLDS.MAIN_BUNDLE}KB)${colors.reset}`);
    }
    
    // Total size threshold
    const totalStatus = totalKB <= THRESHOLDS.TOTAL_SIZE ? 'PASS' : 'WARN';
    const totalColor = totalStatus === 'PASS' ? colors.green : colors.yellow;
    console.log(`${totalColor}${totalStatus}: Total size ${totalKB.toFixed(2)}KB (threshold: ${THRESHOLDS.TOTAL_SIZE}KB)${colors.reset}`);
    
    // Large chunks warning
    const largeChunks = this.buildMetrics.chunks.filter(c => c.sizeKB > THRESHOLDS.CHUNK_WARNING);
    if (largeChunks.length > 0) {
      console.log(`${colors.yellow}⚠️  Large chunks detected (>${THRESHOLDS.CHUNK_WARNING}KB):${colors.reset}`);
      largeChunks.forEach(chunk => {
        console.log(`   - ${chunk.name}: ${chunk.sizeKB}KB`);
      });
      
      this.buildMetrics.warnings.push(`${largeChunks.length} chunks exceed ${THRESHOLDS.CHUNK_WARNING}KB threshold`);
    }
    
    // Build time check
    const buildTimeWarning = this.buildMetrics.buildTime > 45000; // 45 seconds
    if (buildTimeWarning) {
      console.log(`${colors.yellow}⚠️  Build time ${this.buildMetrics.buildTime}ms exceeds recommended 45s${colors.reset}`);
      this.buildMetrics.warnings.push(`Build time ${this.buildMetrics.buildTime}ms exceeds 45s threshold`);
    } else {
      console.log(`${colors.green}✅ Build time ${this.buildMetrics.buildTime}ms within acceptable range${colors.reset}`);
    }
  }

  async generateReport() {
    const reportData = {
      ...this.buildMetrics,
      thresholds: THRESHOLDS,
      recommendations: this.generateRecommendations()
    };
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const reportFile = path.join(REPORTS_DIR, `build-report-${timestamp}.json`);
    
    await fs.writeFile(reportFile, JSON.stringify(reportData, null, 2));
    
    console.log(`\n${colors.green}📄 Build report saved: ${reportFile}${colors.reset}`);
    
    // Also save as latest
    const latestFile = path.join(REPORTS_DIR, 'build-report-latest.json');
    await fs.writeFile(latestFile, JSON.stringify(reportData, null, 2));
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Bundle size recommendations
    const mainChunk = this.buildMetrics.chunks.find(c => c.isMain);
    if (mainChunk && mainChunk.sizeKB > THRESHOLDS.MAIN_BUNDLE) {
      recommendations.push({
        type: 'bundle-size',
        priority: 'medium',
        message: 'Consider implementing additional code splitting to reduce main bundle size',
        action: 'Split large components with React.lazy() or dynamic imports'
      });
    }
    
    // Large chunks recommendations  
    const largeChunks = this.buildMetrics.chunks.filter(c => c.sizeKB > THRESHOLDS.CHUNK_WARNING);
    if (largeChunks.length > 0) {
      recommendations.push({
        type: 'chunk-optimization',
        priority: 'low',
        message: `${largeChunks.length} chunks are larger than ${THRESHOLDS.CHUNK_WARNING}KB`,
        action: 'Review chunk contents and consider splitting or lazy loading'
      });
    }
    
    // Build time recommendations
    if (this.buildMetrics.buildTime > 45000) {
      recommendations.push({
        type: 'build-performance',
        priority: 'medium',
        message: 'Build time exceeds 45 seconds',
        action: 'Consider enabling build caching or optimizing build configuration'
      });
    }
    
    // Optimization recommendations
    if (!this.buildMetrics.optimization.treeshaking) {
      recommendations.push({
        type: 'optimization',
        priority: 'high',
        message: 'Tree shaking may not be working optimally',
        action: 'Verify ES modules usage and check for side effects'
      });
    }
    
    return recommendations;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new BuildMonitor();
  monitor.init().catch(error => {
    console.error(`${colors.red}❌ Build monitoring failed:${colors.reset}`, error);
    process.exit(1);
  });
}

export default BuildMonitor;