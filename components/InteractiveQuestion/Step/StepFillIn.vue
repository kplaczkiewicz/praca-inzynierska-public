<!-- Step where user needs to input the answer -->
<script setup lang="ts">
import * as Compute from '@cortex-js/compute-engine'

const props = defineProps<{
    answers: string[]
    onFinish: (isAnswerCorrect: boolean) => void
}>()

// User answer
const userAnswer = ref('')
const answerState = ref<'correct' | 'incorrect' | 'show_answer'>()

// Check answer
function checkAnswers() {
    // Error prevention
    if (answerState.value === 'correct' || answerState.value === 'show_answer') return
    answerState.value = undefined

    setTimeout(() => {
        // Compute user answer
        const ce = new Compute.ComputeEngine()
        const answer = ce.parse(userAnswer.value).simplify()
    
        // Check all answers and if any match set state to correct
        let isCorrect = false
        props.answers.forEach((a) => {
            const correctAnswer = ce.parse(a)
    
            // Compare on few cases
            if (answer.isSame(correctAnswer) || answer.isEqual(correctAnswer) || answer.latex == correctAnswer.latex) {
                answerState.value = 'correct'
                isCorrect = true
            }
        })
    
        // If no answers matched set state to incorrect
        if (!isCorrect) {
            answerState.value = 'incorrect'
        } else {
            props.onFinish(true)
        }
    }, 200)
}

// Add correct answer
function showAnswer() {
    // Error prevention
    if (answerState.value === 'correct' || answerState.value === 'show_answer') return

    // Add last answer from the array
    userAnswer.value = props.answers[props.answers.length - 1];

    answerState.value = 'show_answer'
    props.onFinish(false)
}

// Add math field with all customizations
useMathField()

// Helper for checking is user given an answer
const hasNoAnswer = computed(() => {
    return answerState.value === undefined || answerState.value === 'incorrect'
})

// Helper for border classes
const borderClasses = {
    correct: 'border-success',
    incorrect: 'border-error',
    show_answer: 'border-warning',
}

</script>

<template>
    <div class="mb-12">
        <div class="mx-auto w-[70%]">
            <!-- User answer -->
            <div class="">
                <ClientOnly>
                    <!-- Interactive math field -->
                    <math-field
                        class="w-full cursor-pointer rounded border-2 px-3 py-3 text-2xl"
                        :class="answerState === undefined ? 'border-primary' : borderClasses[answerState!]"
                        @input="(e : any) => userAnswer = e.target.value"
                        :value="userAnswer"
                        v-if="hasNoAnswer"
                    ></math-field>

                    <!-- After answer read-only -->
                    <math-field
                        class="pointer-events-none w-full rounded border-2 px-3 py-3 text-2xl"
                        :class="borderClasses[answerState!]"
                        :value="userAnswer"
                        read-only
                        v-else
                    ></math-field>
                </ClientOnly>
            </div>
            <!-- User answer -->

            <!-- Controls -->
            <div class="space-between mt-3.5 flex items-center px-1">
                <div
                    class="-mt-px flex-1 text-lg font-semibold"
                >
                    <!-- Message to the user -->
                    <TransitionWrapper name="crossfade">
                        <span class="text-success" v-if="answerState === 'correct'">
                            <font-awesome-icon icon="fa-solid fa-circle-check" class="mr-1.5 text-xl" />
                            Dobra odpowiedź
                        </span>

                        <span class="text-error" v-else-if="answerState === 'incorrect'">
                            <font-awesome-icon icon="fa-solid fa-circle-xmark" class="mr-1.5 text-xl" />
                            Zła odpowiedź
                        </span>

                        <span class="text-warning" v-else-if="answerState === 'show_answer'">
                            <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="-mb-px mr-1.5 text-xl" />
                            Pokazano odpowiedź
                        </span>
                    </TransitionWrapper>
                    <!-- Message to the user -->
                </div>

                <!-- Check answers -->
                <div class="flex justify-end gap-6 text-[15px]" :class="hasNoAnswer ? '' : 'pointer-events-none grayscale'">
                    <a href="#" class="no-underline transition-colors hover:text-accent" @click.prevent="checkAnswers">
                        <font-awesome-icon icon="fa-solid fa-square-check" class="-mb-px mr-1.5 text-lg text-accent" />
                        Sprawdź odpowiedź
                    </a>

                    <a href="#" class="no-underline transition-colors hover:text-primary" @click.prevent="showAnswer">
                        <font-awesome-icon icon="fa-solid fa-eye" class="-mb-0.5 mr-1 text-lg text-primary" />
                        Pokaż odpowiedź
                    </a>
                </div>
                <!-- Check answers -->
            </div>
            <!-- Controls -->
        </div>
    </div>
</template>

<style lang="scss">
@import url('@/assets/scss/vendor/math-field.scss');
</style>
