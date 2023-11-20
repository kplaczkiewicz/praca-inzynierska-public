<!-- Card for interactive quesions -->
<script setup lang="ts">
import FilterQuestions from '@/components/Filtering/FilterQuestions.vue';
import { questionCompactTypeFormatted } from '~/server/types'

const props = defineProps<{
    question: questionCompactTypeFormatted
    index: number
    filterElement: InstanceType<typeof FilterQuestions> | null
}>()

// Add filter 
function addFilter(filter: string, value: string) {
    if (props.filterElement) {
        props.filterElement.addFilter(filter, value);
    }
}

// Question content modal
const questionContentModal = useState(`question-content-modal-${props.question.id}`, () => ref<HTMLDialogElement | null>(null))

// Render math
const mathQuestion = ref<HTMLElement>()
const mathAnnotation = ref<HTMLElement>()

const { renderMath, addMathClasses } = useDisplayMath()
onMounted(() => {
    renderMath()
    addMathClasses([mathQuestion.value, mathAnnotation.value])
})

// Color helpers
const colorVariants = useColorVariants()
const colorVariantsButtons = useColorButtons()
</script>

<template>
    <div class="question-card" :style="`--variant: var(--${colorVariants[index % 3]});`">
        <div class="text-center">
            <!-- Math field -->
            <div class="math-field" @click="addFilter('math_fields', question.field_type)">
                <font-awesome-icon icon="fa-solid fa-shapes" class="mr-2.5 transition-colors" />
                {{ question.field }}
            </div>
            <!-- Math field -->

            <!-- Question number and exam -->
            <p class="cursor-pointer text-3xl font-bold" @click="addFilter('exam', question.exam_id.toString())">
                {{ question.exam_title }}
            </p>
            <p class="mt-3 text-2xl font-bold">
                Zadanie
                <span class="question-number"> {{ question.question_number }}. </span>
            </p>
            <!-- Question number and exam -->
        </div>

        <!-- Question actions -->
        <div class="mt-10 flex gap-4">
            <button class="btn btn-outline flex-1" :class="colorVariantsButtons[index % 3]" @click="questionContentModal?.showModal()">
                <font-awesome-icon icon="fa-solid fa-eye" class="mb-px mr-1 text-lg" />
                Zobacz treść
            </button>

            <NuxtLink
                class="btn-icon-move-right btn flex-1"
                :class="colorVariantsButtons[index % 3]"
                :to="`/cwiczenie/${question.id}`"
            >
                Rozwiązuj
                <font-awesome-icon icon="fa-solid fa-arrow-right-long" class="mb-px ml-1 text-lg" />
            </NuxtLink>
        </div>
        <!-- Question actions -->
    </div>

    <!-- Show question content in modal -->
    <ModalQuestionContent :name="`question-content-modal-${props.question.id}`" :question="question" :index="index"/>
</template>

<style lang="scss" scoped>
.question-card {
    @apply relative flex flex-col justify-between rounded-xl border-2 border-neutral bg-white px-8 py-5 shadow-lg;

    .math-field {
        @apply mb-2 inline-block cursor-pointer rounded-full px-4 py-1 text-sm font-semibold transition-colors hover:text-white;
        color: hsl(var(--variant) / 1);

        &:hover {
            background-color: hsl(var(--variant) / 1);
        }
    }

    .question-number {
        color: hsl(var(--variant) / 1);
    }
}
</style>
