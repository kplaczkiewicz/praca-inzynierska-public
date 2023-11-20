<!-- Content for open questions, mostly storing user answers -->
<script setup lang="ts">
import { questionType, toastType } from '~/server/types'
import ImageLightbox from '@/components/Base/ImageLightbox/ImageLightbox.vue'

const props = defineProps<{
    question: questionType
    selectedAnswer: string | string[] | undefined
    questionId: number
}>()

// Show message about upload
const toasts = useState<toastType[]>('toasts', () => [])

// Save buttons as ref for scrolling uploaded answer into view
const userAnswersElement = ref<HTMLElement | null>(null)

// Get function from Exam component
const selectAnswer = inject<(questionId: number, answer: string | string[]) => void>('selectAnswer', () => {})

// Get the selected answer
const userAnswers = ref<string[]>([])
userAnswers.value = (props.selectedAnswer as string[]) || []

// Add user answer
function addUserAnswer(answer: string) {
    userAnswers.value.push(answer)

    // Scroll answers into view
    userAnswersElement.value?.scrollIntoView({ block: 'center' })
}

// Remove user answer by index
function removeUserAnswer(index: number) {
    userAnswers.value.splice(index, 1)

    // Show toast
    toasts.value.push({
        message: 'Usunięto zdjęcie',
        status: 'info',
    })
}

// Update the cookie
watch(userAnswers.value, (userAnswersNew) => {
    selectAnswer(props.questionId, userAnswersNew)
})

// Control the image lightbox
const imageLightbox = ref<InstanceType<typeof ImageLightbox>>()

// Animation of images
import { useAutoAnimate } from '@formkit/auto-animate/vue'
const [imageWrapper] = useAutoAnimate()

// Toggle drawing canvas
const whiteboard = ref(false)

// Transform question for the whiteboard
const questionWhiteboard = useTransformQuestionCanvas(props.question, 'question');

function toggleWhiteboard() {
    // Hide upload answer if open
    if (uploadAnswer.value?.style.display !== 'none') {
        toggleUploadAnswer()
    }

    whiteboard.value = !whiteboard.value
}

// Toggle upload answer
const uploadAnswer = ref<HTMLElement>()

// Has to be done like this because using v-if caused problems with uppy
function toggleUploadAnswer() {
    // Prevent errors
    if (!uploadAnswer.value) return

    if (uploadAnswer.value.style.display === 'none') {
        // Fade in
        uploadAnswer.value!.style.display = 'block'
        uploadAnswer.value.classList.add('fade-in')

        setTimeout(() => {
            uploadAnswer.value!.classList.remove('fade-in')
            // Scroll upload into view
            uploadAnswer.value?.scrollIntoView({ block: 'center' })
        }, 300)
    } else {
        // Fade out
        uploadAnswer.value.classList.add('fade-out')

        setTimeout(() => {
            uploadAnswer.value!.style.display = 'none'
            uploadAnswer.value!.classList.remove('fade-out')
        }, 300)
    }
}

// Disable scroll on overlay
const bodyOverflowHidden = useState('overflowHidden', () => false)

watchEffect(() => {
    bodyOverflowHidden.value = whiteboard.value
})
</script>

<template>
    <div class="prose mt-6 max-w-none">
        <!-- Drawing canvas -->
        <TransitionWrapper name="fade" class="z-[100] w-full">
            <Whiteboard :question="questionWhiteboard" :add-answer="addUserAnswer" :toggle-whiteboard="toggleWhiteboard" v-if="whiteboard" />
        </TransitionWrapper>
        <!-- Drawing canvas -->

        <p class="mb-5 mt-12 text-xl font-medium">
            <font-awesome-icon icon="fa-solid fa-pen-to-square" class="mr-2 text-xl text-accent" />Twoje rozwiązanie:
        </p>

        <!-- User current answer -->
        <div class="mb-9 mt-0 text-lg" ref="userAnswersElement">
            <!-- No answer -->
            <div v-if="userAnswers.length === 0">
                <font-awesome-icon icon="fa-solid fa-ban" class="mr-3 text-lg text-error" />Brak rozwiązania

                <h3 class="text-center mt-4">
                    <font-awesome-icon icon="fa-solid fa-turn-down" class="-mb-2.5 mr-5 text-accent text-3xl" flip="horizontal" />
                    Dodaj rozwiązanie
                    <font-awesome-icon icon="fa-solid fa-turn-down" class="-mb-2.5 ml-5 text-accent text-3xl" />
                </h3>
            </div>
            <!-- No answer -->

            <!-- Answers uploaded by the user -->
            <div class="user-answer-images" ref="imageWrapper" v-else>
                <div v-for="(answer, index) in userAnswers" :key="index">
                    <img :src="answer" @click="imageLightbox?.toggleLightbox(index)" />
                    <font-awesome-icon icon="fa-solid fa-xmark" class="remove-image" @click="removeUserAnswer(index)" />
                </div>
            </div>
            <!-- Answers uploaded by the user -->
        </div>
        <!-- User current answer -->
        
        <!-- Upload answer -->
        <div ref="uploadAnswer" style="display: none">
            <UploadAnswer :add-answer="addUserAnswer" />
        </div>
        <!-- Upload answer -->

        <!-- Answer options -->
        <div class="flex justify-center gap-4">
            <button class="btn btn-primary min-w-[300px]" @click="toggleWhiteboard()">
                <font-awesome-icon icon="fa-solid fa-chalkboard-user" class="mr-0.5 text-lg" />
                Otwórz tablicę
            </button>
            <button class="btn btn-secondary min-w-[300px]" @click="toggleUploadAnswer()">
                <font-awesome-icon icon="fa-solid fa-paperclip" class="mr-0.5 text-lg" />
                Prześlij rozwiązanie
            </button>
        </div>
        <!-- Answer options -->
    </div>

    <!-- Images lightbox -->
    <ImageLightbox ref="imageLightbox" :images="userAnswers" />
</template>

<style lang="scss" scoped>
@import '@/assets/scss/utilities/animations.scss';

.user-answer-images {
    @apply grid grid-cols-4 gap-6;

    > div {
        @apply relative aspect-[4/3];

        img {
            @apply m-0 h-full w-full cursor-pointer rounded border-2 border-neutral object-cover brightness-95;
        }
        .remove-image {
            @apply absolute -right-2 -top-2 aspect-square cursor-pointer rounded-full bg-error p-1 text-error-content transition-colors;

            &:hover {
                background-color: darken(hsl(354 77% 52%), 10%);
            }
        }
    }
}

.fade-in {
    animation: fade-in 0.3s ease;
}

.fade-out {
    animation: fade-in 0.3s ease reverse;
}

@include move-animation('fade-in', 0 1rem, 0);
</style>
