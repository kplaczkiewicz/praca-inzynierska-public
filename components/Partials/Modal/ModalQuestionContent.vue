<!-- Modal to content of interactive quesiton -->
<script setup lang="ts">
import { questionCompactTypeFormatted } from '~/server/types'

defineProps<{
    name: string
    question: questionCompactTypeFormatted
    index: number
}>()

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
    <BaseModal :name="name" :close-on-backdrop="true" body-classes="!max-w-[800px]">
        <div class="px-3" :style="`--variant: var(--${colorVariants[index % 3]});`">
            <div class="flex items-center justify-between text-center text-neutral mb-6">
                <!-- Question number and exam -->
                <p class="question-title text-marking !m-0">
                    Zadanie {{ question.question_number }}.
                </p>
                <!-- Question number and exam -->

                <!-- Math field -->
                <div class="math-field">
                    <font-awesome-icon icon="fa-solid fa-shapes" class="mr-2.5" />
                    {{ question.field }}
                </div>
                <!-- Math field -->
            </div>

            <!-- Show annotation at top if present -->
            <span v-if="question.annotation" ref="mathAnnotation">{{ question.annotation }}</span>

            <!-- Question -->
            <span class="math-content" ref="mathQuestion" v-else>{{ question.question }}</span>

            <!-- Image -->
            <img
                class="mx-auto mb-10 mt-8 rounded shadow"
                :src="question.image_url"
                :alt="`Zdjęcie pomocnicze do zadania nr ${question.question_number}`"
                v-if="question.image_url"
            />
            <!-- Image -->

            <!-- If annotation present show question at the bottom -->
            <p class="mt-10" ref="mathQuestion" v-if="question.annotation">{{ question.question }}</p>
        </div>

        <!-- Modal actions -->
        <div class="mt-10 flex gap-4">
            <button class="btn btn-outline flex-1 btn-icon-move-left" :class="colorVariantsButtons[index % 3]">
                <font-awesome-icon icon="fa-solid fa-arrow-left" />
                Powrót
            </button>

            <NuxtLink
                class="btn-icon-move-right btn flex-1 !text-primary-content !no-underline"
                :class="colorVariantsButtons[index % 3]"
                :to="`/cwiczenie/${question.id}`"
            >
                Rozwiązuj
                <font-awesome-icon icon="fa-solid fa-arrow-right" class="mb-px ml-1 text-lg" />
            </NuxtLink>
        </div>
        <!-- Modal actions -->
    </BaseModal>
</template>

<style scoped lang="scss">
@import '@/assets/scss/utilities/helpers.scss';

.question-title {
    @apply text-3xl font-bold;

    &::before {
        @apply w-[235px];
    background-color: hsl(var(--variant) / 1);
    }

    span {
        @apply ml-1 text-lg;
    }
}

.math-field {
    @apply inline-block rounded-full px-4 py-1 text-sm font-semibold text-white;
    background-color: hsl(var(--variant) / 1);
}

.question-number {
    color: hsl(var(--variant) / 1);
}
</style>
