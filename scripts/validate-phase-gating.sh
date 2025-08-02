#!/bin/bash
# validate-phase-gating.sh
# Validates gating criteria for comprehensive phase sections

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[✓]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }
print_error() { echo -e "${RED}[✗]${NC} $1"; }
print_header() { echo -e "${BLUE}[GATE]${NC} $1"; }

usage() {
    echo "Usage: $0 <phase-name> <section> [--strict]"
    echo ""
    echo "Validates section gating criteria for comprehensive phases"
    echo ""
    echo "Arguments:"
    echo "  phase-name     Name of the phase"
    echo "  section        Section to validate (analysis|implementation|migration)"
    echo ""
    echo "Options:"
    echo "  --strict       Enforce strict validation (fail on warnings)"
    echo ""
    echo "Exit codes:"
    echo "  0 - All criteria met"
    echo "  1 - Critical criteria failed"
    echo "  2 - Warning criteria failed (only with --strict)"
    exit 1
}

# Parse arguments
PHASE_NAME=""
SECTION=""
STRICT_MODE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --strict)
            STRICT_MODE=true
            shift
            ;;
        *)
            if [ -z "$PHASE_NAME" ]; then
                PHASE_NAME="$1"
            elif [ -z "$SECTION" ]; then
                SECTION="$1"
            else
                echo "Unknown argument: $1"
                usage
            fi
            shift
            ;;
    esac
done

if [ -z "$PHASE_NAME" ] || [ -z "$SECTION" ]; then
    usage
fi

PHASE_DIR="plans/$PHASE_NAME"

# Validate phase exists
if [ ! -d "$PHASE_DIR" ]; then
    print_error "Phase directory '$PHASE_DIR' does not exist"
    exit 1
fi

# Validate section
if [[ ! "$SECTION" =~ ^(analysis|implementation|migration)$ ]]; then
    print_error "Section must be: analysis, implementation, or migration"
    exit 1
fi

print_header "Validating Gating Criteria: $SECTION"

critical_failures=0
warning_failures=0

# Section-specific validation
case "$SECTION" in
    "analysis")
        print_header "Analysis → Implementation Gating Criteria"
        
        # Critical: Required files exist and have content
        required_files=(
            "$PHASE_DIR/analysis/system-analysis.md"
            "$PHASE_DIR/analysis/dependency-analysis.md"
            "$PHASE_DIR/analysis/consolidation-opportunities.md"
        )
        
        for file in "${required_files[@]}"; do
            if [ ! -f "$file" ]; then
                print_error "Required file missing: $file"
                ((critical_failures++))
            elif [ $(wc -l < "$file") -lt 20 ]; then
                print_warning "File appears incomplete (< 20 lines): $file"
                ((warning_failures++))
            else
                print_status "File exists and has content: $(basename "$file")"
            fi
        done
        
        # Critical: System analysis has actual data
        if [ -f "$PHASE_DIR/analysis/system-analysis.md" ]; then
            if grep -q "| \[System" "$PHASE_DIR/analysis/system-analysis.md"; then
                print_warning "System analysis still contains template placeholders"
                ((warning_failures++))
            elif ! grep -q "| [A-Za-z]" "$PHASE_DIR/analysis/system-analysis.md"; then
                print_error "System analysis lacks actual system data"
                ((critical_failures++))
            else
                print_status "System analysis contains real data"
            fi
        fi
        
        # Critical: Consolidation target defined
        if [ -f "$PHASE_DIR/analysis/consolidation-opportunities.md" ]; then
            if grep -q "\[Unified Controller Name\]" "$PHASE_DIR/analysis/consolidation-opportunities.md"; then
                print_error "Consolidation target not defined (still template placeholder)"
                ((critical_failures++))
            else
                print_status "Consolidation target defined"
            fi
        fi
        
        # Warning: Status updated from template
        if grep -q "Not Started" "$PHASE_DIR/analysis/section-status.md" 2>/dev/null; then
            print_warning "Analysis section status still shows 'Not Started'"
            ((warning_failures++))
        else
            print_status "Section status updated"
        fi
        ;;
        
    "implementation")
        print_header "Implementation → Migration Gating Criteria"
        
        # Critical: Design documents completed
        if [ -f "$PHASE_DIR/implementation/unified-controller-design.md" ]; then
            if grep -q "\[ControllerName\]" "$PHASE_DIR/implementation/unified-controller-design.md"; then
                print_error "Controller design still contains template placeholders"
                ((critical_failures++))
            else
                print_status "Controller design completed"
            fi
        else
            print_error "Controller design document missing"
            ((critical_failures++))
        fi
        
        # Critical: TypeScript compilation
        print_status "Checking TypeScript compilation..."
        if npm run typecheck >/dev/null 2>&1; then
            print_status "TypeScript compilation successful"
        else
            print_error "TypeScript compilation failed"
            ((critical_failures++))
        fi
        
        # Critical: Controller file exists
        controller_files=($(find src-js -name "*Controller.ts" -o -name "*Consciousness*.ts" | grep -v test))
        if [ ${#controller_files[@]} -eq 0 ]; then
            print_warning "No controller files found - may not be implemented yet"
            ((warning_failures++))
        else
            print_status "Controller implementation files found: ${#controller_files[@]}"
        fi
        
        # Warning: API compatibility documented
        if [ -f "$PHASE_DIR/implementation/api-compatibility.md" ]; then
            if grep -q "\[OriginalSystemName\]" "$PHASE_DIR/implementation/api-compatibility.md"; then
                print_warning "API compatibility still contains template placeholders"
                ((warning_failures++))
            else
                print_status "API compatibility documented"
            fi
        fi
        
        # Warning: Implementation progress tracked
        if [ -f "$PHASE_DIR/implementation/implementation-progress.md" ]; then
            if grep -q "Not Started" "$PHASE_DIR/implementation/implementation-progress.md"; then
                print_warning "Implementation progress shows components not started"
                ((warning_failures++))
            else
                print_status "Implementation progress updated"
            fi
        fi
        ;;
        
    "migration")
        print_header "Migration → Complete Gating Criteria"
        
        # Critical: Build succeeds
        print_status "Checking build..."
        if npm run build >/dev/null 2>&1; then
            print_status "Build successful"
        else
            print_error "Build failed"
            ((critical_failures++))
        fi
        
        # Critical: Integration files updated
        integration_files=(
            "src-js/visual/integration/VisualSystemFacade.ts"
            "src-js/core/lifecycle/year3000System.ts"
        )
        
        for file in "${integration_files[@]}"; do
            if [ -f "$file" ]; then
                print_status "Integration file exists: $(basename "$file")"
            else
                print_error "Integration file missing: $file"
                ((critical_failures++))
            fi
        done
        
        # Warning: Tests pass
        print_status "Checking tests..."
        if npm test >/dev/null 2>&1; then
            print_status "Tests passing"
        else
            print_warning "Tests failing - review required"
            ((warning_failures++))
        fi
        
        # Critical: Migration documentation complete
        if [ -f "$PHASE_DIR/migration/integration-updates.md" ]; then
            if grep -q "\[SystemKey\]" "$PHASE_DIR/migration/integration-updates.md"; then
                print_error "Integration updates still contain template placeholders"
                ((critical_failures++))
            else
                print_status "Integration updates documented"
            fi
        else
            print_error "Integration updates documentation missing"
            ((critical_failures++))
        fi
        
        # Warning: Bundle size metrics captured
        if [ -f "$PHASE_DIR/artifacts/after-metrics.md" ]; then
            if grep -q "Not yet measured" "$PHASE_DIR/artifacts/after-metrics.md"; then
                print_warning "After-migration metrics not yet captured"
                ((warning_failures++))
            else
                print_status "Migration metrics captured"
            fi
        fi
        ;;
esac

# Summary
echo
print_header "Validation Summary"
echo "Critical failures: $critical_failures"
echo "Warning failures: $warning_failures"

if [ $critical_failures -gt 0 ]; then
    print_error "Critical gating criteria failed - section not ready for progression"
    exit 1
elif [ $warning_failures -gt 0 ]; then
    if [ "$STRICT_MODE" = true ]; then
        print_error "Warning criteria failed in strict mode - address warnings before progression"
        exit 2
    else
        print_warning "Warning criteria failed - consider addressing before progression"
        print_status "Section can progress but may benefit from addressing warnings"
    fi
else
    print_status "All gating criteria met - section ready for progression!"
fi

exit 0