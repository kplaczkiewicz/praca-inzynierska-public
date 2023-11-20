<!-- Step controls - show explanation / go to next step -->
<script setup lang="ts">
const props = defineProps<{
    isCorrect: boolean
    hint: string
    explanation: string
    helpfulLinks: string[]
    showExplanationButton: boolean
    showGoNextButton: boolean
    nextStep: () => void
    toggleWhiteboard: () => boolean
}>()

// Control explanation and hit
const showExplanation = ref(!props.isCorrect)
const showHint = ref(false)

// Toggle hint and explanation
function toggleExplanation() {
    if (showHint.value) {
        showHint.value = false
        setTimeout(() => {
            showExplanation.value = !showExplanation.value
        }, 300)
    } else showExplanation.value = !showExplanation.value
}

function toggleHint() {
    if (showExplanation.value) {
        showExplanation.value = false
        setTimeout(() => {
            showHint.value = !showHint.value
        }, 300)
    } else showHint.value = !showHint.value
}

// Render math
const mathHint = ref<HTMLElement>()

const { renderMath, addMathClasses } = useDisplayMath()
onMounted(() => {
    renderMath()
    addMathClasses([mathHint.value])
})

// Render math on change
watch(showHint, () => {
    renderMath()
    addMathClasses([mathHint.value])
}, { flush: 'post' })
</script>

<template>
    <!-- Buttons -->
    <div class="my-10 flex justify-center gap-4">
        <button class="btn btn-primary btn-wide" @click="toggleWhiteboard">
            <font-awesome-icon icon="fa-solid fa-chalkboard-user" class="mb-px mr-1 text-lg" />
            Otwórz tablicę
        </button>

        <button class="btn btn-secondary btn-wide" @click="toggleHint">
            <font-awesome-icon icon="fa-solid fa-face-smile-wink" class="mb-0.5 mr-1 text-lg" />
            {{ showHint ? 'Ukryj' : 'Pokaż' }} podpowiedź
        </button>

        <button class="btn btn-accent btn-wide" @click="toggleExplanation" v-if="showExplanationButton">
            <font-awesome-icon icon="fa-solid fa-circle-info" class="mb-0.5 mr-1 text-lg" />
            {{ showExplanation ? 'Ukryj' : 'Pokaż' }} wyjaśnienie
        </button>
    </div>
    <!-- Buttons -->

    <!-- Explanation -->
    <TransitionWrapper name="fade-bottom">
        <QuestionExplanation
            class="mb-10"
            header-text="Wyjaśnienie:"
            :is-correct="false"
            :explanation="explanation"
            :helpful-links="helpfulLinks"
            :show-buttons="false"
            v-if="showExplanation"
        />
    </TransitionWrapper>
    <!-- Explanation -->

    <!-- Hint -->
    <TransitionWrapper name="fade-bottom">
        <div class="gradient-border-right relative mx-auto max-w-lg rounded bg-white px-6 py-4 shadow mb-10" v-if="showHint">
            <span class="mb-1 block text-lg font-semibold">
                <font-awesome-icon icon="fa-solid fa-face-smile-wink" class="mr-1" />
                Podpowiedź:
            </span>
            <span class="math-content" ref="mathHint">
                {{ hint }}
            </span>
        </div>
    </TransitionWrapper>
    <!-- Hint -->

    <!-- Next step -->
    <LargeButton class="btn btn-accent" icon="fa-solid fa-angles-down" text="Następny krok" @click="nextStep" v-if="showGoNextButton" />
    <!-- Next step -->
</template>

<style lang="scss" scoped></style>
