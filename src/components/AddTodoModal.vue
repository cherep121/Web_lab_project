<script setup>
import { nextTick, onMounted, ref } from 'vue'

const props = defineProps({
  initialTitle: {
    type: String,
    default: ''
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'close'])

const dialog = ref(null)
const titleInput = ref(null)
const draft = ref(props.initialTitle)
const errorMessage = ref('')

onMounted(async () => {
  dialog.value?.showModal()
  await nextTick()
  titleInput.value?.focus()
  if (props.isEditing) titleInput.value?.select()
})

function submit() {
  const title = draft.value.trim()

  if (title.length < 2) {
    errorMessage.value = 'Название должно быть не короче 2 символов.'
    titleInput.value?.focus()
    return
  }

  emit('save', title)
}

function requestClose() {
  emit('close')
}

function handleBackdropClick(event) {
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
          v-model="draft"
          class="form-group__input"
          type="text"
          maxlength="200"
          autocomplete="off"
          :aria-invalid="errorMessage ? 'true' : undefined"
          :aria-describedby="errorMessage ? 'task-title-error' : undefined"
          @input="errorMessage = ''"
        >
        <span id="task-title-error" class="form-group__error" role="alert">
          {{ errorMessage }}
        </span>
      </div>

      <div class="modal__actions">
        <button type="button" class="button button--ghost" @click="requestClose">
          Отмена
        </button>
        <button type="submit" class="button button--primary">
          Сохранить
        </button>
      </div>
    </form>
  </dialog>
</template>
