<!-- Base component for all questions -->
<script setup lang="ts">
import { questionType } from '~/server/types'

defineProps<{
    question: questionType
    questionIndex: number
    selectedAnswer: string | string[] | undefined
}>()
</script>

<template>
    <div class="exam-question">
        <!-- Question -->
        <QuestionContent :question="question" :question-index="questionIndex" :correct-answers="null" />
        <!-- Question -->

        <!-- Single choice question answers -->
        <SingleChoiceQuestion
            v-if="question.type === 'single_choice'"
            :question="question"
            :selected-answer="selectedAnswer"
            :question-index="questionIndex"
        />
        <!-- Single choice question answers -->

        <!-- Open question answers -->
        <OpenQuestion
            v-if="question.type === 'open_question'"
            :question="question"
            :selected-answer="selectedAnswer"
            :question-id="question.question_id"
        />
        <!-- Open question answers -->

        <div class="question-divider w-[75%]"></div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';
</style>
