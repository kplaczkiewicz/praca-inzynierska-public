<!-- Checking and marking open questions -->

<script setup lang="ts">
import useSetBackgroundPattern from '~/composables/useSetBackgroundPattern';
import OpenQuestionChecking from '../Question/Open/OpenQuestionChecking.vue'
import {
    examTypeFormatted,
    userCurrentExamType,
    openQuestionSolutionsFormattedType,
    openQuestionPointsType,
    openQuestionExplanationType,
} from '~/server/types'

const props = defineProps<{
    exam: examTypeFormatted | null | undefined
    openQuestionSolutions: openQuestionSolutionsFormattedType[]
    endExam: (openQuestionsUserSolutions?: openQuestionPointsType[]) => Promise<void>
}>()

// Checking end modal
const checkingEndModal = useState('checkingEndModal', () => ref<HTMLDialogElement | null>(null))

// Get the current exam
const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())

// Store all questions as refs to get their points
const openQuestions = ref<InstanceType<typeof OpenQuestionChecking>[]>()

// Finish checking the options
function finishChecking() {
    const openQuestionsUserSolutions = <openQuestionPointsType[]>[]

    openQuestions.value?.forEach((q) => {
        const questionId = q.$props.question.question_id
        const userAnswers = getUserAnswersFromQuestionId(questionId)
        // If there are no answers set 'no_answer'
        let questionExplanation: openQuestionExplanationType | 'no_answer' = 'no_answer'

        // If there are answers add them
        if (userAnswers?.length) {
            questionExplanation = {
                solution: q.isUserOwnScoring ? 'own_scoring' : q.currentSolution,
                selectedQuestions: q.selectedQuestionCheckboxes,
                explanations: getSolutionsFromQuestionId(questionId)![q.currentSolution].questions.map(
                    (q) => q.explanation
                ),
            }
        }

        openQuestionsUserSolutions.push({
            question_id: questionId,
            points: q.points,
            open_question_explanation: questionExplanation,
        })
    })

    // Go to finish
    props.endExam(openQuestionsUserSolutions)
}

// Get a user answer from userCurrentExam by question id
function getUserAnswersFromQuestionId(questionId: number) {
    return userCurrentExam.value.answers?.find((e) => e.question_id === questionId)?.answer
}

// Get solutions by question id
function getSolutionsFromQuestionId(questionId: number) {
    return props.openQuestionSolutions.find((e) => e.questionId === questionId)?.solutions
}

// Get only the open questions from all the questions
const getOnlyOpenQuesions = computed(() => {
    return props.exam?.questions.filter((question) => question.type === 'open_question')
})

// Scroll to top
onMounted(() => {
    if (process.client) {
        window.scrollTo(0, 0)
    }
})

// Set background pattern
useSetBackgroundPattern('dots-empty')
</script>

<template>
    <!-- Exam title -->
    <ExamTitle
        :title="exam?.title"
        subtitle="- sprawdzanie zadań otwartych"
        :date="exam?.date"
        icon="fa-solid fa-book"
        class="from-accent to-secondary"
        :tags="exam?.tags"
    />

    <div class="exam-container exam-finished container">
        <div class="prose max-w-none text-center relative">
            <h2 class="mb-8 text-3xl">
                <font-awesome-icon icon="fa-solid fa-circle-check" class="-mb-1 mr-4 text-4xl text-primary" />
                Twoje odpowiedzi zostały zapisane
                <font-awesome-icon icon="fa-solid fa-circle-check" class="-mb-1 ml-4 text-4xl text-primary" />
            </h2>

            <h2 class="mb-14">
                <font-awesome-icon
                    icon="fa-solid fa-arrow-turn-down"
                    class="-mb-2.5 mr-4 text-3xl text-accent"
                    flip="horizontal"
                />
                Punktacja zadań otwartych
                <font-awesome-icon icon="fa-solid fa-arrow-turn-down" class="-mb-2.5 ml-4 text-3xl text-accent" />
            </h2>
        </div>

        <!-- Exam checking component -->
        <OpenQuestionChecking
            v-for="(question, index) in getOnlyOpenQuesions"
            ref="openQuestions"
            :key="question.question_id"
            :question="question"
            :question-index="index"
            :user-answers="getUserAnswersFromQuestionId(question.question_id)"
            :solutions="getSolutionsFromQuestionId(question.question_id)"
        />

        <!-- Finish checking -->
        <LargeButton
            text="Zakończ sprawdzanie"
            icon="fa-solid fa-flag-checkered"
            @click="checkingEndModal?.showModal()"
            class="btn-accent"
        ></LargeButton>
    </div>

    <!-- Modal to show at the end -->
    <ModalFinishChecking :on-finish-checking="finishChecking" />
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';
</style>
