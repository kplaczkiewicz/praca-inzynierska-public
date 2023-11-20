<!-- Interactive question single choice step -->
<script setup lang="ts">
import { interactiveSingleChoiceType } from '~/server/types'

const props = defineProps<{
    singleChoiceContent: interactiveSingleChoiceType
    hint: string
    index: number
    onFinish: (isAnswerCorrect: boolean) => void
}>()

// Currently checked answer
const currentAnswer = ref<number | null>(null)
const isCorrect = ref<boolean | undefined>()

// Check if the answer is correct
function checkAnswer(index: number) {
    currentAnswer.value = index
    isCorrect.value = currentAnswer.value === props.singleChoiceContent.correct_answer

    // Show control buttons
    setTimeout(() => {
        props.onFinish(isCorrect.value ?? true)
    }, 500)
}

// Apply correct classes after the answer
function classesAfterAnswer(index: number) {
    // No answer
    if (currentAnswer.value === null) return

    if (index === props.singleChoiceContent.correct_answer && isCorrect.value) return 'is-correct'
    else if (currentAnswer.value === index && !isCorrect.value) return 'is-wrong'
    else if (index === props.singleChoiceContent.correct_answer) return 'correct-answer'
}

// Helper for color classes
const colorVariants = useColorVariants()

// Helper for options letters
const optionLetters = ['a', 'b', 'c', 'd']
</script>

<template>
    <!-- Options wrapper -->
    <div class="grid grid-cols-4 gap-4" :style="`--variant: var(--${colorVariants[index % 3]})`">
        <!-- Single option -->
        <div
            v-for="(option, index) in singleChoiceContent.options"
            :key="index"
            class="single-choice-answer"
            :class="[
                { active: currentAnswer === index },
                { locked: currentAnswer !== null },
                classesAfterAnswer(index),
            ]"
            @click="checkAnswer(index)"
        >
            <img class="!mb-3 !mt-0" :src="option" :alt="`Opdowiedź nr. ${index}`" />
            <span class="single-choice-answer-option">
                {{ optionLetters[index] }}
            </span>
        </div>
        <!-- Single option -->
    </div>
    <!-- Options wrapper -->

    <!-- Good / bad answer -->
    <div class="text-center text-xl font-semibold">
        <TransitionWrapper name="switch-right">
            <div class="alert alert-success mt-10 py-3 text-center max-w-md mx-auto inline-block" v-if="isCorrect">
                <font-awesome-icon icon="fa-solid fa-circle-check" class="mr-2" />
                Dobra odpowiedź
            </div>

            <div class="alert alert-error mt-10 py-3 text-center max-w-md mx-auto inline-block" v-else-if="!isCorrect && isCorrect !== undefined">
                <font-awesome-icon icon="fa-solid fa-circle-xmark" class="mr-2" />
                Zła odpowiedź
            </div>
        </TransitionWrapper>
    </div>
    <!-- Good / bad answer -->
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';
@import '@/assets/scss/utilities/helpers.scss';

.single-choice-answer {
    @apply flex cursor-pointer flex-col items-center justify-between rounded border-4 outline outline-2 outline-neutral/20 border-transparent bg-white px-3 py-4 shadow transition-all;

    &.locked {
        @apply pointer-events-none outline-none;
    }

    &:not(.locked):hover {
        @apply -translate-y-1.5;
    }

    &:not(.locked):hover,
    &.active {
        @apply outline-none;
        border-color: hsl(var(--variant) / 1);
        box-shadow: 0 1px 3px 0 hsl(var(--variant) / 1), 0 1px 2px -1px hsl(var(--variant) / 1);
    }

    &.is-correct {
        @apply border-success outline-none;
        box-shadow: 0 1px 3px 0 hsl(var(--su) / 1), 0 1px 2px -1px hsl(var(--su) / 1);

        .single-choice-answer-option {
            @apply border-success text-success;
        }
    }

    &.is-wrong {
        @apply border-error outline-none;
        box-shadow: 0 1px 3px 0 hsl(var(--er) / 1), 0 1px 2px -1px hsl(var(--er) / 1);

        .single-choice-answer-option {
            @apply border-error text-error;
        }
    }

    &.correct-answer {
        @apply border-success border-4 outline-none;
        box-shadow: 0 1px 3px 0 hsl(var(--su) / 1), 0 1px 2px -1px hsl(var(--su) / 1);

        .single-choice-answer-option {
            @apply border-success text-success;
        }
    }

    .single-choice-answer-option {
        @apply inline-flex h-7 w-7 items-center justify-center rounded border-2 transition-colors;
        border-color: hsl(var(--variant) / 1);
        color: hsl(var(--variant) / 1);
    }
}
</style>
