<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])
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
      @input="emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>
