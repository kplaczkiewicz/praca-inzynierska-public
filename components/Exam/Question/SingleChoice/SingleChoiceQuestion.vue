<!-- Component for single choice question answers -->
<script setup lang="ts">
import { questionType } from '~/server/types'

const props = defineProps<{
    question: questionType
    selectedAnswer: string | string[] | undefined
    questionIndex: number
}>()

// Get select answer function from parent component
const selectAnswer = inject<(questionId: number, answer: string | string[]) => void>('selectAnswer', () => {})

// Toggle drawing canvas
const whiteboard = ref(false)

// Transform question for the whiteboard
const questionWhiteboard = useTransformQuestionCanvas(props.question, 'question');

// Helper for color classes
const colorVariants = useColorVariants()

// Disable scroll on overlay
const bodyOverflowHidden = useState('overflowHidden', () => false)

watchEffect(() => {
    bodyOverflowHidden.value = whiteboard.value
})

// Render math
const mathAnswers = ref<HTMLElement[]>([]);
const { renderMath, addMathClasses } = useDisplayMath();
onMounted(() => {
    renderMath()
    addMathClasses(mathAnswers.value)
})
</script>

<template>
    <!-- Single choice question answers -->
    <div class="single-choice-wrapper">
        <div
            class="single-choice-answer"
            :class="{ active: selectedAnswer === answer.option }"
            :style="`--variant: var(--${colorVariants[questionIndex % 3]})`"
            v-for="answer in question.question_content?.answers"
            :key="answer.option"
            @click="selectAnswer(question.question_id, answer.option)"
        >
            <span class="single-choice-answer-option">{{ answer.option }} </span>
            <span class="math-content" ref="mathAnswers">{{ answer.answer }}</span>
        </div>
    </div>
    <!-- Single choice question answers -->

    <!-- Open whiteboard -->
    <div class="text-center">
        <button class="btn btn-primary min-w-[300px] mt-6" @click="() => whiteboard = !whiteboard">
            <font-awesome-icon icon="fa-solid fa-chalkboard-user" class="mr-0.5 text-lg" />
            Otwórz tablicę
        </button>
    </div>
    <!-- Open whiteboard -->

    <!-- Drawing canvas -->
    <TransitionWrapper name="fade" class="z-[100] w-full">
        <Whiteboard :question="questionWhiteboard" :toggle-whiteboard="() => whiteboard = !whiteboard" v-if="whiteboard" />
    </TransitionWrapper>
    <!-- Drawing canvas -->
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/single-choice-question.scss';
</style>
