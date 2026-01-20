# Ticks and Tokens - Admin Features Implementation Plan

## Overview
This document outlines the implementation chunks for adding administrative controls to the Ticks and Tokens dashboard. These features transform the basic MVP into a fully manageable system for parents, including task management, week operations, token control, reward configuration, and data history.

## Progress Summary
- ✅ **Chunk 1: Task Editing Interface** - COMPLETED
- 🔄 **Chunk 2: Week Management System** - NEXT UP
- ⏳ **Chunks 3-6** - PENDING

**Recommended Next Step:** Start implementing Chunk 2 (Week Management System) to add the ability to start new weeks, carry forward task structures, and manage week lifecycles.

## Implementation Chunks

### Chunk 1: Task Editing Interface ✅ COMPLETED
Core administrative functionality for managing children's task lists.

- [x] **Create Edit Mode Toggle**: Add admin/parent mode button to switch between view and edit modes
- [x] **Task List UI Components**: Design and implement task editing interface with add/remove/modify buttons
- [x] **Add Task Functionality**: Implement "Add Task" dialog with task name input and extra task toggle
- [x] **Remove Task Functionality**: Add delete buttons and confirmation dialogs for task removal
- [x] **Edit Task Functionality**: Allow inline editing of task names and extra task status
- [x] **Task Persistence**: Save task changes to localStorage and update current week data
- [x] **Task Validation**: Add validation for task names (required, unique per child)
- [x] **UI State Management**: Handle switching between edit and view modes with visual indicators

### Chunk 2: Week Management System 🔄 NEXT UP
Administrative controls for starting, ending, and managing weeks.

- [ ] **Week Data Structure**: Extend data model to support multiple weeks and week states
- [ ] **Start New Week UI**: Create "Start New Week" button and modal interface
- [ ] **Week Initialization Logic**: Implement logic to create new week with default tasks or carry-forward option
- [ ] **Carry Forward Feature**: Add option to copy previous week's task structure to new week
- [ ] **End Week Functionality**: Implement "End Week" button to finalize scores and archive data
- [ ] **Week State Management**: Track current week status (active, completed, archived)
- [ ] **Week Navigation**: Allow switching between current and previous weeks for viewing
- [ ] **Week Persistence**: Ensure week data persists across browser sessions

### Chunk 3: Token Deduction Controls
Parent controls for managing screen time tokens.

- [ ] **Token Display Enhancement**: Improve token counter with clear remaining/used indicators
- [ ] **Deduct Token Button**: Add "Deduct Token" button for each child in admin mode
- [ ] **Token Deduction Logic**: Implement token reduction with validation (can't go below 0)
- [ ] **Deduction History**: Track and display recent token deductions with timestamps
- [ ] **Token Reset Logic**: Automatic token reset at start of new week (7 tokens per child)
- [ ] **Token Persistence**: Save token state across sessions and week transitions
- [ ] **Visual Feedback**: Add animations or highlights when tokens are deducted
- [ ] **Token Warning System**: Alert when tokens are getting low (< 3 remaining)

### Chunk 4: Reward Threshold Configuration
Configurable reward system for motivating children.

- [ ] **Reward Config UI**: Create admin interface for setting score-to-coins thresholds
- [ ] **Threshold Management**: Add/remove/modify reward tiers (e.g., 50+ = 1 coin, 70+ = 2 coins)
- [ ] **Extra Task Bonus Config**: Configure automatic bonus coins for extra task completion
- [ ] **Config Persistence**: Save reward configuration to localStorage
- [ ] **Config Validation**: Ensure thresholds are logical (increasing scores, positive coin values)
- [ ] **Live Preview**: Show how current scores would translate to rewards with current config
- [ ] **Default Config**: Provide sensible default reward thresholds out of the box
- [ ] **Config Reset**: Allow resetting to default configuration

### Chunk 5: Historical Data Viewing
Access to past weeks' performance and progress.

- [ ] **History Navigation UI**: Create "View History" button and week selection interface
- [ ] **Week History Display**: Show archived weeks with scores, coins earned, and token usage
- [ ] **Historical Task Display**: View completed checkmarks and task completion patterns
- [ ] **Progress Charts**: Simple charts showing score trends and improvement over time
- [ ] **Export Functionality**: Option to export historical data (CSV or simple print format)
- [ ] **Data Retention**: Implement automatic cleanup of very old data (keep last 12 weeks)
- [ ] **Search/Filter**: Allow filtering history by date range or specific achievements
- [ ] **Comparison View**: Side-by-side comparison of multiple weeks' performance

### Chunk 6: Admin UI Polish & Integration
Polish the administrative experience and integrate all features.

- [ ] **Admin Panel Layout**: Create dedicated admin section with organized feature access
- [ ] **Keyboard Shortcuts**: Add keyboard shortcuts for common admin actions
- [ ] **Bulk Operations**: Allow bulk task operations (copy tasks between children, etc.)
- [ ] **Settings Persistence**: Remember admin preferences (default carry-forward, etc.)
- [ ] **Error Handling**: Robust error handling for admin operations with user feedback
- [ ] **Undo Functionality**: Basic undo for accidental changes (task deletions, etc.)
- [ ] **Help Documentation**: In-app help text explaining admin features
- [ ] **Mobile Admin**: Ensure admin features work on mobile devices for on-the-go management

## Dependencies & Integration Points

### Data Model Updates
- [ ] Extend Child model to support task editing and history
- [ ] Update WeekData structure for multiple weeks and states
- [ ] Add RewardConfig entity for configurable thresholds
- [ ] Implement data migration for existing MVP data

### UI/UX Considerations
- [ ] Admin mode visual indicators (different color scheme, admin badges)
- [ ] Consistent button styling across all admin interfaces
- [ ] Loading states for async operations (saving configurations, etc.)
- [ ] Responsive design for admin panels on various screen sizes

### Testing Requirements
- [ ] Unit tests for all new data manipulation functions
- [ ] Integration tests for admin workflows (edit → save → persist)
- [ ] UI tests for admin interfaces and modal dialogs
- [ ] Data persistence tests across browser sessions

## Success Criteria
- [ ] Parent can fully customize task lists for each child
- [ ] Week transitions are smooth and data is preserved
- [ ] Token system provides effective behavior control
- [ ] Reward system is motivating and configurable
- [ ] Historical data provides valuable insights
- [ ] Admin interface is intuitive and reliable

## Risk Mitigation
- **Data Loss Prevention**: Implement backup/export before major data model changes
- **Backward Compatibility**: Ensure Phase 1 data can be migrated to Phase 2 structure
- **Performance**: Monitor for UI lag with larger datasets (many weeks of history)
- **User Training**: Consider simple onboarding for admin features

## Estimated Effort
- **Chunk 1 (Task Editing)**: Medium (2-3 days)
- **Chunk 2 (Week Management)**: Large (3-4 days)
- **Chunk 3 (Token Controls)**: Small (1-2 days)
- **Chunk 4 (Reward Config)**: Medium (2-3 days)
- **Chunk 5 (History)**: Medium (2-3 days)
- **Chunk 6 (Polish)**: Small (1-2 days)

**Total Estimated Time**: 12-18 days of development work