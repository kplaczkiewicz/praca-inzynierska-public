<!-- Component for all questions with answer shown -->
<script setup lang="ts">
import { questionType, examAnswerType, openQuesionSolutionType } from '~/server/types'

const props = defineProps<{
    question: questionType
    questionIndex: number
    correctAnswers: examAnswerType | null
    solutions: openQuesionSolutionType[] | undefined
}>()

// Get user solution for open question
function getSolution() { 
    if (props.correctAnswers?.open_question_explanation === 'no_answer') return undefined;
    const solution = props.correctAnswers?.open_question_explanation?.solution;

    if (solution !== undefined && solution !== 'own_scoring') {
        return props.solutions?.[solution];
    }
    return undefined;
}
</script>

<template>
    <div class="exam-question">
        <!-- Question -->
        <QuestionContent :question="question" :question-index="questionIndex" :correct-answers="correctAnswers" />
        <!-- Question -->

        <!-- Single choice question answers with correct answer checked -->
        <SingleChoiceQuestionWithAnswer
            v-if="question.type === 'single_choice'"
            :question="question"
            :single-choice-answer="correctAnswers!"
        />
        <!-- Single choice question answers with correct answer checked -->

        <!-- Open question answers with answers and explanations -->
        <OpenQuestionWithAnswer
            v-if="question.type === 'open_question'"
            :question="question"
            :open-question-answer="correctAnswers!"
            :solution="getSolution()"
        />
        <!-- Open question answers with answers and explanations -->

        <div class="question-divider w-[75%]"></div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';
</style>
