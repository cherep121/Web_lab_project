import { ref, watch } from 'vue'

const STORAGE_KEY = 'todo.tasks'

function isValidTask(task) {
  return task
    && typeof task === 'object'
    && typeof task.id === 'string'
    && typeof task.title === 'string'
    && task.title.trim().length >= 2
    && typeof task.done === 'boolean'
}

function loadTasks() {
  try {
    const rawTasks = localStorage.getItem(STORAGE_KEY)
    if (!rawTasks) return []

    const parsedTasks = JSON.parse(rawTasks)
    if (!Array.isArray(parsedTasks)) return []

    return parsedTasks
      .filter(isValidTask)
      .map((task) => ({
        id: task.id,
        title: task.title.trim().slice(0, 200),
        done: task.done
      }))
  } catch (error) {
    console.warn('Не удалось прочитать задачи из localStorage:', error)
    return []
  }
}

export function useStoredTasks() {
  const tasks = ref(loadTasks())

  watch(
    tasks,
    (currentTasks) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentTasks))
      } catch (error) {
        console.warn('Не удалось сохранить задачи в localStorage:', error)
      }
    },
    { deep: true }
  )

  return { tasks }
}
