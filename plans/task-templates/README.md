# Task Templates

This directory contains specialized templates for different types of development tasks.

## Template Categories

### By Development Phase
- **Phase 1**: System consolidation and performance optimization
- **Phase 2**: Visual consciousness architecture
- **Phase 3**: Integration and effects systems
- **Phase 4**: Testing and deployment

### By Technical Domain
- **CSS Systems**: CSS variable management, styling architecture
- **WebGL Systems**: Background rendering, visual effects
- **Architecture**: System integration, facade patterns
- **Performance**: Optimization, monitoring, device adaptation

### By Task Type
- **Implementation**: Code development tasks
- **Research**: Investigation and analysis tasks
- **Integration**: System connection and testing tasks
- **Maintenance**: Refactoring and cleanup tasks

## Usage

Templates can be used directly or copied as starting points for new tasks:

```bash
# Use template directly
cp plans/task-templates/css-implementation-template.md plans/tasks/my-css-task/implementation-plan.md

# Or use the create-task.sh script which automatically selects appropriate templates
scripts/create-task.sh my-css-task implementation PHASE-2-MASTER-PLAN High
```

## Template Naming Convention

- `[domain]-[type]-template.md` - e.g., `css-implementation-template.md`
- `[phase]-[domain]-template.md` - e.g., `phase2-visual-template.md`
- `status-template.md` - Generic status tracking template
- `notes-template.md` - Generic implementation notes template

---

**Templates Version**: 1.0.0  
**Created**: 2025-07-23  
**Purpose**: Standardized task creation for efficient development
## Comprehensive Phase Templates

### Analysis → Implementation → Migration Pattern
- **comprehensive-phase-template.md** - Complete A/I/M phase structure
- **analysis-section-template.md** - System analysis methodology
- **implementation-section-template.md** - Development work structure  
- **migration-section-template.md** - Integration and testing approach

### Usage
```bash
# Create comprehensive phase
scripts/create-comprehensive-phase.sh phase-name -d "Description" -t "Target"

# Or manually copy templates
cp plans/task-templates/comprehensive-phase-template.md plans/my-phase/PHASE-STATUS.md
```

