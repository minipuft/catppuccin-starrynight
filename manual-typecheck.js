const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🌟 Manual TypeScript Type Checking System Test');
console.log('===============================================');

// Check if TypeScript is available
try {
  const tscPath = path.join(__dirname, 'node_modules', '.bin', 'tsc');
  if (fs.existsSync(tscPath)) {
    console.log('✅ TypeScript compiler found at:', tscPath);
  } else {
    console.log('❌ TypeScript compiler not found');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error checking TypeScript:', error.message);
  process.exit(1);
}

// Check if tsconfig.json exists
try {
  const tsconfigPath = path.join(__dirname, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    console.log('✅ tsconfig.json found');
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    console.log('📋 TypeScript configuration:');
    console.log('  - Target:', tsconfig.compilerOptions.target);
    console.log('  - Module:', tsconfig.compilerOptions.module);
    console.log('  - Strict:', tsconfig.compilerOptions.strict);
    console.log('  - NoEmit:', tsconfig.compilerOptions.noEmit);
  } else {
    console.log('❌ tsconfig.json not found');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error reading tsconfig.json:', error.message);
  process.exit(1);
}

// Run TypeScript type checking
console.log('\n🔍 Running TypeScript type checking...');
try {
  const result = execSync('./node_modules/.bin/tsc --noEmit', {
    cwd: __dirname,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ TypeScript type checking passed!');
  if (result.trim()) {
    console.log('Output:', result);
  }
} catch (error) {
  console.log('❌ TypeScript type checking failed!');
  console.error('Error output:', error.stdout || error.stderr || error.message);
  
  // Try to analyze the errors
  const errorOutput = error.stdout || error.stderr || '';
  const lines = errorOutput.split('\n');
  const errorCount = lines.filter(line => line.includes('error TS')).length;
  
  console.log(`\n📊 Analysis: ${errorCount} TypeScript errors found`);
  
  // Show first few errors for analysis
  const errors = lines.filter(line => line.includes('error TS')).slice(0, 5);
  if (errors.length > 0) {
    console.log('\n🔍 First few errors:');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.trim()}`);
    });
  }
  
  process.exit(1);
}

// Test build process
console.log('\n🔨 Testing build process...');
try {
  const result = execSync('./node_modules/.bin/esbuild src-js/theme.entry.ts --bundle --outfile=theme.js --format=iife --target=es2020 --external:react --external:react-dom --loader:.fs=text', {
    cwd: __dirname,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ Build process completed successfully!');
  
  // Check if output file was created
  const outputPath = path.join(__dirname, 'theme.js');
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    console.log(`📦 Output file size: ${(stats.size / 1024).toFixed(2)} KB`);
  }
  
} catch (error) {
  console.log('❌ Build process failed!');
  console.error('Error output:', error.stdout || error.stderr || error.message);
  process.exit(1);
}

console.log('\n🎉 All tests completed successfully!');
console.log('✨ TypeScript type checking system is working properly');