<!-- Exam in progress -->

<script setup lang="ts">
import useSaveCurrentExam from '~/composables/useSaveCurrentExam';
import { examTypeFormatted, userCurrentExamType } from '~/server/types'

const props = defineProps<{
    exam: examTypeFormatted | null | undefined
    endExam: () => Promise<void>
}>()

// User
const user = useSupabaseUser()

// Get exam from the cookie
const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())

// Exam end modal
const examEndModal = useState('examEndModal', () => ref<HTMLDialogElement | null>(null))

// Control time pause/play
const isPaused = ref(false)

function pauseTime() {
    isPaused.value = !isPaused.value
}
provide('pauseTime', pauseTime)

// Select an answer
async function selectAnswer(questionId: number, answer: string | string[]) {
    // Get array index
    const index = userCurrentExam.value.answers.findIndex((e) => e.question_id === questionId)

    // Store answer
    userCurrentExam.value.answers[index].answer = answer

    // If user is logged in also save to database
    if (user.value) {
        await useSaveCurrentExam(user.value.id, userCurrentExam.value);
    }
}
// Make this function accessible to all children
provide('selectAnswer', selectAnswer)

// Finish the exam
function finishExam() {
    // Clear the coundown
    // In case of error the countdown will resume automaticaly
    timeCountdown.pause()

    // Call function in main exam component
    props.endExam()
}

// Get an answer from userCurrentExam by question id
function getAnswerFromQuestionId(questionId: number) {
    return userCurrentExam.value.answers?.find((e) => e.question_id === questionId)?.answer
}

// Get number of unanswered questions
const getUnAnsweredQuestions = computed(() => {
    return userCurrentExam.value.answers?.filter((e) => e.answer === '' || e.answer.length === 0).length
})

// Check if there are answers for open questions
const hasOpenQuestionsWithAnswers = computed(() => {
    return userCurrentExam.value.answers.some(
        (answer) => answer.question_type === 'open_question' && answer.answer.length !== 0
    )
})

// Count down time
const timeCountdown = useIntervalFn(() => {
    // If time runs out finish the exam
    if (userCurrentExam.value.time_left === 0) {
        timeCountdown.pause()
        props.endExam()

        // If overflow hidden enable it
        const bodyOverflowHidden = useState('overflowHidden', () => false)
        if (bodyOverflowHidden.value === true) {
            bodyOverflowHidden.value = false
        }

        // Show time expired modal
        const modal = useState('timeExpiredModal', () => ref<HTMLDialogElement | null>(null))
        modal.value?.showModal()

        // Hide modal after 3s
        setTimeout(() => {
            modal.value?.close()
        }, 3000)
    } else if (!isPaused.value && userCurrentExam.value.has_time_limit) {
        // Refresh cookie every second
        userCurrentExam.value.time_left--
    }
}, 1000)

// Disable scroll on overlay
const bodyOverflowHidden = useState('overflowHidden', () => false)

watchEffect(() => {
    bodyOverflowHidden.value = isPaused.value
})

// Set background pattern
useSetBackgroundPattern('squares-half-empty')
</script>

<template>
    <!-- Exam title -->
    <ExamTitle
        :title="exam?.title"
        :date="exam?.date"
        :is-finished="false"
        class="from-primary to-accent"
        icon="fa-solid fa-book"
        :tags="exam?.tags"
    />

    <div class="exam-container container">
        <!-- Left sidebar -->
        <ExamProgress
            :borderPosition="'right'"
            :userCurrentExam="userCurrentExam.answers"
            :numberOfQuestions="exam?.questions.length"
        />
        <!-- Left sidebar -->

        <!-- Main exam container -->
        <div>
            <!-- Questions -->
            <Question
                v-for="(question, index) in exam?.questions"
                :key="question.question_id"
                :question="question"
                :question-index="index"
                :selectedAnswer="getAnswerFromQuestionId(question.question_id)"
            />
            <!-- Questions -->

            <!-- Finish exam button -->
            <LargeButton
                :text="hasOpenQuestionsWithAnswers ? 'Sprawdź odpowiedzi' : 'Zakończ rozwiązywanie'"
                :icon="hasOpenQuestionsWithAnswers ? 'fa-solid fa-pencil' : 'fa-solid fa-flag-checkered'"
                @click="examEndModal?.showModal()"
                class="btn-accent"
            ></LargeButton>
        </div>
        <!-- Main exam container -->

        <!-- Right sidebar -->
        <ExamTimeLeft
            :borderPosition="'left'"
            :time-left="userCurrentExam.time_left"
            :is-paused="isPaused"
            :has-time-limit="userCurrentExam.has_time_limit"
        />
        <!-- Right sidebar -->
    </div>

    <!-- Time expired modal -->
    <ModalTimeExpired />

    <!-- Time paused overlay -->
    <TransitionWrapper name="fade">
        <OverlayTimePause :time-left="userCurrentExam.time_left" v-if="isPaused" />
    </TransitionWrapper>
    <!-- Time paused overlay -->

    <!-- Modal to show at the end -->
    <ModalExamFinish
        :unansweredQuestions="getUnAnsweredQuestions"
        :on-end-exam="finishExam"
        :time-left="userCurrentExam.time_left"
        :next-text="hasOpenQuestionsWithAnswers ? 'Przejdź do sprawdzania' : 'Przejdź do wyników'"
        :has-time-limit="userCurrentExam.has_time_limit"
    />
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';
</style>
