<!-- Display questions in user solution checking -->
<script setup lang="ts">
defineProps<{
    questionIndex: number
    questionOptions: string[]
}>()

// Helper for color classes
const colorVariants = useColorVariants()

// Render math
const mathQuestions = ref<HTMLElement[]>([]);
const { renderMath, addMathClasses } = useDisplayMath();
onMounted(() => {
    renderMath()
    addMathClasses(mathQuestions.value)
})
</script>

<template>
    <div>
        <span class="question-title" :style="`--variant: var(--${colorVariants[questionIndex % 3]})`">
            Pytanie {{ questionIndex + 1 }}.
        </span>

        <div class="my-4">
            <span v-for="(question, optionIndex) in questionOptions" :key="optionIndex">
                <span class="math-content" ref="mathQuestions">{{ question }}</span>
                <span class="divider" v-if="optionIndex !== questionOptions.length - 1">LUB</span>
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';

.question-title {
    @apply mb-3 text-2xl;

    &::before {
        @apply w-[200px];
    }
}
</style>
