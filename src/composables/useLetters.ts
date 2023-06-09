import { ref, computed, type Ref } from "vue"

export const useLetters = (word: Ref<string>) => {
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
  const addLetter = (key: string) => {
    // слушаем только кириллицу
    if (/[а-яА-ЯёЁ]/.test(key)) {
      letters.value.push(key.toLowerCase())
    }
  }
  const resetLetters = () => {
    letters.value = []
  }

  return {
    letters,
    correctLetters,
    wrongLetters,
    isLose,
    isWin,
    addLetter,
    resetLetters
  }
}