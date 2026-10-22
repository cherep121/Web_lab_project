<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle', 'edit', 'delete'])

const checkboxId = computed(() => `task-${props.task.id}-done`)
const titleId = computed(() => `task-${props.task.id}-title`)
const editId = computed(() => `task-${props.task.id}-edit`)
const deleteId = computed(() => `task-${props.task.id}-delete`)
</script>

<template>
  <li
    class="task"
    :data-task-id="task.id"
    :data-done="task.done"
  >
    <div class="task__row">
      <input
        :id="checkboxId"
        class="task__checkbox"
        type="checkbox"
        :checked="task.done"
        @change="emit('toggle', task.id, $event.target.checked)"
      >
      <label
        :id="titleId"
        class="task__title"
        :for="checkboxId"
      >
        {{ task.title }}
      </label>
    </div>

    <div class="task__actions">
      <button
        :id="editId"
        class="button-icon button-icon--edit"
        type="button"
        :aria-labelledby="`${editId} ${titleId}`"
        @click="emit('edit', task.id)"
      >
        <span class="visually-hidden">Редактировать задачу</span>
        <span aria-hidden="true">✎</span>
      </button>
      <button
        :id="deleteId"
        class="button-icon button-icon--delete"
        type="button"
        :aria-labelledby="`${deleteId} ${titleId}`"
        @click="emit('delete', task.id)"
      >
        <span class="visually-hidden">Удалить задачу</span>
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  </li>
</template>
