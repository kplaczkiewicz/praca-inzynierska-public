<!-- Display user exam history -->
<script setup lang="ts">
const props = defineProps<{
    exams: {
        score: string;
        id: number;
        title: string;
        date: Date;
    }[]
}>()

// Format date
function formatDate(date : Date) {
    // Format the date
    const dateFormatter = Intl.DateTimeFormat('pl-PL', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    })

    return dateFormatter.format(date) + 'r.';
}

// Color helper
const colorThemes = ['accent', 'primary', 'secondary']
</script>

<template>
    <!-- Last exams in chronological order -->
    <div class="flex flex-col">
        <ExamCardCompact
            class="mb-6 border-b-2 border-t-neutral/30 pb-6"
            :title="exam.title"
            :small-text="formatDate(new Date(exam.date))"
            small-text-icon="fa-solid fa-calendar"
            progress-label="Wynik:"
            :progress-value="exam.score"
            :progress-value-label="exam.score + '%'"
            :button-link="`/arkusze/przegladaj/${exam.id}`"
            button-text="Przeglądaj"
            :colorTheme="colorThemes[index % 3]"
            :key="exam.id"
            v-for="(exam, index) in exams"
        />
    </div>
    <!-- Last exams in chronological order -->

    <!-- Pagination -->
    <div class="mt-6 hidden text-center">
        <PaginateData :current-page="1" :last-page="6" :change-page="() => {}" />
    </div>
</template>

<style scoped></style>
