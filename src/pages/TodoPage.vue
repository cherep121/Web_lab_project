<script setup>
import { computed, nextTick, ref } from 'vue'
import AddTodoModal from '../components/AddTodoModal.vue'
import SearchBar from '../components/SearchBar.vue'
import TodoList from '../components/TodoList.vue'
import { useTodoStore } from '../stores/todo.js'
import { useUserStore } from '../stores/user.js'

const todoStore = useTodoStore()
const userStore = useUserStore()
const searchQuery = ref('')
const editingTaskId = ref(null)
const isModalOpen = ref(false)
const liveMessage = ref('')
const addButton = ref(null)

const currentUserId = computed(() => userStore.currentUserId)
const userTasks = computed(() => todoStore.tasksForUser(currentUserId.value))
const editingTask = computed(() => userTasks.value.find((task) => task.id === editingTaskId.value) ?? null)
const completedCount = computed(() => userTasks.value.filter((task) => task.done).length)

const visibleTasks = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('ru-RU')
  return [...userTasks.value]
    .sort((first, second) => Number(first.done) - Number(second.done))
    .filter((task) => task.title.toLocaleLowerCase('ru-RU').includes(query))
})

const emptyMessage = computed(() => {
  if (userTasks.value.length === 0) return 'Задач пока нет. Добавьте первую!'
  return `Ничего не найдено по запросу «${searchQuery.value}».`
})

function announce(message) {
  liveMessage.value = ''
  window.setTimeout(() => { liveMessage.value = message }, 50)
}

function openCreateModal() {
  editingTaskId.value = null
  isModalOpen.value = true
}

function openEditModal(taskId) {
  if (!userTasks.value.some((task) => task.id === taskId)) return
  editingTaskId.value = taskId
  isModalOpen.value = true
}

async function closeModal() {
  const editedId = editingTaskId.value
  isModalOpen.value = false
  editingTaskId.value = null
  await nextTick()

  if (editedId) document.querySelector(`#task-${CSS.escape(editedId)}-edit`)?.focus()
  else addButton.value?.focus()
}

function saveTask(title) {
  if (editingTaskId.value === null) {
    todoStore.addTask(currentUserId.value, title)
    announce(`Задача добавлена: ${title}`)
  } else {
    todoStore.updateTask(currentUserId.value, editingTaskId.value, title)
    announce(`Задача изменена: ${title}`)
  }
  closeModal()
}

function toggleTask(taskId, done) {
  const task = userTasks.value.find((item) => item.id === taskId)
  if (!task) return
  todoStore.toggleTask(currentUserId.value, taskId, done)
  announce(done ? `Задача выполнена: ${task.title}` : `Задача возвращена в работу: ${task.title}`)
}

async function deleteTask(taskId) {
  const task = userTasks.value.find((item) => item.id === taskId)
  if (!task) return

  const visibleIds = visibleTasks.value.map((item) => item.id)
  const currentIndex = visibleIds.indexOf(taskId)
  const nextTaskId = visibleIds[currentIndex + 1] ?? visibleIds[currentIndex - 1] ?? null
  todoStore.deleteTask(currentUserId.value, taskId)
  announce(`Задача удалена: ${task.title}`)

  await nextTick()
  if (nextTaskId) document.querySelector(`[data-task-id="${CSS.escape(nextTaskId)}"] .task__checkbox`)?.focus()
  else addButton.value?.focus()
}
</script>

<template>
  <div class="container">
    <section class="page-heading" aria-labelledby="todo-title">
      <div>
        <p class="eyebrow">Личное пространство</p>
        <h1 id="todo-title">Мои задачи</h1>
        <p>Выполнено {{ completedCount }} из {{ userTasks.length }}</p>
      </div>
    </section>

    <section class="toolbar" aria-label="Панель управления задачами">
      <SearchBar v-model="searchQuery" />
      <button ref="addButton" type="button" class="button button--primary" @click="openCreateModal">
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

  <AddTodoModal
    v-if="isModalOpen"
    :initial-title="editingTask?.title ?? ''"
    :is-editing="editingTask !== null"
    @save="saveTask"
    @close="closeModal"
  />

  <div class="visually-hidden" role="status" aria-live="polite">{{ liveMessage }}</div>
</template>
