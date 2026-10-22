<script setup>
import { computed, nextTick, ref } from 'vue'
import AddTodoModal from './components/AddTodoModal.vue'
import SearchBar from './components/SearchBar.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import TodoList from './components/TodoList.vue'

const tasks = ref([])
const searchQuery = ref('')
const editingTaskId = ref(null)
const isModalOpen = ref(false)
const isDark = ref(false)
const liveMessage = ref('')
const addButton = ref(null)

const editingTask = computed(() => (
  tasks.value.find((task) => task.id === editingTaskId.value) ?? null
))

const visibleTasks = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('ru-RU')

  return [...tasks.value]
    .sort((first, second) => Number(first.done) - Number(second.done))
    .filter((task) => task.title.toLocaleLowerCase('ru-RU').includes(query))
})

const emptyMessage = computed(() => {
  if (tasks.value.length === 0) return 'Задач пока нет. Добавьте первую!'
  return `Ничего не найдено по запросу «${searchQuery.value}».`
})

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function announce(message) {
  liveMessage.value = ''
  window.setTimeout(() => {
    liveMessage.value = message
  }, 50)
}

function openCreateModal() {
  editingTaskId.value = null
  isModalOpen.value = true
}

function openEditModal(taskId) {
  if (!tasks.value.some((task) => task.id === taskId)) return
  editingTaskId.value = taskId
  isModalOpen.value = true
}

async function closeModal() {
  const editedId = editingTaskId.value
  isModalOpen.value = false
  editingTaskId.value = null
  await nextTick()

  if (editedId) {
    document.querySelector(`#task-${CSS.escape(editedId)}-edit`)?.focus()
  } else {
    addButton.value?.focus()
  }
}

function saveTask(title) {
  if (editingTaskId.value === null) {
    tasks.value.push({ id: generateId(), title, done: false })
    announce(`Задача добавлена: ${title}`)
  } else {
    const task = tasks.value.find((item) => item.id === editingTaskId.value)
    if (task) {
      task.title = title
      announce(`Задача изменена: ${title}`)
    }
  }

  closeModal()
}

function toggleTask(taskId, done) {
  const task = tasks.value.find((item) => item.id === taskId)
  if (!task) return

  task.done = done
  announce(done ? `Задача выполнена: ${task.title}` : `Задача возвращена в работу: ${task.title}`)
}

function deleteTask(taskId) {
  const task = tasks.value.find((item) => item.id === taskId)
  if (!task) return

  tasks.value = tasks.value.filter((item) => item.id !== taskId)
  announce(`Задача удалена: ${task.title}`)
}

function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}
</script>

<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <h1 class="app-header__title">Мои задачи</h1>
      <ThemeToggle :is-dark="isDark" @toggle="toggleTheme" />
    </div>
  </header>

  <main class="app-main">
    <div class="container">
      <section class="toolbar" aria-label="Панель управления задачами">
        <SearchBar v-model="searchQuery" />
        <button
          ref="addButton"
          type="button"
          class="button button--primary"
          @click="openCreateModal"
        >
          + Добавить задачу
        </button>
      </section>

      <TodoList
        :tasks="visibleTasks"
        :empty-message="emptyMessage"
        @toggle="toggleTask"
        @edit="openEditModal"
        @delete="deleteTask"
      />
    </div>
  </main>

  <AddTodoModal
    v-if="isModalOpen"
    :initial-title="editingTask?.title ?? ''"
    :is-editing="editingTask !== null"
    @save="saveTask"
    @close="closeModal"
  />

  <div class="visually-hidden" role="status" aria-live="polite">
    {{ liveMessage }}
  </div>
</template>
