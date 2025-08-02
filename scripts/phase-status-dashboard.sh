#!/bin/bash
# phase-status-dashboard.sh
# Shows comprehensive status across all comprehensive phases

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() { echo -e "${BLUE}=== $1 ===${NC}"; }
print_section() { echo -e "${CYAN}$1${NC}"; }
print_status() { echo -e "${GREEN}✅${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠️${NC} $1"; }
print_error() { echo -e "${RED}❌${NC} $1"; }
print_progress() { echo -e "${BLUE}🔄${NC} $1"; }

# Find all comprehensive phases
PHASES=($(find plans -maxdepth 1 -type d -name "phase-*" | sort))

if [ ${#PHASES[@]} -eq 0 ]; then
    echo "No comprehensive phases found in plans/ directory"
    exit 0
fi

print_header "Comprehensive Phase Dashboard"
echo

# Overall summary
total_phases=${#PHASES[@]}
completed_phases=0
in_progress_phases=0
not_started_phases=0

for phase_dir in "${PHASES[@]}"; do
    phase_name=$(basename "$phase_dir")
    
    if [ -f "$phase_dir/PHASE-STATUS.md" ]; then
        if grep -q "PHASE COMPLETE" "$phase_dir/PHASE-STATUS.md"; then
            ((completed_phases++))
        elif grep -q "Status.*Not Started\|Status.*Waiting" "$phase_dir/analysis/section-status.md" 2>/dev/null; then
            ((not_started_phases++))
        else
            ((in_progress_phases++))
        fi
    else
        ((not_started_phases++))
    fi
done

print_section "📊 Summary"
echo "  Total Phases: $total_phases"
echo "  ✅ Completed: $completed_phases"
echo "  🔄 In Progress: $in_progress_phases"
echo "  ⏸️  Not Started: $not_started_phases"
echo

# Detailed phase status
print_section "📋 Phase Details"
for phase_dir in "${PHASES[@]}"; do
    phase_name=$(basename "$phase_dir")
    echo
    echo "🔹 $phase_name"
    
    # Check if it's a comprehensive phase
    if [ ! -f "$phase_dir/analysis/section-status.md" ]; then
        echo "   ℹ️  Not a comprehensive A/I/M phase"
        continue
    fi
    
    # Analysis section status
    analysis_status="❓"
    if [ -f "$phase_dir/analysis/section-status.md" ]; then
        if grep -q "Progress.*100%" "$phase_dir/analysis/section-status.md"; then
            analysis_status="✅"
        elif grep -q "Status.*Not Started" "$phase_dir/analysis/section-status.md"; then
            analysis_status="⏸️"
        else
            analysis_status="🔄"
        fi
    fi
    
    # Implementation section status  
    implementation_status="❓"
    if [ -f "$phase_dir/implementation/section-status.md" ]; then
        if grep -q "Progress.*100%" "$phase_dir/implementation/section-status.md"; then
            implementation_status="✅"
        elif grep -q "Status.*Waiting\|Status.*Not Started" "$phase_dir/implementation/section-status.md"; then
            implementation_status="⏸️"
        else
            implementation_status="🔄"
        fi
    fi
    
    # Migration section status
    migration_status="❓"
    if [ -f "$phase_dir/migration/section-status.md" ]; then
        if grep -q "Progress.*100%" "$phase_dir/migration/section-status.md"; then
            migration_status="✅"
        elif grep -q "Status.*Waiting\|Status.*Not Started" "$phase_dir/migration/section-status.md"; then
            migration_status="⏸️"
        else
            migration_status="🔄"
        fi
    fi
    
    echo "   📊 Analysis: $analysis_status | Implementation: $implementation_status | Migration: $migration_status"
    
    # Show current focus/blocker
    if [ -f "$phase_dir/PHASE-STATUS.md" ]; then
        current_section=""
        if [ "$analysis_status" = "🔄" ]; then
            current_section="Analysis"
        elif [ "$implementation_status" = "🔄" ]; then
            current_section="Implementation"
        elif [ "$migration_status" = "🔄" ]; then
            current_section="Migration"
        elif [ "$analysis_status" = "✅" ] && [ "$implementation_status" = "✅" ] && [ "$migration_status" = "✅" ]; then
            current_section="✅ Complete"
        else
            current_section="Ready to start"
        fi
        
        if [ "$current_section" != "✅ Complete" ]; then
            echo "   🎯 Current focus: $current_section"
        fi
    fi
done

echo
print_section "🚀 Quick Actions"
echo "  📝 Create new phase: scripts/create-comprehensive-phase.sh <name>"
echo "  ▶️  Progress section: scripts/progress-section.sh <phase> <section> [next]"
echo "  📊 View specific phase: cat plans/<phase>/PHASE-STATUS.md"
