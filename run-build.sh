#!/bin/bash
cd /home/minipuft/Applications/catppuccin-starrynight
echo "Running build process..."
./node_modules/.bin/esbuild src-js/theme.entry.ts --bundle --outfile=theme.js --format=iife --target=es2020 --external:react --external:react-dom --loader:.fs=text