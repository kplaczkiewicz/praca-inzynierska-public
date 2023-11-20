<!-- User dashboard -->
<script setup lang="ts">
import { userCurrentExamType } from '~/server/types'

definePageMeta({
    middleware: 'authorized',
})

// Supabase composables
const user = useSupabaseUser()

// Get user stats
const { data : statsData, pending : statsPending } = useLazyFetch(`/api/user/statistics?user_id=${user.value!.id}`)

// Handle error
if (statsData.value?.error) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono danych`, fatal: true })
}

// Get user previous exams
const { data : examData, pending : examPending } = useLazyFetch(`/api/user/user-exams?user_id=${user.value!.id}`)

// Handle error
if (examData.value?.error) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono danych`, fatal: true })
}

// Set background pattern
useSetBackgroundPattern('dots-random-size-primary')
</script>

<template>
    <div class="base-container container relative">
        <div class="prose mx-auto max-w-6xl">
            <!-- Hello user -->
            <DashboardHello />
            <!-- Hello user -->

            <div class="dashboard-divider divider"></div>

            <!-- Current exam -->
            <DashboardSavedExam />
            <!-- Current exam -->

            <div class="dashboard-divider divider"></div>

            <!-- User simple stats -->
            <div class="mb-12 text-center">
                <h2 class="mb-12 mt-0 text-4xl">
                    <font-awesome-icon icon="fa-solid fa-bars-staggered" class="-mb-1.5 mr-3 text-5xl text-secondary" />
                    Twoje statystyki
                </h2>

                <!-- Loading -->
                <UserStatsSkeleton :quantity="2" v-if="statsPending" />

                <div v-else-if="statsData?.user_stats">
                    <!-- Last 30 days -->
                    <DashboardStat title="Ostatnie 30 dni:" icon="fa-regular fa-calendar-days" :solved-exams="statsData.user_stats.recent_data.exam_count" :average-score="statsData.user_stats.recent_data.average_score" :passed-exams="statsData.user_stats.recent_data.passed_count" color-theme="primary"/>
    
                    <!-- All stats -->
                    <DashboardStat title="Od początku:" icon="fa-solid fa-globe" :solved-exams="statsData.user_stats.all_data.exam_count" :average-score="statsData.user_stats.all_data.average_score" :passed-exams="statsData.user_stats.all_data.passed_count" color-theme="accent"/>
                </div>
            </div>
            <!-- User simple stats -->

            <div class="dashboard-divider divider"></div>

            <!-- User exam history -->
            <div class="mx-auto max-w-3xl">
                <h2 class="mb-14 mt-0 text-center text-4xl">
                    <font-awesome-icon
                        icon="fa-solid fa-clock-rotate-left"
                        class="-mb-1.5 mr-3 text-5xl text-primary"
                    />
                    Ostatnio rozwiązane
                </h2>

                <!-- Loading -->
                <ExamHistorySkeleton :quantity="6" v-if="examPending" />
                
                <!-- Dashboard history -->
                <div v-else-if="examData?.user_exams">
                    <DashboardHistory :exams="examData.user_exams" />
                </div>
            </div>
            <!-- User exam history -->
        </div>
    </div>
</template>

<style scoped lang="scss">
.dashboard-divider {
    @apply mx-auto my-9 max-w-[90%] before:bg-neutral/60 after:bg-neutral/60;
}
</style>
