// Configuration file for Ticks and Tokens
// Edit this file to customize child names and initial tasks

const CONFIG = {
    children: [
        {
            id: 'child1',
            name: 'Alex',
            initialTasks: [
                { id: 'make-bed', name: 'Make Bed', isExtra: false },
                { id: 'brush-teeth', name: 'Brush Teeth', isExtra: false },
                { id: 'homework', name: 'Homework', isExtra: false },
                { id: 'practice-piano', name: 'Practice Piano', isExtra: true }
            ]
        },
        {
            id: 'child2',
            name: 'Jordan',
            initialTasks: [
                { id: 'tidy-room', name: 'Tidy Room', isExtra: false },
                { id: 'brush-teeth-2', name: 'Brush Teeth', isExtra: false },
                { id: 'read-book', name: 'Read Book', isExtra: false },
                { id: 'help-chores', name: 'Help with Chores', isExtra: true },
                { id: 'walk-dog', name: 'Walk Dog', isExtra: true }
            ]
        }
    ]
};
