<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { validateTaskInput, type Task, type TaskInput } from '../domain/todo'

const props = withDefaults(defineProps<{ task?: Task | null }>(), {
  task: null
})

const emit = defineEmits<{
  save: [input: TaskInput]
  close: []
}>()

function toInputDate(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

const dialog = ref<HTMLDialogElement | null>(null)
const titleInput = ref<HTMLInputElement | null>(null)
const isEditing = computed(() => props.task !== null)
const draft = reactive({
  title: props.task?.title ?? '',
  startDate: toInputDate(props.task?.startDate),
  dueDate: toInputDate(props.task?.dueDate),
  priority: props.task?.priority ?? 0,
  tags: props.task?.tags.join(', ') ?? ''
})
const errorMessage = ref('')

onMounted(async () => {
  dialog.value?.showModal()
  await nextTick()
  titleInput.value?.focus()
  if (isEditing.value) titleInput.value?.select()
})

function submit(): void {
  const input: TaskInput = {
    title: draft.title,
    startDate: draft.startDate || null,
    dueDate: draft.dueDate || null,
    priority: Number(draft.priority),
    tags: draft.tags.split(',')
  }
  const validation = validateTaskInput(input)
  if (!validation.ok) {
    errorMessage.value = validation.message
    return
  }

  emit('save', validation.value)
}

function requestClose(): void {
  emit('close')
}

function handleBackdropClick(event: MouseEvent): void {
  if (event.target === dialog.value) requestClose()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="modal"
    aria-labelledby="task-dialog-title"
    @cancel.prevent="requestClose"
    @click="handleBackdropClick"
  >
    <form class="modal__form" novalidate @submit.prevent="submit">
      <h2 id="task-dialog-title" class="modal__title">
        {{ isEditing ? 'Редактировать задачу' : 'Новая задача' }}
      </h2>

      <div class="form-group">
        <label for="task-title">Название задачи</label>
        <input
          id="task-title"
          ref="titleInput"
          v-model="draft.title"
          class="form-group__input"
          type="text"
          maxlength="200"
          autocomplete="off"
          required
          :aria-invalid="errorMessage ? 'true' : undefined"
          @input="errorMessage = ''"
        />
      </div>

      <div class="modal__fields">
        <div class="form-group">
          <label for="task-start">Начало</label>
          <input
            id="task-start"
            v-model="draft.startDate"
            type="datetime-local"
          />
        </div>
        <div class="form-group">
          <label for="task-due">Дедлайн</label>
          <input id="task-due" v-model="draft.dueDate" type="datetime-local" />
        </div>
      </div>

      <div class="form-group">
        <label for="task-priority">Приоритет</label>
        <select id="task-priority" v-model.number="draft.priority">
          <option :value="0">Низкий</option>
          <option :value="1">Обычный</option>
          <option :value="2">Высокий</option>
          <option :value="3">Срочный</option>
        </select>
      </div>

      <div class="form-group">
        <label for="task-tags">Метки через запятую</label>
        <input
          id="task-tags"
          v-model="draft.tags"
          type="text"
          maxlength="200"
          placeholder="Учёба, дом, работа"
        />
      </div>

      <p v-if="errorMessage" class="notice notice--error" role="alert">
        {{ errorMessage }}
      </p>

      <div class="modal__actions">
        <button
          type="button"
          class="button button--ghost"
          @click="requestClose"
        >
          Отмена
        </button>
        <button type="submit" class="button button--primary">Сохранить</button>
      </div>
    </form>
  </dialog>
</template>
