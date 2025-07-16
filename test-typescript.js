#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = '/home/minipuft/Applications/catppuccin-starrynight';

console.log('🔍 TypeScript System Test');
console.log('=========================');

// Check if TypeScript compiler exists
const tscPath = path.join(projectRoot, 'node_modules', '.bin', 'tsc');
if (!fs.existsSync(tscPath)) {
  console.error('❌ TypeScript compiler not found');
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

// Parse and display tsconfig
try {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  console.log('\n📋 TypeScript Configuration:');
  console.log('  - Target:', tsconfig.compilerOptions.target);
  console.log('  - Module:', tsconfig.compilerOptions.module);
  console.log('  - Strict:', tsconfig.compilerOptions.strict);
  console.log('  - NoImplicitAny:', tsconfig.compilerOptions.noImplicitAny);
  console.log('  - BaseUrl:', tsconfig.compilerOptions.baseUrl);
  console.log('  - NoEmit:', tsconfig.compilerOptions.noEmit);
  
  // Check includes
  if (tsconfig.include) {
    console.log('  - Includes:', tsconfig.include);
  }
  
  // Check path aliases
  if (tsconfig.compilerOptions.paths) {
    console.log('\n🔗 Path Aliases:');
    Object.entries(tsconfig.compilerOptions.paths).forEach(([alias, paths]) => {
      console.log(`  - ${alias} -> ${paths}`);
    });
  }
} catch (error) {
  console.error('❌ Error reading tsconfig.json:', error.message);
  process.exit(1);
}

// Test TypeScript compilation
console.log('\n🔬 Running TypeScript Type Checking...');
try {
  const result = execSync(`"${tscPath}" --noEmit`, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ TypeScript type checking PASSED!');
  console.log('🎉 No type errors found');
  
  if (result.trim()) {
    console.log('\nCompiler output:');
    console.log(result);
  }
  
} catch (error) {
  console.log('❌ TypeScript type checking FAILED');
  
  const errorOutput = error.stdout || error.stderr || '';
  console.log('\n📊 Error Analysis:');
  
  // Extract error lines
  const errorLines = errorOutput.split('\n').filter(line => 
    line.includes('error TS') || 
    line.includes('Error:') ||
    line.includes('Cannot find module') ||
    line.includes('Property') && line.includes('does not exist')
  );
  
  console.log(`Total errors: ${errorLines.length}`);
  
  if (errorLines.length > 0) {
    console.log('\n🚨 First 10 Errors:');
    errorLines.slice(0, 10).forEach((error, index) => {
      console.log(`${index + 1}. ${error.trim()}`);
    });
    
    if (errorLines.length > 10) {
      console.log(`... and ${errorLines.length - 10} more errors`);
    }
  }
  
  console.log('\n📋 Full Error Output:');
  console.log(errorOutput);
  
  process.exit(1);
}

// Test build process
console.log('\n🔨 Testing Build Process...');
const esbuildPath = path.join(projectRoot, 'node_modules', '.bin', 'esbuild');

if (fs.existsSync(esbuildPath)) {
  try {
    const buildResult = execSync(`"${esbuildPath}" src-js/theme.entry.ts --bundle --outfile=theme.js --format=iife --target=es2020 --external:react --external:react-dom --loader:.fs=text`, {
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
    
    if (buildResult.trim()) {
      console.log('\nBuild output:');
      console.log(buildResult);
    }
    
  } catch (buildError) {
    console.log('❌ Build process FAILED');
    console.error('Build error:', buildError.stdout || buildError.stderr);
    process.exit(1);
  }
} else {
  console.log('⚠️  esbuild not found, skipping build test');
}

console.log('\n✨ All tests completed successfully!');
console.log('🚀 TypeScript type checking system is working properly');