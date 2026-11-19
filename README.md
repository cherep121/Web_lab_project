# $${\color{#ff00ff}Web\text{-}lab\text{-}project}$$

## Лабораторная работа №8
📌 $${\color{#FF69B4}Тема:\ Основы\ TypeScript\ и\ Node.js}$$

Консольный практикум из девяти задач на TypeScript: перегрузки функций,
кортежи и перечисления, функции-сторожи, иммутабельные коллекции, обобщения,
`reduce`, классы и рекурсивные типы. Каждый файл является отдельным модулем и
содержит реализацию вместе с примерами использования.


## 🛠 Стек

- **TypeScript** — строгая типизация и компиляция исходного кода
- **Node.js v24.13.0** — запуск скомпилированных заданий
- **npm** — установка зависимостей и запуск команд
- **ES Modules / NodeNext** — модульная система проекта
- **Git** — контроль версий

## 📦 Установка и проверка

```bash
npm ci
npm run check
npm run build
```

- `npm run check` проверяет типы без создания файлов;
- `npm run build` компилирует исходники из `src/` в `dist/`;
- `node_modules/` и `dist/` исключены из Git.

## ▶️ Запуск

Собрать проект и запустить все задания с отдельными заголовками:

```bash
npm start
```

Если проект уже собран:

```bash
npm run run:all
```

Запуск одного задания:

```bash
node dist/task1.js
node dist/task2.js
# ...
node dist/task9.js
```

## 📁 Структура

```text
Web-lab-project/
├─ src/
│  ├─ task1.ts
│  ├─ task2.ts
│  ├─ task3.ts
│  ├─ task4.ts
│  ├─ task5.ts
│  ├─ task6.ts
│  ├─ task7.ts
│  ├─ task8.ts
│  └─ task9.ts
├─ scripts/
│  └─ run-all.mjs              <-- последовательный запуск девяти задач
├─ package.json
├─ package-lock.json
├─ tsconfig.json
├─ README.md
└─ .gitignore
```
