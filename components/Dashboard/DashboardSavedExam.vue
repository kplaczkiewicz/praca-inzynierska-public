<!-- Show user saved exam -->
<script setup lang="ts">
// Get current exam
const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())

// Get number of answered questions
const getAnsweredQuestions = computed(() => {
    return userCurrentExam.value.answers?.filter((e) => e.answer !== '' && e.answer.length !== 0).length
})

// Get percentage of answered questions
const examPercentage = computed(() => {
    return Math.round((Number(getAnsweredQuestions.value) / Number(userCurrentExam.value.answers.length)) * 10000) / 100
})

// Return formatted time
const formattedTime = computed(() => {
    return useFormatTime(userCurrentExam.value.time_left)
})
</script>

<template>
    <div class="mx-auto mb-10 max-w-3xl text-center">
        <h2 class="mb-3.5 mt-0 border-b-2 pb-3.5 text-left">
            <font-awesome-icon icon="fa-solid fa-cloud" class="mr-3 text-primary" />
            Zapisany arkusz:
        </h2>

        <ExamCardCompact
            :title="userCurrentExam.exam_title"
            :small-text="
                userCurrentExam.has_time_limit
                    ? `${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`
                    : 'Brak limitu'
            "
            small-text-icon="fa-solid fa-hourglass-half"
            progress-label="Postęp:"
            :progress-value="examPercentage"
            :progress-value-label="examPercentage + '%'"
            :button-link="
                userCurrentExam.exam_type === 'normal' ? `/arkusze/${userCurrentExam.exam_id}` : '/zadania/rozwiazuj'
            "
            button-text="Kontynuuj"
            colorTheme="accent"
            v-if="userCurrentExam"
        />

        <div v-else>
            <h3 class="my-7 text-2xl">Brak zapisanego arkusza!</h3>
            <div class="flex justify-center gap-4">
                <NuxtLink class="btn btn-primary btn-wide" to="/arkusze">
                    <font-awesome-icon icon="fa-solid fa-graduation-cap" class="mb-0.5 mr-1 text-lg" />
                    Rozwiązuj arkusze
                </NuxtLink>

                <NuxtLink class="btn btn-secondary btn-wide" to="/zadania/losuj">
                    <font-awesome-icon icon="fa-solid fa-square-poll-vertical" class="mr-1 text-lg" />
                    Rozwiązuj zadania
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
