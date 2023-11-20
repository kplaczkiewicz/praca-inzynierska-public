<!-- Exam finished show score -->

<script setup lang="ts">
import {
    examTypeFormatted,
    examAnswerType,
    userCurrentExamType,
    openQuestionSolutionsFormattedType,
} from '~/server/types'

const props = defineProps<{
    exam: examTypeFormatted | null | undefined
    openQuestionSolutions: openQuestionSolutionsFormattedType[]
    correctAnswers: examAnswerType[] | null
}>()

// User
const user = useSupabaseUser()

// Get the current exam
const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())

// Get total points
const getTotalPoints = computed(() => {
    let totalPoints = 0
    props.correctAnswers?.forEach((a) => (totalPoints += a.total_points))
    return totalPoints
})

// Get points scored by the user
const getScoredPoints = computed(() => {
    let scoredPoints = 0
    props.correctAnswers?.forEach((a) => (scoredPoints += a.points))
    return scoredPoints
})

// Get points percentage
const pointsPercentage = computed(() => {
    return Math.round((getScoredPoints.value / getTotalPoints.value) * 10000) / 100
})

// If user is logged save the exam to database and reset the current exam in database
if (user.value) {
    // Save to db
    const { data } = await useLazyFetch('/api/user/save-exam', {
        method: 'POST',
        body: {
            user_id: user.value.id,
            title: props.exam?.title,
            date: new Date(),
            score: pointsPercentage.value,
            exam_content: JSON.stringify(props.exam),
            open_question_solutions: JSON.stringify(props.openQuestionSolutions),
            correct_answers: JSON.stringify(props.correctAnswers),
            user_answers: JSON.stringify(userCurrentExam.value),
        },
    })

    if (data.value?.error) {
        console.error(data.value.error);
    }

    // Reset in db
    await useSaveCurrentExam(user.value.id, userCurrentExam.value);
}

// Get correct answers from questions array
function getCorrectAnwers(questionId: number) {
    return props.correctAnswers?.find((e) => e.question_id === questionId) ?? null
}

// Get solutions by question id
function getSolutionsFromQuestionId(questionId: number) {
    return props.openQuestionSolutions.find((e) => e.questionId === questionId)?.solutions
}

// Set background pattern
useSetBackgroundPattern('rhombi-and-squares')
</script>

<template>
    <!-- Exam title -->
    <ExamTitle
        :title="exam?.title"
        subtitle="- koniec egzaminu"
        icon="fa-solid fa-book"
        :date="exam?.date"
        class="from-secondary to-accent"
        :tags="exam?.tags"
    />

    <div class="exam-container exam-finished container">
        <!-- Exam score -->
        <ExamScore :correct-answers="correctAnswers" :time-left="userCurrentExam.time_left" :has-time-limit="userCurrentExam.has_time_limit" />

        <!-- Questions with answers -->
        <QuestionWithAnswer
            v-for="(question, index) in exam?.questions"
            :key="question.question_id"
            :question="question"
            :question-index="index"
            :correct-answers="getCorrectAnwers(question.question_id)"
            :solutions="getSolutionsFromQuestionId(question.question_id)"
        />
        <!-- Questions with answers -->

        <!-- End -->
        <ExamEndButtons label="Koniec zadań" button-label="Więcej arkuszy" button-link="/arkusze" />
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';
</style>
