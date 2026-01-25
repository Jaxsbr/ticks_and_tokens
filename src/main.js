// Ticks and Tokens - Simplified Weekly Task Tracking
// Main application logic

// Application state
let currentWeekId = null; // Monday date in YYYY-MM-DD format
let isEditMode = false;
let currentEditingChildId = null;
let currentEditingTaskId = null;

// Week data structure: weekData[childId][weekId] = { tasks, checks, completed }
let weekData = {};

// Initialize application
function init() {
    // Load data from localStorage
    loadDashboardData();
    
    // Set current week to this week's Monday
    currentWeekId = getCurrentWeekId();
    
    // Initialize week data for both children if needed
    CONFIG.children.forEach(child => {
        ensureWeekData(child.id, currentWeekId);
    });
    
    // Render UI
    renderWeekNavigation();
    createTaskGrid('child1');
    createTaskGrid('child2');
    updateScoreDisplay('child1');
    updateScoreDisplay('child2');
    updateChildNames();
    updateWeekCompletedCheckbox();
    
    // Set up event listeners
    document.getElementById('prev-week-btn').addEventListener('click', () => navigateWeek(-1));
    document.getElementById('next-week-btn').addEventListener('click', () => navigateWeek(1));
    
    // Task form submission
    document.getElementById('task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const isExtra = document.getElementById('task-is-extra').checked;
        
        let success = false;
        if (currentEditingTaskId) {
            success = updateTask(currentEditingChildId, currentEditingTaskId, taskName, isExtra);
        } else {
            success = addTask(currentEditingChildId, taskName, isExtra);
        }
        
        if (success) {
            const childId = currentEditingChildId;
            closeTaskModal();
            createTaskGrid(childId);
            updateScoreDisplay(childId);
            saveDashboardData();
        }
    });
    
    // Close modal when clicking outside
    document.getElementById('task-modal').addEventListener('click', (e) => {
        if (e.target.id === 'task-modal') {
            closeTaskModal();
        }
    });
    
    console.log('Ticks and Tokens initialized');
}

// Get Monday date for a given date (or current date)
function getMondayDate(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
}

// Get current week ID (Monday date as YYYY-MM-DD)
function getCurrentWeekId() {
    const monday = getMondayDate();
    return formatWeekId(monday);
}

// Format date as YYYY-MM-DD
function formatWeekId(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format date for display (e.g., "Jan 20 - Jan 26, 2025")
function formatWeekDisplay(weekId) {
    const monday = new Date(weekId);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const options = { month: 'short', day: 'numeric' };
    const mondayStr = monday.toLocaleDateString('en-US', options);
    const sundayStr = sunday.toLocaleDateString('en-US', options);
    const year = monday.getFullYear();
    
    return `${mondayStr} - ${sundayStr}, ${year}`;
}

// Ensure week data exists for a child and week
function ensureWeekData(childId, weekId) {
    if (!weekData[childId]) {
        weekData[childId] = {};
    }
    
    if (!weekData[childId][weekId]) {
        // Create new week by copying tasks from most recent week, or use initial tasks
        const child = CONFIG.children.find(c => c.id === childId);
        if (!child) return;
        
        // Find most recent week for this child
        const weekIds = Object.keys(weekData[childId]).sort().reverse();
        let sourceWeek = null;
        
        if (weekIds.length > 0) {
            sourceWeek = weekData[childId][weekIds[0]];
        }
        
        // Initialize tasks from source week or config
        const tasks = sourceWeek ? [...sourceWeek.tasks] : child.initialTasks.map(t => ({ ...t }));
        
        // Initialize checks (empty for all tasks)
        const checks = {};
        tasks.forEach(task => {
            checks[task.id] = new Array(7).fill(false);
        });
        
        weekData[childId][weekId] = {
            tasks: tasks,
            checks: checks,
            completed: false
        };
    }
}

// Get week data for a child
function getWeekData(childId, weekId) {
    ensureWeekData(childId, weekId);
    return weekData[childId][weekId];
}

// Navigate to previous or next week
function navigateWeek(direction) {
    const currentMonday = new Date(currentWeekId);
    const newMonday = new Date(currentMonday);
    newMonday.setDate(currentMonday.getDate() + (direction * 7));
    
    const newWeekId = formatWeekId(newMonday);
    
    // Ensure week data exists for both children
    CONFIG.children.forEach(child => {
        ensureWeekData(child.id, newWeekId);
    });
    
    currentWeekId = newWeekId;
    
    // Update UI
    renderWeekNavigation();
    createTaskGrid('child1');
    createTaskGrid('child2');
    updateScoreDisplay('child1');
    updateScoreDisplay('child2');
    updateWeekCompletedCheckbox();
    
    saveDashboardData();
}

// Render week navigation display
function renderWeekNavigation() {
    const weekDisplay = document.getElementById('week-display');
    if (weekDisplay) {
        weekDisplay.textContent = `Week: ${formatWeekDisplay(currentWeekId)}`;
    }
    
    // Disable prev button if we're at the current week
    const prevBtn = document.getElementById('prev-week-btn');
    const nextBtn = document.getElementById('next-week-btn');
    const currentWeek = getCurrentWeekId();
    
    if (prevBtn) {
        prevBtn.disabled = currentWeekId === currentWeek;
    }
    if (nextBtn) {
        // Allow going one week into the future
        const nextWeek = new Date(currentWeek);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekId = formatWeekId(nextWeek);
        nextBtn.disabled = currentWeekId >= nextWeekId;
    }
}

// Check if current week is completed
function isWeekCompleted() {
    // Check if any child has this week marked as completed
    for (const child of CONFIG.children) {
        const week = getWeekData(child.id, currentWeekId);
        if (week.completed) {
            return true;
        }
    }
    return false;
}

// Toggle week completed status
function toggleWeekCompleted() {
    const checkbox = document.getElementById('week-completed-checkbox');
    const completed = checkbox.checked;
    
    // Set completion status for all children's current week
    CONFIG.children.forEach(child => {
        const week = getWeekData(child.id, currentWeekId);
        week.completed = completed;
    });
    
    // Refresh UI to show/hide disabled state
    createTaskGrid('child1');
    createTaskGrid('child2');
    
    saveDashboardData();
}

// Update week completed checkbox display
function updateWeekCompletedCheckbox() {
    const container = document.getElementById('week-completed-container');
    const checkbox = document.getElementById('week-completed-checkbox');
    
    if (container && checkbox) {
        container.style.display = isEditMode ? 'flex' : 'none';
        checkbox.checked = isWeekCompleted();
    }
}

// Load data from localStorage
function loadDashboardData() {
    const savedData = localStorage.getItem('ticksAndTokens');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            if (parsed.weekData) {
                weekData = parsed.weekData;
            }
            if (parsed.currentWeekId) {
                currentWeekId = parsed.currentWeekId;
            }
            if (parsed.isEditMode !== undefined) {
                isEditMode = parsed.isEditMode;
            }
        } catch (e) {
            console.warn('Failed to load saved data:', e);
        }
    }
}

// Save data to localStorage
function saveDashboardData() {
    const dataToSave = {
        weekData: weekData,
        currentWeekId: currentWeekId,
        isEditMode: isEditMode
    };
    
    try {
        localStorage.setItem('ticksAndTokens', JSON.stringify(dataToSave));
    } catch (e) {
        console.warn('Failed to save data:', e);
    }
}

// Update child names from config
function updateChildNames() {
    CONFIG.children.forEach(child => {
        const nameElement = document.getElementById(`${child.id}-name`);
        if (nameElement) {
            nameElement.textContent = child.name;
        }
    });
}

// Toggle edit mode
function toggleEditMode() {
    isEditMode = !isEditMode;
    
    const toggleButton = document.getElementById('edit-mode-toggle');
    const toggleText = document.getElementById('edit-mode-text');
    
    if (isEditMode) {
        toggleButton.className = 'btn btn-warning';
        toggleText.textContent = 'Exit Admin Mode';
    } else {
        toggleButton.className = 'btn btn-secondary';
        toggleText.textContent = 'Admin Mode';
    }
    
    // Refresh task grids to show/hide edit controls
    createTaskGrid('child1');
    createTaskGrid('child2');
    updateWeekCompletedCheckbox();
    
    saveDashboardData();
}

// Create task grid for a child
function createTaskGrid(childId) {
    const child = CONFIG.children.find(c => c.id === childId);
    if (!child) return;
    
    const week = getWeekData(childId, currentWeekId);
    const taskGrid = document.getElementById(`${childId}-tasks`);
    if (!taskGrid) return;
    
    taskGrid.innerHTML = '';
    
    const weekCompleted = week.completed;
    
    // Create header row
    const headerRow = document.createElement('div');
    headerRow.className = 'task-row header-row';
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
        ${isEditMode && !weekCompleted ? '<div class="edit-actions">Actions</div>' : ''}
    `;
    taskGrid.appendChild(headerRow);
    
    // Create task rows
    week.tasks.forEach(task => {
        const taskRow = document.createElement('div');
        taskRow.className = `task-row ${task.isExtra ? 'extra-task' : ''}`;
        
        const dayButtons = [];
        for (let day = 0; day < 7; day++) {
            const isCompleted = week.checks[task.id]?.[day] || false;
            const buttonClass = isCompleted ? 'completed' : '';
            const extraClass = task.isExtra ? 'extra' : '';
            const disabled = weekCompleted ? 'disabled' : '';
            
            dayButtons.push(`
                <button class="day-button ${buttonClass} ${extraClass}"
                        data-task-id="${task.id}"
                        data-day="${day}"
                        ${disabled}
                        onclick="toggleCheckmark('${childId}', '${task.id}', ${day})">
                    ${isCompleted ? '✓' : ''}
                </button>
            `);
        }
        
        taskRow.innerHTML = `
            <div class="task-name">${task.name}</div>
            <div class="day-buttons">${dayButtons.join('')}</div>
            ${isEditMode && !weekCompleted ? `
                <div class="edit-actions">
                    <button class="btn btn-secondary btn-small" onclick="editTask('${childId}', '${task.id}')">Edit</button>
                    <button class="btn btn-warning btn-small" onclick="removeTask('${childId}', '${task.id}')">Remove</button>
                </div>
            ` : ''}
        `;
        
        taskGrid.appendChild(taskRow);
    });
    
    // Add "Add Task" button in edit mode (if not completed)
    if (isEditMode && !weekCompleted) {
        const addTaskRow = document.createElement('div');
        addTaskRow.className = 'task-row add-task-row';
        addTaskRow.innerHTML = `
            <button class="btn btn-primary" onclick="showAddTaskDialog('${childId}')">
                + Add Task
            </button>
        `;
        taskGrid.appendChild(addTaskRow);
    }
}

// Toggle checkmark for a task/day
function toggleCheckmark(childId, taskId, dayIndex) {
    const week = getWeekData(childId, currentWeekId);
    
    // Don't allow toggling if week is completed
    if (week.completed) {
        return;
    }
    
    // Initialize checks array if needed
    if (!week.checks[taskId]) {
        week.checks[taskId] = new Array(7).fill(false);
    }
    
    // Toggle the checkmark
    week.checks[taskId][dayIndex] = !week.checks[taskId][dayIndex];
    
    // Update button visual
    const button = document.querySelector(`[data-task-id="${taskId}"][data-day="${dayIndex}"]`);
    if (button) {
        const isCompleted = week.checks[taskId][dayIndex];
        button.classList.toggle('completed', isCompleted);
        button.textContent = isCompleted ? '✓' : '';
    }
    
    // Update score display
    updateScoreDisplay(childId);
    
    // Save to localStorage
    saveDashboardData();
}

// Update score display for a child
function updateScoreDisplay(childId) {
    const week = getWeekData(childId, currentWeekId);
    
    // Calculate total score (count all completed checkmarks)
    let totalScore = 0;
    week.tasks.forEach(task => {
        const checks = week.checks[task.id] || [];
        const completedCount = checks.filter(Boolean).length;
        totalScore += completedCount;
    });
    
    // Update display
    const scoreElement = document.getElementById(`${childId}-score`);
    if (scoreElement) {
        scoreElement.textContent = totalScore;
    }
}

// Task editing functions
function showAddTaskDialog(childId) {
    const week = getWeekData(childId, currentWeekId);
    if (week.completed) return;
    
    currentEditingChildId = childId;
    currentEditingTaskId = null;
    
    document.getElementById('modal-title').textContent = 'Add Task';
    document.getElementById('task-name').value = '';
    document.getElementById('task-is-extra').checked = false;
    document.getElementById('task-modal').style.display = 'flex';
    
    setTimeout(() => document.getElementById('task-name').focus(), 100);
}

function editTask(childId, taskId) {
    const week = getWeekData(childId, currentWeekId);
    if (week.completed) return;
    
    const task = week.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    currentEditingChildId = childId;
    currentEditingTaskId = taskId;
    
    document.getElementById('modal-title').textContent = 'Edit Task';
    document.getElementById('task-name').value = task.name;
    document.getElementById('task-is-extra').checked = task.isExtra;
    document.getElementById('task-modal').style.display = 'flex';
    
    setTimeout(() => document.getElementById('task-name').focus(), 100);
}

function closeTaskModal() {
    document.getElementById('task-modal').style.display = 'none';
    currentEditingChildId = null;
    currentEditingTaskId = null;
}

function addTask(childId, taskName, isExtra) {
    const week = getWeekData(childId, currentWeekId);
    if (week.completed) {
        alert('Cannot add tasks to a completed week');
        return false;
    }
    
    // Validate task name
    if (!taskName.trim()) {
        alert('Task name is required');
        return false;
    }
    
    // Check for duplicate names
    const isDuplicate = week.tasks.some(task => 
        task.name.toLowerCase() === taskName.toLowerCase().trim()
    );
    if (isDuplicate) {
        alert('A task with this name already exists');
        return false;
    }
    
    // Generate unique ID
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Add the task
    week.tasks.push({
        id: taskId,
        name: taskName.trim(),
        isExtra: isExtra
    });
    
    // Initialize checks for this task
    week.checks[taskId] = new Array(7).fill(false);
    
    return true;
}

function updateTask(childId, taskId, taskName, isExtra) {
    const week = getWeekData(childId, currentWeekId);
    if (week.completed) {
        alert('Cannot edit tasks in a completed week');
        return false;
    }
    
    const task = week.tasks.find(t => t.id === taskId);
    if (!task) return false;
    
    // Validate task name
    if (!taskName.trim()) {
        alert('Task name is required');
        return false;
    }
    
    // Check for duplicate names (excluding current task)
    const isDuplicate = week.tasks.some(t =>
        t.id !== taskId && t.name.toLowerCase() === taskName.toLowerCase().trim()
    );
    if (isDuplicate) {
        alert('A task with this name already exists');
        return false;
    }
    
    // Update the task
    task.name = taskName.trim();
    task.isExtra = isExtra;
    
    return true;
}

function removeTask(childId, taskId) {
    const week = getWeekData(childId, currentWeekId);
    if (week.completed) {
        alert('Cannot remove tasks from a completed week');
        return;
    }
    
    const taskIndex = week.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const task = week.tasks[taskIndex];
    
    // Confirm deletion
    if (!confirm(`Are you sure you want to remove "${task.name}"? This will also delete all checkmarks for this task.`)) {
        return;
    }
    
    // Remove the task
    week.tasks.splice(taskIndex, 1);
    
    // Remove checks for this task
    delete week.checks[taskId];
    
    // Refresh the grid and save
    createTaskGrid(childId);
    updateScoreDisplay(childId);
    saveDashboardData();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    init();
});

// Export functions for global access
window.toggleCheckmark = toggleCheckmark;
window.toggleEditMode = toggleEditMode;
window.toggleWeekCompleted = toggleWeekCompleted;
window.showAddTaskDialog = showAddTaskDialog;
window.editTask = editTask;
window.closeTaskModal = closeTaskModal;
window.removeTask = removeTask;
