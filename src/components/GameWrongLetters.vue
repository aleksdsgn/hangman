<script setup lang="ts">
export interface Props {
  wrongLetters: string[]
}

defineProps<Props>()
</script>

<template>
  <!-- показываем только если массив не нулевой длинны -->
  <div v-if="wrongLetters.length" class="wrong-letters-container">
    <div class="wrong-letters">
      <p>Ошибки</p>
      <span v-for="(letter, index) in wrongLetters" :key="letter">
        <!-- если символ последний отрисовываем без запятой иначе с запятой-->
        {{ index === wrongLetters.length - 1 ? letter : `${letter}, ` }}
      </span>
    </div>
  </div>
</template>