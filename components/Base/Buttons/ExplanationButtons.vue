<!-- Buttons to show explanation and show answers sheet -->
<script setup lang="ts">
defineProps<{
    showExplanation: boolean
    changeShowExplanation: () => void
    isOpenQuestion: boolean
    pdfLink: string | null
    questionId?: number
}>()
</script>

<template>
    <button class="btn btn-primary" @click="changeShowExplanation">
        <font-awesome-icon icon="fa-solid fa-circle-info" class="-mt-0.5 mr-1 text-xl" />
        {{ showExplanation ? 'Ukryj' : 'Pokaż' }} wyjaśnienie
    </button>
    <a class="btn btn-secondary" :href="pdfLink" target="_blank" v-if="isOpenQuestion && pdfLink">
        <font-awesome-icon icon="fa-solid fa-file-circle-check" class="-mt-px mr-1 text-lg" />
        Klucz odpowiedzi
    </a>
    <NuxtLink class="btn btn-accent" :to="`/cwiczenie/${questionId}`" target="_blank" v-if="isOpenQuestion">
        <font-awesome-icon icon="fa-solid fa-chalkboard" class="mr-1 text-xl" />
        Rozwiąż w trybie interaktywnym
    </NuxtLink>
</template>

<style scoped></style>
