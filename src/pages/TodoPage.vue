<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import AddTodoModal from '../components/AddTodoModal.vue'
import SearchBar from '../components/SearchBar.vue'
import TodoList from '../components/TodoList.vue'
import { isDueThisWeek, isDueToday, sortTasks } from '../domain/todoRules'
import type { Task, TaskInput } from '../domain/todo'
import { useTodoStore } from '../stores/todo'
import { useUserStore } from '../stores/user'

type TodoView = 'search' | 'all' | 'today' | 'upcoming' | 'completed'

const tabs: Array<{ id: TodoView; label: string }> = [
  { id: 'search', label: 'Поиск' },
  { id: 'all', label: 'Все' },
  { id: 'today', label: 'На сегодня' },
  { id: 'upcoming', label: 'Грядущие' },
  { id: 'completed', label: 'Выполненные' }
]

const todoStore = useTodoStore()
const userStore = useUserStore()
const activeView = ref<TodoView>('search')
const searchQuery = ref('')
const selectedTag = ref('')
const showCompleted = reactive({ today: false, upcoming: false })
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
const availableTags = computed(() =>
  [...new Set(userTasks.value.flatMap((task) => task.tags))].sort(
    (first, second) => first.localeCompare(second, 'ru')
  )
)

const visibleTasks = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('ru-RU')
  const now = new Date()
  let tasks = userTasks.value

  if (activeView.value === 'search') {
    tasks = tasks.filter(
      (task) =>
        !task.done &&
        task.title.toLocaleLowerCase('ru-RU').includes(query) &&
        (!selectedTag.value || task.tags.includes(selectedTag.value))
    )
  } else if (activeView.value === 'today') {
    tasks = tasks.filter(
      (task) => isDueToday(task, now) && (showCompleted.today || !task.done)
    )
  } else if (activeView.value === 'upcoming') {
    tasks = tasks.filter(
      (task) =>
        isDueThisWeek(task, now) && (showCompleted.upcoming || !task.done)
    )
  } else if (activeView.value === 'completed') {
    tasks = tasks.filter((task) => task.done)
  }

  return sortTasks(tasks)
})

const emptyMessage = computed(() => {
  if (userTasks.value.length === 0) return 'Задач пока нет. Добавьте первую!'
  const messages: Record<TodoView, string> = {
    search: 'По вашему запросу ничего не найдено.',
    all: 'Список задач пуст.',
    today: 'На сегодня задач с дедлайном нет.',
    upcoming: 'На эту неделю задач с дедлайном нет.',
    completed: 'Выполненных задач пока нет.'
  }
  return messages[activeView.value]
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

function saveTask(input: TaskInput): void {
  const userId = currentUserId.value
  if (!userId) return

  const result = editingTaskId.value
    ? todoStore.updateTask(userId, editingTaskId.value, input)
    : todoStore.addTask(userId, input)

  if (!result.ok) {
    announce(result.message)
    return
  }
  announce(
    editingTaskId.value
      ? `Задача изменена: ${input.title}`
      : `Задача добавлена: ${input.title}`
  )
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

    <nav class="todo-tabs" aria-label="Представления задач">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="todo-tabs__button"
        :class="{ 'todo-tabs__button--active': activeView === tab.id }"
        :aria-pressed="activeView === tab.id"
        @click="activeView = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <section class="toolbar" aria-label="Панель управления задачами">
      <div v-if="activeView === 'search'" class="todo-filters">
        <SearchBar v-model="searchQuery" />
        <label class="todo-filters__tag">
          <span>Метка</span>
          <select v-model="selectedTag">
            <option value="">Все метки</option>
            <option v-for="tag in availableTags" :key="tag" :value="tag">
              {{ tag }}
            </option>
          </select>
        </label>
      </div>

      <label v-else-if="activeView === 'today'" class="todo-completed-toggle">
        <input v-model="showCompleted.today" type="checkbox" />
        Показать выполненные
      </label>
      <label
        v-else-if="activeView === 'upcoming'"
        class="todo-completed-toggle"
      >
        <input v-model="showCompleted.upcoming" type="checkbox" />
        Показать выполненные
      </label>
      <span v-else class="toolbar__spacer" />

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
    :task="editingTask"
    @save="saveTask"
    @close="closeModal"
  />

  <div class="visually-hidden" role="status" aria-live="polite">
    {{ liveMessage }}
  </div>
</template>
