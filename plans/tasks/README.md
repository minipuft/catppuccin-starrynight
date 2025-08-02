# Tasks Directory

This directory contains task-specific coordination folders for development work.

## Structure

Each task should have its own folder with:

```
tasks/
├── [task-name]/
│   ├── status.md    # Progress tracking and current status
│   └── notes.md     # Implementation discoveries and details
```

## Creating a New Task

1. Create folder: `mkdir plans/tasks/[task-name]`
2. Copy templates from examples below
3. Update `agent-coordination.md` with your active work

## Task Status Template

```markdown
# Task: [Task Name]

**Agent**: [Your identifier]
**Started**: [Date]
**Priority**: [High/Medium/Low]
**Status**: [Not Started/In Progress/Blocked/Complete]

## Progress Checklist

- [ ] Task item 1
- [ ] Task item 2  
- [ ] Task item 3

## Current Focus

[What you're working on right now]

## Blockers

[Any issues preventing progress, or "None"]

## Next Actions

[What needs to be done next]
```

## Task Notes Template

```markdown
# Implementation Notes: [Task Name]

## Key Discoveries

- [Important findings during implementation]

## Code Patterns Used

```typescript
// Example code patterns or solutions
```

## Performance Considerations

- [Memory usage, build time, or runtime performance notes]

## Integration Points

- [How this connects to other systems]

## Gotchas and Pitfalls

- [Things to watch out for]

## Testing Approach

- [How this was tested or should be tested]

## Documentation Updates

- [Any documentation that needs updating]
```

---

*Task organization for structured development coordination*