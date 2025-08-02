#!/bin/bash
# scripts/create-task.sh - Create structured development tasks

set -e

TASK_NAME=$1
TASK_TYPE=${2:-"implementation"}
PARENT_PLAN=${3:-""}
PRIORITY=${4:-"Medium"}

if [ -z "$TASK_NAME" ]; then
    echo "Usage: $0 <task-name> [implementation|research|integration] [parent-plan] [High|Medium|Low]"
    echo ""
    echo "Examples:"
    echo "  $0 css-consciousness-integration implementation PHASE-2-MASTER-PLAN High"
    echo "  $0 performance-analysis research '' Medium"
    echo "  $0 system-integration integration PHASE-2-MASTER-PLAN High"
    echo ""
    echo "Task Types:"
    echo "  implementation - Code implementation tasks"
    echo "  research       - Investigation and analysis tasks"
    echo "  integration    - System integration and testing tasks"
    exit 1
fi

# Validate task type
case $TASK_TYPE in
    implementation|research|integration)
        ;;
    *)
        echo "Error: Task type must be 'implementation', 'research', or 'integration'"
        exit 1
        ;;
esac

# Validate priority
case $PRIORITY in
    High|Medium|Low)
        ;;
    *)
        echo "Error: Priority must be 'High', 'Medium', or 'Low'"
        exit 1
        ;;
esac

TASK_DIR="plans/tasks/$TASK_NAME"

echo "📋 Creating task: $TASK_NAME"
echo "📁 Task type: $TASK_TYPE"
echo "📊 Priority: $PRIORITY"
if [ -n "$PARENT_PLAN" ]; then
    echo "📄 Parent plan: $PARENT_PLAN"
fi
echo ""

# Check if task already exists
if [ -d "$TASK_DIR" ]; then
    echo "❌ Error: Task directory '$TASK_DIR' already exists"
    exit 1
fi

# Create task directory
mkdir -p "$TASK_DIR"

# Create status.md based on task type
case $TASK_TYPE in
    implementation)
        cat > "$TASK_DIR/status.md" << EOF
# Task: $TASK_NAME

**Agent**: [To be assigned]
**Started**: [Date when work begins]
**Priority**: $PRIORITY
**Status**: Ready
**Type**: Implementation
**Parent Plan**: $PARENT_PLAN
**Dependencies**: [List prerequisites]

## Task Overview
[Brief description of what this implementation task accomplishes]

## Success Criteria
- [ ] Implementation completed and tested
- [ ] Integration with existing systems verified
- [ ] Performance targets met
- [ ] npm run build passes with no errors
- [ ] Test coverage maintained above 90%
- [ ] Documentation updated

## Implementation Phases
- [ ] Phase 1: Design and architecture setup
- [ ] Phase 2: Core implementation
- [ ] Phase 3: Integration and testing
- [ ] Phase 4: Performance optimization

## Current Focus
[Updated by assigned agent when work begins]

## Blockers
None currently identified

## Performance Targets
- **Bundle Size Impact**: [Target size change]
- **Build Time Impact**: No degradation
- **Runtime Performance**: [Specific targets]

## Next Actions
1. Review existing codebase and architecture
2. Design implementation approach
3. Begin core implementation
EOF
        ;;
    research)
        cat > "$TASK_DIR/status.md" << EOF
# Task: $TASK_NAME

**Agent**: [To be assigned]
**Started**: [Date when work begins]
**Priority**: $PRIORITY
**Status**: Ready
**Type**: Research
**Parent Plan**: $PARENT_PLAN
**Dependencies**: [List prerequisites]

## Research Overview
[Brief description of what this research task investigates]

## Research Questions
- [ ] Research question 1
- [ ] Research question 2
- [ ] Research question 3

## Success Criteria
- [ ] All research questions answered
- [ ] Technical findings documented
- [ ] Recommendations provided
- [ ] Implementation plan created (if applicable)

## Research Phases
- [ ] Phase 1: Literature review and existing system analysis
- [ ] Phase 2: Technical investigation
- [ ] Phase 3: Performance analysis
- [ ] Phase 4: Findings and recommendations

## Current Focus
[Updated by assigned agent when work begins]

## Blockers
None currently identified

## Expected Deliverables
- Research findings document
- Technical recommendations
- Implementation suggestions (if applicable)

## Next Actions
1. Review existing documentation and codebase
2. Identify key investigation areas
3. Begin systematic research
EOF
        ;;
    integration)
        cat > "$TASK_DIR/status.md" << EOF
# Task: $TASK_NAME

**Agent**: [To be assigned]
**Started**: [Date when work begins]
**Priority**: $PRIORITY
**Status**: Ready
**Type**: Integration
**Parent Plan**: $PARENT_PLAN
**Dependencies**: [List prerequisite tasks/systems]

## Integration Overview
[Brief description of what systems/components this task integrates]

## Integration Scope
- [ ] System 1 integration
- [ ] System 2 integration
- [ ] Cross-system communication
- [ ] End-to-end testing

## Success Criteria
- [ ] All systems integrate successfully
- [ ] Cross-system communication working
- [ ] Integration tests pass
- [ ] Performance targets maintained
- [ ] No regression in existing functionality

## Integration Phases
- [ ] Phase 1: Integration planning and design
- [ ] Phase 2: System connections and interfaces
- [ ] Phase 3: Integration testing
- [ ] Phase 4: Performance validation

## Current Focus
[Updated by assigned agent when work begins]

## Blockers
None currently identified

## Integration Points
- [System/component 1]
- [System/component 2]
- [Cross-cutting concerns]

## Next Actions
1. Review systems to be integrated
2. Plan integration approach
3. Begin system connections
EOF
        ;;
esac

# Create implementation plan based on task type
case $TASK_TYPE in
    implementation)
        cat > "$TASK_DIR/implementation-plan.md" << EOF
# Implementation Plan: $TASK_NAME

## Technical Overview
[Detailed description of what will be implemented]

## Architecture Design

### Current State
[Description of current system state]

### Target State  
[Description of desired end state]

### Implementation Approach
[High-level approach to achieving the target state]

## Technical Requirements
- **Programming Languages**: TypeScript, SCSS
- **Frameworks**: [List applicable frameworks]
- **Integration Points**: [Systems this will connect to]
- **Performance Requirements**: [Specific performance targets]

## Implementation Phases

### Phase 1: Foundation (Day 1)
- [ ] Create core classes and interfaces
- [ ] Set up basic structure
- [ ] Implement IManagedSystem compliance

### Phase 2: Core Implementation (Days 2-3) 
- [ ] Implement main functionality
- [ ] Add error handling
- [ ] Basic testing

### Phase 3: Integration (Day 4)
- [ ] Integrate with existing systems
- [ ] Update dependent systems
- [ ] Integration testing

### Phase 4: Optimization (Day 5)
- [ ] Performance optimization
- [ ] Bundle size optimization
- [ ] Comprehensive testing

## Code Structure
\`\`\`
src-js/
├── [relevant-directory]/
│   ├── $TASK_NAME.ts
│   ├── interfaces/
│   └── utils/
\`\`\`

## Testing Strategy
- Unit tests for core functionality
- Integration tests for system connections
- Performance tests for optimization verification
- End-to-end tests for user-facing features

## Performance Considerations
- **Bundle Size**: [Target impact]
- **Memory Usage**: [Target usage]
- **CPU Usage**: [Performance requirements]
- **Build Time**: No degradation

## Risk Mitigation
- [Risk 1] - [Mitigation strategy]
- [Risk 2] - [Mitigation strategy]

## Dependencies
- [External dependency 1]
- [Internal system dependency 2]

## Rollback Plan
[Strategy for reverting changes if issues arise]
EOF
        ;;
    research)
        cat > "$TASK_DIR/research-plan.md" << EOF
# Research Plan: $TASK_NAME

## Research Objective
[Clear statement of what this research aims to discover]

## Background Context
[Relevant background information and motivation for this research]

## Research Questions
1. [Primary research question]
2. [Secondary research question]
3. [Additional questions as needed]

## Research Methodology

### Phase 1: Literature Review
- [ ] Review existing documentation
- [ ] Analyze current codebase
- [ ] Study related projects/libraries
- [ ] Review performance benchmarks

### Phase 2: Technical Investigation
- [ ] Code analysis and profiling
- [ ] Performance measurements
- [ ] Architecture evaluation
- [ ] Implementation experiments

### Phase 3: Analysis and Synthesis
- [ ] Compile findings
- [ ] Analyze performance implications
- [ ] Evaluate different approaches
- [ ] Create recommendations

## Research Tools and Methods
- **Code Analysis**: [Tools to be used]
- **Performance Testing**: [Benchmarking approach]
- **Documentation Review**: [Sources to examine]
- **Experimentation**: [Prototype approach]

## Expected Outcomes
- Technical findings document
- Performance analysis results
- Implementation recommendations
- Risk assessment

## Success Metrics
- [ ] All research questions answered
- [ ] Quantitative data collected where applicable
- [ ] Clear recommendations provided
- [ ] Implementation path identified

## Timeline
- **Phase 1**: [Duration] - Literature review
- **Phase 2**: [Duration] - Investigation  
- **Phase 3**: [Duration] - Analysis
- **Documentation**: [Duration] - Final report

## Deliverables
1. Research findings document
2. Technical analysis report
3. Implementation recommendations
4. Performance implications assessment
EOF
        ;;
    integration)
        cat > "$TASK_DIR/integration-plan.md" << EOF
# Integration Plan: $TASK_NAME

## Integration Objective
[Clear statement of what systems/components will be integrated]

## Systems Overview

### System A: [System Name]
- **Purpose**: [What this system does]
- **Interfaces**: [Public APIs/interfaces]
- **Dependencies**: [What it depends on]

### System B: [System Name]
- **Purpose**: [What this system does]
- **Interfaces**: [Public APIs/interfaces]
- **Dependencies**: [What it depends on]

## Integration Architecture

### Integration Points
1. **Interface A ↔ Interface B**: [Description of connection]
2. **Data Flow**: [How data moves between systems]
3. **Event Communication**: [How systems communicate events]

### Integration Patterns
- **Pattern 1**: [e.g., Observer, Factory, Facade]
- **Pattern 2**: [Additional patterns used]

## Integration Phases

### Phase 1: Planning and Design
- [ ] Define integration interfaces
- [ ] Create integration architecture
- [ ] Identify potential issues

### Phase 2: Implementation
- [ ] Create integration layer
- [ ] Implement communication interfaces
- [ ] Add error handling

### Phase 3: Testing
- [ ] Unit test integration components
- [ ] Integration testing
- [ ] End-to-end testing

### Phase 4: Validation
- [ ] Performance validation
- [ ] Regression testing
- [ ] Load testing (if applicable)

## Technical Requirements
- **Communication Protocol**: [How systems communicate]
- **Data Formats**: [Data exchange formats]
- **Error Handling**: [Error handling strategy]
- **Performance Requirements**: [Integration performance targets]

## Testing Strategy
- **Unit Tests**: Test individual integration components
- **Integration Tests**: Test system-to-system communication
- **Performance Tests**: Validate integration performance
- **Regression Tests**: Ensure no existing functionality is broken

## Risk Assessment
- **Risk 1**: [Description] - **Mitigation**: [Strategy]
- **Risk 2**: [Description] - **Mitigation**: [Strategy]

## Success Criteria
- [ ] All systems communicate successfully
- [ ] Performance targets met
- [ ] No regression in existing functionality
- [ ] Error handling works correctly
- [ ] Integration is maintainable and documented

## Rollback Strategy
[Plan for reverting integration if issues arise]
EOF
        ;;
esac

# Create notes.md
cat > "$TASK_DIR/notes.md" << EOF
# Implementation Notes: $TASK_NAME

## Key Discoveries
[Important findings during task execution - will be updated by assigned agent]

## Code Patterns Used
\`\`\`typescript
// Example code patterns or solutions discovered during implementation
// This section will be updated as work progresses
\`\`\`

## Performance Considerations
[Memory usage, build time, or runtime performance notes]

## Integration Points
[How this task connects to other systems]

## Gotchas and Pitfalls
[Things to watch out for - discovered during implementation]

## Testing Approach
[How this task was tested or should be tested]

## Documentation Updates
[Documentation that was updated or needs updating]

## Future Considerations
[Potential improvements or related future work]

---
*Notes will be updated throughout task execution by the assigned agent*
EOF

echo "✅ Task '$TASK_NAME' created successfully!"
echo ""
echo "📁 Task location: $TASK_DIR/"
echo "📄 Files created:"
echo "  - status.md (task tracking and progress)"
echo "  - notes.md (implementation discoveries)"
if [ "$TASK_TYPE" = "implementation" ]; then
    echo "  - implementation-plan.md (technical implementation plan)"
elif [ "$TASK_TYPE" = "research" ]; then
    echo "  - research-plan.md (research methodology and questions)"
elif [ "$TASK_TYPE" = "integration" ]; then
    echo "  - integration-plan.md (integration architecture and approach)"
fi
echo ""
echo "📋 Next steps:"
echo "  1. Review and customize the generated templates"
echo "  2. Update agent-coordination.md to register this task"
echo "  3. Assign an agent to work on this task"
echo ""
echo "🔧 Quick commands:"
echo "  Edit task status: \$EDITOR $TASK_DIR/status.md"
echo "  Edit task notes: \$EDITOR $TASK_DIR/notes.md"
echo "  Register in coordination: echo '| **$TASK_NAME** | [Agent Type] | [Description] | [Target] | 🟢 READY | [Dependencies] |' >> plans/agent-coordination.md"