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
        name: 'Alex',
        score: 0,
        tokens: 7,
        tasks: [
            { id: 'make-bed', name: 'Make Bed', isExtra: false },
            { id: 'brush-teeth', name: 'Brush Teeth', isExtra: false },
            { id: 'homework', name: 'Homework', isExtra: false },
            { id: 'practice-piano', name: 'Practice Piano', isExtra: true }
        ],
        currentWeek: {
            weekId: 'week-2024-01-21',
            startDate: new Date('2024-01-21'),
            checks: {
                'make-bed': [true, true, false, true, false, false, false],
                'brush-teeth': [true, true, true, true, false, false, false],
                'homework': [false, false, false, false, false, false, false],
                'practice-piano': [true, true, true, true, false, false, false]
            }
        }
    },
    {
        id: 'child2',
        name: 'Jordan',
        score: 0,
        tokens: 7,
        tasks: [
            { id: 'tidy-room', name: 'Tidy Room', isExtra: false },
            { id: 'brush-teeth-2', name: 'Brush Teeth', isExtra: false },
            { id: 'read-book', name: 'Read Book', isExtra: false },
            { id: 'help-chores', name: 'Help with Chores', isExtra: true },
            { id: 'walk-dog', name: 'Walk Dog', isExtra: true }
        ],
        currentWeek: {
            weekId: 'week-2024-01-21',
            startDate: new Date('2024-01-21'),
            checks: {
                'tidy-room': [true, false, true, false, true, false, false],
                'brush-teeth-2': [true, true, true, true, true, false, false],
                'read-book': [true, true, false, true, true, false, false],
                'help-chores': [false, true, false, false, false, false, false],
                'walk-dog': [false, false, false, false, false, false, false]
            }
        }
    }
]

// UI State
let isEditMode = false

// Task editing state
let currentEditingChildId = null
let currentEditingTaskId = null

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

    // Initialize dashboard components
    loadDashboardData()

    // Create task grids for both children
    createTaskGrid('child1')
    createTaskGrid('child2')

    // Update initial score displays
    updateScoreDisplay('child1')
    updateScoreDisplay('child2')

    // Initialize animation manager
    // Load current week data or create new week

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
    // Load from localStorage
    const savedData = localStorage.getItem('ticksAndTokens')
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData)
            // Merge saved data with current structure
            if (parsed.children) {
                parsed.children.forEach((savedChild, index) => {
                    if (children[index]) {
                        children[index] = { ...children[index], ...savedChild }
                        // Convert date strings back to Date objects
                        if (savedChild.currentWeek?.startDate) {
                            children[index].currentWeek.startDate = new Date(savedChild.currentWeek.startDate)
                        }
                    }
                })
            }
            if (parsed.isEditMode !== undefined) {
                isEditMode = parsed.isEditMode
            }
        } catch (e) {
            console.warn('Failed to load saved data:', e)
        }
    }

    // Update UI elements
    updateChildNames()
}

function saveDashboardData() {
    // Save to localStorage
    const dataToSave = {
        children: children.map(child => ({
            ...child,
            currentWeek: {
                ...child.currentWeek,
                startDate: child.currentWeek.startDate?.toISOString()
            }
        })),
        isEditMode
    }

    try {
        localStorage.setItem('ticksAndTokens', JSON.stringify(dataToSave))
    } catch (e) {
        console.warn('Failed to save data:', e)
    }
}

function updateChildNames() {
    children.forEach(child => {
        const nameElement = document.getElementById(`${child.id}-name`)
        if (nameElement) {
            nameElement.textContent = child.name
        }
    })
}

// Task editing functions
function showAddTaskDialog(childId) {
    currentEditingChildId = childId
    currentEditingTaskId = null

    document.getElementById('modal-title').textContent = 'Add Task'
    document.getElementById('task-name').value = ''
    document.getElementById('task-is-extra').checked = false
    document.getElementById('task-modal').style.display = 'flex'

    // Focus on the input
    setTimeout(() => document.getElementById('task-name').focus(), 100)
}

function editTask(childId, taskId) {
    const child = children.find(c => c.id === childId)
    const task = child?.tasks.find(t => t.id === taskId)
    if (!task) return

    currentEditingChildId = childId
    currentEditingTaskId = taskId

    document.getElementById('modal-title').textContent = 'Edit Task'
    document.getElementById('task-name').value = task.name
    document.getElementById('task-is-extra').checked = task.isExtra
    document.getElementById('task-modal').style.display = 'flex'

    // Focus on the input
    setTimeout(() => document.getElementById('task-name').focus(), 100)
}

function closeTaskModal() {
    document.getElementById('task-modal').style.display = 'none'
    currentEditingChildId = null
    currentEditingTaskId = null
}

function addTask(childId, taskName, isExtra) {
    const child = children.find(c => c.id === childId)
    if (!child) return false

    // Validate task name
    if (!taskName.trim()) {
        alert('Task name is required')
        return false
    }

    // Check for duplicate names
    const isDuplicate = child.tasks.some(task => task.name.toLowerCase() === taskName.toLowerCase().trim())
    if (isDuplicate) {
        alert('A task with this name already exists')
        return false
    }

    // Generate unique ID
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Add the task
    child.tasks.push({
        id: taskId,
        name: taskName.trim(),
        isExtra: isExtra
    })

    // Initialize checks for this task
    child.currentWeek.checks[taskId] = new Array(7).fill(false)

    return true
}

function updateTask(childId, taskId, taskName, isExtra) {
    const child = children.find(c => c.id === childId)
    const task = child?.tasks.find(t => t.id === taskId)
    if (!task) return false

    // Validate task name
    if (!taskName.trim()) {
        alert('Task name is required')
        return false
    }

    // Check for duplicate names (excluding current task)
    const isDuplicate = child.tasks.some(t =>
        t.id !== taskId && t.name.toLowerCase() === taskName.toLowerCase().trim()
    )
    if (isDuplicate) {
        alert('A task with this name already exists')
        return false
    }

    // Update the task
    task.name = taskName.trim()
    task.isExtra = isExtra

    return true
}

function removeTask(childId, taskId) {
    const child = children.find(c => c.id === childId)
    if (!child) return

    const taskIndex = child.tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) return

    const task = child.tasks[taskIndex]

    // Confirm deletion
    if (!confirm(`Are you sure you want to remove "${task.name}"? This will also delete all checkmarks for this task.`)) {
        return
    }

    // Remove the task
    child.tasks.splice(taskIndex, 1)

    // Remove checks for this task
    delete child.currentWeek.checks[taskId]

    // Refresh the grid and save
    createTaskGrid(childId)
    updateScoreDisplay(childId)
    saveDashboardData()
}

// Form submission handler and modal setup
document.addEventListener('DOMContentLoaded', () => {
    init()
    gameLoop()

    // Task form event listener
    const taskForm = document.getElementById('task-form')
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const taskName = document.getElementById('task-name').value
        const isExtra = document.getElementById('task-is-extra').checked

        let success = false

        if (currentEditingTaskId) {
            // Update existing task
            success = updateTask(currentEditingChildId, currentEditingTaskId, taskName, isExtra)
        } else {
            // Add new task
            success = addTask(currentEditingChildId, taskName, isExtra)
        }

        if (success) {
            // Capture the child ID before closing modal (since closeTaskModal resets it)
            const childId = currentEditingChildId
            closeTaskModal()
            createTaskGrid(childId)
            updateScoreDisplay(childId)
            saveDashboardData()
        }
    })

    // Close modal when clicking outside
    document.getElementById('task-modal').addEventListener('click', (e) => {
        if (e.target.id === 'task-modal') {
            closeTaskModal()
        }
    })
})

function toggleCheckmark(childId, taskId, dayIndex) {
    const child = children.find(c => c.id === childId)
    if (!child) return

    // Initialize checks array for this task if it doesn't exist
    if (!child.currentWeek.checks[taskId]) {
        child.currentWeek.checks[taskId] = new Array(7).fill(false)
    }

    // Toggle the checkmark
    child.currentWeek.checks[taskId][dayIndex] = !child.currentWeek.checks[taskId][dayIndex]

    // Update the button visual
    const button = document.querySelector(`[data-task-id="${taskId}"][data-day="${dayIndex}"]`)
    if (button) {
        const isCompleted = child.currentWeek.checks[taskId][dayIndex]
        button.classList.toggle('completed', isCompleted)
        button.textContent = isCompleted ? '✓' : ''
    }

    // Update score display
    updateScoreDisplay(childId)

    // Save to localStorage
    saveDashboardData()
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

function toggleEditMode() {
    isEditMode = !isEditMode

    // Update button text
    const toggleButton = document.getElementById('edit-mode-toggle')
    const toggleText = document.getElementById('edit-mode-text')

    if (isEditMode) {
        toggleButton.className = 'btn btn-warning'
        toggleText.textContent = 'Exit Admin Mode'
    } else {
        toggleButton.className = 'btn btn-secondary'
        toggleText.textContent = 'Admin Mode'
    }

    // Refresh all task grids to show/hide edit controls
    createTaskGrid('child1')
    createTaskGrid('child2')

    // Update scores display
    updateScoreDisplay('child1')
    updateScoreDisplay('child2')
}

function createTaskGrid(childId) {
    const child = children.find(c => c.id === childId)
    if (!child) return

    const taskGrid = document.getElementById(`${childId}-tasks`)
    if (!taskGrid) return

    taskGrid.innerHTML = ''

    // Create header row with day labels
    const headerRow = document.createElement('div')
    headerRow.className = 'task-row header-row'
    headerRow.innerHTML = `
        <div class="task-name">Task</div>
        <div class="day-buttons">
            <div class="day-label">Mon</div>
            <div class="day-label">Tue</div>
            <div class="day-label">Wed</div>
            <div class="day-label">Thu</div>
            <div class="day-label">Fri</div>
            <div class="day-label">Sat</div>
            <div class="day-label">Sun</div>
        </div>
        ${isEditMode ? '<div class="edit-actions">Actions</div>' : ''}
    `
    taskGrid.appendChild(headerRow)

    // Create task rows
    child.tasks.forEach(task => {
        const taskRow = document.createElement('div')
        taskRow.className = `task-row ${task.isExtra ? 'extra-task' : ''}`
        taskRow.dataset.taskId = task.id

        const dayButtons = []
        for (let day = 0; day < 7; day++) {
            const isCompleted = child.currentWeek.checks[task.id]?.[day] || false
            const buttonClass = isCompleted ? 'completed' : ''
            const extraClass = task.isExtra ? 'extra' : ''

            dayButtons.push(`
                <button class="day-button ${buttonClass} ${extraClass}"
                        data-task-id="${task.id}"
                        data-day="${day}"
                        onclick="toggleCheckmark('${childId}', '${task.id}', ${day})">
                    ${isCompleted ? '✓' : ''}
                </button>
            `)
        }

        taskRow.innerHTML = `
            <div class="task-name">${task.name}</div>
            <div class="day-buttons">${dayButtons.join('')}</div>
            ${isEditMode ? `
                <div class="edit-actions">
                    <button class="btn btn-secondary btn-small" onclick="editTask('${childId}', '${task.id}')">Edit</button>
                    <button class="btn btn-warning btn-small" onclick="removeTask('${childId}', '${task.id}')">Remove</button>
                </div>
            ` : ''}
        `

        taskGrid.appendChild(taskRow)
    })

    // Add "Add Task" button in edit mode
    if (isEditMode) {
        const addTaskRow = document.createElement('div')
        addTaskRow.className = 'task-row add-task-row'
        addTaskRow.innerHTML = `
            <button class="btn btn-primary" onclick="showAddTaskDialog('${childId}')">
                + Add Task
            </button>
        `
        taskGrid.appendChild(addTaskRow)
    }
}

function updateScoreDisplay(childId) {
    const child = children.find(c => c.id === childId)
    if (!child) return

    // Calculate total score (count all completed checkmarks)
    let totalScore = 0
    child.tasks.forEach(task => {
        const checks = child.currentWeek.checks[task.id] || []
        const completedCount = checks.filter(Boolean).length
        totalScore += completedCount
    })

    child.score = totalScore

    // Update display
    const scoreElement = document.getElementById(`${childId}-score`)
    if (scoreElement) {
        scoreElement.textContent = totalScore
    }
}

// Event listeners
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