<!-- Component to show the question content: question, points, image -->
<script setup lang="ts">
import { interactiveQuestionType } from '~/server/types'

defineProps<{
    question: interactiveQuestionType
}>()

// Helper for color classes
const colorVariants = useColorVariants()

// Render math
const mathQuestion = ref<HTMLElement>();
const mathAnnotation = ref<HTMLElement>();

const { renderMath, addMathClasses } = useDisplayMath();
onMounted(() => {
    renderMath()
    addMathClasses([mathQuestion.value, mathAnnotation.value])
})
</script>

<template>
    <div>
        <div class="relative">
            <span class="question-title" :style="`--variant: var(--${colorVariants[question.question_id % 3]})`">
                Zadanie {{ question.question_number }}.
                <span>({{ question.points }} pkt)</span>
            </span>

            <!-- Show annotation at top if present -->
            <span v-if="question.annotation" ref="mathAnnotation">{{ question.annotation }}</span>

            <!-- Question -->
            <span class="math-content" ref="mathQuestion" v-else>{{ question.question }}</span>
        </div>

        <!-- Image -->
        <NuxtImg
            class="mx-auto mt-8 mb-10 rounded shadow"
            :src="question.image_url"
            alt="Zdjęcie pomocnicze do zadania"
            densities="1x"
            v-if="question.image_url"
        />
        <!-- Image -->

        <!-- If annotation present show question at the bottom -->
        <p class="mt-10" ref="mathQuestion" v-if="question.annotation">{{ question.question }}</p>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/utilities/helpers.scss';
@import '@/assets/scss/components/exam.scss';

.question-title {
    @apply text-3xl mb-5 pl-1;

    &::before {
        @apply w-[325px] top-5;
    }

    span {
        @apply ml-1.5 relative bottom-px text-xl;
    }
}
</style>
