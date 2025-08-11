# Enhanced Multi-Agent Communication Templates

Standardized templates for Claude Code sub-agent coordination during Simple Theme Architecture transition.

## 1. Sub-Agent Status Update Template

```markdown
## Status Update: [Sub-Agent Name]
**Date**: [YYYY-MM-DD]
**Agent**: `[theme-architect|color-specialist|performance-guardian|spicetify-specialist|workbench-coordinator]`
**Phase**: [Analysis|Implementation|Migration]
**Current Task**: [Brief description]
**Progress**: [X]% complete
**Next Actions**: [What's planned next]
**Dependencies**: [Waiting on other agents or none]
**Blockers**: [Any blocking issues or none]
**Performance Impact**: [Metrics relevant to agent specialization]
**Coordination Notes**: [Inter-agent communication needs]
**Key Discoveries**: [Important findings or patterns]
```

## 2. Sub-Agent Conflict Alert Template

```markdown
## 🚨 Agent Conflict Alert: [Issue Type]
**Reporting Agent**: `[agent-name]`
**Conflicting Agent**: `[other-agent-name]` (if applicable)
**Issue**: [Brief description of the problem]
**Affected Systems**: [Which files/systems are impacted]
**C.A.G.E.E.R.F Impact**: [How this affects C.A.G.E.E.R.F workflow progression]
**Performance Risk**: [Performance implications if unresolved]
**Proposed Resolution**: [Your suggested solution]
**Coordination Required**: [Which agents need to collaborate]
**Urgency**: [High|Medium|Low] - [Reason for urgency level]
**Escalation**: [Request workbench-coordinator mediation? Y/N]
```

## 3. Resource Request Template

```markdown
## Resource Request: [Request Type]
**Agent ID**: [Your agent identifier]
**Request**: [What resources are needed]
**Justification**: [Why this is needed]
**Duration**: [How long resources are needed]
**Impact**: [Expected performance or development impact]
**Alternatives**: [Other options considered]
```

## 4. C.A.G.E.E.R.F Coordination Template

```markdown
## C.A.G.E.E.R.F Coordination: [Workflow Stage]
**Coordinating Agent**: `workbench-coordinator`
**Stage**: [Context & Analysis|Actions & Goals|Execution & Evaluation|Refinement & Format]
**Active Agents**: [List of participating agents]
**Phase Status**: [Starting|In Progress|Gating|Complete]
**Completion**: [X]% of phase complete
**Gating Criteria**: [Requirements for next phase]
**Dependencies**: [Cross-agent dependencies]
**Timeline**: [Expected completion date]
**Risk Assessment**: [Potential issues or none]
**Next Phase Readiness**: [Ready|Blocked|Pending]
```

## 5. Knowledge Transfer Template

```markdown
## Knowledge Transfer: [Topic Area]
**From Agent**: `[source-agent]`
**To Agents**: `[target-agents]`
**Topic**: [What knowledge is being shared]
**Context**: [Simple Theme Architecture relevance]
**Implementation**: [Key implementation details]
**Code Examples**: [Relevant code snippets or patterns]
**Gotchas**: [Pitfalls to avoid]
**Best Practices**: [Recommended approaches]
**Integration Notes**: [How this affects other systems]
**Pattern Sharing**: [Reusable patterns for other projects]
```

## Usage Guidelines

### When to Use Each Template

- **Status Update**: Regular progress reports from specialized agents
- **Conflict Alert**: Immediate notification of inter-agent conflicts or blocking issues
- **Resource Request**: Need for additional development resources or tool access
- **C.A.G.E.E.R.F Coordination**: Workflow stage transitions and cross-agent coordination
- **Knowledge Transfer**: Sharing discoveries, patterns, and successful implementations

### Sub-Agent Communication Frequency

- **Status Updates**: At phase milestones or every major task completion
- **Conflict Alerts**: Immediately when agent conflicts or blocking issues are discovered
- **Resource Requests**: As needed with clear justification and impact analysis
- **Phase Coordination**: At phase transitions and gating validation points
- **Knowledge Transfer**: After significant discoveries, successful patterns, or task completion

### Multi-Agent Best Practices

1. **Agent-Specific Context**: Tailor communication to agent specialization
2. **C.A.G.E.E.R.F Awareness**: Include current workflow stage context in all communications
3. **Performance Impact**: Always consider performance implications of coordination
4. **Coordination Overhead**: Keep communication efficient (<0.5% CPU target)
5. **Pattern Documentation**: Document successful coordination patterns for reuse

---

## 🎯 Sub-Agent Activation Protocol

### Phase-Based Agent Coordination

**Analysis Phase**:
- **Primary**: `theme-architect` + `performance-guardian`
- **Support**: `workbench-coordinator`
- **Communication**: Status updates every major analysis milestone

**Implementation Phase**:
- **Primary**: `color-specialist` + `spicetify-specialist`
- **Support**: `performance-guardian` + `workbench-coordinator`  
- **Communication**: Real-time coordination for complex changes

**Migration Phase**:
- **All Agents**: Coordinated through `workbench-coordinator`
- **Communication**: Intensive coordination with frequent status updates

### Agent Interaction Examples

```markdown
## Example: theme-architect → performance-guardian
**From**: `theme-architect`
**To**: `performance-guardian`
**Context**: Proposing file reorganization that may impact build performance
**Request**: Validate bundle size impact of moving 15 color files to colors/ structure
**Expected Response**: Performance metrics and optimization recommendations
```

```markdown
## Example: workbench-coordinator → all agents
**From**: `workbench-coordinator`
**To**: All active agents
**Context**: Analysis Phase → Implementation Phase transition
**Action**: Gating validation complete, ready for Implementation Phase
**Next Steps**: color-specialist and spicetify-specialist begin implementation work
```

---

*Enhanced Multi-Agent Communication Templates - Neural Workbench 2.0*
*Supporting Simple Theme Architecture transition with specialized Claude Code sub-agents*