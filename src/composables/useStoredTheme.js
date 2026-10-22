import { ref, watch } from 'vue'

const THEME_KEY = 'todo.theme'

function loadTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme
  } catch (error) {
    console.warn('Не удалось прочитать тему из localStorage:', error)
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useStoredTheme() {
  const isDark = ref(loadTheme() === 'dark')

  watch(
    isDark,
    (darkThemeEnabled) => {
      if (darkThemeEnabled) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }

      try {
        localStorage.setItem(THEME_KEY, darkThemeEnabled ? 'dark' : 'light')
      } catch (error) {
        console.warn('Не удалось сохранить тему в localStorage:', error)
      }
    },
    { immediate: true }
  )

  return { isDark }
}
