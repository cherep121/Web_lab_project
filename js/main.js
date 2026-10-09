'use strict';

const STORAGE_KEY = 'todo.tasks';
const THEME_KEY = 'todo.theme';

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

const taskListEl     = document.querySelector('.js-task-list');
const emptyMessageEl = document.querySelector('.js-empty-message');
const searchInputEl  = document.querySelector('.js-search');

const dialogEl       = document.querySelector('.js-task-dialog');
const dialogTitleEl  = document.querySelector('#task-dialog-title');
const formEl         = document.querySelector('.js-task-form');
const titleInputEl   = document.querySelector('#task-title');
const formErrorEl    = document.querySelector('.js-form-error');
const addButtonEl    = document.querySelector('.js-add-task');
const cancelBtnEl    = document.querySelector('.js-cancel-dialog');
const liveRegionEl   = document.querySelector('.js-live-region');
const themeToggleEl  = document.querySelector('.js-theme-toggle');

let tasks = loadTasks();
let editingTaskId = null;
let searchQuery = '';

function renderTasks() {
  taskListEl.innerHTML = '';

  if (tasks.length === 0) {
    emptyMessageEl.hidden = false;
    emptyMessageEl.textContent = 'Задач пока нет. Добавьте первую!';
    return;
  }
  emptyMessageEl.hidden = true;

  for (const task of tasks) {
    taskListEl.appendChild(createTaskElement(task));
  }

  applyFilter();
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
  srText.className = 'sr-only';
  srText.textContent = labelText;

  const iconEl = document.createElement('span');
  iconEl.setAttribute('aria-hidden', 'true');
  iconEl.textContent = icon;

  btn.append(srText, iconEl);
  return btn;
}

function openCreateDialog() {
  editingTaskId = null;
  dialogTitleEl.textContent = 'Новая задача';
  formEl.reset();
  clearFormError();
  dialogEl.showModal();
  titleInputEl.focus();
}

function openEditDialog(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  editingTaskId = taskId;
  dialogTitleEl.textContent = 'Редактировать задачу';
  formEl.reset();
  clearFormError();
  titleInputEl.value = task.title;
  dialogEl.showModal();
  titleInputEl.focus();
  titleInputEl.select();
}

function closeDialog() {
  dialogEl.close();
}

function clearFormError() {
  formErrorEl.textContent = '';
  titleInputEl.removeAttribute('aria-invalid');
}

function showFormError(message) {
  formErrorEl.textContent = message;
  titleInputEl.setAttribute('aria-invalid', 'true');
  titleInputEl.focus();
}

function announce(message) {
  if (!liveRegionEl) return;
  liveRegionEl.textContent = '';
  setTimeout(() => { liveRegionEl.textContent = message; }, 50);
}

function sortTasks() {
  tasks.sort((a, b) => Number(a.done) - Number(b.done));
}

function isElementVisible(el) {
  if (!el) return false;
  return el.getClientRects().length > 0
    && getComputedStyle(el).visibility !== 'hidden';
}

function applyFilter() {
  const query = searchQuery.trim().toLowerCase();
  const items = [...taskListEl.querySelectorAll('[data-task-id]')];

  let visibleCount = 0;

  for (const li of items) {
    const task = tasks.find((t) => t.id === li.dataset.taskId);
    if (!task) continue;

    const matches = query === '' || task.title.toLowerCase().includes(query);
    li.hidden = !matches;
    if (matches) visibleCount++;
  }

  const noResults = items.length > 0 && visibleCount === 0;
  emptyMessageEl.hidden = !(tasks.length === 0 || noResults);
  if (noResults) {
    emptyMessageEl.textContent = 'Ничего не найдено по запросу «' + searchQuery + '».';
  } else if (tasks.length === 0) {
    emptyMessageEl.textContent = 'Задач пока нет. Добавьте первую!';
  }
}

function deleteTask(li) {
  const id = li?.dataset.taskId;
  if (!id) return;

  const task = tasks.find((t) => t.id === id);
  const title = task ? task.title : '';

  const allItems = [...taskListEl.querySelectorAll('[data-task-id]')];
  const visibleItems = allItems.filter(isElementVisible);
  const index = visibleItems.indexOf(li);

  const nextItem =
    visibleItems.slice(index + 1).find(isElementVisible) ??
    visibleItems.slice(0, index).reverse().find(isElementVisible) ??
    null;

  tasks = tasks.filter((t) => t.id !== id);
  saveTasks(tasks);

  const nextId = nextItem?.dataset.taskId ?? null;
  renderTasks();

  if (nextId) {
    const restored = taskListEl.querySelector(`[data-task-id="${nextId}"]`);
    const focusTarget = restored?.querySelector('.js-toggle-done')
      ?? restored?.querySelector('button');
    focusTarget?.focus();
  } else {
    addButtonEl.focus();
  }

  announce('Задача удалена: ' + title);
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggleEl?.setAttribute('aria-label', 'Переключить на светлую тему');
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggleEl?.setAttribute('aria-label', 'Переключить на тёмную тему');
  }
}

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (err) {
    console.warn('Не удалось сохранить тему:', err);
  }
}

addButtonEl.addEventListener('click', openCreateDialog);
cancelBtnEl.addEventListener('click', closeDialog);
themeToggleEl?.addEventListener('click', toggleTheme);

formEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const raw = titleInputEl.value.trim();

  if (raw.length < 2) {
    showFormError('Название должно быть не короче 2 символов.');
    return;
  }
  clearFormError();

  if (editingTaskId === null) {
    tasks.push({
      id: generateId(),
      title: raw,
      done: false,
    });
    saveTasks(tasks);
    renderTasks();
    announce('Задача добавлена: ' + raw);
  } else {
    const t = tasks.find((x) => x.id === editingTaskId);
    if (t) {
      t.title = raw;
      saveTasks(tasks);
      renderTasks();
      announce('Задача изменена: ' + raw);
    }
  }

  dialogEl.close();
});

taskListEl.addEventListener('change', (event) => {
  const checkbox = event.target.closest('.js-toggle-done');
  if (!checkbox) return;

  const li = checkbox.closest('[data-task-id]');
  const id = li?.dataset.taskId;
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.done = checkbox.checked;
  sortTasks();
  saveTasks(tasks);
  renderTasks();
  announce(task.done ? 'Задача выполнена: ' + task.title : 'Задача возвращена в работу: ' + task.title);
});

taskListEl.addEventListener('click', (event) => {
  const deleteBtn = event.target.closest('.js-delete-task');
  if (deleteBtn) {
    const li = deleteBtn.closest('[data-task-id]');
    if (li) deleteTask(li);
    return;
  }

  const editBtn = event.target.closest('.js-edit-task');
  if (editBtn) {
    const li = editBtn.closest('[data-task-id]');
    const id = li?.dataset.taskId;
    if (id) openEditDialog(id);
  }
});

searchInputEl.addEventListener('input', () => {
  searchQuery = searchInputEl.value;
  applyFilter();
});

applyTheme(getInitialTheme());
sortTasks();
renderTasks();
console.log('Загружено задач:', tasks.length, tasks);