<!-- Homepage of the site -->
<script setup lang="ts">
// Get most current exams for the slider
const recentExams = await useLazyFetch(`/api/exam?count=6`)

// Handle error
if (recentExams.data.value?.error) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono arkuszy`, fatal: true })
}

// Get the stats for the stats grid
const examStats = await useLazyFetch(`/api/statistics`)

// Handle error
if (examStats.data.value?.error) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono danych`, fatal: true })
}

// Go to next section in hero
const examsSection = ref<HTMLElement>()
</script>

<template>
    <div class="prose relative max-w-none">
        <!-- Hero -->
        <Hero :arrow-click="() => examsSection?.scrollIntoView({ block: 'start' })" />

        <!-- Exams slider -->
        <div ref="examsSection">
            <ExamsSlider :pending="recentExams.pending.value" :exams="recentExams.data.value?.exams" />
        </div>

        <!-- Questions and exams stats -->
        <StatsGrid :pending="examStats.pending.value" :stats="examStats.data.value?.stats" />

        <!-- Interacitve question showcase -->
        <InteractiveQuestionShowcase />

        <!-- Join us -->
        <JoinUs />
    </div>
</template>

<style lang="scss" scoped>

</style>
