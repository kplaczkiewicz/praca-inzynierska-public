<!-- Display user exam stats -->
<script setup lang="ts">
const props = defineProps<{
    title: string
    icon: string
    solvedExams: number
    averageScore: number
    passedExams: number
    colorTheme: string
}>()

const passedPercentage = computed(() => {
    return Math.round((props.passedExams / props.solvedExams) * 100)
})
</script>

<template>
    <h3 class="mb-4">
        <font-awesome-icon :icon="icon" class="mr-1.5 -mb-px text-2xl" :class="`text-${colorTheme}`" />
        {{ title }}
    </h3>

    <div class="stats border border-base-content/30 shadow">
        <div class="stat border-base-content/30">
            <div class="stat-title">
                <font-awesome-icon icon="fa-solid fa-list" class="mr-1.5" :class="`text-${colorTheme}`" />
                Rozwiązane arkusze
            </div>
            <div class="stat-value">{{ solvedExams }}</div>
        </div>

        <div class="stat border-base-content/30">
            <div class="stat-title">
                <font-awesome-icon icon="fa-solid fa-brain" class="mr-1.5" :class="`text-${colorTheme}`" />
                Średni wynik
            </div>
            <div class="stat-value">{{ averageScore }}%</div>
        </div>

        <div class="stat border-base-content/30">
            <div class="stat-title">
                <font-awesome-icon icon="fa-solid fa-graduation-cap" class="mr-1.5" :class="`text-${colorTheme}`" />
                Zdane egzaminy
            </div>
            <div class="stat-value">{{ passedExams }} / {{ solvedExams }}</div>
        </div>

        <div class="stat border-base-content/30">
            <div class="stat-title">
                <font-awesome-icon icon="fa-solid fa-square-check" class="mr-1.5" :class="`text-${colorTheme}`" />
                Zdawalność
            </div>
            <div class="stat-value">{{ passedPercentage }}%</div>
        </div>
    </div>
</template>

<style scoped></style>
