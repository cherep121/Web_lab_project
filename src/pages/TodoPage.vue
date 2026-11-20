<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import AddTodoModal from '../components/AddTodoModal.vue'
import SearchBar from '../components/SearchBar.vue'
import TodoList from '../components/TodoList.vue'
import { useTodoStore } from '../stores/todo'
import { useUserStore } from '../stores/user'
import type { Task } from '../types/todo'

const todoStore = useTodoStore()
const userStore = useUserStore()
const searchQuery = ref('')
const editingTaskId = ref<string | null>(null)
const isModalOpen = ref(false)
const liveMessage = ref('')
const addButton = ref<HTMLButtonElement | null>(null)

const currentUserId = computed(() => userStore.currentUserId)
const userTasks = computed<Task[]>(() =>
  currentUserId.value ? todoStore.tasksForUser(currentUserId.value) : []
)
const editingTask = computed(
  () => userTasks.value.find((task) => task.id === editingTaskId.value) ?? null
)
const completedCount = computed(
  () => userTasks.value.filter((task) => task.done).length
)

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

function announce(message: string): void {
  liveMessage.value = ''
  window.setTimeout(() => {
    liveMessage.value = message
  }, 50)
}

function openCreateModal(): void {
  editingTaskId.value = null
  isModalOpen.value = true
}

function openEditModal(taskId: string): void {
  if (!userTasks.value.some((task) => task.id === taskId)) return
  editingTaskId.value = taskId
  isModalOpen.value = true
}

async function closeModal(): Promise<void> {
  const editedId = editingTaskId.value
  isModalOpen.value = false
  editingTaskId.value = null
  await nextTick()

  if (editedId) {
    document
      .querySelector<HTMLElement>(`#task-${CSS.escape(editedId)}-edit`)
      ?.focus()
  } else addButton.value?.focus()
}

function saveTask(title: string): void {
  const userId = currentUserId.value
  if (!userId) return

  if (editingTaskId.value === null) {
    todoStore.addTask(userId, title)
    announce(`Задача добавлена: ${title}`)
  } else {
    todoStore.updateTask(userId, editingTaskId.value, title)
    announce(`Задача изменена: ${title}`)
  }
  closeModal()
}

function toggleTask(taskId: string, done: boolean): void {
  const userId = currentUserId.value
  if (!userId) return

  const task = userTasks.value.find((item) => item.id === taskId)
  if (!task) return
  todoStore.toggleTask(userId, taskId, done)
  announce(
    done
      ? `Задача выполнена: ${task.title}`
      : `Задача возвращена в работу: ${task.title}`
  )
}

async function deleteTask(taskId: string): Promise<void> {
  const userId = currentUserId.value
  if (!userId) return

  const task = userTasks.value.find((item) => item.id === taskId)
  if (!task) return

  const visibleIds = visibleTasks.value.map((item) => item.id)
  const currentIndex = visibleIds.indexOf(taskId)
  const nextTaskId =
    visibleIds[currentIndex + 1] ?? visibleIds[currentIndex - 1] ?? null
  todoStore.deleteTask(userId, taskId)
  announce(`Задача удалена: ${task.title}`)

  await nextTick()
  if (nextTaskId) {
    document
      .querySelector<HTMLElement>(
        `[data-task-id="${CSS.escape(nextTaskId)}"] .task__checkbox`
      )
      ?.focus()
  } else addButton.value?.focus()
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
