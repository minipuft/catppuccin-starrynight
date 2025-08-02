#!/bin/bash
# scripts/archive-plan.sh - Archive development plans systematically

set -e

PLAN_NAME=$1
ARCHIVE_TYPE=${2:-completed}
AGENT_NAME=${3:-$(git config user.name || echo "Unknown")}

if [ -z "$PLAN_NAME" ]; then
    echo "Usage: $0 <plan-name> [completed|superseded|cancelled] [agent-name]"
    echo ""
    echo "Examples:"
    echo "  $0 PHASE-2-MASTER-PLAN completed"
    echo "  $0 old-approach superseded" 
    echo "  $0 experimental-feature cancelled"
    exit 1
fi

# Validate archive type
case $ARCHIVE_TYPE in
    completed|superseded|cancelled)
        ;;
    *)
        echo "Error: Archive type must be 'completed', 'superseded', or 'cancelled'"
        exit 1
        ;;
esac

ARCHIVE_DATE=$(date +%Y-%m)
ARCHIVE_DIR="plans/archive/$ARCHIVE_TYPE/$ARCHIVE_DATE"

echo "📋 Archiving plan: $PLAN_NAME"
echo "📁 Archive type: $ARCHIVE_TYPE"
echo "📅 Archive date: $ARCHIVE_DATE"
echo "👤 Agent: $AGENT_NAME"
echo ""

# Create archive directory
mkdir -p "$ARCHIVE_DIR"

# Check if plan exists
if [ ! -f "plans/$PLAN_NAME.md" ]; then
    echo "❌ Error: Plan file 'plans/$PLAN_NAME.md' not found"
    echo ""
    echo "Available plans:"
    ls -1 plans/*.md 2>/dev/null | sed 's/plans\//  - /' | sed 's/\.md$//' || echo "  No .md files found in plans/"
    exit 1
fi

# Move plan to archive
cp "plans/$PLAN_NAME.md" "$ARCHIVE_DIR/"
rm "plans/$PLAN_NAME.md"

echo "✅ Moved plan to archive: $ARCHIVE_DIR/$PLAN_NAME.md"

# Create implementation notes template based on archive type
case $ARCHIVE_TYPE in
    completed)
        cat > "$ARCHIVE_DIR/$PLAN_NAME-notes.md" << EOF
# Implementation Notes: $PLAN_NAME

**Archived**: $(date)
**Type**: completed
**Implemented By**: $AGENT_NAME

## Implementation Summary
[Brief summary of what was implemented - PLEASE UPDATE]

## Success Metrics Achieved
- [ ] Success criterion 1 - [Result]
- [ ] Success criterion 2 - [Result]
- [ ] Success criterion 3 - [Result]

## Technical Implementation
- **Key Files Modified**: [List key files - PLEASE UPDATE]
- **New Systems Created**: [List new systems - PLEASE UPDATE]
- **Integration Points**: [Integration details - PLEASE UPDATE]
- **Testing Added**: [Test files/coverage - PLEASE UPDATE]

## Performance Results
- **Bundle Size**: [Before] → [After] ([Change])
- **Build Time**: [Before] → [After] ([Change])
- **Runtime Performance**: [Metrics achieved]
- **Memory Usage**: [Memory impact]

## Key Learnings
### What Worked Well
- [Learning 1 - PLEASE UPDATE]
- [Learning 2 - PLEASE UPDATE]

### Challenges Overcome
- [Challenge 1 and solution - PLEASE UPDATE]
- [Challenge 2 and solution - PLEASE UPDATE]

### Future Recommendations
- [Recommendation 1 - PLEASE UPDATE]
- [Recommendation 2 - PLEASE UPDATE]

## References
- **Related Plans**: [Links to related archived plans]
- **Documentation Updated**: [List of docs updated]
- **Code Reviews**: [PR numbers or review references]

---
*Archived $(date) as part of systematic plan lifecycle management*
EOF
        ;;
    superseded)
        cat > "$ARCHIVE_DIR/$PLAN_NAME-notes.md" << EOF
# Superseded Plan: $PLAN_NAME

**Archived**: $(date)
**Type**: superseded
**Superseded By**: [Link to replacement plan - PLEASE UPDATE]
**Reason**: [Brief reason for superseding - PLEASE UPDATE]

## Original Plan Context
[Brief summary of original plan goals - PLEASE UPDATE]

## Why This Approach Was Superseded
- [Reason 1 - e.g., better architecture discovered - PLEASE UPDATE]
- [Reason 2 - e.g., performance concerns - PLEASE UPDATE] 
- [Reason 3 - e.g., integration complexity - PLEASE UPDATE]

## Valuable Elements Preserved
- [Concept 1 that influenced the replacement - PLEASE UPDATE]
- [Technical insight that was carried forward - PLEASE UPDATE]
- [Research that informed the new approach - PLEASE UPDATE]

## Lessons Learned
- [What this exploration taught us - PLEASE UPDATE]
- [Technical insights gained - PLEASE UPDATE]
- [Architectural understanding developed - PLEASE UPDATE]

---
*Plan superseded but archived for valuable context and learning*
EOF
        ;;
    cancelled)
        cat > "$ARCHIVE_DIR/$PLAN_NAME-notes.md" << EOF
# Cancelled Plan: $PLAN_NAME

**Archived**: $(date)
**Type**: cancelled
**Cancelled By**: $AGENT_NAME
**Reason**: [Brief reason for cancellation - PLEASE UPDATE]

## Original Plan Context
[Brief summary of what this plan aimed to achieve - PLEASE UPDATE]

## Cancellation Reasons
- [Primary reason - e.g., changing priorities - PLEASE UPDATE]
- [Secondary reason - e.g., technical complexity - PLEASE UPDATE]
- [Additional context - PLEASE UPDATE]

## Work Completed Before Cancellation
- [What was implemented before cancellation - PLEASE UPDATE]
- [Research or exploration done - PLEASE UPDATE]
- [Code/artifacts created - PLEASE UPDATE]

## Lessons Learned
- [What we learned from this attempt - PLEASE UPDATE]
- [Technical insights gained - PLEASE UPDATE]
- [Process improvements identified - PLEASE UPDATE]

## Future Considerations
- [Whether this might be revisited later - PLEASE UPDATE]
- [Different approaches that might work - PLEASE UPDATE]
- [Related work that could be valuable - PLEASE UPDATE]

---
*Plan cancelled but archived to preserve decision context*
EOF
        ;;
esac

echo "📝 Created implementation notes template: $ARCHIVE_DIR/$PLAN_NAME-notes.md"

# Update archive index
INDEX_FILE="plans/archive/$ARCHIVE_TYPE/index.md"
DESCRIPTION="[Brief description - please update]"

case $ARCHIVE_TYPE in
    completed)
        DESCRIPTION="Successfully implemented and deployed"
        ;;
    superseded)
        DESCRIPTION="Superseded by improved approach"
        ;;
    cancelled)
        DESCRIPTION="Cancelled due to changing priorities"
        ;;
esac

echo "- [$PLAN_NAME](./$ARCHIVE_DATE/$PLAN_NAME.md) - $(date +%Y-%m-%d) - $DESCRIPTION" >> "$INDEX_FILE"

echo "📇 Updated archive index: $INDEX_FILE"

# Update project status
echo "" >> plans/project-status.md
echo "## Recent Archive Activity" >> plans/project-status.md
echo "- ✅ **$PLAN_NAME** - $ARCHIVE_TYPE $(date +%Y-%m-%d)" >> plans/project-status.md

echo "📊 Updated project status"

echo ""
echo "🎉 Plan '$PLAN_NAME' archived successfully!"
echo ""
echo "📍 Next steps:"
echo "  1. Edit implementation notes: $ARCHIVE_DIR/$PLAN_NAME-notes.md"
echo "  2. Update the description in: $INDEX_FILE"
echo "  3. Review project-status.md for accuracy"
echo ""
echo "💡 Don't forget to document:"
echo "  - Specific technical achievements"
echo "  - Performance metrics and bundle size impact"
echo "  - Key learnings and future recommendations"