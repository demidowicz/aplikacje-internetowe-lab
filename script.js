class Task {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.term = '';
        this.draw();
        document.getElementById('addTaskButton').addEventListener('click', () => this.addTask());
        document.getElementById('searchInput').addEventListener('input', (e) => this.searchTasks(e));
    }

    addTask() {
        const taskInput = document.getElementById('newTaskInput');
        const deadlineInput = document.getElementById('taskDeadline');
        const text = taskInput.value.trim();
        const deadline = deadlineInput.value;

        if (text.length < 3 || text.length > 255) {
            alert('Zadanie musi zawierać od 3 do 255 znaków.');
            return;
        }

        if (deadline && new Date(deadline) < new Date()) {
            alert('Data musi być w przyszłości.');
            return;
        }

        this.tasks.push({ text, deadline, completed: false });
        this.saveTasks();
        this.draw();
        taskInput.value = '';
        deadlineInput.value = '';
    }

    searchTasks(event) {
        this.term = event.target.value.trim();
        this.draw();
    }

    get filteredTasks() {
        if (this.term.length < 2) {
            return this.tasks.map((task, index) => ({ ...task, originalIndex: index }));
        }
        return this.tasks
            .map((task, index) => ({ ...task, originalIndex: index }))
            .filter(task => task.text.toLowerCase().includes(this.term.toLowerCase()));
    }
    

    toggleTaskCompletion(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.saveTasks();
        this.draw();
    }

    editTask(index, newText, newDeadline) {
        this.tasks[index].text = newText;
        this.tasks[index].deadline = newDeadline;
        this.saveTasks();
        this.draw();
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.draw();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    formatDateTime(dateString) {
        if (!dateString) return "Brak terminu";
        
        const date = new Date(dateString);
        
        const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        
        const formattedDate = date.toLocaleDateString('pl-PL', dateOptions);
        const formattedTime = date.toLocaleTimeString('pl-PL', timeOptions);
    
        return `${formattedDate}, ${formattedTime}`;
    }

    draw() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
    
        for (const task of this.filteredTasks) {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
    
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => this.toggleTaskCompletion(task.originalIndex));
            taskElement.appendChild(checkbox);
    
            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;
    
            if (this.term.length >= 2) {
                const regex = new RegExp(`(${this.term})`, 'gi');
                taskText.innerHTML = task.text.replace(regex, '<mark>$1</mark>');
            }
    
            taskText.addEventListener('click', () => this.enableEditing(taskElement, task.originalIndex, task, 'taskText'));
            taskElement.appendChild(taskText);
    
            const deadline = document.createElement('span');
            deadline.className = 'task-deadline';
            deadline.textContent = this.formatDateTime(task.deadline);
            deadline.addEventListener('click', () => this.enableEditing(taskElement, task.originalIndex, task, 'deadline'));
            taskElement.appendChild(deadline);
    
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = '🗑️';
            deleteButton.addEventListener('click', () => this.deleteTask(task.originalIndex));
            taskElement.appendChild(deleteButton);
    
            taskList.appendChild(taskElement);
        }
    }
    
    
    enableEditing(taskElement, originalIndex, task, trigger) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
    
        const deadlineInput = document.createElement('input');
        deadlineInput.type = 'datetime-local';
        deadlineInput.value = task.deadline;
    
        taskElement.innerHTML = '';
        taskElement.appendChild(input);
        taskElement.appendChild(deadlineInput);
    
        let blurTimeout;
    
        const saveChanges = () => {
            const newText = input.value.trim();
            const newDeadline = deadlineInput.value;
    
            if (newText.length < 3 || newText.length > 255) {
                alert('Zadanie musi zawierać od 3 do 255 znaków.');
                return;
            }
    
            if (newDeadline && new Date(newDeadline) < new Date()) {
                alert('Data musi być w przyszłości.');
                return;
            }
    
            this.editTask(originalIndex, newText, newDeadline);
        };
    
        const handleBlur = (event) => {
            blurTimeout = setTimeout(() => {
                if (!taskElement.contains(document.activeElement)) {
                    saveChanges();
                }
            }, 50);
        };
    
        const handleFocus = () => {
            clearTimeout(blurTimeout);
        };
    
        input.addEventListener('blur', handleBlur);
        deadlineInput.addEventListener('blur', handleBlur);
        input.addEventListener('focus', handleFocus);
        deadlineInput.addEventListener('focus', handleFocus);
    
        if (trigger === 'taskText') {
            input.focus();
        } else if (trigger === 'deadline') {
            deadlineInput.focus();
        }
    }
    
    
}

document.addEventListener('DOMContentLoaded', () => new Task());
