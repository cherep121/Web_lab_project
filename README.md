# $${\color{#ff00ff}Web-lab-project}$$

## Лабораторная работа №6
📌 ${\color{#FF69B4}Тема: \ To\text{-}Do \ List \ на \ Vue \ 3 \ и \ Vite}$

Версия приложения **To-Do List** из лабораторной №4 перенесена с vanilla JavaScript на Vue 3. Интерфейс разделён на компоненты, состояние хранится реактивно, а для разработки и production-сборки используется Vite.

## 🛠 Стек

- **Vue 3** — Composition API и однофайловые компоненты
- **Vite** — сервер разработки и production-сборка
- **JavaScript** — логика приложения
- **Sass (SCSS)** — модульные стили из лабораторной №4
- **HTML5** — семантическая и доступная разметка
- **localStorage** — сохранение задач и выбранной темы
- **GitHub Actions / Pages** — подготовленный способ публикации

## 🧩 Компоненты Vue

- `App.vue` — общее состояние, производные данные и обработка действий;
- `SearchBar.vue` — поле поиска с поддержкой `v-model`;
- `TodoList.vue` — список задач и пустое состояние;
- `TodoItem.vue` — одна задача, чекбокс и кнопки действий;
- `AddTodoModal.vue` — создание и редактирование задачи;
- `ThemeToggle.vue` — переключатель светлой и тёмной темы.

## 📁 Структура

```text
Web-lab-project/
├─ .github/
│  └─ workflows/
│     └─ ci.yaml                  <-- сборка и публикация GitHub Pages
├─ src/
│  ├─ components/
│  │  ├─ AddTodoModal.vue
│  │  ├─ SearchBar.vue
│  │  ├─ ThemeToggle.vue
│  │  ├─ TodoItem.vue
│  │  └─ TodoList.vue
│  ├─ composables/
│  │  ├─ useStoredTasks.js
│  │  └─ useStoredTheme.js
│  ├─ App.vue
│  └─ main.js
├─ scss/                          <-- стили из Sass-версии лабораторной №4
├─ index.html
├─ vite.config.js
├─ package.json
├─ package-lock.json
├─ README.md
└─ .gitignore
```
