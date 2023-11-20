<!-- Whiteboard top bar with question, time and close button -->
<script setup lang="ts">
import { userCurrentExamType, canvasQuestionType } from '~/server/types'

const props = defineProps<{
    question: canvasQuestionType
    toggleWhiteboard: () => void
    onUpdate: () => void
}>()

// Get exam for remaining time
const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())

// Return formatted time
const formattedTime = computed(() => {
    return useFormatTime(userCurrentExam.value.time_left)
})

// Show question
const showQuestion = ref(true)

function hideQuestion() {
    showQuestion.value = !showQuestion.value

    setTimeout(() => {
        props.onUpdate()
    }, 300)
}

// Helper for color classes
const colorVariants = useColorVariants()

// Render math
const mathQuestion = ref<HTMLElement>()
const mathAnnotation = ref<HTMLElement>()

const { renderMath, addMathClasses } = useDisplayMath()
onMounted(() => {
    renderMath()
    addMathClasses([mathQuestion.value, mathAnnotation.value])
})
</script>

<template>
    <div class="isolate flex items-start justify-between border-b-2 border-neutral bg-white px-8 py-3">
        <!-- Question content -->
        <div class="flex-1 pr-8">
            <!-- Title for quesitons -->
            <span
                class="question-title"
                :style="`--variant: var(--${colorVariants[(question.question_number - 1) % 3]}); --width: 235px;`"
                v-if="question.question_type === 'question'"
            >
                Zadanie {{ question.question_number }}.
                <span>({{ question.points }} pkt)</span>
            </span>

            <!-- Title for steps -->
            <span
                class="question-title"
                :style="`--variant: var(--${colorVariants[question.question_number % 3]}); --width: 135px;`"
                v-else
            >
                Krok {{ question.question_number + 1 }}.
            </span>

            <TransitionSlide :visible="showQuestion">
                <div>
                    <!-- Show annotation at top if present -->
                    <span class="math-content mb-2 block" ref="mathAnnotation" v-if="question.annotation">
                        {{question.annotation}}
                    </span>

                    <!-- Question -->
                    <span class="math-content block max-w-[100ch]" ref="mathQuestion" v-if="question.question_type === 'question'">{{ question.question }}</span>
                </div>
            </TransitionSlide>
        </div>
        <!-- Question content -->

        <div class="flex items-center">
            <!-- Hide question -->
            <span
                tabindex="0"
                class="block cursor-pointer font-semibold transition-colors hover:text-primary"
                @click="hideQuestion()"
            >
                <font-awesome-icon
                    class="mr-2 text-lg"
                    :icon="showQuestion ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
                />
                {{ showQuestion ? 'Ukryj' : 'Pokaż' }} treść
            </span>
            <!-- Hide question -->

            <div class="divider divider-horizontal"></div>

            <!-- Timer -->
            <div v-if="question.question_type === 'question'">
                <span class="mt-1">
                    <font-awesome-icon icon="fa-regular fa-clock" class="mr-4 text-2xl text-primary" />
                </span>
                <CountdownSimple
                    class="mr-2 text-2xl font-semibold"
                    :hours="formattedTime.hours"
                    :minutes="formattedTime.minutes"
                    :seconds="formattedTime.seconds"
                />
            </div>
            <!-- Timer -->

            <div class="divider divider-horizontal mr-0.5" v-if="question.question_type === 'question'"></div>

            <!-- Close whiteboard -->
            <button class="btn btn-ghost text-lg" @click="toggleWhiteboard">
                zamknij
                <font-awesome-icon icon="fa-solid fa-xmark" class="ml-2 text-3xl" />
            </button>
            <!-- Close whiteboard -->
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';

.question-title {
    @apply mb-3 text-[22px];

    &::before {
        width: var(--width);
    }

    span {
        @apply ml-1 text-lg;
    }
}
</style>
