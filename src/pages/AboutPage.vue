<script setup>
import { computed } from 'vue'
import { useTodoStore } from '../stores/todo.js'
import { useUserStore } from '../stores/user.js'

const todoStore = useTodoStore()
const userStore = useUserStore()

const ownTasks = computed(() => userStore.currentUserId
  ? todoStore.tasksForUser(userStore.currentUserId)
  : [])
const completed = computed(() => ownTasks.value.filter((task) => task.done).length)
const progress = computed(() => ownTasks.value.length
  ? Math.round((completed.value / ownTasks.value.length) * 100)
  : 0)
</script>

<template>
  <div class="container about">
    <section class="about-hero" aria-labelledby="about-title">
      <div>
        <p class="eyebrow">Лабораторная работа №7</p>
        <h1 id="about-title">Спокойное место для важных дел</h1>
        <p class="about-hero__lead">
          TaskSpace — учебный To‑Do, который вырос из простого списка задач в приложение
          с профилями, маршрутами и личным пространством для каждого пользователя.
        </p>
        <RouterLink class="button button--primary" :to="userStore.isAuthenticated ? '/todo' : '/register'">
          {{ userStore.isAuthenticated ? 'Открыть мои задачи' : 'Создать учебный аккаунт' }}
        </RouterLink>
      </div>
      <div class="about-hero__mark" aria-hidden="true">
        <span>7</span>
        <small>лаба</small>
      </div>
    </section>

    <section class="feature-grid" aria-label="Возможности приложения">
      <article class="feature-card">
        <span class="feature-card__icon" aria-hidden="true">✓</span>
        <h2>Личные задачи</h2>
        <p>У каждого учебного аккаунта свой список: записи пользователей не смешиваются.</p>
      </article>
      <article class="feature-card">
        <span class="feature-card__icon" aria-hidden="true">↻</span>
        <h2>Всё сохраняется</h2>
        <p>Pinia и localStorage возвращают профиль, тему и задачи после обновления страницы.</p>
      </article>
      <article class="feature-card">
        <span class="feature-card__icon" aria-hidden="true">A</span>
        <h2>Доступный интерфейс</h2>
        <p>Подписи, видимый фокус, клавиатура и сообщения для скринридера сохранены.</p>
      </article>
    </section>

    <section v-if="userStore.isAuthenticated" class="stats-panel" aria-labelledby="stats-title">
      <div>
        <p class="eyebrow">Ваш прогресс</p>
        <h2 id="stats-title">Небольшая статистика</h2>
      </div>
      <dl class="stats-panel__list">
        <div><dt>Всего</dt><dd>{{ ownTasks.length }}</dd></div>
        <div><dt>Готово</dt><dd>{{ completed }}</dd></div>
        <div><dt>Прогресс</dt><dd>{{ progress }}%</dd></div>
      </dl>
    </section>

    <section class="project-story" aria-labelledby="story-title">
      <p class="eyebrow">Как менялся проект</p>
      <h2 id="story-title">Три этапа одной идеи</h2>
      <ol class="project-story__list">
        <li><strong>Лаба 4</strong><span>Доступная разметка, Sass, адаптивность и две темы.</span></li>
        <li><strong>Лаба 6</strong><span>Переезд интерфейса на Vue 3 и компонентный подход.</span></li>
        <li><strong>Лаба 7</strong><span>Pinia, маршруты и разделение задач между пользователями.</span></li>
      </ol>
    </section>

    <aside class="about-note">
      <strong>Важно:</strong> авторизация создана только для обучения. Пароли хранятся в браузере,
      поэтому здесь следует использовать исключительно вымышленные данные.
    </aside>
  </div>
</template>
