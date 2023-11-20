<!-- Component for single choice question answers with answers shown -->
<script setup lang="ts">
import { questionType, examAnswerType } from '~/server/types'

defineProps<{
    question: questionType
    singleChoiceAnswer: examAnswerType
}>()

// Render math
const mathAnswers = ref<HTMLElement[]>([])
const { renderMath, addMathClasses } = useDisplayMath()
onMounted(() => {
    renderMath()
    addMathClasses(mathAnswers.value)
})
</script>

<template>
    <!-- Single choice question answers -->
    <div class="single-choice-wrapper">
        <!-- Question options with the correct and wrong highlighted -->
        <div
            class="single-choice-answer answer-locked"
            :class="{
                'answer-wrong': singleChoiceAnswer.user_answer === answer.option && !singleChoiceAnswer.is_correct,
                'answer-correct': singleChoiceAnswer.user_answer === answer.option && singleChoiceAnswer.is_correct,
                'answer-correct-outline':
                    singleChoiceAnswer.correct_answer === answer.option && !singleChoiceAnswer.is_correct,
            }"
            v-for="answer in question.question_content?.answers"
            :key="answer.option"
        >
            <span class="single-choice-answer-option grayed-out">{{ answer.option }} </span>
            <span class="math-content" ref="mathAnswers">{{ answer.answer }}</span>

            <font-awesome-icon
                icon="fa-solid fa-check"
                class="ml-auto text-2xl"
                v-if="singleChoiceAnswer.correct_answer === answer.option"
            />
            <font-awesome-icon
                icon="fa-solid fa-xmark"
                class="ml-auto text-2xl"
                v-if="singleChoiceAnswer.user_answer === answer.option && !singleChoiceAnswer.is_correct"
            />
        </div>
        <!-- Question options with the correct and wrong highlighted -->

        <!-- Explanation -->
        <QuestionExplanation
            :is-correct="singleChoiceAnswer.is_correct"
            :explanation="question.explanation"
            :helpful-links="question.helpful_links"
            :show-buttons="true"
            header-text="Przykładowe rozwiązanie:"
        />
        <!-- Explanation -->
    </div>
    <!-- Single choice question answers -->
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/single-choice-question.scss';
</style>
