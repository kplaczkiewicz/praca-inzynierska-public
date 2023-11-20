<!-- Display questions generated from /losuj -->
<script setup lang="ts">
import { examTypeFormatted, userCurrentExamType } from '~/server/types'

// Prevent from acessing page without the exam set
definePageMeta({
    middleware: 'random-questions',
})

// Exam info
const examTitle = ref('')
const examTags = ref<string[]>([])

// Time limit and num of questions
const timeLimit = ref(-1)
const numOfQuestions = ref('')

// Question IDs to query
const quesionIDs = ref<string[]>([])

// Reset exam
const resetExam = ref(false)

// If there is a url query pull the data from query params (new exam)
const route = useRoute()

if (route.query.question_ids) resetExam.value = true;

if (resetExam.value) {
    numOfQuestions.value = route.query.num_of_questions?.toString() ?? '20'
    quesionIDs.value = route.query.question_ids?.toString().split(',') ?? []
    
    // Set exam title from url
    examTitle.value = `Zadania zamknięte - ${numOfQuestions.value} zadań`

    // Time limit in seconds
    timeLimit.value = Number(route.query.time_limit) ?? -1

    // Set the tags
    examTags.value = route.query.tags?.toString().split(',') ?? []
}

// Get current exam
const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())

// Check if there is a random exam in progress (existing exam)
if (
    !resetExam.value &&
    userCurrentExam.value &&
    userCurrentExam.value.exam_type === 'random' &&
    userCurrentExam.value.question_ids.length
) {
    // Set question ids and exam title from cookies
    quesionIDs.value = userCurrentExam.value.question_ids
    examTitle.value = userCurrentExam.value.exam_title
    timeLimit.value = userCurrentExam.value.has_time_limit ? userCurrentExam.value.time_left : -1
    examTags.value = userCurrentExam.value.tags
}

// Query the questions
const { data, pending } = await useLazyFetch('/api/question', {
    query: {
        question_ids: quesionIDs,
    },
    watch: false,
})

// Handle error
if (data.value?.error) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono pytań`, fatal: true })
}

// Set date as todays date
const dateFormatter = Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
})

// Create exam object to pass to Exam component
const exam = ref<examTypeFormatted>({
    id: 0,
    title: examTitle.value,
    time_to_complete: timeLimit.value === -1 ? 3600 : timeLimit.value,
    type: '3',
    date: dateFormatter.format(new Date()),
    has_time_limit: timeLimit.value !== -1,
    questions: data.value?.questions ?? [],
    tags: examTags.value
})
console.log(exam.value)

// In case the data hasnt loaded
watch(data, (newData) => {
    if (newData?.questions) {
        exam.value.questions = newData.questions
    }
})

// Remove query string from url
if (process.client) {
    const baseURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
    history.replaceState({}, document.title, baseURL);
}

// Set background pattern
useSetBackgroundPattern('squares')
</script>

<template>
    <!-- Loading -->
    <ExamSkeleton v-if="pending || !data?.questions" />

    <!-- Data loaded -->
    <Exam v-else :exam="exam" :reset="resetExam" />
</template>

<style scoped></style>
