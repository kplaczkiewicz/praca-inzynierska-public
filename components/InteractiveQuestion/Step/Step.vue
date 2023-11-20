<!-- Interactive question step -->
<script setup lang="ts">
import { interactiveContentStepType, interactiveFillInType, interactiveSingleChoiceType } from '~/server/types'

const props = defineProps<{
    step: interactiveContentStepType
    index: number
    isLast: boolean
    nextStep: () => void
}>()

// Show buttons
const showExplanationButton = ref(false)
const showGoNextButton = ref(false)
const controlButtons = ref<HTMLElement>()
const isCorrect = ref(true)
const buttonsKey = ref(0)

function toggleButtons(isAnswerCorrect: boolean) {
    showExplanationButton.value = true
    showGoNextButton.value = true
    isCorrect.value = isAnswerCorrect

    // Update buttons manually
    buttonsKey.value++

    // Scroll buttons into view
    setTimeout(() => {
        controlButtons.value?.scrollIntoView({ block: 'start' })

        // If last show finish
        if (props.isLast) {
            props.nextStep()
        }
    }, 400)
}

// Go to the next step
function goToNextStep() {
    props.nextStep()

    // Hide go next button
    showGoNextButton.value = false
}

// Control whiteboard
const whiteboard = ref(false)

// Disable clip path in question
const isWhiteboardOpen = useState('is-whiteboard-open', () => false)
watchEffect(() => {
    isWhiteboardOpen.value = whiteboard.value
})

// Transform question for the whiteboard
const questionWhiteboard = useTransformQuestionCanvas(props.step, 'step')

// Show image from the whiteboard
const canvasImage = useState(`interactive-question-${props.index}-step-${props.step.index}`, () => '')
const canvasImageExpand = ref(false)

// Render math
const mathQuestion = ref<HTMLElement>()
const mathAnnotation = ref<HTMLElement>()

const { renderMath, addMathClasses } = useDisplayMath()
onMounted(() => {
    renderMath()
    addMathClasses([mathQuestion.value, mathAnnotation.value])
})

// Helper for color classes
const colorVariants = useColorVariants()

// Disable scroll on overlay
const bodyOverflowHidden = useState('overflowHidden', () => false)

watchEffect(() => {
    bodyOverflowHidden.value = whiteboard.value
})
</script>

<template>
    <div>
        <div :style="`--variant: var(--${colorVariants[index % 3]})`">
            <span class="question-title"> Krok {{ index + 1 }}. </span>

            <!-- Step question -->
            <p class="math-content !my-0" v-if="step.annotation" ref="mathAnnotation">{{ step.annotation }}</p>

            <!-- Image -->
            <img
                class="mx-auto mb-10 mt-8 rounded shadow"
                :src="step.image_url"
                :alt="`Zdjęcie pomocnicze do kroku nr ${step.index}`"
                v-if="step.image_url"
            />
            <!-- Image -->

            <!-- Step question -->
            <p class="math-content !mt-3" ref="mathQuestion">
                <font-awesome-icon icon="fa-solid fa-circle-info" class="mr-0.5" />
                {{ step.question }}
            </p>

            <!-- Step single choice question -->
            <StepSingleChoice
                :single-choice-content="(step.content as interactiveSingleChoiceType)"
                :hint="step.hint"
                :index="index"
                :on-finish="toggleButtons"
                v-if="step.type === 'single_choice'"
            />

            <!-- Step fill in -->
            <StepFillIn
                :answers="(step.content as interactiveFillInType).correct_answers"
                :on-finish="toggleButtons"
                v-else-if="step.type === 'fill_in'"
            />

            <!-- Canvas image -->
            <div class="my-10" v-if="canvasImage">
                <p class="text-lg font-semibold">
                    <font-awesome-icon icon="fa-solid fa-chalkboard" class="-mb-px mr-1.5 text-2xl text-accent" />
                    Zapiski z tablicy:
                </p>
                <div class="relative cursor-pointer transition-all duration-300" :class="canvasImageExpand ? 'max-w-full' : 'max-w-[300px]'" @click="canvasImageExpand = !canvasImageExpand">
                    <img
                        class="m-0 rounded border-2 border-neutral shadow  "
                        :src="canvasImage"
                        :alt="`Zapiski z tablicy do kroku ${step.index}`"
                        
                    />

                    <div class="absolute inset-0 bg-neutral/20 rounded grid place-items-center opacity-0 transition-opacity hover:opacity-100">
                        <font-awesome-icon icon="fa-solid fa-minimize" class="text-5xl text-primary" v-if="canvasImageExpand" />
                        <font-awesome-icon icon="fa-solid fa-maximize" class="text-5xl text-primary" v-else />
                    </div>
                </div>
            </div>
            <!-- Canvas image -->

            <!-- Step controls -->
            <div ref="controlButtons">
                <StepControls
                    :is-last="isLast"
                    :is-correct="isCorrect"
                    :hint="step.hint"
                    :explanation="step.explanation"
                    :helpful-links="step.helpful_links"
                    :next-step="goToNextStep"
                    :show-go-next-button="showGoNextButton && !isLast"
                    :show-explanation-button="showExplanationButton"
                    :toggleWhiteboard="() => (whiteboard = !whiteboard)"
                    :key="buttonsKey"
                />
            </div>
            <!-- Step controls -->
        </div>

        <!-- Drawing canvas -->
        <TransitionWrapper name="fade" class="z-[1200] w-full">
            <Whiteboard
                :question="questionWhiteboard"
                :toggle-whiteboard="() => (whiteboard = !whiteboard)"
                :image-state-name="`interactive-question-${index}-step-${step.index}`"
                v-if="whiteboard"
            />
        </TransitionWrapper>
        <!-- Drawing canvas -->
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';

.question-title {
    @apply mb-4 pl-1 text-[24px];

    &::before {
        @apply top-5 w-[155px];
    }
}
</style>
