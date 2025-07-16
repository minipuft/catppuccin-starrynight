#!/bin/bash

# Setup script for Git hooks in Catppuccin StarryNight Theme
# This script sets up pre-commit hooks for type checking and code quality

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}🌌 Catppuccin StarryNight - Git Hooks Setup${NC}"
    echo -e "${BLUE}===========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

print_header

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "This is not a git repository"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Please run 'npm install' first."
    echo "Would you like to run 'npm install' now? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        npm install
    else
        print_error "Please run 'npm install' and try again"
        exit 1
    fi
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Check if pre-commit hook already exists
if [ -f ".git/hooks/pre-commit" ]; then
    print_warning "Pre-commit hook already exists"
    echo "Would you like to overwrite it? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        print_info "Skipping pre-commit hook installation"
        exit 0
    fi
fi

# Copy pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/usr/bin/env bash

# Pre-commit hook for Catppuccin StarryNight Theme
# Ensures TypeScript type checking and code quality before commits

set -e

echo "🌌 [Pre-commit] Starting validation checks..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}🔍 [Pre-commit]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ [Pre-commit]${NC} $1"
}

print_error() {
    echo -e "${RED}❌ [Pre-commit]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  [Pre-commit]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Not in project root directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_error "node_modules not found. Please run 'npm install' first."
    exit 1
fi

# Get list of staged TypeScript files
STAGED_TS_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$' || true)

if [ -z "$STAGED_TS_FILES" ]; then
    print_warning "No TypeScript files staged for commit"
else
    print_status "Found staged TypeScript files:"
    echo "$STAGED_TS_FILES" | while read -r file; do
        echo "  - $file"
    done
fi

# Run TypeScript type checking
print_status "Running TypeScript type check..."
if npm run typecheck; then
    print_success "TypeScript type check passed"
else
    print_error "TypeScript type check failed"
    echo ""
    echo "💡 Fix the TypeScript errors above before committing."
    echo "   You can run 'npm run typecheck' to see the errors again."
    exit 1
fi

# Run ESLint on staged TypeScript files
if [ -n "$STAGED_TS_FILES" ]; then
    print_status "Running ESLint on staged TypeScript files..."
    if echo "$STAGED_TS_FILES" | xargs npm run lint:js --; then
        print_success "ESLint check passed"
    else
        print_error "ESLint check failed"
        echo ""
        echo "💡 Fix the ESLint errors above before committing."
        echo "   You can run 'npm run lint:js:fix' to auto-fix some issues."
        exit 1
    fi
fi

# Get list of staged SCSS files
STAGED_SCSS_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.scss$' || true)

if [ -n "$STAGED_SCSS_FILES" ]; then
    print_status "Running stylelint on staged SCSS files..."
    if echo "$STAGED_SCSS_FILES" | xargs npm run lint:css --; then
        print_success "stylelint check passed"
    else
        print_error "stylelint check failed"
        echo ""
        echo "💡 Fix the CSS/SCSS errors above before committing."
        echo "   Check the stylelint configuration and fix the issues."
        exit 1
    fi
fi

# Run tests if test files are staged or if core files changed
TEST_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.test\.(ts|tsx)$' || true)
CORE_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E 'src-js/.*\.(ts|tsx)$' | grep -v '\.test\.' || true)

if [ -n "$TEST_FILES" ] || [ -n "$CORE_FILES" ]; then
    print_status "Running tests..."
    if npm test; then
        print_success "Tests passed"
    else
        print_error "Tests failed"
        echo ""
        echo "💡 Fix the failing tests above before committing."
        echo "   You can run 'npm test' to run tests again."
        exit 1
    fi
fi

# Check for performance-sensitive files
PERF_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E 'src-js/(core|visual|audio)/.*\.(ts|tsx)$' || true)

if [ -n "$PERF_FILES" ]; then
    print_status "Performance-sensitive files detected:"
    echo "$PERF_FILES" | while read -r file; do
        echo "  - $file"
    done
    print_warning "Please ensure performance budgets are maintained"
    echo "   Run performance tests if available"
fi

# Check for large files
LARGE_FILES=$(git diff --cached --name-only --diff-filter=ACM | xargs -I {} sh -c 'if [ -f "{}" ] && [ $(wc -c < "{}") -gt 100000 ]; then echo "{}"; fi' || true)

if [ -n "$LARGE_FILES" ]; then
    print_warning "Large files detected (>100KB):"
    echo "$LARGE_FILES" | while read -r file; do
        size=$(wc -c < "$file")
        echo "  - $file (${size} bytes)"
    done
fi

print_success "All validation checks passed!"
print_success "Commit can proceed ✨"

exit 0
EOF

# Make the hook executable
chmod +x .git/hooks/pre-commit

print_success "Pre-commit hook installed successfully!"

# Test the hook
echo ""
print_info "Testing the pre-commit hook..."
echo ""

# Run a dry-run test
if .git/hooks/pre-commit; then
    print_success "Pre-commit hook test passed!"
else
    print_error "Pre-commit hook test failed"
    print_info "This might be expected if there are no staged files"
fi

echo ""
print_info "Git hooks setup complete!"
echo ""
print_info "The pre-commit hook will now run automatically before each commit and check:"
echo "  • TypeScript type checking"
echo "  • ESLint for JavaScript/TypeScript files"
echo "  • stylelint for CSS/SCSS files"
echo "  • Tests (when test files or core files are changed)"
echo "  • Performance-sensitive file warnings"
echo "  • Large file detection"
echo ""
print_info "To bypass the hook (not recommended), use: git commit --no-verify"
echo ""
print_success "Happy coding! 🌌✨"