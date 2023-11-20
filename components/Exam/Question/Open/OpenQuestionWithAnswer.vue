<!-- Open question with user solution and highlighted errors -->
<script setup lang="ts">
import { questionType, examAnswerType, openQuesionSolutionType } from '~/server/types'

const props = defineProps<{
    question: questionType
    solution: openQuesionSolutionType | undefined
    openQuestionAnswer: examAnswerType
}>()

// Flag to show additional info
const showExplanation = ref(!props.openQuestionAnswer.is_correct)

// Check if the answer is user own scoring
const isUserOwnScoring = (props.openQuestionAnswer.open_question_explanation !== 'no_answer') ? props.openQuestionAnswer.open_question_explanation!.solution === 'own_scoring' : false;

// Check if answer is yes or no
function isAnswerYes(questionIndex: number) {
    if (props.openQuestionAnswer.open_question_explanation !== 'no_answer') {
        return props.openQuestionAnswer.open_question_explanation?.selectedQuestions.includes(questionIndex)
    }
}

// Render math on visibility change
const mathExplanations = ref<HTMLElement[]>([]);
const { renderMath, addMathClasses } = useDisplayMath();

watch(showExplanation, () => {
    renderMath()
	addMathClasses(mathExplanations.value)
}, { flush: 'post' })
</script>

<template>
    <div class="mt-6">
        <!-- Buttons -->
        <div class="mt-2 flex items-center justify-center gap-4">
            <ExplanationButtons
                :show-explanation="showExplanation"
                :change-show-explanation="() => (showExplanation = !showExplanation)"
                :isOpenQuestion="true"
                :pdf-link="question.official_answers"
                :question-id="question.question_id"
            />
        </div>
        <!-- Buttons -->

        <!-- User answers with explanantions -->
        <TransitionWrapper name="fade-bottom">
            <div v-if="showExplanation">
                <div class="mb-6 mt-12 flex" v-if="openQuestionAnswer.open_question_explanation !== 'no_answer'">
                    <!-- User solutions -->
                    <OpenQuestionUserSolution
                        class="w-1/2 pr-8"
                        :question="question"
                        :user-answers="openQuestionAnswer.user_answer"
                    />
                    <!-- User solutions -->

                    <!-- User answers to questions -->
                    <div class="scoring-section gradient-border-left">
                        <h3 class="scoring-section-header">
                            <font-awesome-icon icon="fa-solid fa-ranking-star" />
                            Twoje odpowiedzi:
                        </h3>

                        <h4 class="mb-3 text-lg font-medium">
                            <span v-if="isUserOwnScoring">
                                Samodzielnie przyznałeś sobie <span class="inline-block mx-1 text-accent text-2xl font-bold">{{ openQuestionAnswer.points }} pkt</span>
                            </span>
                            <span v-else>
                                Rozwiązanie nr.{{ Number(openQuestionAnswer.open_question_explanation!.solution) + 1 }}:
                            </span>
                        </h4>

                        <!-- User question anwers -->
                        <div
                            class="prose mb-4"
                            v-for="(questions, questionIndex) in solution.questions"
                            :key="questionIndex"
                            v-if="solution && !isUserOwnScoring"
                        >
                            <!-- Question -->
                            <OpenQuestionScoringQuestion
                                :question-index="questionIndex"
                                :question-options="questions.options"
                                class="question-title-small"
                            />
                            <!-- Question -->

                            <!-- User answer -->
                            <span class="user-answer user-answer-yes" v-if="isAnswerYes(questionIndex)">
                                <font-awesome-icon icon="fa-solid fa-check" />
                                Tak
                            </span>
                            <span class="user-answer user-answer-no" v-else>
                                <font-awesome-icon icon="fa-solid fa-xmark" />
                                Nie
                            </span>
                            <!-- User answer -->

                            <p class="mb-1 mt-8 font-medium" v-if="openQuestionAnswer.open_question_explanation?.explanations[questionIndex]">
                                <font-awesome-icon icon="fa-solid fa-circle-info" class="mr-1" />
                                Wyjaśnienie:
                            </p>

                            <!-- Explanation -->
                            <p class="mt-0 math-content" ref="mathExplanations">
                                {{ openQuestionAnswer.open_question_explanation?.explanations[questionIndex] }}
                            </p>
                            
                            <img
                                class="mt-3"
                                :src="solution.questions[questionIndex].explanationImage"
                                :alt="`Wyjaśnienie do zad ${question.question_number}`"
                                v-if="solution.questions[questionIndex].explanationImage"
                            />
                            <!-- Explanation -->

                            <div
                                class="divider mx-auto mt-6 w-[60%] before:bg-neutral/50 after:bg-neutral/50"
                                v-if="questionIndex !== solution.questions.length - 1"
                            ></div>
                        </div>
                        <!-- User question anwers -->
                    </div>
                    <!-- User answers to questions -->
                </div>

                <div v-else>
                    <p class="mb-5 mt-12 text-xl font-medium">
                        <font-awesome-icon icon="fa-solid fa-pen-to-square" class="mr-2 text-xl text-primary" />Twoje rozwiązanie:
                        <span class="text-lg block font-normal mt-4">
                            <font-awesome-icon icon="fa-solid fa-ban" class="mr-3 text-lg text-error" />Brak rozwiązania
                        </span>
                    </p>
                </div>

                <!-- Explanation for the entire question -->
                <QuestionExplanation
                    :is-correct="false"
                    :explanation="question.explanation"
                    :helpful-links="question.helpful_links"
                    :show-buttons="false"
                    header-text="Przykładowe rozwiązanie:"
                    class="mt-14"
                />
                <!-- Explanation for the entire question -->
            </div>
        </TransitionWrapper>
        <!-- User answers with explanantions -->
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/utilities/helpers.scss';
@import '@/assets/scss/components/exam.scss';

.user-answer {
    @apply text-marking flex items-center gap-4 text-2xl font-bold;

    &.user-answer-yes {
        &::before {
            background-color: hsl(var(--su) / 0.3);
        }

        svg {
            @apply text-success;
        }
    }

    &.user-answer-no {
        &::before {
            background-color: hsl(var(--er) / 0.3);
        }

        svg {
            @apply text-error;
        }
    }

    &::before {
        @apply h-5 w-28;
    }

    svg {
        @apply text-[26px];
    }
}
</style>
