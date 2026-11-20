<script setup lang="ts">
import TodoItem from './TodoItem.vue'
import type { Task } from '../types/todo'

defineProps<{
  tasks: Task[]
  emptyMessage: string
}>()

const emit = defineEmits<{
  toggle: [taskId: string, done: boolean]
  edit: [taskId: string]
  delete: [taskId: string]
}>()
</script>

<template>
  <section class="task-section" aria-labelledby="tasks-heading">
    <h2 id="tasks-heading" class="visually-hidden">Список задач</h2>

    <ul v-if="tasks.length" id="task-list" class="task-list">
      <TodoItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="(taskId, done) => emit('toggle', taskId, done)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </ul>

    <p v-else class="task-empty">
      {{ emptyMessage }}
    </p>
  </section>
</template>
