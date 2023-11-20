<!-- Sidebar to display progress and quick access to questions -->
<script setup lang="ts">
import { userAnswerType } from '~/server/types'
type SidebarPositionType = 'left' | 'right'

const props = defineProps<{
    borderPosition: SidebarPositionType
    userCurrentExam: userAnswerType[] | undefined
    numberOfQuestions: Number | undefined
}>()

// Get number of answered questions
const getAnsweredQuestions = computed(() => {
    return props.userCurrentExam?.filter((e) => e.answer !== '' && e.answer.length !== 0).length
})

// Check if a given question has an answer
function checkIfQuestionHasAnswer(index: number) {
    if (Array.isArray(props.userCurrentExam?.[index].answer)) return props.userCurrentExam?.[index].answer.length !== 0
    return props.userCurrentExam?.[index].answer !== ''
}

// Scroll to a question
function goToQuestion(index: number) {
    const questions = document.querySelectorAll('.exam-question')

    // Scroll question into view
    questions[index - 1].scrollIntoView({block: 'start'})
}
</script>

<template>
    <Sidebar :border-position="borderPosition">
        <!-- Number of questions done -->
        <p class="mb-3 text-3xl font-bold">Zadania</p>
        <div class="mb-4 text-4xl">
            <span class="font-semibold">{{ getAnsweredQuestions }}</span>
            <span class="px-2 text-2xl">na</span>
            <span class="font-semibold">{{ numberOfQuestions }}</span>
        </div>
        <!-- Number of questions done -->

        <!-- Progress bar -->
        <progress
            class="progress-primary progress mb-6 w-full transition-all"
            :value="((getAnsweredQuestions ?? 0) / Number(numberOfQuestions)) * 100"
            max="100"
        ></progress>

        <!-- Questions quick access -->
        <div class="question-quick-access">
            <a
                v-for="index in numberOfQuestions"
                :key="Number(index)"
                :class="{ active: checkIfQuestionHasAnswer(Number(index) - 1) }"
                @click="goToQuestion(Number(index))"
            >
                {{ index }}
            </a>
        </div>
        <!-- Questions quick access -->
    </Sidebar>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/utilities/animations.scss';

.question-quick-access {
    @apply mb-8 grid grid-cols-4 gap-2;

    > a {
        @apply grid aspect-square cursor-pointer place-items-center border border-primary transition-colors rounded-sm;

        &.active {
            @apply bg-primary/40;
        }

        &:hover {
            @apply bg-primary text-white;
        }

        &:focus {
            animation: pulse 150ms ease-in-out;
        }
    }
}

progress::-webkit-progress-value {
    @apply transition-all;
}

@include pulse-animation('pulse', 0.9);
</style>
