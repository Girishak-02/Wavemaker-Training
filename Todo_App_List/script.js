document.addEventListener('DOMContentLoaded', () => {
    const theme = document.getElementById('theme');
    const addTodoButton = document.getElementById('add-todo');
    const newTodoInput = document.getElementById('new-todo');
    const todoList = document.getElementById('todo-list');
    const prioritySelect = document.getElementById('priority');
    const searchTodoInput = document.getElementById('search-todo');
    const sortTodoSelect = document.getElementById('sort-todo');
    const importFileInput = document.getElementById('import-file');
    const exportTodoButton = document.getElementById('export-todo');

    const editTodoModal = new bootstrap.Modal(document.getElementById('editTodoModal'));
    const editTodoInput = document.getElementById('edit-todo-input');
    const editDueDateInput = document.getElementById('edit-date');
    const editDueTimeInput = document.getElementById('edit-time');
    const editPrioritySelect = document.getElementById('edit-priority-select');
    const saveTodoButton = document.getElementById('save-todo');
    const subtaskModal = new bootstrap.Modal(document.getElementById('AddSubTask'));
    const subtaskInput = document.getElementById('subtask-input');
    const subtaskDateInput = document.getElementById('subtask-date');
    const subtaskTimeInput = document.getElementById('subtask-time');
    const subtaskPrioritySelect = document.getElementById('subtask-priority');
    const addSubtaskButton = document.getElementById('add-subtask-button');
    
    let currentEdit = null;

    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    theme.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    addTodoButton.addEventListener('click', addTodo);
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    searchTodoInput.addEventListener('input', searchTodo);
    sortTodoSelect.addEventListener('change', () => {
        if (sortTodoSelect.value === 'priority') {
            sortByPriority();
        } else if (sortTodoSelect.value === 'datetime') {
            sortByDateTime();
        }
    });

    saveTodoButton.addEventListener('click', () => {
        const newText = editTodoInput.value.trim();
        const dueDate = editDueDateInput.value;
        const dueTime = editDueTimeInput.value;
        const dueDateTime = `${dueDate}T${dueTime}`;
        const newPriority = editPrioritySelect.value;

        if (newText) {
            currentEdit.querySelector('.todo-text').textContent = newText;
            currentEdit.querySelector('.todo-datetime').setAttribute('datetime', dueDateTime);
            currentEdit.querySelector('.todo-datetime').textContent = formatDateTime(dueDateTime);
            currentEdit.classList.remove('priority-low', 'priority-medium', 'priority-high');
            currentEdit.classList.add(`priority-${newPriority}`);
            editTodoModal.hide();
            saveTodos();
            scheduleNotification(newText, dueDateTime);
        }
    });

    addSubtaskButton.addEventListener('click', () => {
        const subtaskText = subtaskInput.value.trim();
        const subtaskPriority = subtaskPrioritySelect.value;
        const subtaskDate = subtaskDateInput.value;
        const subtaskTime = subtaskTimeInput.value;
        const subtaskDateTime = `${subtaskDate}T${subtaskTime}`;

        if (subtaskText !== '' && subtaskPriority !== 'Select') {
            const subtaskLi = document.createElement('li');
            subtaskLi.className = `list-group-item subtask-item priority-${subtaskPriority}`;
            subtaskLi.innerHTML = `
                <span class="subtask-text">${subtaskText}</span>
                <span class="subtask-datetime" datetime="${subtaskDateTime}">${formatDateTime(subtaskDateTime)}</span>
                <div class="container">
                    <button class="btn btn-sm btn-warning edit-subtask">Edit</button>
                    <button class="btn btn-sm btn-danger delete-subtask">Delete</button>
                </div>
            `;
            const editSubtaskButton = subtaskLi.querySelector('.edit-subtask');
            const deleteSubtaskButton = subtaskLi.querySelector('.delete-subtask');

            editSubtaskButton.addEventListener('click', () => {
                // Handle subtask editing if needed
            });

            deleteSubtaskButton.addEventListener('click', () => {
                subtaskLi.parentElement.removeChild(subtaskLi);
                saveTodos();
            });

            currentEdit.querySelector('.subtask-list').appendChild(subtaskLi);
            subtaskModal.hide();
            subtaskInput.value = '';
            subtaskDateInput.value = '';
            subtaskTimeInput.value = '';
            subtaskPrioritySelect.value = 'Select';
            saveTodos();
        }
    });

    exportTodoButton.addEventListener('click', exportTodos);
    importFileInput.addEventListener('change', importTodos);

    new Sortable(todoList, {
        onEnd: () => {
            saveTodos();
        }
    });

    loadTodos();

    function addTodo() {
        const todoText = newTodoInput.value.trim();
        const priority = prioritySelect.value;
        const date = document.getElementById('date-picker').value;
        const time = document.getElementById('time-picker').value;
        const dueDateTime = `${date}T${time}`;

        if (todoText !== '' && priority !== 'Select') {
            const li = document.createElement('li');
            li.className = `list-group-item todo-item priority-${priority}`;
            li.innerHTML = `
                <span class="todo-text">${todoText}</span>
                <span class="todo-datetime" datetime="${dueDateTime}">${formatDateTime(dueDateTime)}</span>
                <div class="container">
                    <button class="btn btn-sm btn-warning edit-todo">Edit</button>
                    <button class="btn btn-sm btn-danger delete-todo">Delete</button>
                    <button class="btn btn-sm btn-success subtask-todo">Sub Task</button>
                </div>
                <ul class="subtask-list mt-2"></ul>
            `;
            const editButton = li.querySelector('.edit-todo');
            const deleteButton = li.querySelector('.delete-todo');
            const subtaskButton = li.querySelector('.subtask-todo');

            editButton.addEventListener('click', () => {
                currentEdit = li;
                editTodoInput.value = todoText;
                const [editDate, editTime] = dueDateTime.split('T');
                editDueDateInput.value = editDate;
                editDueTimeInput.value = editTime;
                editPrioritySelect.value = priority;
                editTodoModal.show();
            });

            deleteButton.addEventListener('click', () => {
                todoList.removeChild(li);
                saveTodos();
            });

            subtaskButton.addEventListener('click', () => {
                currentEdit = li;
                subtaskModal.show();
            });

            todoList.appendChild(li);
            newTodoInput.value = '';
            prioritySelect.value = 'Select';
            document.getElementById('date-picker').value = '';
            document.getElementById('time-picker').value = '';
            saveTodos();
            scheduleNotification(todoText, dueDateTime);

            let datetime = new Date(`${date}T${time}`);
            let currentTime = new Date();
            if (datetime < currentTime) {
                alert("The task time is past");
                return;
            }
        }
    }

    function searchTodo() {
        const searchText = searchTodoInput.value.toLowerCase();
        const items = todoList.getElementsByTagName('li');

        Array.from(items).forEach((item) => {
            const itemText = item.querySelector('.todo-text').textContent.toLowerCase();
            if (itemText.includes(searchText)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function saveTodos() {
        const todos = [];
        const items = todoList.getElementsByTagName('li');

        Array.from(items).forEach((item) => {
            const text = item.querySelector('.todo-text').textContent;
            const priority = item.className.split(' ').find(cls => cls.startsWith('priority-')).split('-')[1];
            const datetime = item.querySelector('.todo-datetime').getAttribute('datetime');
            const subtasks = Array.from(item.querySelectorAll('.subtask-list .subtask-item')).map(subtask => {
                return {
                    text: subtask.querySelector('.subtask-text').textContent,
                    priority: subtask.className.split(' ').find(cls => cls.startsWith('priority-')).split('-')[1],
                    datetime: subtask.querySelector('.subtask-datetime').getAttribute('datetime')
                };
            });
            todos.push({ text, priority, datetime, subtasks });
        });

        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];

        todos.forEach((todo) => {
            const li = document.createElement('li');
            li.className = `list-group-item todo-item priority-${todo.priority}`;
            li.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <span class="todo-datetime" datetime="${todo.datetime}">${formatDateTime(todo.datetime)}</span>
                <div class="container">
                    <button class="btn btn-sm btn-warning edit-todo">Edit</button>
                    <button class="btn btn-sm btn-danger delete-todo">Delete</button>
                    <button class="btn btn-sm btn-success subtask-todo">Sub Task</button>
                </div>
                <ul class="subtask-list mt-2"></ul>
            `;

            const editButton = li.querySelector('.edit-todo');
            const deleteButton = li.querySelector('.delete-todo');
            const subtaskButton = li.querySelector('.subtask-todo');

            editButton.addEventListener('click', () => {
                currentEdit = li;
                editTodoInput.value = todo.text;
                const [editDate, editTime] = todo.datetime.split('T');
                editDueDateInput.value = editDate;
                editDueTimeInput.value = editTime;
                editPrioritySelect.value = todo.priority;
                editTodoModal.show();
            });

            deleteButton.addEventListener('click', () => {
                todoList.removeChild(li);
                saveTodos();
            });

            subtaskButton.addEventListener('click', () => {
                currentEdit = li;
                subtaskModal.show();
            });

            todo.subtasks.forEach((subtask) => {
                const subtaskLi = document.createElement('li');
                subtaskLi.className = `list-group-item subtask-item priority-${subtask.priority}`;
                subtaskLi.innerHTML = `
                    <span class="subtask-text">${subtask.text}</span>
                    <span class="subtask-datetime" datetime="${subtask.datetime}">${formatDateTime(subtask.datetime)}</span>
                    <div class="container">
                        <button class="btn btn-sm btn-warning edit-subtask">Edit</button>
                        <button class="btn btn-sm btn-danger delete-subtask">Delete</button>
                    </div>
                `;

                
                const deleteSubtaskButton = subtaskLi.querySelector('.delete-subtask');

                deleteSubtaskButton.addEventListener('click', () => {
                    subtaskLi.parentElement.removeChild(subtaskLi);
                    saveTodos();
                });

                li.querySelector('.subtask-list').appendChild(subtaskLi);
            });

            todoList.appendChild(li);
        });
    }

    function formatDateTime(datetime) {
        const date = new Date(datetime);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleString(undefined, options).replace(',', '');
    }

    function scheduleNotification(text, datetime) {
        const notifyDate = new Date(datetime);
        const now = new Date();
        const delay = notifyDate - now;

        if (delay > 0) {
            setTimeout(() => {
                if (Notification.permission === 'granted') {
                    new Notification('To-Do Reminder', {
                        body: `Don't forget: ${text}`,
                    });
                }
            }, delay);
        }
    }

    function sortByPriority() {
        const items = Array.from(todoList.querySelectorAll('li.todo-item'));
        items.sort((a, b) => {
            const priorityA = a.className.split(' ').find(cls => cls.startsWith('priority-')).split('-')[1];
            const priorityB = b.className.split(' ').find(cls => cls.startsWith('priority-')).split('-')[1];
            return priorityB.localeCompare(priorityA);
        });
        items.forEach(item => todoList.appendChild(item));
    }

    function sortByDateTime() {
        const items = Array.from(todoList.querySelectorAll('li.todo-item'));
        items.sort((a, b) => {
            const dateTimeA = new Date(a.querySelector('.todo-datetime').getAttribute('datetime'));
            const dateTimeB = new Date(b.querySelector('.todo-datetime').getAttribute('datetime'));
            return dateTimeA - dateTimeB;
        });
        items.forEach(item => todoList.appendChild(item));
    }

    function exportTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        const blob = new Blob([JSON.stringify(todos, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'todos.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function importTodos(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const todos = JSON.parse(reader.result);
                    localStorage.setItem('todos', JSON.stringify(todos));
                    loadTodos();
                } catch (error) {
                    alert('Failed to load todos.');
                }
            };
            reader.readAsText(file);
        }
    }
});
