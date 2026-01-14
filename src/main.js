// Ticks and Tokens - Kids Task Tracking Dashboard
// Main application entry point with game loop for animations

let delta = 0
let then = 0
let canvas
let ctx
let animationManager // Will handle celebration animations (fireworks, etc.)

// Dashboard state - Each child has their own age-appropriate task list
let children = [
    {
        id: 'child1',
        name: 'Child 1',
        score: 0,
        tokens: 7,
        tasks: [
            // Example: { id: 'make-bed', name: 'Make Bed', isExtra: false },
            // Each child can have different tasks and different numbers of tasks
        ],
        currentWeek: {
            weekId: null,
            startDate: null,
            checks: {} // taskId -> array of 7 booleans for each day
        }
    },
    {
        id: 'child2',
        name: 'Child 2',
        score: 0,
        tokens: 7,
        tasks: [
            // Example: { id: 'brush-teeth', name: 'Brush Teeth', isExtra: false },
            // Different tasks appropriate for their age
        ],
        currentWeek: {
            weekId: null,
            startDate: null,
            checks: {} // taskId -> array of 7 booleans for each day
        }
    }
]

function sizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

function init() {
    // Initialize animation canvas
    canvas = document.getElementById('canvas')
    sizeCanvas()
    ctx = canvas.getContext('2d')

    if (!ctx) {
        console.error("Invalid Canvas Context")
        throw new Error("Invalid Canvas Context")
    }

    // TODO: Initialize dashboard components
    // - Load data from localStorage (including individual task lists per child)
    // - Create task grids for both children (different tasks, different counts)
    // - Set up event listeners for checkmark buttons
    // - Initialize animation manager
    // - Load current week data or create new week

    console.log("Ticks and Tokens dashboard initialized")
}

function updateDelta() {
    let now = Date.now()
    let newDelta = now - then
    delta = newDelta / 100
    then = now

    if (isNaN(delta)) {
        console.error("Invalid Delta")
        throw new Error("Invalid Delta")
    }
}

function update() {
    updateDelta()

    // TODO: Update logic will include:
    // - Animation manager updates
    // - Score calculations
    // - Token updates
    // - Any time-based dashboard updates

    if (animationManager) {
        animationManager.update(delta)
    }
}

function render() {
    // Clear canvas for animations
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // TODO: Render logic will include:
    // - Celebration animations (fireworks for high scores)
    // - Particle effects
    // - Any dynamic visual elements

    if (animationManager) {
        animationManager.render(ctx)
    }
}

function gameLoop() {
    update()
    render()
    requestAnimationFrame(gameLoop)
}

// Dashboard functions (to be implemented)
// TODO: Implement these core functions

function loadDashboardData() {
    // Load from localStorage:
    // - Child configurations (names, individual task lists)
    // - Current week progress
    // - Historical data
    // Initialize task grids (each child can have different tasks/different counts)
    // Update UI with current state
}

function saveDashboardData() {
    // Save to localStorage
    // Persist current state
}

function toggleCheckmark(childId, taskId, dayIndex) {
    // Toggle checkmark state
    // Update score
    // Trigger animations if needed
}

function calculateScore(childId) {
    // Calculate total checkmarks for the week
    // Update display
    // Trigger celebration if threshold met
}

function deductToken(childId) {
    // Reduce token count
    // Update display
    // Maybe show warning animation
}

function startNewWeek() {
    // Reset checkmarks for new week
    // Optionally carry forward task structure (each child's individual tasks)
    // Reset scores
    // Reset tokens to 7
}

function createTaskGrid(childId) {
    // Create HTML grid for a specific child
    // Each child can have different number of tasks
    // Generate 7 day columns for each task
    // Add click handlers for checkmarks
}

function updateScoreDisplay(childId) {
    // Calculate and display current score for a child
    // Count all completed checkmarks across their individual tasks
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    init()
    gameLoop()
})

document.addEventListener('resize', () => {
    sizeCanvas()
})

// Export functions for potential future module use
window.TicksAndTokens = {
    children,
    toggleCheckmark,
    calculateScore,
    deductToken,
    startNewWeek
}