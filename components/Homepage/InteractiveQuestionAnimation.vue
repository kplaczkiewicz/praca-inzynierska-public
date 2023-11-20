<!-- Browser mockup with interactive question example -->
<script setup lang="ts">
const mathFieldTargetValue = [
    '',
    'V',
    'V=',
    'V=\\frac',
    'V=\\frac1',
    'V=\\frac13',
    'V=\\frac13\\cdot',
    'V=\\frac13\\cdot1',
    'V=\\frac13\\cdot16',
    'V=\\frac13\\cdot16\\cdot',
    'V=\\frac13\\cdot16\\cdot2',
    'V=\\frac13\\cdot16\\cdot2\\cdot',
    'V=\\frac13\\cdot16\\cdot2\\cdot\\sqrt',
    'V=\\frac13\\cdot16\\cdot2\\cdot\\sqrt7',
]

const mathFieldValue = ref('')
const duration = 3500

const showAnswerFeedback = ref(false)

const observer = ref<IntersectionObserver>()
const mockup = ref<HTMLElement>()

onMounted(() => {
    // Initialize the observer
    observer.value = new IntersectionObserver(handleIntersection, {
        rootMargin: '0px 0px -20% 0px', // Show at 75% of viewport
        threshold: 1,
    })

    if (mockup.value) {
        observer.value.observe(mockup.value)
    }
})

// Function for the observer
function handleIntersection(entries: any) {
    const entry = entries[0]

    // If element is visible start the animation
    if (entry.isIntersecting && observer.value && mockup.value) {
        setTimeout(() => {
            typewriterAnimation()
        }, 2000)
        observer.value.unobserve(mockup.value)
    }
}


function typewriterAnimation() {
    let startTime: number

    const typeAnswer = (timestamp: number) => {
        // Calculate progress based on time for different refresh rates
        if (!startTime) startTime = timestamp
        const progress = timestamp - startTime

        if (progress < duration) {
            // Increase the count
            mathFieldValue.value =
                mathFieldTargetValue.at(Math.floor((progress / duration) * mathFieldTargetValue.length)) + '|'
            requestAnimationFrame(typeAnswer)
        } else {
            // Set count to target count and finish the animation
            mathFieldValue.value = mathFieldTargetValue.at(-1) ?? ''

            setTimeout(() => {
                showAnswerFeedback.value = true
            }, 500)
        }
    }

    // Start the animation
    requestAnimationFrame(typeAnswer)
}


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
    <div class="mockup-browser flex h-full flex-col border-2 border-neutral/50 bg-base-300" ref="mockup">
        <div class="mockup-browser-toolbar">
            <div class="input before:!top-[45%] after:!top-[45%]">
                <span class="relative top-0.5"> https://mathlink.pl </span>
            </div>
        </div>

        <!-- An example of an interactive quesiton step -->
        <div class="flex-1 overflow-hidden bg-base-400 px-8 pb-8 pt-5">
            <p
                class="question-title mt-0"
                :style="`--variant: var(--p)`"
                v-motion
                :initial="{
                    opacity: 0,
                    y: -40,
                }"
                :visibleOnce="{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 350,
                        delay: 400,
                    },
                }"
            >
                Przykład
            </p>

            <p
                class="math-content mb-4 mt-0"
                ref="mathQuestion"
                v-motion
                :initial="{
                    opacity: 0,
                    y: -40,
                }"
                :visibleOnce="{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 350,
                        delay: 500,
                    },
                }"
            >
                Znamy już wartości **a=4** i **h=2\sqrt7**, możemy więc obliczyć objętość ostrosłupa.
            </p>

            <p
                class="math-content mb-3 mt-0"
                ref="mathAnnotation"
                v-motion
                :initial="{
                    opacity: 0,
                    x: -60,
                }"
                :visibleOnce="{
                    opacity: 1,
                    x: 0,
                    transition: {
                        duration: 350,
                        delay: 600,
                    },
                }"
            >
                <font-awesome-icon icon="fa-solid fa-circle-info" class="mr-0.5" />
                Oblicz objętość ostrosłupa **V**:
            </p>

            <ClientOnly>
                <div
                    v-motion
                    :initial="{
                        opacity: 0,
                        y: 50,
                    }"
                    :visibleOnce="{
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 400,
                            delay: 700,
                        },
                    }"
                >
                    <math-field
                        class="w-full rounded border-2 px-3 py-2 text-lg transition-colors"
                        :class="showAnswerFeedback ? 'border-success' : 'border-primary'"
                        :value="mathFieldValue"
                        readonly
                    >
                    </math-field>
                </div>
            </ClientOnly>

            <TransitionWrapper name="crossfade">
                <div class="mt-4 text-lg font-semibold text-success" v-if="showAnswerFeedback">
                    <font-awesome-icon icon="fa-solid fa-circle-check" class="mr-1.5 text-xl" />
                    Dobra odpowiedź
                </div>
            </TransitionWrapper>
        </div>
        <!-- An example of an interactive quesiton step -->
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/exam.scss';

.question-title {
    @apply mb-3 pl-1 text-[24px];

    &::before {
        @apply top-5 h-5 w-[165px];
    }
}
</style>
