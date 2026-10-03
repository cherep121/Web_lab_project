'use strict';

const STORAGE_KEY = 'todo.tasks';

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidTask);
  } catch (err) {
    console.warn('Не удалось прочитать задачи из localStorage:', err);
    return [];
  }
}

function isValidTask(task) {
  return task
    && typeof task === 'object'
    && typeof task.id === 'string'
    && typeof task.title === 'string'
    && typeof task.done === 'boolean';
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.warn('Не удалось сохранить задачи:', err);
  }
}

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

const taskListEl = document.querySelector('.js-task-list');
const emptyMessageEl = document.querySelector('.js-empty-message');

function renderTasks() {
  taskListEl.innerHTML = '';

  if (tasks.length === 0) {
    emptyMessageEl.hidden = false;
    return;
  }
  emptyMessageEl.hidden = true;

  for (const task of tasks) {
    taskListEl.appendChild(createTaskElement(task));
  }
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task';
  li.dataset.taskId = task.id;
  if (task.done) li.dataset.done = 'true';

  const checkboxId = `task-${task.id}-done`;
  const titleId    = `task-${task.id}-title`;
  const deleteId   = `task-${task.id}-delete`;
  const editId     = `task-${task.id}-edit`;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = checkboxId;
  checkbox.className = 'task__checkbox js-toggle-done';
  checkbox.checked = task.done;

  const title = document.createElement('label');
  title.htmlFor = checkboxId;
  title.id = titleId;
  title.className = 'task__title';
  title.textContent = task.title;

  const editBtn = createIconButton({
    id: editId,
    labelledBy: `${editId} ${titleId}`,
    labelText: 'Редактировать задачу',
    className: 'button-icon button-icon--edit js-edit-task',
    icon: '✎',
  });

  const deleteBtn = createIconButton({
    id: deleteId,
    labelledBy: `${deleteId} ${titleId}`,
    labelText: 'Удалить задачу',
    className: 'button-icon button-icon--delete js-delete-task',
    icon: '✕',
  });

  const row = document.createElement('div');
  row.className = 'task__row';
  row.append(checkbox, title);

  const actions = document.createElement('div');
  actions.className = 'task__actions';
  actions.append(editBtn, deleteBtn);

  li.append(row, actions);
  return li;
}

function createIconButton({ id, labelledBy, labelText, className, icon }) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = id;
  btn.className = className;
  btn.setAttribute('aria-labelledby', labelledBy);

  const srText = document.createElement('span');
  srText.className = 'visually-hidden';
  srText.textContent = labelText;

  const iconEl = document.createElement('span');
  iconEl.setAttribute('aria-hidden', 'true');
  iconEl.textContent = icon;

  btn.append(srText, iconEl);
  return btn;
}

let tasks = loadTasks();

renderTasks();
console.log('Загружено задач:', tasks.length, tasks);