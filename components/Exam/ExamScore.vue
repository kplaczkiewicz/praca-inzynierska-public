<!-- Exam score details -->
<script setup lang="ts">
import { examAnswerType } from '~/server/types'

const props = defineProps<{
    correctAnswers: examAnswerType[] | null
    timeLeft: number
    hasTimeLimit: boolean
}>()

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

// Get correct icon according to the score
const starIconScore = computed(() => {
    if (pointsPercentage.value > 66) return 'fa-solid fa-star'
    else if (pointsPercentage.value > 30) return 'fa-regular fa-star-half-stroke'
    else return 'fa-regular fa-star'
})

// Return formatted time
const formattedTime = computed(() => {
    return useFormatTime(props.timeLeft)
})
</script>

<template>
    <div class="prose mb-12 max-w-none text-center relative">
        <h1>
            <font-awesome-icon icon="fa-solid fa-arrow-turn-down" class="-mb-2 mr-5 text-secondary" flip="horizontal" />
            Twój wynik
            <font-awesome-icon icon="fa-solid fa-arrow-turn-down" class="-mb-2 ml-5 text-secondary" />
        </h1>

        <!-- Stats -->
        <div class="stats shadow border border-base-content/30">
            <div class="stat border-base-content/30">
                <div class="stat-title">
                    <font-awesome-icon icon="fa-regular fa-square-check" class="mr-2 text-primary" />Wynik punktowy
                </div>
                <div class="stat-value">{{ getScoredPoints }} / {{ getTotalPoints }}</div>
                <div class="stat-desc">pkt</div>
            </div>

            <div class="stat border-base-content/30">
                <div class="stat-title">
                    <font-awesome-icon :icon="starIconScore" class="mr-2 text-secondary" />Wynik procentowy
                </div>
                <div class="stat-value">{{ pointsPercentage }}%</div>
                <div class="stat-desc">
                    <span v-if="pointsPercentage < 30">
                        <font-awesome-icon icon="fa-regular fa-face-sad-tear" class="mr-1 text-secondary" />Egzamin
                        niezdany
                    </span>
                    <span v-else>
                        <font-awesome-icon icon="fa-regular fa-face-laugh-beam" class="mr-1 text-secondary" />Egzamin
                        zdany
                    </span>
                </div>
            </div>

            <div class="stat border-base-content/30" v-if="hasTimeLimit">
                <div class="stat-title">
                    <font-awesome-icon icon="fa-regular fa-clock" class="mr-2 text-accent" />Pozostały czas
                </div>
                <div class="stat-value">
                    {{ formattedTime.hours }} : {{ formattedTime.minutes }} : {{ formattedTime.seconds }}
                </div>
                <div class="stat-desc">h : min : s</div>
            </div>
        </div>
        <!-- Stats -->

        <h2>
            <font-awesome-icon icon="fa-solid fa-turn-down" class="-mb-1 mr-4 text-secondary" flip="horizontal" />
            Sprawdź swoje odpowiedzi
            <font-awesome-icon icon="fa-solid fa-turn-down" class="-mb-1 ml-4 text-secondary" />
        </h2>

        <div class="divider mx-auto mt-10 max-w-[85%] before:bg-neutral/50 after:bg-neutral/50"></div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';
</style>
