<script setup lang="ts">
import GameHeader from './components/GameHeader.vue'
import GameFigure from './components/GameFigure.vue'
import GameWrongLetters from './components/GameWrongLetters.vue'
import GameWord from './components/GameWord.vue'
import GamePopup from './components/GamePopup.vue'
import GameNotification from './components/GameNotification.vue'
import { computed, ref, watch } from 'vue'
import { getRandomName } from './api/getRandomName'

// загаданное случайное слово
const word = ref('')

const getRandomWord = async () => {
  try {
    const name = await getRandomName()
    word.value = name.toLowerCase()
  } catch (err) {
    console.log(err)
    word.value = ''
  }
}

getRandomWord()

// массив со всеми введенными символами
const letters = ref<string[]>([])
// только те символы которые есть в загаданном слове
const correctLetters = computed(() => letters.value.filter(x => word.value.includes(x)))
// только ошибочные символы
const wrongLetters = computed(() => letters.value.filter(x => !word.value.includes(x)))
// проигравшее состояние
const isLose = computed(() => wrongLetters.value.length === 6)
// выигравшее состояние
const isWin = computed(() => [...word.value].every(x => correctLetters.value.includes(x)))
// уведомление о повторновведеном символе
const notification = ref<InstanceType<typeof GameNotification> | null>(null)
// попап об окончании игры
const popup = ref<InstanceType<typeof GamePopup> | null>(null)

watch(correctLetters, () => {
  // преобразуем строку в массив и проверяем каждый символ
  if (isWin.value) {
    popup.value?.open('win')
  }
})

watch(wrongLetters, () => {
  if (isLose.value) {
    popup.value?.open('lose')
  }
})

// слушатель ввода символов
window.addEventListener('keydown', ({ key }) => {
  // прекратить слушать если игра окончена
  if (isLose.value || isWin.value) {
    return
  }

  // показ предупреждения о повторно введенном символе
  if (letters.value.includes(key)) {
    notification.value?.open()
    setTimeout(() => notification.value?.close(), 2000)
    return
  }

  // слушаем только кириллицу
  if (/[а-яА-ЯёЁ]/.test(key)) {
    letters.value.push(key.toLowerCase())
  }
})

const restart = async () => {
  await getRandomWord()
  letters.value = []
  popup.value?.close()
}
</script>

<template>
  <GameHeader />
  <div class="game-container">
    <GameFigure :wrong-letters-count="wrongLetters.length" />
    <GameWrongLetters :wrong-letters="wrongLetters" />
    <GameWord :word="word" :correct-letters="correctLetters" />
  </div>

  <GamePopup ref="popup" :word="word" @restart="restart" />
  <GameNotification ref="notification" />
</template>