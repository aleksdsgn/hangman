<script setup lang="ts">
import GameHeader from './components/GameHeader.vue'
import GameFigure from './components/GameFigure.vue'
import GameWrongLetters from './components/GameWrongLetters.vue'
import GameWord from './components/GameWord.vue'
import GamePopup from './components/GamePopup.vue'
import GameNotification from './components/GameNotification.vue'
import { computed, ref } from 'vue'

// загаданное слово
const word = ref('василий')
// массив со всеми введенными символами
const letters = ref<string[]>([])
// только те символы которые есть в загаданном слове
const correctLetters = computed(() => letters.value.filter(x => word.value.includes(x)))
// только ошибочные символы
const wrongLetters = computed(() => letters.value.filter(x => !word.value.includes(x)))
const notification = ref<InstanceType<typeof GameNotification> | null>(null)

window.addEventListener('keydown', ({ key }) => {
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
</script>

<template>
  {{ word }}
  {{ letters }}
  {{ correctLetters }}
  {{ wrongLetters }}
  <GameHeader />
  <div class="game-container">
    <GameFigure />
    <GameWrongLetters :wrong-letters="wrongLetters" />
    <GameWord :word="word" :correct-letters="correctLetters"/>
  </div>

  <GamePopup v-if="false" />
  <GameNotification ref="notification"/>
</template>