<script setup lang="ts">
import GameHeader from './components/GameHeader.vue'
import GameFigure from './components/GameFigure.vue'
import GameWrongLetters from './components/GameWrongLetters.vue'
import GameWord from './components/GameWord.vue'
import GamePopup from './components/GamePopup.vue'
import GameNotification from './components/GameNotification.vue'
import { ref, watch } from 'vue'
import { useRandomWord } from './composables/useRandomWord'
import { useLetters } from './composables/useLetters'
import { useNotification } from './composables/useNotification'

const { word, getRandomWord } = useRandomWord()
const { letters, correctLetters, wrongLetters, isLose, isWin, addLetter, resetLetters } = useLetters(word)
const { notification, showNotification } = useNotification()
// попап об окончании игры
const popup = ref<InstanceType<typeof GamePopup> | null>(null)
const restart = async () => {
  await getRandomWord()
  resetLetters()
  popup.value?.close()
}

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
    showNotification()
    return
  }

  addLetter(key)
})
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