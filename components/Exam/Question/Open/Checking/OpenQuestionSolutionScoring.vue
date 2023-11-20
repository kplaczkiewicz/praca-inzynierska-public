<!-- Scoring of open questions by answering questions -->
<script setup lang="ts">
import { questionType, openQuesionSolutionType } from '~/server/types'

const props = defineProps<{
    question: questionType
    solutions: openQuesionSolutionType[] | undefined
}>()

// Control points with state
const points = useState(`points-question-${props.question.question_number}`, () => 0)

// Control current solution
const currentSolution = useState(`solution-question-${props.question.question_number}`, () => 0)

// Calculate the points from questions
const selectedQuestionCheckboxes = useState<number[]>(`checkboxes-question-${props.question.question_number}`, () => [])

// Calculate points
watch(
    selectedQuestionCheckboxes,
    (newSelectedQuestionCheckboxes) => {
        // Remove -1 for 'no' answers
        newSelectedQuestionCheckboxes = newSelectedQuestionCheckboxes.filter((e) => e !== -1)

        if (!newSelectedQuestionCheckboxes || !newSelectedQuestionCheckboxes.length) {
            points.value = 0
            return
        }

        // Check all the rules
        let ruleMatched = false
        props.solutions?.[currentSolution.value].scoring.forEach((scoring) => {
            scoring.rules.forEach((rule) => {
                // If rules match set points
                if (rule.toString() === newSelectedQuestionCheckboxes.toString()) {
                    ruleMatched = true
                    points.value = scoring.points
                    return
                }
            })
        })

        // If no rules are matched return 0
        if (!ruleMatched) {
            points.value = 0
            return
        }
    },
    { deep: true }
)

// Check if checkbox should have an 'active' class
function isCheckboxActive(questionIndex: number, radioValue: number | null) {
    // Checks if radio is active after click
    const isActive = selectedQuestionCheckboxes.value[questionIndex] === (radioValue || questionIndex)

    // Fallback for when no radio is selected
    const isActiveFallback = selectedQuestionCheckboxes.value[questionIndex] === undefined && radioValue === -1

    return isActive || isActiveFallback
}

// Show explanations
const showExplanations = ref(initShowExplanations(props.solutions?.[0].questions.length))

// Generate the array based on number of questions
function initShowExplanations(n: number | undefined) {
    if (n === undefined) return []
    const explanations = []

    for (let i = 0; i < n; i++) {
        explanations.push(false)
    }

    return explanations
}

// Reset show explanations when solution changes
watchEffect(() => {
    showExplanations.value = initShowExplanations(props.solutions?.[currentSolution.value].questions.length)
})

// Radio helper
const radios = [
    {
        label: 'Tak',
        value: null,
    },
    {
        label: 'Nie',
        value: -1,
    },
]

// Render math
const mathExplanations = ref<HTMLElement[]>([]);
const { renderMath, addMathClasses } = useDisplayMath();
onMounted(() => {
    renderMath()
    addMathClasses(mathExplanations.value)
})

// On solution change rerender math
watch(currentSolution, () => {
    renderMath()
    addMathClasses(mathExplanations.value)
}, { flush: 'post' })
</script>

<template>
    <!-- All solutions wrapper -->
    <div v-for="(solution, solutionIndex) in solutions" :key="solutionIndex">
        <TransitionWrapper name="crossfade">
            <div v-if="solutionIndex === currentSolution">
                <!-- Single solution -->
                <div class="mb-5" v-for="(questions, questionIndex) in solution.questions" :key="questionIndex">
                    <!-- Question -->
                    <OpenQuestionScoringQuestion
                        :question-index="questionIndex"
                        :question-options="questions.options"
                    />
                    <!-- Question -->

                    <!-- Toggle -->
                    <div class="mt-6 flex gap-6">
                        <!-- Control all styles with variable --variant -->
                        <div
                            v-for="radio in radios"
                            :key="radio.label"
                            class="toggle-radio"
                            :class="isCheckboxActive(questionIndex, radio.value) ? 'active' : ''"
                            :style="`--variant: var(${radio.value === null ? '--su' : '--er'})`"
                        >
                            <label>
                                <input
                                    type="radio"
                                    :name="`radio-${questionIndex}`"
                                    :value="radio.value || questionIndex"
                                    v-model="selectedQuestionCheckboxes[questionIndex]"
                                    checked
                                />
                                <span class="font-semibold">{{ radio.label }}</span>
                            </label>
                        </div>
                    </div>
                    <!-- Toggle -->

                    <!-- Explanation -->
                    <div
                        class="mb-4 mt-5 cursor-pointer text-primary"
                        @click="showExplanations[questionIndex] = !showExplanations[questionIndex]"
                        v-if="solution.questions[questionIndex].explanation"
                    >
                        <font-awesome-icon icon="fa-solid fa-circle-info" class="-mb-px mr-1 text-lg" />
                        {{ showExplanations[questionIndex] ? 'Ukryj' : 'Pokaż' }} wyjaśnienie
                    </div>

                    <!-- Explanation -->
                    <TransitionSlide :visible="showExplanations[questionIndex]">
                        <div>
                            <p class="math-content mt-0" ref="mathExplanations">
                                {{ solution.questions[questionIndex].explanation }}
                            </p>

                            <img
                                class="mt-3"
                                :src="solution.questions[questionIndex].explanationImage"
                                :alt="`Wyjaśnienie do zad ${question.question_number}`"
                                v-if="solution.questions[questionIndex].explanationImage"
                            />
                        </div>
                    </TransitionSlide>
                    <!-- Explanation -->

                    <!-- Divider -->
                    <div
                        class="divider mx-auto mt-3 w-[60%] before:bg-neutral/50 after:bg-neutral/50"
                        v-if="questionIndex !== solution.questions.length - 1"
                    ></div>
                </div>
                <!-- Single solution -->
            </div>
        </TransitionWrapper>
    </div>
    <!-- All solutions wrapper -->

    <!-- Points -->
    <p class="mt-12 text-lg">
        <font-awesome-icon icon="fa-solid fa-chart-column" class="-mb-px mr-1 text-2xl text-primary" />
        Uzyskane punkty:
    </p>

    <div class="scored-points">
        <div class="bg-percentage" :style="`width: ${(points / question.points) * 100}%`"></div>
        <div class="points">
            <span> {{ points }} / {{ question.points }} </span>
            pkt
        </div>
    </div>
    <!-- Points -->

    <p class="mb-4 mt-12">
        <font-awesome-icon icon="fa-solid fa-circle-question" class="mr-1 text-lg" />
        Problemy z punktacją?
    </p>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/utilities/helpers.scss';
@import '@/assets/scss/components/exam.scss';
@import '@/assets/scss/components/toggle-radio.scss';

.scored-points {
    @apply relative mt-4 inline-block rounded border-2 border-neutral px-10 py-2 text-2xl font-bold;

    .bg-percentage {
        @apply absolute inset-0 z-0 bg-primary/40 transition-all duration-300;
    }

    span {
        @apply mr-1 text-2xl;
    }

    .points {
        @apply relative z-10;
    }
}
</style>
