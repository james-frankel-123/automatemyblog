#!/usr/bin/env node

/**
 * Command-line test runner for Phase 1
 * Run with: node scripts/test-phase1.js
 */

const puppeteer = require('puppeteer');
const chalk = require('chalk');
const path = require('path');

// Test configuration
const CONFIG = {
  appUrl: 'http://localhost:3000',
  testRunnerUrl: 'http://localhost:3000/test-runner.html',
  timeout: 30000,
  headless: true,
  verbose: true
};

class CLITestRunner {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  async initialize() {
    console.log(chalk.blue('🚀 Starting Phase 1 CLI Test Runner...'));
    
    try {
      this.browser = await puppeteer.launch({ 
        headless: CONFIG.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      this.page = await this.browser.newPage();
      
      // Capture console logs from the page
      this.page.on('console', msg => {
        if (CONFIG.verbose && msg.type() !== 'warning') {
          const prefix = this.getLogPrefix(msg.type());
          console.log(`${prefix} ${msg.text()}`);
        }
      });

      // Capture page errors
      this.page.on('pageerror', error => {
        console.error(chalk.red('❌ Page Error:'), error.message);
        this.results.errors.push(error.message);
      });

      console.log(chalk.green('✅ Browser initialized'));
      
    } catch (error) {
      console.error(chalk.red('❌ Failed to initialize browser:'), error.message);
      process.exit(1);
    }
  }

  async checkAppAvailability() {
    console.log(chalk.blue('🔍 Checking if AutoBlog app is running...'));
    
    try {
      await this.page.goto(CONFIG.appUrl, { waitUntil: 'networkidle0', timeout: 10000 });
      console.log(chalk.green('✅ AutoBlog app is accessible'));
      return true;
    } catch (error) {
      console.error(chalk.red('❌ AutoBlog app is not accessible'));
      console.error(chalk.yellow('💡 Make sure to run "npm start" first'));
      return false;
    }
  }

  async runTests() {
    console.log(chalk.blue('🧪 Running Phase 1 tests...'));
    
    try {
      // Load the main app to get API access
      await this.page.goto(CONFIG.appUrl, { waitUntil: 'networkidle0' });
      
      // Wait for API to be available
      await this.page.waitForFunction('window.autoBlogAPI', { timeout: 10000 });
      
      // Inject and run our test suite
      await this.page.addScriptTag({ 
        path: path.join(__dirname, '../src/tests/phase1-test.js')
      });

      // Wait for test script to load
      await this.page.waitForFunction('window.runPhase1Tests', { timeout: 5000 });

      console.log(chalk.blue('📋 Test script loaded, executing tests...'));

      // Run tests and capture results
      const testResults = await this.page.evaluate(async () => {
        try {
          // Capture console output
          const originalConsoleLog = console.log;
          const logs = [];
          console.log = (...args) => {
            logs.push(args.join(' '));
            originalConsoleLog(...args);
          };

          // Run tests
          await window.runPhase1Tests({
            verbose: true,
            cleanup: true
          });

          // Get test results
          const testRunner = window.Phase1TestRunner;
          const results = testRunner.results;

          // Restore console
          console.log = originalConsoleLog;

          return {
            success: true,
            results: results,
            logs: logs
          };

        } catch (error) {
          return {
            success: false,
            error: error.message,
            stack: error.stack
          };
        }
      });

      if (testResults.success) {
        this.processTestResults(testResults.results);
      } else {
        console.error(chalk.red('❌ Test execution failed:'), testResults.error);
        this.results.errors.push(testResults.error);
      }

    } catch (error) {
      console.error(chalk.red('❌ Failed to run tests:'), error.message);
      this.results.errors.push(error.message);
    }
  }

  processTestResults(results) {
    console.log(chalk.blue('\n📊 Processing test results...'));
    
    this.results.total = results.length;
    this.results.passed = results.filter(r => r.status === 'PASS').length;
    this.results.failed = results.filter(r => r.status === 'FAIL').length;

    // Group results by category
    const categories = {};
    results.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = { passed: 0, failed: 0, tests: [] };
      }
      categories[result.category][result.status === 'PASS' ? 'passed' : 'failed']++;
      categories[result.category].tests.push(result);
    });

    // Print category summaries
    console.log(chalk.blue('\n📋 Results by Category:'));
    Object.entries(categories).forEach(([category, stats]) => {
      const status = stats.failed === 0 ? chalk.green('✅') : chalk.red('❌');
      console.log(`${status} ${category}: ${stats.passed}/${stats.passed + stats.failed} passed`);
      
      if (stats.failed > 0) {
        stats.tests.filter(t => t.status === 'FAIL').forEach(test => {
          console.log(`   ${chalk.red('×')} ${test.name}: ${test.error}`);
        });
      }
    });

    // Print failed tests
    const failedTests = results.filter(r => r.status === 'FAIL');
    if (failedTests.length > 0) {
      console.log(chalk.red('\n❌ Failed Tests:'));
      failedTests.forEach(test => {
        console.log(`   • ${test.name}`);
        console.log(`     ${chalk.gray('Category:')} ${test.category}`);
        console.log(`     ${chalk.gray('Error:')} ${test.error}`);
      });
      
      this.results.errors = failedTests.map(t => t.error);
    }
  }

  printSummary() {
    console.log(chalk.blue('\n' + '='.repeat(60)));
    console.log(chalk.blue('📊 TEST SUMMARY'));
    console.log(chalk.blue('='.repeat(60)));

    const { total, passed, failed } = this.results;
    
    console.log(`Total Tests: ${total}`);
    console.log(`${chalk.green('Passed:')} ${passed}`);
    console.log(`${chalk.red('Failed:')} ${failed}`);
    
    if (failed === 0) {
      console.log(chalk.green('\n🎉 All tests passed! Phase 1 implementation is ready.'));
      console.log(chalk.blue('✅ You can proceed to Phase 2 development.'));
    } else {
      console.log(chalk.red('\n⚠️  Some tests failed. Please fix issues before proceeding.'));
      console.log(chalk.yellow('💡 Check the detailed error messages above.'));
    }

    console.log(chalk.blue('\n📋 Next Steps:'));
    if (failed === 0) {
      console.log('1. ✅ Phase 1 Complete - persistence layer working');
      console.log('2. 🔄 Test manual workflow to ensure no UX changes');  
      console.log('3. 🚀 Begin Phase 2 development (enhanced features)');
    } else {
      console.log('1. 🔍 Review failed test details above');
      console.log('2. 🛠️  Fix issues in the codebase');
      console.log('3. 🔄 Re-run tests until all pass');
      console.log('4. 📝 Manual test workflow to ensure no UX changes');
    }

    console.log(chalk.blue('='.repeat(60)));
  }

  getLogPrefix(type) {
    switch (type) {
      case 'error': return chalk.red('[ERROR]');
      case 'warn': return chalk.yellow('[WARN]');
      case 'info': return chalk.blue('[INFO]');
      default: return chalk.gray('[LOG]');
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log(chalk.gray('🧹 Browser cleanup completed'));
    }
  }

  async run() {
    try {
      await this.initialize();
      
      const appAvailable = await this.checkAppAvailability();
      if (!appAvailable) {
        process.exit(1);
      }

      await this.runTests();
      this.printSummary();

      const exitCode = this.results.failed > 0 ? 1 : 0;
      process.exit(exitCode);

    } catch (error) {
      console.error(chalk.red('❌ Test runner failed:'), error.message);
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }
}

// Handle CLI arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(chalk.blue('AutoBlog Phase 1 Test Runner'));
  console.log('');
  console.log('Usage: node scripts/test-phase1.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --headless     Run browser in headless mode (default)');
  console.log('  --headed       Run browser in headed mode (visible)');
  console.log('  --quiet        Suppress verbose output');
  console.log('  --help, -h     Show this help message');
  console.log('');
  console.log('Make sure AutoBlog app is running at http://localhost:3000 before running tests.');
  process.exit(0);
}

// Apply CLI arguments
if (args.includes('--headed')) {
  CONFIG.headless = false;
}
if (args.includes('--quiet')) {
  CONFIG.verbose = false;
}

// Run tests
const runner = new CLITestRunner();
runner.run().catch(error => {
  console.error(chalk.red('❌ Unhandled error:'), error.message);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', async () => {
  console.log(chalk.yellow('\n⚠️  Test interrupted by user'));
  await runner.cleanup();
  process.exit(130);
});

process.on('SIGTERM', async () => {
  console.log(chalk.yellow('\n⚠️  Test terminated'));
  await runner.cleanup();
  process.exit(143);
});