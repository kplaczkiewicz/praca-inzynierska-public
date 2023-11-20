<!-- Additional info box and button -->
<script setup lang="ts">
const props = defineProps<{
    isCorrect: boolean
    explanation: string | null
    helpfulLinks: string[] | undefined
    showButtons: boolean
    headerText: string
}>()

// Flag to show additional info
const showExplanation = ref(!props.isCorrect)

// Add images to explanation
const transformExplanation = useTransformPlainText();

// Render math
const mathExplanation = ref<HTMLElement>()
const { renderMath, addMathClasses } = useDisplayMath();
onMounted(() => {
    renderMath()
    addMathClasses([mathExplanation.value])
})

// Render math on visibility change
watch(showExplanation, () => {
    renderMath()
	addMathClasses([mathExplanation.value])
}, { flush: 'post' })
</script>

<template>
    <div>
        <!-- Buttons -->
        <div class="mt-4 flex items-center justify-center gap-4" v-if="showButtons">
            <ExplanationButtons :show-explanation="showExplanation" :change-show-explanation="() => showExplanation = !showExplanation" :isOpenQuestion="false" :pdf-link="null" />
        </div>
        <!-- Buttons -->

        <!-- Additional info for wrong answer -->
        <TransitionWrapper name="fade-bottom">
            <div class="additional-info prose max-w-[80ch]" v-if="showExplanation">
                <div v-if="explanation">
                    <p class="subheader">
                        <font-awesome-icon icon="fa-solid fa-circle-info" class="mr-1.5 text-primary" />
                        {{ headerText }}
                    </p>
                    <span class="block mb-6 math-content" ref="mathExplanation" v-html="transformExplanation(explanation)"></span>
                </div>

                <div v-if="helpfulLinks">
                    <p class="subheader">
                        <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" class="mr-2 text-accent" />
                        Pomocne linki:
                    </p>

                    <ul class="!mt-0">
                        <li v-for="link in helpfulLinks" :key="link">
                            <a class="hover:text-accent" target="_blank" :href="link">{{ link }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </TransitionWrapper>
        <!-- Additional info for wrong answer -->
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/utilities/helpers.scss';
.additional-info {
    @apply gradient-border-top relative mx-auto mb-4 mt-6 rounded-lg bg-white border border-neutral/20 px-8 pb-6 pt-9 shadow;

    .subheader {
        @apply mb-3 mt-0 text-xl font-semibold;
    }
}
</style>
