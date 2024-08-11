document.addEventListener('DOMContentLoaded', () => {
    const theme = document.getElementById('theme-toggle');
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
    const editDueDateInput = document.getElementById('edit-due-date');
    const editDueTimeInput = document.getElementById('edit-due-time');
    const editPrioritySelect = document.getElementById('edit-priority-select');
    const saveTodoButton = document.getElementById('save-todo');
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
                <span class="todo-text ">${todoText}</span>
                <span class="todo-datetime " datetime="${dueDateTime}">${formatDateTime(dueDateTime)}</span>
                <div class="container ">
                    <button class="btn btn-sm btn-warning edit-todo">Edit</button>
                    <button class="btn btn-sm btn-danger delete-todo">Delete</button>
                </div>
            `;
            const editButton = li.querySelector('.edit-todo');
            const deleteButton = li.querySelector('.delete-todo');
            const subTaskButton = li.querySelector('.add-subtask');

            editButton.addEventListener('click', () => {
                currentEdit = li;
                editTodoInput.value = todoText;
                editDueDateInput.value = editDate;
                editDueTimeInput.value = editTime;
                editPrioritySelect.value = priority;
                editTodoModal.show();
            });

            deleteButton.addEventListener('click', () => {
                todoList.removeChild(li);
                saveTodos();
            });

            todoList.appendChild(li);
            newTodoInput.value = '';
            prioritySelect.value = 'Select';
            document.getElementById('date-picker').value = '';
            document.getElementById('time-picker').value = '';
            saveTodos();
            scheduleNotification(todoText, dueDateTime);
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
            todos.push({ text, priority, datetime });
        });

        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.sort((a, b) => {
            const priorityOrder = { low: 1, medium: 2, high: 3 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }).forEach(todo => {
            const li = document.createElement('li');
            li.className = `list-group-item todo-item priority-${todo.priority}`;
            li.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <time class="todo-datetime" datetime="${todo.datetime}">${formatDateTime(todo.datetime)}</time>
                <div class="container float-end">
                    <button class="btn btn-sm btn-warning edit-todo">Edit</button>
                    <button class="btn btn-sm btn-danger delete-todo">Delete</button>
                    
                </div>
            `;
            const editButton = li.querySelector('.edit-todo');
            const deleteButton = li.querySelector('.delete-todo');

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

            todoList.appendChild(li);
            scheduleNotification(todo.text, todo.datetime);
        });
    }

    function scheduleNotification(text, dateTime) {
        const now = new Date();
        const then = new Date(dateTime);
        const delay = then - now;

        if (delay > 0) {
            setTimeout(() => {
                new Notification('Task Reminder', {
                    body: `Task: ${text} is due `,
                });
            }, delay);
        }
    }

    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    function sortByPriority() {
        const items = Array.from(todoList.getElementsByTagName('li'));
        items.sort((a, b) => {
            const priorityOrder = { low: 1, medium: 2, high: 3 };
            const aPriority = a.className.split(' ').find(cls => cls.startsWith('priority-')).split('-')[1];
            const bPriority = b.className.split(' ').find(cls => cls.startsWith('priority-')).split('-')[1];
            return priorityOrder[bPriority] - priorityOrder[aPriority];
        });
        items.forEach(item => todoList.appendChild(item));
    }

    function sortByDateTime() {
        const items = Array.from(todoList.getElementsByTagName('li'));
        items.sort((a, b) => {
            const aDateTime = new Date(a.querySelector('.todo-datetime').getAttribute('datetime'));
            const bDateTime = new Date(b.querySelector('.todo-datetime').getAttribute('datetime'));
            return aDateTime - bDateTime;
        });
        items.forEach(item => todoList.appendChild(item));
    }

    function exportTodos() {
        const todos = [];
        const items = todoList.getElementsByTagName('li');

        Array.from(items).forEach((item) => {
            const text = item.querySelector('.todo-text').textContent;
            const priority = item.className.split(' ').find(cls => cls.startsWith('priority-')).split('-')[1];
            const datetime = item.querySelector('.todo-datetime').getAttribute('datetime');
            todos.push({ text, priority, datetime });
        });

        const blob = new Blob([JSON.stringify(todos)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'todos.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function importTodos(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = () => {
                const todos = JSON.parse(reader.result);
                todoList.innerHTML = '';
                todos.forEach(todo => {
                    const li = document.createElement('li');
                    li.className = `list-group-item todo-item priority-${todo.priority}`;
                    li.innerHTML = `
                        <span class="todo-text">${todo.text}</span>
                        <time class="todo-datetime" datetime="${todo.datetime}">${formatDateTime(todo.datetime)}</time>
                        <div class="container float-end">
                            <button class="btn btn-sm btn-warning edit-todo">Edit</button>
                            <button class="btn btn-sm btn-danger delete-todo">Delete</button>
                        </div>
                    `;

                    const editButton = li.querySelector('.edit-todo');
                    const deleteButton = li.querySelector('.delete-todo');

                    editButton.addEventListener('click', () => {
                        currentEdit = li;
                        editTodoInput.value = todo.text;
                        editDueDateInput.value = editDate;
                        editDueTimeInput.value = editTime;
                        editPrioritySelect.value = todo.priority;
                        editTodoModal.show();
                    });

                    deleteButton.addEventListener('click', () => {
                        todoList.removeChild(li);
                        saveTodos();
                    });

                    todoList.appendChild(li);
                });
                saveTodos();
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid JSON file.');
        }
    }
});
