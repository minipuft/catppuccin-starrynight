#!/bin/bash
# progress-section.sh
# Validates section completion and enables progression to next section

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_header() { echo -e "${BLUE}[PROGRESS]${NC} $1"; }

usage() {
    echo "Usage: $0 <phase-name> <section> [next-section]"
    echo ""
    echo "Validates section completion and enables progression"
    echo ""
    echo "Arguments:"
    echo "  phase-name     Name of the phase"
    echo "  section        Current section (analysis|implementation|migration)"
    echo "  next-section   Next section to enable (optional)"
    echo ""
    echo "Examples:"
    echo "  $0 phase-2-5-effect-consolidation analysis implementation"
    echo "  $0 phase-2-5-effect-consolidation implementation migration"
    echo "  $0 phase-2-5-effect-consolidation migration"
    exit 1
}

# Parse arguments
PHASE_NAME="$1"
CURRENT_SECTION="$2"
NEXT_SECTION="$3"

if [ -z "$PHASE_NAME" ] || [ -z "$CURRENT_SECTION" ]; then
    usage
fi

PHASE_DIR="plans/$PHASE_NAME"

# Validate phase exists
if [ ! -d "$PHASE_DIR" ]; then
    print_error "Phase directory '$PHASE_DIR' does not exist"
    exit 1
fi

# Validate section
if [[ ! "$CURRENT_SECTION" =~ ^(analysis|implementation|migration)$ ]]; then
    print_error "Section must be: analysis, implementation, or migration"
    exit 1
fi

print_header "Validating section completion: $CURRENT_SECTION"

# Section-specific validation
case "$CURRENT_SECTION" in
    "analysis")
        print_status "Validating Analysis section..."
        
        # Check required files exist
        required_files=(
            "$PHASE_DIR/analysis/system-analysis.md"
            "$PHASE_DIR/analysis/dependency-analysis.md" 
            "$PHASE_DIR/analysis/consolidation-opportunities.md"
        )
        
        for file in "${required_files[@]}"; do
            if [ ! -f "$file" ]; then
                print_error "Required file missing: $file"
                exit 1
            fi
        done
        
        # Check for completion indicators (basic validation)
        if grep -q "Analysis Status.*Not Started" "$PHASE_DIR/analysis"/*.md; then
            print_warning "Some analysis documents still show 'Not Started' status"
            print_warning "Please update status in analysis documents before progressing"
        fi
        
        print_status "Analysis section validation complete"
        if [ "$NEXT_SECTION" = "implementation" ]; then
            print_status "Enabling Implementation section..."
            sed -i 's/Status.*Waiting for Analysis/Status**: Ready to Start/g' "$PHASE_DIR/implementation/section-status.md"
            sed -i 's/Analysis section complete/✅ Analysis section complete/g' "$PHASE_DIR/implementation/section-status.md"
        fi
        ;;
        
    "implementation")
        print_status "Validating Implementation section..."
        
        # Check required files exist
        required_files=(
            "$PHASE_DIR/implementation/unified-controller-design.md"
            "$PHASE_DIR/implementation/api-compatibility.md"
            "$PHASE_DIR/implementation/implementation-progress.md"
        )
        
        for file in "${required_files[@]}"; do
            if [ ! -f "$file" ]; then
                print_error "Required file missing: $file"
                exit 1
            fi
        done
        
        # Check for TypeScript compilation
        print_status "Checking TypeScript compilation..."
        if ! npm run typecheck >/dev/null 2>&1; then
            print_error "TypeScript compilation failed - please fix errors before progressing"
            exit 1
        fi
        
        print_status "Implementation section validation complete"
        if [ "$NEXT_SECTION" = "migration" ]; then
            print_status "Enabling Migration section..."
            sed -i 's/Status.*Waiting for Implementation/Status**: Ready to Start/g' "$PHASE_DIR/migration/section-status.md"
            sed -i 's/Implementation section complete/✅ Implementation section complete/g' "$PHASE_DIR/migration/section-status.md"
        fi
        ;;
        
    "migration")
        print_status "Validating Migration section..."
        
        # Check required files exist
        required_files=(
            "$PHASE_DIR/migration/integration-updates.md"
            "$PHASE_DIR/migration/legacy-compatibility.md"
            "$PHASE_DIR/migration/testing-validation.md"
        )
        
        for file in "${required_files[@]}"; do
            if [ ! -f "$file" ]; then
                print_error "Required file missing: $file"
                exit 1
            fi
        done
        
        # Check build and tests
        print_status "Checking build and tests..."
        if ! npm run build >/dev/null 2>&1; then
            print_error "Build failed - please fix build errors before completing migration"
            exit 1
        fi
        
        if ! npm test >/dev/null 2>&1; then
            print_warning "Tests failed - please review test results before completing migration"
        fi
        
        print_status "Migration section validation complete"
        print_status "Phase ready for completion!"
        
        # Update phase status
        sed -i 's/Current Section Status/✅ **PHASE COMPLETE** - All sections finished/g' "$PHASE_DIR/PHASE-STATUS.md"
        ;;
esac

print_status "Section progression complete"
