<!-- Component to show the question content: question, points, image etc. -->
<script setup lang="ts">
import { questionType, examAnswerType } from '~/server/types'

defineProps<{
    question: questionType
    questionIndex: number
    correctAnswers: examAnswerType | null
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
        <div class="relative" :class="{ 'pr-20': correctAnswers }">
            <span class="question-title" :style="`--variant: var(--${colorVariants[questionIndex % 3]})`">
                Zadanie {{ question.question_number }}.
                <span>({{ question.points }} pkt)</span>
            </span>

            <!-- Show annotation at top if present -->
            <span v-if="question.annotation" ref="mathAnnotation">{{ question.annotation }}</span>

            <!-- Question -->
            <span class="math-content" ref="mathQuestion" v-else>{{ question.question }}</span>

            <!-- Show points scored -->
            <div
                class="absolute -top-3 right-0 rounded border-[3px] px-3 py-2.5 text-lg font-semibold"
                :class="correctAnswers.is_correct ? 'border-success bg-success/10' : 'border-error bg-error/10'"
                v-if="correctAnswers"
            >
                {{ correctAnswers.points }} / {{ correctAnswers.total_points }} pkt
            </div>
            <!-- Show points scored -->
        </div>

        <!-- Image -->
        <img
            class="mx-auto mt-8 mb-10 rounded shadow"
            :src="question.image_url"
            :alt="`Zdjęcie pomocnicze do zadania nr ${question.question_number}`"
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
    @apply text-[22px] mb-5;

    &::before {
        @apply w-[235px];
    }

    span {
        @apply ml-1 text-lg;
    }
}
</style>
