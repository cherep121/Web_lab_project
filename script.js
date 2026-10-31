const PUZZLES = {
  cpp: [
    { answer: 'КОМПИЛЯТОР', clue: 'Программа, превращающая исходный код в исполняемый файл.', difficulty: 'easy' },
    { answer: 'КЛАСС', clue: 'Шаблон, по которому создаются объекты в C++.', difficulty: 'easy' },
    { answer: 'УМНЫЙ УКАЗАТЕЛЬ', clue: 'Объект C++, который помогает автоматически управлять динамической памятью.', difficulty: 'medium' },
    { answer: 'КОНСТРУКТОР', clue: 'Метод класса, который вызывается при создании объекта.', difficulty: 'medium' },
    { answer: 'ПЕРЕГРУЗКА ОПЕРАТОРА', clue: 'Способ задать собственное поведение плюса, сравнения или другого знака для класса.', difficulty: 'hard' },
    { answer: 'ВИРТУАЛЬНЫЙ ДЕСТРУКТОР', clue: 'Он нужен базовому классу для правильного удаления объектов наследников.', difficulty: 'hard' }
  ],
  web: [
    { answer: 'БРАУЗЕР', clue: 'Программа, которая читает HTML, CSS и JavaScript и показывает сайт.', difficulty: 'easy' },
    { answer: 'СЕРВЕР', clue: 'Компьютер или программа, которая отвечает на запросы клиента.', difficulty: 'easy' },
    { answer: 'КАСКАДНЫЕ СТИЛИ', clue: 'Именно они отвечают за цвет, отступы и расположение элементов на странице.', difficulty: 'medium' },
    { answer: 'АДРЕСНАЯ СТРОКА', clue: 'Место, куда пользователь вводит URL сайта.', difficulty: 'medium' },
    { answer: 'ОБЪЕКТНАЯ МОДЕЛЬ', clue: 'Представление HTML-документа как дерева программных объектов.', difficulty: 'hard' },
    { answer: 'АСИНХРОННЫЙ ЗАПРОС', clue: 'Обращение к серверу, во время которого страница продолжает работать.', difficulty: 'hard' }
  ],
  git: [
    { answer: 'КОММИТ', clue: 'Сохранённый снимок изменений с коротким сообщением.', difficulty: 'easy' },
    { answer: 'ВЕТКА', clue: 'Независимая линия разработки в репозитории.', difficulty: 'easy' },
    { answer: 'РЕПОЗИТОРИЙ', clue: 'Хранилище проекта вместе со всей историей изменений.', difficulty: 'medium' },
    { answer: 'КОНФЛИКТ СЛИЯНИЯ', clue: 'Ситуация, когда Git не может сам объединить изменения.', difficulty: 'medium' },
    { answer: 'ИНТЕРАКТИВНЫЙ РЕБЕЙЗ', clue: 'Команда для перестановки, объединения и изменения нескольких коммитов.', difficulty: 'hard' },
    { answer: 'ОТЛОЖЕННЫЕ ИЗМЕНЕНИЯ', clue: 'Временное хранилище незавершённой работы перед переключением ветки.', difficulty: 'hard' }
  ],
  it: [
    { answer: 'ДЕДЛАЙН', clue: 'Дата, после которой задача внезапно становится очень интересной.', difficulty: 'easy' },
    { answer: 'ТЁМНАЯ ТЕМА', clue: 'Режим интерфейса, который программист включает даже солнечным днём.', difficulty: 'easy' },
    { answer: 'ЧИСТЫЙ КОД', clue: 'Код, который легко читать не только автору через две недели.', difficulty: 'medium' },
    { answer: 'КОФЕ МАШИНА', clue: 'Главный сервер бодрости разработчика.', difficulty: 'medium' },
    { answer: 'ТЕХНИЧЕСКИЙ ДОЛГ', clue: 'Цена быстрых решений, которую проекту приходится платить позднее.', difficulty: 'hard' },
    { answer: 'РЕЗИНОВАЯ УТКА', clue: 'Молчаливый помощник, которому объясняют код, чтобы найти ошибку.', difficulty: 'hard' }
  ]
}

const WHEEL_SEGMENTS = [
  { label: '100', points: 100 },
  { label: '200', points: 200 },
  { label: '300', points: 300 },
  { label: '500', points: 500 },
  { label: '750', points: 750 },
  { label: '×2', points: 1000 },
  { label: 'БАНКРОТ', type: 'bankrupt' },
  { label: 'ПРИЗ', points: 1500, type: 'prize' }
]
const WHEEL_WEIGHTS = [12, 14, 15, 18, 15, 10, 3, 13]

const ALPHABET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'

const elements = {
  setupScreen: document.querySelector('#setup-screen'),
  gameScreen: document.querySelector('#game-screen'),
  topicList: document.querySelector('#topic-list'),
  topicButtons: [...document.querySelectorAll('.topic-card')],
  difficultyInputs: [...document.querySelectorAll('input[name="difficulty"]')],
  startPreset: document.querySelector('#start-preset'),
  customForm: document.querySelector('#custom-form'),
  customAnswer: document.querySelector('#custom-answer'),
  customClue: document.querySelector('#custom-clue'),
  answerError: document.querySelector('#answer-error'),
  clueError: document.querySelector('#clue-error'),
  editPuzzle: document.querySelector('#edit-puzzle'),
  score: document.querySelector('#score-value'),
  mistakes: document.querySelector('#mistakes-value'),
  round: document.querySelector('#round-value'),
  clueToggle: document.querySelector('#clue-toggle'),
  clueCard: document.querySelector('#clue-card'),
  clueText: document.querySelector('#clue-text'),
  clueTimer: document.querySelector('#clue-timer'),
  wordBoard: document.querySelector('#word-board'),
  wheel: document.querySelector('#wheel'),
  wheelResult: document.querySelector('#wheel-result'),
  sectorResult: document.querySelector('#sector-result'),
  spinStatus: document.querySelector('#spin-status'),
  spinButton: document.querySelector('#spin-wheel'),
  letterForm: document.querySelector('#letter-form'),
  letterInput: document.querySelector('#letter-input'),
  letterButton: document.querySelector('#guess-letter'),
  answerForm: document.querySelector('#answer-form'),
  answerInput: document.querySelector('#answer-input'),
  keyboard: document.querySelector('#keyboard'),
  soundToggle: document.querySelector('#sound-toggle'),
  resultDialog: document.querySelector('#result-dialog'),
  resultKicker: document.querySelector('#result-kicker'),
  resultTitle: document.querySelector('#result-title'),
  resultText: document.querySelector('#result-text'),
  resultAnswer: document.querySelector('#result-answer'),
  nextRound: document.querySelector('#next-round'),
  backHome: document.querySelector('#back-home')
}

const state = {
  topic: 'cpp',
  difficulty: 'easy',
  puzzle: null,
  source: 'preset',
  guessed: new Set(),
  solvedWords: new Set(),
  score: 0,
  mistakes: 0,
  round: 1,
  spinValue: 0,
  canGuessLetter: false,
  spinning: false,
  wheelRotation: 0,
  clueTimeout: null,
  sound: true,
  audioContext: null
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function pickWeightedSegmentIndex() {
  const totalWeight = WHEEL_WEIGHTS.reduce((sum, weight) => sum + weight, 0)
  let roll = Math.random() * totalWeight

  for (let index = 0; index < WHEEL_WEIGHTS.length; index += 1) {
    roll -= WHEEL_WEIGHTS[index]
    if (roll < 0) return index
  }

  return WHEEL_WEIGHTS.length - 1
}

function normalizeText(value) {
  return value
    .toLocaleUpperCase('ru-RU')
    .replace(/\s+/g, ' ')
    .trim()
}

function lettersOnly(value) {
  return value.replace(/[^А-ЯЁ]/giu, '')
}

function setSound(enabled) {
  state.sound = enabled
  elements.soundToggle.setAttribute('aria-pressed', String(enabled))
  elements.soundToggle.setAttribute('aria-label', enabled ? 'Выключить звук' : 'Включить звук')
}

function tone(frequency, duration = .08, type = 'square', delay = 0) {
  if (!state.sound) return

  try {
    state.audioContext ??= new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = state.audioContext.createOscillator()
    const gain = state.audioContext.createGain()
    const start = state.audioContext.currentTime + delay

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, start)
    gain.gain.setValueAtTime(.035, start)
    gain.gain.exponentialRampToValueAtTime(.001, start + duration)
    oscillator.connect(gain)
    gain.connect(state.audioContext.destination)
    oscillator.start(start)
    oscillator.stop(start + duration)
  } catch {
    setSound(false)
  }
}

function soundCorrect() {
  tone(520, .08, 'sine')
  tone(760, .12, 'sine', .08)
}

function soundWrong() {
  tone(180, .18, 'sawtooth')
}

function soundWin() {
  ;[440, 550, 660, 880].forEach((frequency, index) => tone(frequency, .18, 'sine', index * .11))
}

function buildWheelLabels() {
  WHEEL_SEGMENTS.forEach((segment, index) => {
    const label = document.createElement('span')
    label.className = `wheel__label${segment.type ? ` wheel__label--${segment.type}` : ''}`
    label.textContent = segment.label
    label.style.setProperty('--angle', `${index * 45}deg`)
    label.style.setProperty('--label-angle', `${index > 3 && index < 8 ? 90 : -90}deg`)
    elements.wheel.insertBefore(label, elements.wheel.firstChild)
  })
}

function buildKeyboard() {
  elements.keyboard.replaceChildren()
  ;[...ALPHABET].forEach((letter) => {
    const button = document.createElement('button')
    button.className = 'key'
    button.type = 'button'
    button.textContent = letter
    button.dataset.letter = letter
    button.setAttribute('aria-label', `Назвать букву ${letter}`)
    button.addEventListener('click', () => {
      if (!state.canGuessLetter) {
        elements.spinStatus.textContent = 'Сначала вращайте барабан'
        tone(210, .08)
        elements.spinButton.focus()
        return
      }
      guessLetter(letter)
    })
    elements.keyboard.append(button)
  })
}

function createBoard() {
  elements.wordBoard.replaceChildren()
  const words = state.puzzle.answer.split(' ')

  words.forEach((word, wordIndex) => {
    const wordElement = document.createElement('span')
    wordElement.className = 'word-board__word'

    ;[...word].forEach((character) => {
      const tile = document.createElement('span')
      const isLetter = /[А-ЯЁ]/u.test(character)
      const isRevealed = !isLetter || state.guessed.has(character)
      tile.className = `letter-tile${isRevealed ? ' is-revealed' : ''}${isLetter ? '' : ' is-symbol'}`
      tile.textContent = character
      tile.dataset.letter = character
      tile.dataset.wordIndex = wordIndex
      tile.setAttribute('aria-label', isRevealed ? character : 'скрытая буква')
      wordElement.append(tile)
    })

    elements.wordBoard.append(wordElement)
    if (wordIndex < words.length - 1) {
      const space = document.createElement('span')
      space.className = 'letter-tile is-space'
      space.setAttribute('aria-hidden', 'true')
      elements.wordBoard.append(space)
    }
  })
}

function updateBoard() {
  elements.wordBoard.querySelectorAll('.letter-tile[data-letter]').forEach((tile) => {
    const character = tile.dataset.letter
    const wordIsSolved = state.solvedWords.has(Number(tile.dataset.wordIndex))
    if (state.guessed.has(character) || wordIsSolved) {
      tile.classList.add('is-revealed')
      tile.setAttribute('aria-label', character)
    }
  })
}

function getPuzzleWords() {
  return state.puzzle.answer.split(' ')
}

function isWordSolved(index) {
  if (state.solvedWords.has(index)) return true
  return [...getPuzzleWords()[index]].every((character) => {
    return !/[А-ЯЁ]/u.test(character) || state.guessed.has(character)
  })
}

function isPuzzleSolved() {
  return getPuzzleWords().every((word, index) => isWordSolved(index))
}

function getPresetPool() {
  return PUZZLES[state.topic].filter((puzzle) => puzzle.difficulty === state.difficulty)
}

function updateScoreboard() {
  elements.score.textContent = state.score.toLocaleString('ru-RU')
  elements.mistakes.textContent = `${state.mistakes} / 6`
  elements.round.textContent = state.round
}

function setLetterControls(enabled) {
  state.canGuessLetter = enabled
  elements.letterInput.disabled = !enabled
  elements.letterButton.disabled = !enabled
  if (!enabled) elements.letterInput.value = ''
}

function resetKeyboard() {
  elements.keyboard.querySelectorAll('.key').forEach((button) => {
    button.disabled = false
    button.classList.remove('is-correct', 'is-wrong')
  })
}

function showScreen(screen) {
  elements.setupScreen.hidden = screen !== 'setup'
  elements.gameScreen.hidden = screen !== 'game'
  const target = screen === 'setup' ? elements.setupScreen : elements.gameScreen
  target.classList.remove('is-entering')
  requestAnimationFrame(() => target.classList.add('is-entering'))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function setClueVisibility(visible, automatic = false) {
  elements.clueCard.classList.toggle('is-collapsed', !visible)
  elements.clueToggle.setAttribute('aria-expanded', String(visible))
  elements.clueToggle.textContent = visible ? 'Скрыть подсказку' : 'Показать подсказку'
  if (!visible && automatic) elements.clueToggle.focus()
}

function startClueTimer() {
  clearTimeout(state.clueTimeout)
  elements.clueTimer.textContent = 'Подсказка скроется через 5 секунд'
  setClueVisibility(true)

  let seconds = 5
  const countdown = window.setInterval(() => {
    seconds -= 1
    if (seconds > 0) elements.clueTimer.textContent = `Подсказка скроется через ${seconds} секунды`
    else window.clearInterval(countdown)
  }, 1000)

  state.clueTimeout = window.setTimeout(() => {
    window.clearInterval(countdown)
    setClueVisibility(false)
    elements.clueTimer.textContent = ''
  }, 5000)
}

function startGame(puzzle, source = 'preset') {
  state.puzzle = {
    answer: normalizeText(puzzle.answer),
    clue: puzzle.clue.trim()
  }
  state.source = source
  state.guessed = new Set()
  state.solvedWords = new Set()
  state.score = 0
  state.mistakes = 0
  state.spinValue = 0
  state.canGuessLetter = false
  state.spinning = false
  elements.answerInput.value = ''
  elements.wheelResult.textContent = 'КРУТИ'
  elements.sectorResult.textContent = '—'
  elements.sectorResult.className = ''
  elements.spinStatus.textContent = 'Сначала вращайте барабан'
  elements.clueText.textContent = state.puzzle.clue
  setLetterControls(false)
  resetKeyboard()
  createBoard()
  updateScoreboard()
  showScreen('game')
  startClueTimer()
  elements.spinButton.focus()
}

function spinWheel() {
  if (state.spinning) return

  state.spinning = true
  setLetterControls(false)
  document.body.classList.add('is-spinning')
  elements.spinButton.disabled = true
  elements.wheelResult.textContent = '...'
  elements.sectorResult.textContent = 'Вращение...'
  elements.sectorResult.className = 'is-spinning'
  elements.spinStatus.textContent = 'Колесо решает вашу судьбу...'
  const index = pickWeightedSegmentIndex()
  const extraTurns = 5 + Math.floor(Math.random() * 3)
  const targetOffset = 360 - index * 45
  const currentOffset = ((state.wheelRotation % 360) + 360) % 360
  const offsetDelta = (targetOffset - currentOffset + 360) % 360
  state.wheelRotation += extraTurns * 360 + offsetDelta
  elements.wheel.style.transform = `rotate(${state.wheelRotation}deg)`

  let ticks = 0
  const tickTimer = window.setInterval(() => {
    tone(270 + ticks * 4, .025, 'square')
    ticks += 1
    if (ticks > 22) window.clearInterval(tickTimer)
  }, 145)

  window.setTimeout(() => {
    window.clearInterval(tickTimer)
    resolveSpin(WHEEL_SEGMENTS[index])
  }, 4300)
}

function resolveSpin(segment) {
  state.spinning = false
  document.body.classList.remove('is-spinning')
  elements.spinButton.disabled = false
  elements.wheelResult.textContent = segment.label
  elements.sectorResult.textContent = segment.label
  elements.sectorResult.className = segment.type ? `is-${segment.type}` : 'is-points'

  if (segment.type === 'bankrupt') {
    state.score = 0
    updateScoreboard()
    elements.spinStatus.textContent = 'Банкрот! Очки сгорели. Крутите ещё раз.'
    soundWrong()
    elements.spinButton.focus()
    return
  }

  state.spinValue = segment.points
  setLetterControls(true)
  elements.spinStatus.textContent = segment.type === 'prize'
    ? 'Сектор «Приз»: 1 500 очков за каждую букву!'
    : `Сектор ${segment.label}: называйте букву`
  tone(660, .12, 'sine')
  elements.letterInput.focus()
}

function guessLetter(rawLetter) {
  const letter = normalizeText(rawLetter).slice(0, 1)
  if (!state.canGuessLetter) return

  if (!/^[А-ЯЁ]$/u.test(letter)) {
    elements.spinStatus.textContent = 'Введите одну русскую букву'
    soundWrong()
    elements.letterInput.focus()
    return
  }

  if (state.guessed.has(letter)) {
    elements.spinStatus.textContent = `Буква ${letter} уже была — выберите другую`
    soundWrong()
    elements.letterInput.select()
    return
  }

  state.guessed.add(letter)
  const occurrences = [...state.puzzle.answer].filter((character) => character === letter).length
  const keyboardKey = elements.keyboard.querySelector(`[data-letter="${letter}"]`)
  keyboardKey.disabled = true

  if (occurrences > 0) {
    state.score += state.spinValue * occurrences
    keyboardKey.classList.add('is-correct')
    updateBoard()
    elements.spinStatus.textContent = occurrences === 1
      ? `Есть одна буква ${letter}. +${state.spinValue} очков`
      : `Есть ${occurrences} буквы ${letter}. +${state.spinValue * occurrences} очков`
    soundCorrect()
  } else {
    state.mistakes += 1
    keyboardKey.classList.add('is-wrong')
    elements.spinStatus.textContent = `Буквы ${letter} нет. Крутите барабан снова.`
    soundWrong()
  }

  updateScoreboard()
  setLetterControls(false)

  if (isPuzzleSolved()) {
    finishGame(true, 'Все буквы открыты. Это было технично!')
  } else if (state.mistakes >= 6) {
    finishGame(false, 'Шесть ошибок — табло уходит на перезагрузку.')
  } else {
    elements.spinButton.focus()
  }
}

function guessAnswer(rawAnswer) {
  const answer = normalizeText(rawAnswer)
  if (!answer) {
    elements.spinStatus.textContent = 'Введите вариант ответа целиком'
    elements.answerInput.focus()
    return
  }

  if (answer === state.puzzle.answer) {
    getPuzzleWords().forEach((word, index) => state.solvedWords.add(index))
    updateBoard()
    state.score += 2000
    updateScoreboard()
    finishGame(true, 'Ответ принят целиком. Смелость вознаграждена!')
    return
  }

  const words = getPuzzleWords()
  const matchingIndexes = words
    .map((word, index) => ({ word, index }))
    .filter(({ word, index }) => word === answer && !isWordSolved(index))
    .map(({ index }) => index)

  if (matchingIndexes.length > 0) {
    matchingIndexes.forEach((index) => state.solvedWords.add(index))
    state.score += 750 * matchingIndexes.length
    elements.answerInput.value = ''
    updateBoard()
    updateScoreboard()
    soundCorrect()

    if (isPuzzleSolved()) {
      finishGame(true, 'Все слова открыты по отдельности. Отличная работа!')
    } else {
      const remaining = words.filter((word, index) => !isWordSolved(index)).length
      elements.spinStatus.textContent = `Слово «${answer}» открыто. Осталось слов: ${remaining}.`
      elements.answerInput.focus()
    }
    return
  }

  const alreadySolved = words.some((word, index) => word === answer && isWordSolved(index))
  if (alreadySolved) {
    elements.spinStatus.textContent = `Слово «${answer}» уже открыто. Введите оставшееся слово.`
    elements.answerInput.select()
    return
  }

  state.mistakes += 1
  updateScoreboard()
  elements.answerInput.select()
  elements.spinStatus.textContent = 'Ответ не совпал. Минус одна попытка.'
  soundWrong()

  if (state.mistakes >= 6) finishGame(false, 'Шесть ошибок — выпуск завершён.')
}

function finishGame(won, message) {
  clearTimeout(state.clueTimeout)
  setLetterControls(false)
  elements.spinButton.disabled = true
  elements.resultDialog.classList.toggle('is-loss', !won)
  elements.resultKicker.textContent = won ? 'Сектор приз!' : 'Сектор stack overflow'
  elements.resultTitle.textContent = won ? 'Вы победили' : 'Раунд проигран'
  elements.resultText.textContent = `${message} Итоговый счёт: ${state.score.toLocaleString('ru-RU')}.`
  elements.resultAnswer.textContent = state.puzzle.answer
  if (won) soundWin()
  else soundWrong()
  elements.resultDialog.showModal()
  elements.nextRound.focus()
}

function selectTopic(topic) {
  state.topic = topic
  elements.topicButtons.forEach((button) => {
    const selected = button.dataset.topic === topic
    button.classList.toggle('is-selected', selected)
    button.setAttribute('aria-checked', String(selected))
  })
}

function validateCustomPuzzle() {
  const answer = normalizeText(elements.customAnswer.value)
  const clue = elements.customClue.value.trim()
  const validCharacters = /^[А-ЯЁ\s-]+$/u.test(answer)
  const letterCount = lettersOnly(answer).length
  let valid = true

  elements.answerError.textContent = ''
  elements.clueError.textContent = ''
  elements.customAnswer.removeAttribute('aria-invalid')
  elements.customClue.removeAttribute('aria-invalid')

  if (!validCharacters || letterCount < 2) {
    elements.answerError.textContent = 'Введите минимум две русские буквы; можно использовать пробелы и дефисы.'
    elements.customAnswer.setAttribute('aria-invalid', 'true')
    valid = false
  }

  if (clue.length < 8) {
    elements.clueError.textContent = 'Подсказка должна быть не короче 8 символов.'
    elements.customClue.setAttribute('aria-invalid', 'true')
    valid = false
  }

  if (!valid) {
    elements.customForm.querySelector('[aria-invalid="true"]')?.focus()
    return null
  }

  return { answer, clue }
}

function returnToEditor(prefill = true) {
  clearTimeout(state.clueTimeout)
  if (elements.resultDialog.open) elements.resultDialog.close()

  if (prefill && state.puzzle) {
    elements.customAnswer.value = state.puzzle.answer
    elements.customClue.value = state.puzzle.clue
  }

  elements.spinButton.disabled = false
  showScreen('setup')
  if (prefill) elements.customAnswer.focus()
}

elements.topicList.addEventListener('click', (event) => {
  const button = event.target.closest('.topic-card')
  if (button) selectTopic(button.dataset.topic)
})

elements.topicList.addEventListener('keydown', (event) => {
  if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) return
  event.preventDefault()
  const currentIndex = elements.topicButtons.findIndex((button) => button.dataset.topic === state.topic)
  const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1
  const nextIndex = (currentIndex + direction + elements.topicButtons.length) % elements.topicButtons.length
  const nextButton = elements.topicButtons[nextIndex]
  selectTopic(nextButton.dataset.topic)
  nextButton.focus()
})

elements.difficultyInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (input.checked) state.difficulty = input.value
  })
})

elements.startPreset.addEventListener('click', () => {
  state.round = 1
  const puzzle = randomItem(getPresetPool())
  startGame(puzzle, 'preset')
})

elements.customForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const puzzle = validateCustomPuzzle()
  if (puzzle) {
    state.round = 1
    startGame(puzzle, 'custom')
  }
})

elements.customAnswer.addEventListener('input', () => {
  elements.answerError.textContent = ''
  elements.customAnswer.removeAttribute('aria-invalid')
})

elements.customClue.addEventListener('input', () => {
  elements.clueError.textContent = ''
  elements.customClue.removeAttribute('aria-invalid')
})

elements.spinButton.addEventListener('click', spinWheel)

elements.letterForm.addEventListener('submit', (event) => {
  event.preventDefault()
  guessLetter(elements.letterInput.value)
})

elements.letterInput.addEventListener('input', () => {
  elements.letterInput.value = lettersOnly(elements.letterInput.value).slice(0, 1)
})

elements.answerForm.addEventListener('submit', (event) => {
  event.preventDefault()
  guessAnswer(elements.answerInput.value)
})

elements.clueToggle.addEventListener('click', () => {
  clearTimeout(state.clueTimeout)
  const visible = elements.clueToggle.getAttribute('aria-expanded') === 'true'
  setClueVisibility(!visible)
  elements.clueTimer.textContent = visible ? '' : 'Подсказка открыта по просьбе игрока'
})

elements.editPuzzle.addEventListener('click', () => returnToEditor(true))
elements.soundToggle.addEventListener('click', () => setSound(!state.sound))

elements.nextRound.addEventListener('click', () => {
  elements.resultDialog.close()
  state.round += 1
  if (state.source === 'preset') startGame(randomItem(getPresetPool()), 'preset')
  else returnToEditor(true)
})

elements.backHome.addEventListener('click', () => returnToEditor(true))

elements.resultDialog.addEventListener('cancel', (event) => {
  event.preventDefault()
  returnToEditor(true)
})

buildWheelLabels()
buildKeyboard()
selectTopic('cpp')
