const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const stats = document.getElementById('stats');

let tasks = JSON.parse(localStorage.getItem('glow-tasks') || '[]');

function saveTasks() {
  localStorage.setItem('glow-tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  if (!tasks.length) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'No tasks yet. Add one to begin.';
    taskList.appendChild(empty);
    stats.textContent = '0 tasks';
    return;
  }

  const remaining = tasks.filter((task) => !task.completed).length;
  stats.textContent = `${remaining} pending`;

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item ${task.completed ? 'completed' : ''}`;

    const main = document.createElement('div');
    main.className = 'task-main';

    const checkbox = document.createElement('input');
    checkbox.className = 'task-checkbox';
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;

    const text = document.createElement('p');
    text.className = 'task-text';
    text.textContent = task.text;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.type = 'button';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.textContent = '×';

    main.append(checkbox, text);
    actions.append(editBtn, deleteBtn);
    item.append(main, actions);

    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    editBtn.addEventListener('click', () => {
      const editInput = document.createElement('input');
      editInput.className = 'task-edit-input';
      editInput.type = 'text';
      editInput.value = task.text;
      editInput.maxLength = 80;

      const saveBtn = document.createElement('button');
      saveBtn.className = 'save-btn';
      saveBtn.type = 'button';
      saveBtn.textContent = 'Save';

      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'cancel-btn';
      cancelBtn.type = 'button';
      cancelBtn.textContent = 'Cancel';

      main.replaceChild(editInput, text);
      actions.innerHTML = '';
      actions.append(saveBtn, cancelBtn);
      editInput.focus();
      editInput.select();

      const saveTask = () => {
        const updatedText = editInput.value.trim();
        if (updatedText) {
          task.text = updatedText;
          saveTasks();
        }
        renderTasks();
      };

      saveBtn.addEventListener('click', saveTask);
      cancelBtn.addEventListener('click', () => renderTasks());
      editInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          saveTask();
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          renderTasks();
        }
      });
    });

    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter((entry) => entry.id !== task.id);
      saveTasks();
      renderTasks();
    });

    taskList.appendChild(item);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) return;

  tasks.unshift({
    id: Date.now(),
    text,
    completed: false,
  });

  saveTasks();
  input.value = '';
  renderTasks();
});

renderTasks();
