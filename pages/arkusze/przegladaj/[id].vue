<!-- Display a user previous exam -->
<script setup lang="ts">
import { examAnswerType, examTypeFormatted, openQuestionSolutionsFormattedType, userCurrentExamType } from '~/server/types';

// Check if the user is authorized
definePageMeta({
    middleware: 'authorized',
})

// Get the route to get the id of the exam
const route = useRoute()

// Set all the data to display the exam
const exam = ref<examTypeFormatted | null>(null)
const openQuestionSolutions = ref<openQuestionSolutionsFormattedType[] | null>(null)
const correctAnswers = ref<examAnswerType[] | null>(null)
const userAnswers = ref<userCurrentExamType | null>(null)

// Get the exam
const { data, pending } = await useLazyFetch(`/api/user/saved-exam/${Number(route.params.id)}`)

// Handle error
if (data.value?.error) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono arkusza: ${route.path}`, fatal: true })
}

// Set all the values from the db
if (data.value?.exam) {
    exam.value = JSON.parse(data.value.exam.exam_content) as examTypeFormatted
    openQuestionSolutions.value = JSON.parse(data.value.exam.open_question_solutions) as openQuestionSolutionsFormattedType[]
    correctAnswers.value = JSON.parse(data.value.exam.correct_answers) as examAnswerType[]
    userAnswers.value = JSON.parse(data.value.exam.user_answers) as userCurrentExamType
}

// Set all the values from the db
watch(data, (newData) => {
    if (newData?.exam) {
        exam.value = JSON.parse(newData.exam.exam_content) as examTypeFormatted
        openQuestionSolutions.value = JSON.parse(newData.exam.open_question_solutions) as openQuestionSolutionsFormattedType[]
        correctAnswers.value = JSON.parse(newData.exam.correct_answers) as examAnswerType[]
        userAnswers.value = JSON.parse(newData.exam.user_answers) as userCurrentExamType
    }
})

// Get correct answers from questions array
function getCorrectAnwers(questionId: number) {
    return correctAnswers.value?.find((e) => e.question_id === questionId) ?? null
}

// Get solutions by question id
function getSolutionsFromQuestionId(questionId: number) {
    return openQuestionSolutions.value?.find((e) => e.questionId === questionId)?.solutions
}

// Set background pattern
useSetBackgroundPattern('rhombi-and-squares')
</script>

<template>
    <div class="relative">
        <!-- Loading -->
        <ExamFinishedSkeleton v-if="pending" />
    
        <!-- Data loaded -->
        <div v-else-if="exam && openQuestionSolutions && correctAnswers && userAnswers">
            <!-- Exam title -->
            <ExamTitle
                :title="exam.title"
                icon="fa-solid fa-book"
                :date="exam?.date"
                class="from-secondary to-accent"
                :tags="exam?.tags"
            />

            <div class="exam-container exam-finished container">
                <!-- Exam score -->
                <ExamScore :correct-answers="correctAnswers" :time-left="userAnswers.time_left" :has-time-limit="userAnswers.has_time_limit" />

                <!-- Questions with answers -->
                <QuestionWithAnswer
                    v-for="(question, index) in exam.questions"
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
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';
</style>
