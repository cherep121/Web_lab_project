<script setup>
import TodoItem from './TodoItem.vue'

defineProps({
  tasks: {
    type: Array,
    required: true
  },
  emptyMessage: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['toggle', 'edit', 'delete'])
</script>

<template>
  <section class="task-section" aria-labelledby="tasks-heading">
    <h2 id="tasks-heading" class="visually-hidden">Список задач</h2>

    <ul v-if="tasks.length" id="task-list" class="task-list">
      <TodoItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="(...args) => emit('toggle', ...args)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </ul>

    <p v-else class="task-empty">
      {{ emptyMessage }}
    </p>
  </section>
</template>
