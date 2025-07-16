#!/bin/bash

# Test TypeScript type checking system
echo "Testing TypeScript type checking..."

# Run TypeScript compiler
npx tsc --noEmit

# Check exit code
if [ $? -eq 0 ]; then
    echo "✅ TypeScript type checking passed!"
else
    echo "❌ TypeScript type checking failed!"
    exit 1
fi

# Test build process
echo "Testing build process..."
npx esbuild src-js/theme.entry.ts --bundle --outfile=theme.js --format=iife --target=es2020 --external:react --external:react-dom --loader:.fs=text

# Check exit code
if [ $? -eq 0 ]; then
    echo "✅ Build process passed!"
else
    echo "❌ Build process failed!"
    exit 1
fi

echo "All tests completed!"