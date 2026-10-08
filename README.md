# $${\color{#ff00ff}Web-lab-project }$$

## Лабороторная работа №4
  📌 ${\color{#FF69B4}Тема: \ Препроцессоры \ и \ верстка}$

Учебный проект курса — приложение **To-Do List** с упором на доступность
интерфейса (a11y). Реализовано на Sass + vanilla JS, проверено через
Lighthouse Accessibility (A1–A7).

## 🛠 Стек
- **HTML5** — семантическая разметка
- **SCSS (Sass)** — модульная архитектура стилей
- **JavaScript (vanilla)** — интерактив: список задач, поиск, модальное окно, темы, `localStorage`
- **Node.js / npm** — сборка проекта
- **БЭМ** — методология именования классов
- **Git**

## 📁 Структура
```
Web-lab-project/
├─ index.html
├─ scss/ <-- исходники стилей
│ ├─ utils/ <-- переменные, функции, миксины
│ │ ├─ _variables.scss
│ │ ├─ _functions.scss
│ │ ├─ _mixins.scss
│ │ └─ _index.scss
│ ├─ base/ <-- reset, типографика, утилита visually-hidden
│ │ ├─ _reset.scss
│ │ ├─ _typography.scss
│ │ └─ _index.scss
│ ├─ layout/ <-- каркас страницы
│ │ ├─ _container.scss
│ │ ├─ _app-header.scss
│ │ ├─ _app-main.scss
│ │ └─ _index.scss
│ ├─ components/ <-- переиспользуемые компоненты
│ │ ├─ _button.scss
│ │ ├─ _button-icon.scss
│ │ ├─ _toolbar.scss
│ │ ├─ _search.scss
│ │ ├─ _task.scss
│ │ ├─ _form-group.scss
│ │ ├─ _modal.scss
│ │ ├─ _theme-toggle.scss
│ │ └─ _index.scss
│ ├─ themes/ <-- светлая и тёмная темы
│ │ ├─ _light.scss
│ │ ├─ _dark.scss
│ │ └─ _index.scss
│ └─ main.scss <-- точка входа
├─ dist/ <-- собранный CSS (генерируется)
│ └─ css/
│ └─ main.css
├─ js/
│ └─ main.js <-- логика приложения (vanilla JS)
├─ node_modules/ <-- зависимости (в .gitignore)
├─ package.json <-- скрипты и зависимости
├─ package-lock.json
├─ README.md
└─ .gitignore
```
**Описание:**
- `index.html` — страница приложения To-Do List
- `scss/` — исходники стилей на препроцессоре Sass
  - `utils/` — переменные, функции, миксины
  - `base/` — сброс стилей, типографика, утилита `visually-hidden`
  - `layout/` — каркас страницы (контейнер, хедер, main)
  - `components/` — переиспользуемые компоненты (кнопки, тулбар, поиск, задача, форма, модалка, переключатель темы)
  - `themes/` — генерация CSS-переменных для светлой и тёмной темы
  - `main.scss` — точка входа, собирает все модули
- `dist/css/main.css` — собранный CSS (генерируется командой `npm run build`)
- `js/main.js` — вся логика приложения: список задач, добавление через модалку, редактирование, удаление, поиск, отметка «выполнено», переключение темы, сохранение в `localStorage`
- `package.json` — скрипты сборки (`sass:dev`, `build`) и зависимости
- `README.md` — документация проекта
- `.gitignore` — исключения для Git (`node_modules/`, `dist/`)