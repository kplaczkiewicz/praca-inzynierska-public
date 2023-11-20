<!-- Scoring of open questions by assiging points -->
<script setup lang="ts">
import { questionType } from '~/server/types'

const props = defineProps<{
    question: questionType
}>()

// Control points with state
const points = useState(`points-question-${props.question.question_number}`, () => 0)

// Helper for color classes
const colorVariants = useColorVariants()
</script>

<template>
    <p class="mb-4">
        <font-awesome-icon icon="fa-solid fa-circle-question" class="mr-1 text-lg" />
        Jeśli masz problemy z przyznaniem punktów, lub twoja metoda nie jest zawarta w pytaniach, możesz przydzielić
        sobie samodzielnie punkty.
    </p>

    <!-- Assign points -->
    <div class="grid grid-cols-3 gap-4 mb-12">
        <div
            v-for="point in question.points + 1"
            :key="point - 1"
            class="toggle-radio radio-large"
            :class="[
                points === (point - 1) ? 'active' : '',
            ]"
            :style="`--variant: var(--${colorVariants[(point - 1) % 3]})`"
        >
            <label>
                <input
                    type="radio"
                    name="radio-points"
                    :value="point - 1"
                    :checked="points === (point - 1)"
                    v-model="points"
                />
                <span class="font-semibold">{{ point - 1 }} pkt</span>
            </label>
        </div>
    </div>
    <!-- Assign points -->
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';
@import '@/assets/scss/components/toggle-radio.scss';

</style>
