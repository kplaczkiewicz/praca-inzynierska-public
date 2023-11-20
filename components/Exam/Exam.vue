<!-- Base component for all exams -->
<script setup lang="ts">
import {
    userAnswerType,
    examTypeFormatted,
    userCurrentExamType,
    examAnswerType,
    examStageType,
    openQuestionSolutionsFormattedType,
    openQuestionPointsType,
} from '~/server/types'
// Needed for SSR
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{
    exam: examTypeFormatted | null | undefined
    reset?: boolean
}>()

// User
const user = useSupabaseUser()

// Store the correct answers
const correctAnswers = ref<examAnswerType[] | null>(null)

// Exam end / loading flags
const examStage = ref<examStageType>('in_progress')
const isPending = ref(false)

// Store answers for open qustions
const openQuestionsSolutions = ref<openQuestionSolutionsFormattedType[]>([])

// Store the answers as a cookie for SSR
// Expires makes that the cookie max-age doesn't change
const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())
userCurrentExam.value = userCurrentExam.value || getDefaultAnswers()

// Check if exam is in checking stage (only after refresh)
if (userCurrentExam.value.exam_stage === 'checking') {
    // Go directly to checking
    examFinish()
}

// If exam is finished reset the answers
// Else If new exam is random and the previous one wasnt reset it
// Else force reset
if (
    userCurrentExam.value.exam_stage === 'finished' ||
    (props.exam?.type === '3' && userCurrentExam.value.exam_type === 'normal') ||
    props.reset
) {
    examStage.value = 'in_progress'
    userCurrentExam.value = await getDefaultAnswers()
}

// Get default/empty answers
async function getDefaultAnswers() {
    const answers: userAnswerType[] = []

    props.exam?.questions.forEach((q) => {
        answers.push({
            question_id: q.question_id,
            question_type: q.type,
            answer: '',
        })
    })

    const currentExam : userCurrentExamType = {
        id: uuidv4(),
        exam_id: props.exam!.id,
        exam_title: props.exam!.title,
        answers: answers,
        time_left: props.exam!.time_to_complete,
        exam_stage: 'in_progress',
        exam_type: props.exam!.type === '3' ? 'random' : 'normal',
        has_time_limit: props.exam!.has_time_limit,
        question_ids: props.exam!.type === '3' ? props.exam!.questions.map((q) => q.question_id.toString()) : [],
        tags: props.exam!.tags.map(tag => tag)
    }

    // If user is logged in also save to database
    if (user.value) {
        await useSaveCurrentExam(user.value.id, currentExam);
    }

    return currentExam;
}

// Finish the exam
async function examFinish(openQuestionsUserSolutions?: openQuestionPointsType[]) {
    // Check if there are open questions with answers and they haven't been checked
    const hasOpenQuestions = userCurrentExam.value.answers.some((answer) => answer.question_type === 'open_question')
    const hasOpenQuestionsWithAnswers = userCurrentExam.value.answers.some(
        (answer) => answer.question_type === 'open_question' && answer.answer.length !== 0
    )

    if (hasOpenQuestions && hasOpenQuestionsWithAnswers && !openQuestionsUserSolutions) {
        // Set flags and exit the function
        isPending.value = true
        examStage.value = 'checking'
        userCurrentExam.value.exam_stage = 'checking'

        // Add all the ids to the params
        const getSolutionsParams = new URLSearchParams()
        props.exam?.questions.forEach((question) => {
            if (question.type === 'open_question') {
                getSolutionsParams.append('id', question.question_id.toString())
            }
        })

        // Get the answers from the endpoint
        const { data } = await useFetch(`/api/exam/open-questions-solutions?${getSolutionsParams.toString()}`)

        // Handle error
        if (data.value?.error || !data.value?.question_solutions) {
            // Show modal with error
            showErrorModal('in_progress')
            return
        }

        // Save the answers
        openQuestionsSolutions.value = data.value.question_solutions

        isPending.value = false

        return
    }

    // If the user hadn't answered any open questions set them to 0 points
    if (hasOpenQuestions && !hasOpenQuestionsWithAnswers) {
        const openQuestionsUserSolutionsTemp = <openQuestionPointsType[]>[]

        props.exam?.questions.forEach((q) => {
            if (q.type === 'single_choice') return

            openQuestionsUserSolutionsTemp.push({
                question_id: q.question_id,
                points: 0,
                open_question_explanation: 'no_answer',
            })
        })

        openQuestionsUserSolutions = openQuestionsUserSolutionsTemp
    }

    // Set the flags
    isPending.value = true
    examStage.value = 'finished'

    // Data to send to the endpoint
    const fetchBody: { [key: string]: any } = {
        userCurrentExam: userCurrentExam.value.answers,
    }

    // Add open quesions
    if (openQuestionsUserSolutions) {
        fetchBody.openQuestionsUserSolutions = openQuestionsUserSolutions
    }

    // Send all the answers to endpoint
    const { data } = await useFetch(`/api/exam/check-answers`, {
        method: 'POST',
        body: fetchBody,
    })

    isPending.value = false

    // Handle error
    if (data.value?.error || !data.value?.checked_answers) {
        // Show modal with error
        showErrorModal('in_progress')
        return
    }

    // Store the answers
    correctAnswers.value = data.value.checked_answers

    // Set the flag to reset the answers the next time user enters the exam
    userCurrentExam.value.exam_stage = 'finished'

    // Scroll to top
    if (process.client) window.scrollTo(0, 0)
}

// Show error modal
function showErrorModal(stage: examStageType) {
    const modal = useState('errorModal', () => ref<HTMLDialogElement | null>(null))
    modal.value?.showModal()
    examStage.value = stage
}
</script>

<template>
    <!-- Show when data is loaded -->
    <div v-if="!isPending">
        <!-- Exam in progress -->
        <ExamInProgress :exam="exam" :end-exam="examFinish" v-if="examStage === 'in_progress'" />
        <!-- Exam in progress -->

        <!-- Checking open questions -->
        <ExamChecking
            :exam="exam"
            :open-question-solutions="openQuestionsSolutions"
            :end-exam="examFinish"
            v-else-if="examStage === 'checking'"
        />
        <!-- Checking open questions -->

        <!-- Exam finshed -->
        <ExamFinished
            :exam="exam"
            :open-question-solutions="openQuestionsSolutions"
            :correct-answers="correctAnswers"
            v-else-if="examStage === 'finished'"
        />
        <!-- Exam finshed -->
    </div>
    <!-- Show when data is loaded -->

    <!-- Show loading -->
    <div v-else>
        <ExamCheckingSkeleton v-if="examStage === 'checking'" />
        <ExamFinishedSkeleton v-else-if="examStage === 'finished'" />
    </div>

    <!-- Error modal -->
    <ModalError />
</template>

<style lang="scss">
@import '@/assets/scss/components/exam.scss';
</style>
