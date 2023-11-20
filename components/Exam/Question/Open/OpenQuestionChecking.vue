<!-- Component for checking answers in open questions  -->
<script setup lang="ts">
import { questionType, openQuesionSolutionType, selectOptionType } from '~/server/types'
import vSelect from 'vue-select'

const props = defineProps<{
    question: questionType
    questionIndex: number
    solutions: openQuesionSolutionType[] | undefined
    userAnswers: string | string[] | undefined
}>()

// Own scoring flag
const isUserOwnScoring = ref(false)

// Save points
const points = useState(`points-question-${props.question.question_number}`, () => 0)

// Control current solution
const currentSolution = useState(`solution-question-${props.question.question_number}`, () => 0)

// Calculate the points from questions
const selectedQuestionCheckboxes = useState<number[]>(`checkboxes-question-${props.question.question_number}`, () => [])

// Solution options for select
const selectOptions = props.solutions?.map((solution, index) => {
    return <selectOptionType>{
        label: solution.name,
        value: index,
    }
})

// Expose properties to the parent component
defineExpose({
    points,
    currentSolution,
    selectedQuestionCheckboxes,
    isUserOwnScoring,
})

// Save scoring section for scroll
const scoringSection = ref<HTMLElement>()

// Change scoring tabs and reset the score
function changeScoringTabs() {
    isUserOwnScoring.value = !isUserOwnScoring.value
    resetScoring()

	// Scroll into view
    setTimeout(() => {
        if (!scoringSection.value) return;
        scoringSection.value.scrollIntoView({block: 'start'})
    }, 100)
}

// Reset checkboxes and points on solution change
function resetScoring() {
    points.value = 0
    selectedQuestionCheckboxes.value = []
}
watch(currentSolution, () => resetScoring())

// Reset on component render
onMounted(() => {
    currentSolution.value = 0
    resetScoring()
});

// Add select options
const { removeDelete } = useSelectOptions();
</script>

<template>
    <div class="exam-question" v-if="userAnswers?.length">
        <!-- Question -->
        <QuestionContent class="mb-12" :question="question" :question-index="questionIndex" :correct-answers="null" />
        <!-- Question -->

		<div class="prose max-w-none text-center" >
			<h3 class="mb-12">
				<font-awesome-icon icon="fa-solid fa-turn-down" class="-mb-2 text-2xl mr-4 text-primary"  flip="horizontal" />
				Sprawdź swoje odpowiedzi
				<font-awesome-icon icon="fa-solid fa-turn-down" class="-mb-2 text-2xl ml-4 text-primary" />
			</h3>
		</div>

        <!-- Scoring section -->
        <div class="my-6 flex" ref="scoringSection">
            <OpenQuestionUserSolution class="w-1/2 pr-8" :question="question" :user-answers="userAnswers" />

            <!-- Scoring -->
            <div class="scoring-section gradient-border-left">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="scoring-section-header">
                        <font-awesome-icon icon="fa-solid fa-star-half-stroke" />
                        Punktacja:
                    </h3>

                    <!-- Select solution -->
                    <v-select
                        class="-mt-4 w-full max-w-[15rem] hide-clear"
                        v-model="currentSolution"
                        :options="selectOptions"
                        :reduce="(solution : selectOptionType) => solution.value"
                        :map-keydown="removeDelete"
                        :searchable="false"
                        v-if="solutions!.length > 1 && !isUserOwnScoring"
                    ></v-select>
                    <!-- Select solution -->
                </div>

                <!-- User scoring by answersing yes or no questions -->
                <div v-if="!isUserOwnScoring">
                    <OpenQuestionSolutionScoring :question="question" :solutions="solutions" />
                </div>

                <!-- User assigning themselves points -->
                <div v-else>
                    <OpenQuestionOwnScoring :question="question" />
                </div>

                <!-- Controls -->
                <div class="flex gap-5">
                    <button class="btn btn-primary" @click="changeScoringTabs">
                        <span v-if="isUserOwnScoring">
                            <font-awesome-icon icon="fa-solid fa-chart-simple" class="-mb-px mr-1.5 text-lg" />
                            Zwykła punktacja
                        </span>

                        <span v-else>
                            <font-awesome-icon icon="fa-solid fa-file-pen" class="-mb-0.5 mr-1.5 text-lg" />
                            Samodzielna punktacja
                        </span>
                    </button>

                    <a class="btn btn-secondary" :href="question.official_answers" target="_blank" v-if="question.official_answers">
                        <font-awesome-icon icon="fa-solid fa-file-circle-check" class="-mt-px mr-1 text-lg" />
                        Klucz odpowiedzi
                    </a>
                </div>
                <!-- Controls -->
            </div>
            <!-- Scoring -->
        </div>
        <!-- Scoring section -->

        <div class="question-divider w-[85%]"></div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';
</style>
