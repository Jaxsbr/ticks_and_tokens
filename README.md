# Ticks and Tokens

A simple digital dashboard for tracking kids' weekly tasks. Replaces paper-based task sheets with an interactive display suitable for wall-mounting on a screen.
![Ticks and Tokens Dashboard](screenshot.png)

## Features

- **Side-by-Side Display**: View both children's progress simultaneously
- **Calendar-Aligned Weeks**: Weeks run Monday-Sunday matching actual calendar dates
- **Week Navigation**: Navigate between previous and current weeks to view recorded ticks and tasks
- **Task Tracking**: Unique tasks per child per week with daily checkmarks
- **Admin Mode**: Edit tasks, add/remove tasks for each child
- **Week Completion**: Lock completed weeks to prevent changes (can be unlocked for edits)
- **Simple Scoring**: Automatic score calculation based on completed checkmarks

## Quick Start

1. **Configure Children**: Edit `config.js` to set child names and initial tasks
2. **Open Dashboard**: Open `index.html` in any modern browser
3. **Use Admin Mode**: Click "Admin Mode" to edit tasks and manage weeks

## File Structure

```
ticks_and_tokens/
├── index.html          Main dashboard HTML
├── styles.css          All styling (easily customizable)
├── config.js           Child names and initial task configuration
├── src/
│   └── main.js         Application logic
└── README.md           This file
```

## Configuration

Edit `config.js` to customize:
- Child names
- Initial tasks for each child
- Task types (regular or extra tasks)

## Usage

### Viewing Progress
- Click day buttons to toggle checkmarks
- View scores automatically calculated at the top of each child's panel
- Navigate weeks using Prev/Next buttons

### Admin Mode
- Click "Admin Mode" to enter edit mode
- Add tasks: Click "+ Add Task" button
- Edit tasks: Click "Edit" next to any task
- Remove tasks: Click "Remove" next to any task
- Complete week: Check "Week Completed" to lock the week (prevents adding/removing ticks and editing tasks)
- Unlock week: Uncheck "Week Completed" to make changes

### Week Navigation
- Use Prev/Next buttons to navigate between weeks
- Each week stores its own tasks and checkmarks
- New weeks automatically copy tasks from the most recent week

## Data Storage

All data is stored in browser localStorage. To reset:
- Open browser developer console
- Run: `localStorage.removeItem('ticksAndTokens')`
- Refresh the page

## Deployment

The dashboard can be deployed to any static hosting service or run locally. For Raspberry Pi deployment:
1. Clone repository to Pi
2. Open `index.html` in Chromium (kiosk mode optional)
3. Pull updates from git to deploy changes
