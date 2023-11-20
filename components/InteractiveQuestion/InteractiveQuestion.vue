<!-- Main component for interactive questions -->
<script setup lang="ts">
import { interactiveQuestionType } from '~/server/types'

const props = defineProps<{
    interactiveQuestion: interactiveQuestionType
}>()

// Control current step
const currentStep = ref(0)

// Store all steps
const allSteps = ref<HTMLElement[]>([])

// Go to next step
function goToNextStep() {
    currentStep.value++

    // Last step
    if (currentStep.value === props.interactiveQuestion.interactive_content.steps.length) return

    // Scroll newest step into view
    setTimeout(() => {
        const steps = document.querySelectorAll('.interactive-question-step')
        steps[currentStep.value].scrollIntoView({ block: 'start' })
    }, 400)
}

// On whiteboard disable the clip path
const isWhiteboardOpen = useState('is-whiteboard-open', () => false)

// Set background pattern
useSetBackgroundPattern('rhombi-half-empty')
</script>

<template>
    <!-- Header -->
    <InteractiveQuestionTitle
        title="Tryb interaktywny"
        icon="fa-solid fa-chalkboard-user"
        :tags="[
            interactiveQuestion.exam_type.toLowerCase(),
            interactiveQuestion.math_field.toLowerCase(),
            `${interactiveQuestion.points} pkt`,
        ]"
    />

    <!-- Interactive question -->
    <div class="-mt-48 bg-base-400" :class="{ 'inverted-circle': !isWhiteboardOpen }">
        <BackgroundPattern />

        <div class="base-container container relative">
            <div class="prose mx-auto max-w-5xl">
                <!-- Question -->
                <InteractiveQuestionContent :question="interactiveQuestion" />

                <h2 class="mb-12 text-center">
                    <font-awesome-icon
                        icon="fa-solid fa-turn-down"
                        class="-mb-4 mr-5 text-4xl text-primary"
                        flip="horizontal"
                    />
                    Rozwiąż zadanie krok po kroku
                    <font-awesome-icon icon="fa-solid fa-turn-down" class="-mb-4 ml-5 text-4xl text-primary" />
                </h2>

                <div class="question-divider !mb-6 !mt-12 max-w-[90%]"></div>

                <!-- Interactive question content -->
                <div v-for="(step, index) in interactiveQuestion.interactive_content.steps" :key="index">
                    <!-- Only render up to current step -->
                    <Step
                        class="interactive-question-step"
                        :step="step"
                        :index="index"
                        :next-step="goToNextStep"
                        :is-last="index === interactiveQuestion.interactive_content.steps.length - 1"
                        ref="allSteps"
                        v-if="index <= currentStep"
                    />
                    <div class="question-divider !mb-6 !mt-12 max-w-[60%]" v-if="index + 1 <= currentStep"></div>
                </div>
                <!-- Interactive question content -->

                <!-- Finish question -->
                <ExamEndButtons
                    label="Koniec rozwiązywania"
                    button-label="Więcej zadań"
                    button-link="/cwiczenie"
                    v-if="currentStep === interactiveQuestion.interactive_content.steps.length"
                />
            </div>
        </div>
        <!-- Interactive question -->
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';

.inverted-circle {
    clip-path: ellipse(220% 100% at 50% 100%);
}
</style>
