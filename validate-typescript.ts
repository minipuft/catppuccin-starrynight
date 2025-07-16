#!/usr/bin/env node

/**
 * TypeScript Validation Script
 * Checks for common TypeScript issues and provides analysis
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const projectRoot = '/home/minipuft/Applications/catppuccin-starrynight';

console.log('🔍 TypeScript Validation Analysis');
console.log('=================================');

// Check if TypeScript is installed
const tscPath = path.join(projectRoot, 'node_modules', '.bin', 'tsc');
if (!fs.existsSync(tscPath)) {
  console.error('❌ TypeScript not installed');
  process.exit(1);
}

// Check if tsconfig.json exists
const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
if (!fs.existsSync(tsconfigPath)) {
  console.error('❌ tsconfig.json not found');
  process.exit(1);
}

console.log('✅ TypeScript compiler found');
console.log('✅ tsconfig.json found');

// Parse tsconfig.json
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
console.log('\n📋 TypeScript Configuration:');
console.log('  - Target:', tsconfig.compilerOptions.target);
console.log('  - Module:', tsconfig.compilerOptions.module);
console.log('  - Strict:', tsconfig.compilerOptions.strict);
console.log('  - NoImplicitAny:', tsconfig.compilerOptions.noImplicitAny);
console.log('  - BaseUrl:', tsconfig.compilerOptions.baseUrl);

// Check path aliases
if (tsconfig.compilerOptions.paths) {
  console.log('\n🔗 Path Aliases:');
  Object.entries(tsconfig.compilerOptions.paths).forEach(([alias, paths]) => {
    console.log(`  - ${alias} -> ${paths}`);
  });
}

// Run TypeScript type checking
console.log('\n🔬 Running TypeScript Type Checking...');
try {
  const result = execSync(`${tscPath} --noEmit`, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ TypeScript type checking PASSED!');
  console.log('\n🎉 No type errors found');
  
  // Test build process
  console.log('\n🔨 Testing Build Process...');
  const esbuildPath = path.join(projectRoot, 'node_modules', '.bin', 'esbuild');
  
  if (fs.existsSync(esbuildPath)) {
    try {
      const buildResult = execSync(`${esbuildPath} src-js/theme.entry.ts --bundle --outfile=theme.js --format=iife --target=es2020 --external:react --external:react-dom --loader:.fs=text`, {
        cwd: projectRoot,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log('✅ Build process PASSED!');
      
      // Check output file size
      const outputPath = path.join(projectRoot, 'theme.js');
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        console.log(`📦 Output file size: ${(stats.size / 1024).toFixed(2)} KB`);
      }
      
    } catch (buildError: any) {
      console.log('❌ Build process FAILED');
      console.error('Build error:', buildError.stdout || buildError.stderr);
    }
  } else {
    console.log('⚠️  esbuild not found, skipping build test');
  }
  
} catch (error: any) {
  console.log('❌ TypeScript type checking FAILED');
  
  const errorOutput = error.stdout || error.stderr || '';
  console.log('\n📊 Error Analysis:');
  
  // Count errors
  const errorLines = errorOutput.split('\n').filter(line => line.includes('error TS'));
  console.log(`   Total errors: ${errorLines.length}`);
  
  // Categorize errors
  const errorCategories = {
    'Cannot find module': 0,
    'Type assertions': 0,
    'Implicit any': 0,
    'Property does not exist': 0,
    'Other': 0
  };
  
  errorLines.forEach(line => {
    if (line.includes('Cannot find module')) errorCategories['Cannot find module']++;
    else if (line.includes('Type assertion')) errorCategories['Type assertions']++;
    else if (line.includes('implicitly has an \'any\' type')) errorCategories['Implicit any']++;
    else if (line.includes('Property') && line.includes('does not exist')) errorCategories['Property does not exist']++;
    else errorCategories['Other']++;
  });
  
  console.log('\n🔍 Error Categories:');
  Object.entries(errorCategories).forEach(([category, count]) => {
    if (count > 0) {
      console.log(`   ${category}: ${count}`);
    }
  });
  
  // Show first 10 errors
  if (errorLines.length > 0) {
    console.log('\n🚨 First 10 Errors:');
    errorLines.slice(0, 10).forEach((error, index) => {
      console.log(`${index + 1}. ${error.trim()}`);
    });
    
    if (errorLines.length > 10) {
      console.log(`... and ${errorLines.length - 10} more errors`);
    }
  }
  
  // Show full error output for debugging
  console.log('\n📋 Full Error Output:');
  console.log(errorOutput);
  
  process.exit(1);
}

console.log('\n✨ All validations completed successfully!');