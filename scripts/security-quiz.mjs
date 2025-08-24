#!/usr/bin/env node

/**
 * BelizeVibes Security Quiz
 * Interactive security knowledge validation for the development team
 * 
 * Usage: npm run security:quiz
 * Purpose: Ensure team members understand security practices and procedures
 */

import readline from 'readline';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

class SecurityQuiz {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.score = 0;
    this.totalQuestions = 0;
    this.results = [];
  }

  async question(query) {
    return new Promise((resolve) => {
      this.rl.question(query, resolve);
    });
  }

  displayHeader() {
    console.clear();
    console.log(chalk.blue.bold('🔒 BelizeVibes Security Quiz'));
    console.log(chalk.gray('Test your knowledge of the security infrastructure\n'));
    console.log(chalk.yellow('Instructions:'));
    console.log(chalk.gray('• Answer each question with the letter (a, b, c, d)'));
    console.log(chalk.gray('• Type "quit" to exit at any time'));
    console.log(chalk.gray('• Passing score: 80% (16/20 questions)\n'));
  }

  async askQuestion(question, options, correctAnswer, explanation) {
    this.totalQuestions++;
    
    console.log(chalk.white.bold(`Question ${this.totalQuestions}: ${question}\n`));
    
    options.forEach((option, index) => {
      const letter = String.fromCharCode(97 + index); // a, b, c, d
      console.log(chalk.cyan(`${letter}) ${option}`));
    });
    
    console.log(''); // Empty line
    
    let answer;
    while (true) {
      answer = (await this.question(chalk.yellow('Your answer (a-d): '))).toLowerCase().trim();
      
      if (answer === 'quit') {
        console.log(chalk.red('\nQuiz terminated by user.'));
        this.rl.close();
        process.exit(0);
      }
      
      if (['a', 'b', 'c', 'd'].includes(answer)) {
        break;
      }
      
      console.log(chalk.red('Please enter a, b, c, or d'));
    }
    
    const isCorrect = answer === correctAnswer;
    if (isCorrect) {
      this.score++;
      console.log(chalk.green('✅ Correct!'));
    } else {
      console.log(chalk.red(`❌ Incorrect. The correct answer is: ${correctAnswer.toUpperCase()}`));
    }
    
    console.log(chalk.gray(`\nExplanation: ${explanation}\n`));
    
    this.results.push({
      question: this.totalQuestions,
      correct: isCorrect,
      userAnswer: answer,
      correctAnswer: correctAnswer,
      explanation: explanation
    });
    
    await this.question(chalk.dim('Press Enter to continue...'));
    console.clear();
  }

  async runQuiz() {
    this.displayHeader();
    await this.question(chalk.green('Press Enter to start the quiz...'));
    console.clear();

    // Question 1: Rate Limiting
    await this.askQuestion(
      'What is the correct rate limit for admin authentication endpoints?',
      [
        '100 requests per minute',
        '10 requests per minute', 
        '1000 requests per hour',
        '5 requests per second'
      ],
      'b',
      'Admin authentication endpoints are limited to 10 requests per minute to prevent brute force attacks while allowing legitimate admin access.'
    );

    // Question 2: RLS Policies
    await this.askQuestion(
      'What must be done when creating a new public table in the database?',
      [
        'Add an index on the primary key',
        'Enable Row Level Security (RLS)',
        'Create a backup policy',
        'Set up foreign key constraints'
      ],
      'b',
      'All public tables MUST have Row Level Security (RLS) enabled to prevent unauthorized data access. This is a critical security requirement.'
    );

    // Question 3: SECURITY DEFINER Functions
    await this.askQuestion(
      'What is required in all SECURITY DEFINER functions to prevent SQL injection?',
      [
        'Input validation only',
        'SET search_path = public',
        'Role-based access checks',
        'Parameterized queries only'
      ],
      'b',
      'SECURITY DEFINER functions must SET search_path = public to prevent SQL injection attacks through search_path manipulation.'
    );

    // Question 4: Secrets Management
    await this.askQuestion(
      'Where should API keys and secrets be stored in the codebase?',
      [
        'In configuration files committed to git',
        'Hardcoded in the source code',
        'In environment variables only',
        'In the database'
      ],
      'c',
      'All secrets must be stored in environment variables and NEVER committed to the repository. This prevents accidental exposure of credentials.'
    );

    // Question 5: CSP Violations
    await this.askQuestion(
      'How many CSP violations per day is considered acceptable?',
      [
        'Less than 100',
        'Less than 50', 
        'Less than 10',
        'Less than 5'
      ],
      'c',
      'CSP violations should be kept under 10 per day. Higher numbers may indicate XSS attempts or missing allowlist entries.'
    );

    // Question 6: Password Reset Security
    await this.askQuestion(
      'What should happen when a user clicks a password reset link?',
      [
        'Automatically log them in',
        'Show a form to enter new password',
        'Email them a new password',
        'Reset to a default password'
      ],
      'b',
      'Password reset links should NEVER automatically log users in. They must show a form requiring explicit password entry for security.'
    );

    // Question 7: File Upload Security
    await this.askQuestion(
      'What is the maximum file size allowed for image uploads?',
      [
        '10 MB',
        '20 MB',
        '5 MB',
        '1 MB'
      ],
      'c',
      'Image uploads are limited to 5 MB to prevent DoS attacks and storage abuse while allowing reasonable image quality.'
    );

    // Question 8: Incident Response
    await this.askQuestion(
      'What is the maximum response time for a P0 (Critical) security incident?',
      [
        '1 hour',
        '30 minutes',
        '15 minutes',
        '5 minutes'
      ],
      'c',
      'P0 Critical incidents (active breaches, data exposure) require response within 15 minutes to minimize damage and contain threats.'
    );

    // Question 9: Authentication Testing
    await this.askQuestion(
      'Which component should be used to protect admin routes in React?',
      [
        'useAuth hook only',
        'RequireRole component',
        'URL pattern matching',
        'Local storage checks'
      ],
      'b',
      'RequireRole component provides proper server-side validated role-based access control and should protect all admin routes.'
    );

    // Question 10: Rate Limiting Storage
    await this.askQuestion(
      'What is the primary storage backend for rate limiting?',
      [
        'PostgreSQL database',
        'Local memory',
        'Redis (Upstash)',
        'File system'
      ],
      'c',
      'Rate limiting uses Redis (Upstash) as primary storage with Deno KV as fallback for high-performance, distributed rate limit enforcement.'
    );

    // Question 11: Security Headers
    await this.askQuestion(
      'Which header prevents the site from being embedded in iframes?',
      [
        'X-Content-Type-Options',
        'X-Frame-Options: DENY',
        'Referrer-Policy',
        'Content-Security-Policy'
      ],
      'b',
      'X-Frame-Options: DENY prevents clickjacking attacks by blocking the site from being embedded in any iframe.'
    );

    // Question 12: Security Events
    await this.askQuestion(
      'How long are security events retained in the database?',
      [
        '30 days',
        '60 days',
        '90 days',
        '1 year'
      ],
      'c',
      'Security events are retained for 90 days with automatic cleanup to balance security monitoring needs with privacy and storage concerns.'
    );

    // Question 13: Input Validation
    await this.askQuestion(
      'Where should input validation be implemented?',
      [
        'Client-side only',
        'Server-side only', 
        'Both client and server-side',
        'Database level only'
      ],
      'c',
      'Input validation must be implemented on both client and server-side. Client-side for UX, server-side for security (client can be bypassed).'
    );

    // Question 14: JWT Token Storage
    await this.askQuestion(
      'Where should JWT tokens be stored in the browser?',
      [
        'localStorage',
        'sessionStorage',
        'Secure HTTP-only cookies',
        'URL parameters'
      ],
      'c',
      'JWT tokens should be stored in secure HTTP-only cookies to prevent XSS attacks. Never use localStorage or sessionStorage for tokens.'
    );

    // Question 15: Error Handling
    await this.askQuestion(
      'What should be included in error messages sent to clients?',
      [
        'Full stack traces',
        'Database query details',
        'Generic error messages only',
        'Internal system paths'
      ],
      'c',
      'Error messages should be generic and not expose internal system details, stack traces, or database information that could aid attackers.'
    );

    // Question 16: Security Monitoring
    await this.askQuestion(
      'Which command monitors real-time security events?',
      [
        'npm run security:audit',
        'node scripts/security-watch.mjs',
        'npm run security:scan',
        'supabase logs'
      ],
      'b',
      'The security-watch.mjs script provides real-time monitoring of security events with filtering and alerting capabilities.'
    );

    // Question 17: Database Access
    await this.askQuestion(
      'What principle should guide database user permissions?',
      [
        'Maximum access for flexibility',
        'Read-only access for everyone',
        'Least privilege principle',
        'Full admin access for developers'
      ],
      'c',
      'The principle of least privilege means users and applications should have only the minimum permissions necessary to perform their functions.'
    );

    // Question 18: API Security
    await this.askQuestion(
      'What should be checked before processing any API request?',
      [
        'Request size only',
        'IP address only',
        'Authentication, authorization, rate limits, and input validation',
        'HTTP method only'
      ],
      'c',
      'Complete API security requires checking authentication, authorization (roles), rate limits, and input validation for every request.'
    );

    // Question 19: Security Testing
    await this.askQuestion(
      'How often should security documentation be reviewed?',
      [
        'Annually',
        'Monthly',
        'Quarterly or after incidents',
        'Only when problems occur'
      ],
      'c',
      'Security documentation should be reviewed quarterly and immediately after any P0/P1 security incidents to incorporate lessons learned.'
    );

    // Question 20: Deployment Security
    await this.askQuestion(
      'What should be run before every production deployment?',
      [
        'Only unit tests',
        'npm run security:preflight',
        'Only build process',
        'Manual testing only'
      ],
      'b',
      'The security:preflight command runs comprehensive security validation including headers, audits, scans, and tests before deployment.'
    );

    this.displayResults();
  }

  displayResults() {
    console.clear();
    console.log(chalk.blue.bold('🔒 Security Quiz Results\n'));
    
    const percentage = Math.round((this.score / this.totalQuestions) * 100);
    const passed = percentage >= 80;
    
    console.log(chalk.white.bold(`Score: ${this.score}/${this.totalQuestions} (${percentage}%)`));
    
    if (passed) {
      console.log(chalk.green.bold('✅ PASSED - Well done!'));
      console.log(chalk.green('You have demonstrated solid understanding of the security infrastructure.\n'));
    } else {
      console.log(chalk.red.bold('❌ FAILED - Review required'));
      console.log(chalk.red(`You need at least 80% (16/20) to pass. Please review the security documentation.\n`));
    }
    
    // Show incorrect answers for learning
    const incorrectAnswers = this.results.filter(r => !r.correct);
    if (incorrectAnswers.length > 0) {
      console.log(chalk.yellow.bold('📚 Review These Topics:\n'));
      incorrectAnswers.forEach(result => {
        console.log(chalk.red(`Question ${result.question}: Review needed`));
        console.log(chalk.gray(`${result.explanation}\n`));
      });
    }
    
    // Provide learning resources
    console.log(chalk.blue.bold('📖 Security Documentation:'));
    console.log(chalk.cyan('• docs/security/README.md - Security fundamentals'));
    console.log(chalk.cyan('• docs/security/secure-coding.md - Development patterns'));
    console.log(chalk.cyan('• docs/security/playbooks/incident-response.md - Incident procedures'));
    console.log(chalk.cyan('• docs/security/checklists/pre-release.md - Deployment security\n'));
    
    if (!passed) {
      console.log(chalk.yellow.bold('Next Steps:'));
      console.log(chalk.yellow('1. Review the security documentation above'));
      console.log(chalk.yellow('2. Ask team members or security lead for clarification'));
      console.log(chalk.yellow('3. Retake the quiz: npm run security:quiz\n'));
    }
    
    this.saveResults(percentage, passed);
  }

  async saveResults(percentage, passed) {
    try {
      const timestamp = new Date().toISOString();
      const resultsData = {
        timestamp,
        score: this.score,
        total: this.totalQuestions,
        percentage,
        passed,
        results: this.results
      };
      
      const resultsDir = join(projectRoot, '.quiz-results');
      await fs.mkdir(resultsDir, { recursive: true });
      
      const fileName = `security-quiz-${timestamp.split('T')[0]}-${Date.now()}.json`;
      const filePath = join(resultsDir, fileName);
      
      await fs.writeFile(filePath, JSON.stringify(resultsData, null, 2));
      console.log(chalk.dim(`Results saved to: ${filePath}\n`));
    } catch (error) {
      console.log(chalk.red(`Failed to save results: ${error.message}\n`));
    }
  }

  async close() {
    this.rl.close();
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.red('\n\nQuiz interrupted. Goodbye!'));
  process.exit(0);
});

// Check if chalk is available, provide fallback if not
let chalkAvailable = true;
try {
  await import('chalk');
} catch (error) {
  chalkAvailable = false;
  console.log('Note: Install chalk for colored output: npm install chalk');
  
  // Provide fallback chalk-like functionality
  global.chalk = {
    blue: { bold: (text) => text },
    green: { bold: (text) => text },
    red: { bold: (text) => text },
    yellow: { bold: (text) => text },
    white: { bold: (text) => text },
    cyan: (text) => text,
    gray: (text) => text,
    dim: (text) => text,
    green: (text) => text,
    red: (text) => text,
    yellow: (text) => text
  };
}

// Run the quiz
async function main() {
  const quiz = new SecurityQuiz();
  
  try {
    await quiz.runQuiz();
  } catch (error) {
    console.error(chalk.red(`Quiz error: ${error.message}`));
    process.exit(1);
  } finally {
    await quiz.close();
  }
}

// Check if running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}