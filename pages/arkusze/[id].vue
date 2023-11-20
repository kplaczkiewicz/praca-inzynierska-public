<!-- Display a quiz form for the exam -->
<script setup lang="ts">
import { userCurrentExamType } from '~/server/types'

// Check for exam id conficts
definePageMeta({
    middleware: 'exam',
})

// Get the route to get the id of the exam
const route = useRoute()

// Get the exam and throw an error if it's not found
const { data, pending } = await useLazyFetch(`/api/exam/${Number(route.params.id)}`)

const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())

// Handle error
if (data.value?.error) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono arkusza: ${route.path}`, fatal: true })
}
</script>

<template>
    <!-- Loading -->
    <div v-if="pending">
        <ExamCheckingSkeleton v-if="userCurrentExam && userCurrentExam.exam_stage === 'checking'" />
        <ExamSkeleton v-else />
    </div>
    
    <!-- Data loaded -->
    <Exam v-else :exam="data?.exam" />
</template>

<style lang="scss" scoped></style>
