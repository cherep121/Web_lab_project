# $${\color{#ff00ff}Web-lab-project }$$

## Лабороторная работа №4
  📌 ${\color{#FF69B4}Тема: \ Препроцессоры \ и \ верстка}$

## 🛠 Стек
- **HTML5** — семантическая разметка (`<main>`, `<section>`, `<ul>`, `<dialog>`)
- **Tailwind CSS v4** — утилитарная стилизация, подключение через `@tailwindcss/cli`
- **JavaScript (vanilla)** — логика приложения: список задач, поиск, модальное окно, темы, `localStorage`
- **Node.js / npm** — сборка проекта
- **CSS custom properties** — для светлой и тёмной тем
- **Git** — контроль версий


## 📁 Структура
```
Web-lab-project/
├─ index.html <-- разметка с утилитами Tailwind
├─ src/
│ └─ input.css <-- точка входа Tailwind
│ (@import "tailwindcss"; + @custom-variant dark
│ + @layer components для .task и .button-icon)
├─ dist/ <-- собранный CSS (в .gitignore)
│ └─ css/
│ └─ main.css
├─ js/
│ └─ main.js <-- вся логика приложения (перенесена из lab-4)
├─ node_modules/ <-- зависимости (в .gitignore)
├─ package.json <-- скрипты сборки и зависимости
├─ package-lock.json <-- зафиксированные версии зависимостей
├─ README.md <-- этот файл
└─ .gitignore <-- node_modules/, dist/, .DS_Store
```
**Описание:**
- `index.html` — страница приложения To-Do List
- `dist/css/main.css` — собранный CSS (генерируется командой `npm run build`)
- `js/main.js` — вся логика приложения: список задач, добавление через модалку, редактирование, удаление, поиск, отметка «выполнено», переключение темы, сохранение в `localStorage`
- `src/input.css` — входной файл Tailwind:
  - `@import "tailwindcss";` — подключение Tailwind;
  - `@source "../js/**/*.js"; @source "../index.html";` — явное указание,
    где искать использованные классы (важно: `sr-only` и другие утилиты
    задаются в JS динамически);
  - `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));` —
    тёмная тема через атрибут `data-theme`, а не по системной настройке;
  - `@layer components { … }` — классы `.task`, `.task__*`, `.button-icon`
    через `@apply` (единственное место с «собственными» стилями —
    обоснованно: эти классы создаются из JS динамически).
- `package.json` — скрипты сборки (`sass:dev`, `build`) и зависимости
- `README.md` — документация проекта
- `.gitignore` — исключения для Git (`node_modules/`, `dist/`)