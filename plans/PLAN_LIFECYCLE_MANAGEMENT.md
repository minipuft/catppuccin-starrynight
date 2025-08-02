# Plan Lifecycle Management

**Version**: 1.0.0 | **Created**: 2025-07-23 | **Purpose**: Streamlined plan management and archival system

## Overview

This document establishes a systematic approach to managing the lifecycle of development plans, from creation through completion and archival. This system reduces planning overhead while preserving valuable knowledge.

## Plan Lifecycle Stages

### 1. Active Plans (Root Level)
Plans currently being worked on or ready for implementation:
- **Location**: `plans/` (root level)
- **Status**: Active, In Progress, or Ready
- **Examples**: `PHASE-2-MASTER-PLAN.md`, `COLOR-ORCHESTRATOR-STRATEGY-INTEGRATION-PLAN.md`

### 2. Completed Plans (Archive)
Plans that have been fully implemented and tested:
- **Location**: `plans/archive/completed/`
- **Status**: Completed and archived
- **Retention**: Permanent (valuable reference material)

### 3. Superseded Plans (Archive)
Plans that were replaced by better approaches:
- **Location**: `plans/archive/superseded/`
- **Status**: Superseded but retained for historical context
- **Retention**: Permanent (learning and decision history)

### 4. Cancelled Plans (Archive)
Plans that were started but not completed due to changing priorities:
- **Location**: `plans/archive/cancelled/`
- **Status**: Cancelled with reason documented
- **Retention**: 6 months minimum (decision context)

## Archive Structure

```
plans/
├── [active-plans].md              # Current working plans
├── archive/
│   ├── completed/
│   │   ├── YYYY-MM/              # Month-based organization
│   │   │   ├── plan-name.md
│   │   │   └── plan-name-implementation-notes.md
│   │   └── index.md              # Archive index
│   ├── superseded/
│   │   ├── YYYY-MM/
│   │   │   ├── old-plan-name.md
│   │   │   └── superseded-by.md  # Reference to replacement
│   │   └── index.md
│   └── cancelled/
│       ├── YYYY-MM/
│       │   ├── cancelled-plan.md
│       │   └── cancellation-reason.md
│       └── index.md
└── tasks/
    ├── [active-tasks]/
    └── archive/                   # Task-level archives (existing)
```

## Archival Workflow

### When to Archive a Plan

**Archive immediately when:**
1. ✅ Plan is fully implemented and tested
2. ✅ All success criteria have been met  
3. ✅ Code is merged and deployed
4. ✅ Documentation has been updated
5. ✅ Performance targets have been achieved

**Archive with status when:**
- 🔄 Plan is superseded by a better approach
- 🚫 Plan is cancelled due to changing priorities
- 📈 Plan evolves into multiple smaller plans

### Archive Process

#### Step 1: Prepare Archive Materials
```bash
# Create archive entry with implementation notes
export PLAN_NAME="your-plan-name"
export ARCHIVE_TYPE="completed"  # or superseded/cancelled
export ARCHIVE_DATE=$(date +%Y-%m)

mkdir -p plans/archive/$ARCHIVE_TYPE/$ARCHIVE_DATE
```

#### Step 2: Create Archive Entry
```bash
# Move plan to archive
mv plans/$PLAN_NAME.md plans/archive/$ARCHIVE_TYPE/$ARCHIVE_DATE/

# Create implementation notes
cat > plans/archive/$ARCHIVE_TYPE/$ARCHIVE_DATE/$PLAN_NAME-notes.md << EOF
# Implementation Notes: $PLAN_NAME

**Archived**: $(date)
**Type**: $ARCHIVE_TYPE
**Implemented By**: [Agent/Developer name]

## Implementation Summary
- [Brief summary of what was implemented]
- [Key technical decisions made]
- [Performance impact achieved]

## Success Metrics
- [Specific success criteria that were met]
- [Performance benchmarks achieved]
- [Bundle size impact, build time improvements, etc.]

## Key Learnings
- [What worked well]
- [What could be improved next time]
- [Patterns that emerged during implementation]

## References
- Related code files: [list key files modified]
- Documentation updated: [list docs updated]
- Tests added: [list test files]

## Future Considerations
- [Potential improvements]
- [Related future work]
- [Technical debt considerations]
EOF
```

#### Step 3: Update Archive Index
```bash
# Update archive index
echo "- [$PLAN_NAME](./$ARCHIVE_DATE/$PLAN_NAME.md) - $(date +%Y-%m-%d) - [Brief description]" >> plans/archive/$ARCHIVE_TYPE/index.md
```

#### Step 4: Update Active Coordination
```bash
# Remove from active tracking
sed -i "/$PLAN_NAME/d" plans/project-status.md
sed -i "/$PLAN_NAME/d" plans/agent-coordination.md

# Add completion note
echo "✅ **$PLAN_NAME** - Completed and archived $(date +%Y-%m-%d)" >> plans/project-status.md
```

## Archive Templates

### Completed Plan Archive Template
```markdown
# Implementation Notes: [Plan Name]

**Archived**: [Date]
**Type**: completed
**Implemented By**: [Agent/Developer]
**Bundle Impact**: [Size reduction/increase]
**Performance Impact**: [Metrics]

## Implementation Summary
[2-3 sentence summary of what was implemented]

## Success Metrics Achieved
- [ ] Success criterion 1 - [Result]
- [ ] Success criterion 2 - [Result]  
- [ ] Success criterion 3 - [Result]

## Technical Implementation
- **Key Files Modified**: [List]
- **New Systems Created**: [List]
- **Integration Points**: [List]
- **Testing Added**: [List]

## Performance Results
- **Bundle Size**: [Before] → [After] ([Change])
- **Build Time**: [Before] → [After] ([Change])
- **Runtime Performance**: [Metrics]
- **Memory Usage**: [Metrics]

## Key Learnings
### What Worked Well
- [Learning 1]
- [Learning 2]

### Challenges Overcome
- [Challenge 1 and solution]
- [Challenge 2 and solution]

### Future Recommendations
- [Recommendation 1]
- [Recommendation 2]

## References
- **Related Plans**: [Links to related archived plans]
- **Documentation Updated**: [List of docs updated]
- **Code Reviews**: [PR numbers or review references]

---
*Archived as part of systematic plan lifecycle management*
```

### Superseded Plan Archive Template
```markdown
# Superseded Plan: [Plan Name]

**Archived**: [Date]
**Type**: superseded
**Superseded By**: [Link to replacement plan]
**Reason**: [Brief reason for superseding]

## Original Plan Context
[Brief summary of original plan goals]

## Why This Approach Was Superseded
- [Reason 1 - e.g., better architecture discovered]
- [Reason 2 - e.g., performance concerns]
- [Reason 3 - e.g., integration complexity]

## Valuable Elements Preserved
- [Concept 1 that influenced the replacement]
- [Technical insight that was carried forward]
- [Research that informed the new approach]

## Lessons Learned
- [What this exploration taught us]
- [Technical insights gained]
- [Architectural understanding developed]

---
*Plan superseded but archived for valuable context and learning*
```

## Automated Archive Helpers

### Archive Script Template
```bash
#!/bin/bash
# scripts/archive-plan.sh

set -e

PLAN_NAME=$1
ARCHIVE_TYPE=${2:-completed}
AGENT_NAME=${3:-$(git config user.name)}

if [ -z "$PLAN_NAME" ]; then
    echo "Usage: $0 <plan-name> [completed|superseded|cancelled] [agent-name]"
    exit 1
fi

ARCHIVE_DATE=$(date +%Y-%m)
ARCHIVE_DIR="plans/archive/$ARCHIVE_TYPE/$ARCHIVE_DATE"

# Create archive directory
mkdir -p "$ARCHIVE_DIR"

# Check if plan exists
if [ ! -f "plans/$PLAN_NAME.md" ]; then
    echo "Error: Plan file 'plans/$PLAN_NAME.md' not found"
    exit 1
fi

# Move plan to archive
mv "plans/$PLAN_NAME.md" "$ARCHIVE_DIR/"

# Create implementation notes template
cat > "$ARCHIVE_DIR/$PLAN_NAME-notes.md" << EOF
# Implementation Notes: $PLAN_NAME

**Archived**: $(date)
**Type**: $ARCHIVE_TYPE  
**Implemented By**: $AGENT_NAME

## Implementation Summary
[Brief summary of implementation]

## Success Metrics
[Metrics achieved]

## Key Learnings
[Important insights]

---
*Archived $(date) as part of systematic plan lifecycle management*
EOF

# Update archive index
echo "- [$PLAN_NAME](./$ARCHIVE_DATE/$PLAN_NAME.md) - $(date +%Y-%m-%d) - [Brief description]" >> "plans/archive/$ARCHIVE_TYPE/index.md"

# Update project status
echo "✅ **$PLAN_NAME** - $ARCHIVE_TYPE $(date +%Y-%m-%d)" >> plans/project-status.md

echo "Plan '$PLAN_NAME' archived successfully to $ARCHIVE_DIR"
echo "Please update the implementation notes at: $ARCHIVE_DIR/$PLAN_NAME-notes.md"
```

### Archive Health Check
```bash
#!/bin/bash
# scripts/check-archive-health.sh

echo "📋 Archive Health Check"
echo "======================="

# Check for stale active plans (older than 30 days without updates)
find plans/ -name "*.md" -maxdepth 1 -mtime +30 | while read file; do
    if [ -f "$file" ]; then
        echo "⚠️  Stale plan detected: $(basename $file) (last modified: $(stat -c %y $file | cut -d' ' -f1))"
    fi
done

# Check archive structure
echo
echo "📁 Archive Structure:"
find plans/archive -type d | sort

# Count archived plans
echo
echo "📊 Archive Statistics:"
echo "Completed plans: $(find plans/archive/completed -name "*.md" 2>/dev/null | wc -l)"
echo "Superseded plans: $(find plans/archive/superseded -name "*.md" 2>/dev/null | wc -l)"  
echo "Cancelled plans: $(find plans/archive/cancelled -name "*.md" 2>/dev/null | wc -l)"

# Check for missing implementation notes
echo
echo "📝 Missing Implementation Notes:"
find plans/archive -name "*.md" ! -name "*-notes.md" ! -name "index.md" | while read plan; do
    notes_file="${plan%.md}-notes.md"
    if [ ! -f "$notes_file" ]; then
        echo "⚠️  Missing notes: $notes_file"
    fi
done
```

## Best Practices

### Archive Decision Making
1. **Be Decisive**: Archive plans promptly when complete
2. **Document Thoroughly**: Include implementation notes with metrics
3. **Preserve Context**: Explain why superseded plans were changed
4. **Learn from Experience**: Review archived plans for patterns

### Archive Quality
1. **Complete Information**: Include all relevant context
2. **Measurable Results**: Document concrete outcomes
3. **Future Reference**: Write for future developers who weren't involved
4. **Searchable Content**: Use consistent terminology and tags

### Maintenance
1. **Monthly Reviews**: Check for stale active plans
2. **Quarterly Cleanup**: Review and organize archive structure
3. **Annual Assessment**: Evaluate archived content for relevance
4. **Continuous Improvement**: Refine templates based on usage

## Integration with Development Workflow

### Pre-Implementation
- Create plan with clear success criteria
- Define measurable outcomes
- Establish archive criteria upfront

### During Implementation  
- Update plan status regularly
- Document key decisions and changes
- Note performance impacts and learnings

### Post-Implementation
- Archive immediately upon completion
- Document comprehensive implementation notes
- Update project status and coordination files
- Share learnings with team

---

**Lifecycle Management Version**: 1.0.0  
**Last Updated**: 2025-07-23  
**Purpose**: Systematic plan management and knowledge preservation