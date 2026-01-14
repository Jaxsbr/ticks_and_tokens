# Ticks and Tokens - MVP Specification

## Overview
A digital dashboard replacing paper-based weekly task tracking sheets for two kids. Displayed on a 23" screen mounted in the home, showing both children's progress side-by-side simultaneously.

## Problem Statement
Currently using paper sheets with:
- Tasks listed down the left side
- 7 columns for each day of the week
- Manual checkmarks added throughout the week
- End-of-week score counting and coin rewards
- Extra column for special tasks
- Need to have demerit system related to screen time allocation

## Core Features

### 1. Weekly Task Tracking
- **Display**: Side-by-side layout for both children on 23" screen
- **Structure**: Each child has their own task list (age-appropriate), 7 columns for Mon-Sun
- **Input**: Simple button clicks to add/remove checkmarks (no typing)
- **Visual**: Clear checkboxes or icons showing completion status
- **Flexibility**: Different number of tasks per child, custom task names per child

### 2. Score Calculation & Rewards
- **Automatic Scoring**: Sum all checkmarks per child per week
- **Configurable Thresholds**: Define score ranges → coin rewards
  - Example: 50+ checks = 1 coin, 70+ = 2 coins
- **Extra Tasks**: Special column for non-routine tasks → automatic extra coins
- **Calculation**: One-click button to compute final scores

### 3. ScreenTimeTokens System
- **Allocation**: 7 tokens per week per child
- **Display**: Visual token counter (stars, coins, or icons)
- **Deduction**: Parent can deduct tokens for misbehavior
- **Purpose**: Replace unlimited screen time with controlled system

### 4. Week Management
- **Start Week**: Initialize new week with tasks
- **Carry Forward**: Option to copy previous week's task structure
- **End Week**: Finalize scores and archive data
- **History**: View previous weeks' scores and achievements

## User Actions

### Parent (Admin) Actions
- **Edit Tasks**: Add/remove/modify tasks for each child
- **Start New Week**: Initialize with current or previous week's tasks
- **Award Checkmarks**: Click buttons to mark task completion
- **Calculate Scores**: One-click score computation
- **Deduct Tokens**: Remove tokens for misbehavior
- **Configure Rewards**: Set score thresholds for coin rewards
- **View History**: Browse past weeks' data

### Child (View-Only) Actions
- **View Progress**: See their checkmarks and current score
- **View Tokens**: See remaining screen time tokens
- **Celebration**: Watch animations when hitting reward thresholds

## Technical Requirements

### Display & Hardware
- **Screen**: 23" mounted display
- **Device**: Raspberry Pi 4
- **Browser**: Chromium in fullscreen kiosk mode
- **Orientation**: Landscape (both kids side-by-side)
- **Resolution**: Responsive design for 1080p+ displays

### Software Architecture
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Storage**: Local browser storage (IndexedDB/localStorage)
- **Updates**: Git pull from GitHub, browser refresh
- **No Backend**: All logic client-side for simplicity

### UI/UX Requirements
- **Layout**: Dual-column layout (Child 1 | Child 2)
- **Input Methods**: Mouse clicks for checkmarks, keyboard for configuration
- **Visual Feedback**: Animations for achievements (fireworks, confetti)
- **Audio**: Sound effects for celebrations
- **Themes**: Clean, kid-friendly design
- **Accessibility**: Large buttons, clear icons, high contrast

## Data Model

### Core Entities
```javascript
Child: {
  id: string,
  name: string,
  tasks: Task[],  // Individual task list per child (age-appropriate)
  currentWeek: WeekData,
  history: WeekData[]
}

Task: {
  id: string,
  name: string,
  description?: string,
  isExtraTask: boolean  // automatic extra coins
}

WeekData: {
  weekId: string,
  startDate: Date,
  endDate: Date,
  dailyChecks: boolean[][]  // [day][task] completion matrix
  finalScore: number,
  coinsEarned: number,
  tokensRemaining: number
}

RewardConfig: {
  thresholds: Array<{minScore: number, coins: number}>,
  extraTaskBonus: number
}
```

## UI Wireframe Concept

```
┌─────────────────────────────────────────────────────────────┐
│                     Ticks and Tokens                        │
├─────────────────────────┬───────────────────────────────────┤
│     CHILD 1 NAME        │       CHILD 2 NAME               │
│     [Score: 45]         │       [Score: 52]                │
│     [Tokens: 6/7]       │       [Tokens: 7/7]              │
├─────────────────────────┼───────────────────────────────────┤
│ Make Bed [✓][✓][ ][✓].. │ Brush Teeth [✓][✓][✓][✓]..       │
│ Brush Teeth [✓][ ][✓].. │ Make Bed [✓][✓][✓][ ]..          │
│ Homework [ ][ ][ ][ ].. │ Homework [✓][ ][✓][✓]..          │
│ ...                     │ Practice Piano [✓][✓][✓][✓]..    │
│                         │ Read Book [✓][✓][✓][ ]..         │
│                         │ ...                              │
├─────────────────────────┼───────────────────────────────────┤
│ [Calculate Score]       │ [Calculate Score]               │
│ [Deduct Token]          │ [Deduct Token]                  │
├─────────────────────────┼───────────────────────────────────┤
│ [Start New Week]        │                                   │
│ [View History]          │                                   │
└─────────────────────────┴───────────────────────────────────┘
```

**Note**: Each child displays their own age-appropriate task list. Task names and counts can differ between children.

## Implementation Phases

### Phase 1: Core Dashboard (MVP)
- [ ] Basic side-by-side layout
- [ ] Static task display (no editing yet)
- [ ] Click-to-toggle checkmarks
- [ ] Score calculation logic
- [ ] Basic token counter
- [ ] Local storage for persistence

### Phase 2: Admin Features
- [ ] Task editing interface
- [ ] Week management (start/end/carry forward)
- [ ] Token deduction controls
- [ ] Reward threshold configuration
- [ ] Historical data viewing

### Phase 3: Polish & Engagement
- [ ] Achievement animations (fireworks for high scores)
- [ ] Audio feedback
- [ ] Kid-friendly theming
- [ ] Responsive design refinements

## Success Metrics
- **Usability**: Parent can update progress in <30 seconds
- **Visibility**: Kids can clearly see their progress from across room
- **Reliability**: Data persists across browser refreshes
- **Engagement**: Kids excited about hitting reward thresholds
- **Behavior Impact**: Reduction in screen time conflicts
