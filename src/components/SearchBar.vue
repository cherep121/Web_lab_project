<script setup lang="ts">
defineProps<{ modelValue: string }>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function updateValue(event: Event): void {
  if (event.target instanceof HTMLInputElement) {
    emit('update:modelValue', event.target.value)
  }
}
</script>

<template>
  <div class="search">
    <label for="search" class="visually-hidden">Поиск задач</label>
    <input
      id="search"
      class="search__input"
      type="search"
      :value="modelValue"
      placeholder="Найти задачу..."
      autocomplete="off"
      @input="updateValue"
    />
  </div>
</template>
