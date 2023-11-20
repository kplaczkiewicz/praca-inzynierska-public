<!-- Canvas where user can draw like on a whiteboard -->

<script setup lang="ts">
import { userCurrentExamType, toastType, canvasOptionsType, canvasQuestionType } from '~/server/types'

import VueDrawingCanvas from '~/modules/vue-drawing-canvas/vue-drawing-canvas'

// Supabase
const supabase = useSupabaseClient()
const runtimeConfig = useRuntimeConfig()

const props = defineProps<{
    question: canvasQuestionType
    toggleWhiteboard: () => void
    imageStateName?: string
    addAnswer?: (answer: string) => void
}>()

// Get user id from cookie
const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())

// Store the canvas
const canvas = ref()

// All canvas settings changed using sidebar
const canvasOptions = useState<canvasOptionsType>(`canvas-settings-${props.question.question_id}`, () => canvasOptionsDefault())

function canvasOptionsDefault() {
    return <canvasOptionsType>{
        eraser: false,
        lineWidth: 5,
        lineColor: '#000000',
        strokeType: 'dash',
        canvasAdditionalImage: undefined
    }
}

// Save image width and height
const additionalImageSize = useState(`additional-image-size-${props.question.question_id}`, () => {
    return {
        width: 0,
        height: 0
    }
})

// If image exists set canvas image
if (props.question.image_url && !canvasOptions.value.canvasAdditionalImage?.src) {
    let imageData = (await imageURLToDataUrl(props.question.image_url)) as string

    canvasOptions.value.canvasAdditionalImage = {
        src: imageData,
        x: 0,
        y: 0,
        show: true
    }
}

// Save the canvas when exiting
const canvasPreviousImage = useState(`canvasPreviousImage-${props.question.question_id}`, () => [])

function closeWhiteboard() {
    canvasPreviousImage.value = canvas.value.getAllStrokes()
    props.toggleWhiteboard()
}

// Save canvas image
const canvasImage = ref('')

// Upload modal
const uploadModal = useState('uploadingImageModal', () => ref<HTMLDialogElement | null>(null))
const uploadStatus = ref<'in_progress' | 'success' | 'error'>('in_progress')

// Show message about upload
const toasts = useState<toastType[]>('toasts', () => [])

// Pause the time on image upload
const pauseTime = inject<() => void>('pauseTime')

const isPending = ref(false)

// Save image on server and in user answers
async function saveImage() {
    try {
        // Show loader
        isPending.value = true
        if (pauseTime) pauseTime()
        uploadStatus.value = 'in_progress'
        uploadModal.value?.showModal();
        
        // Convert dataURL to blob
        const fetchImage = await fetch(canvasImage.value)
        const blobImage = await fetchImage.blob()
		
        // Upload options
        const fileName = `${userCurrentExam.value.id}/zadanie-${props.question.question_number}-${crypto.randomUUID()}.jpg`
        const uploadOptions = {
            contentType: 'image/jpeg',
        }

        // Upload image
        const { data, error } = await supabase.storage
            .from('question_answers_temp')
            .upload(fileName, blobImage, uploadOptions)

        // Handle error
        if (error || !data) throw error

        // Add to user answers
        props.addAnswer?.(`${runtimeConfig.public.supabase.url}/storage/v1/object/public/question_answers_temp/${data.path}`);

        // Show toast
        toasts.value.push({
            message: "Pomyślnie dodano zdjęcie",
            status: 'success'
        })

        // Show message
        uploadStatus.value = 'success'
    } catch (err: any) {
        // Show error message
        uploadStatus.value = 'error'

        // Show toast
        toasts.value.push({
            message: "Wystąpił błąd przy dodawaniu zdjęcia",
            status: 'error'
        })
    } finally {
        // Hide loader
        setTimeout(() => {
			if (pauseTime) pauseTime()
            uploadModal.value?.close();
            isPending.value = false
        }, 2000)
    }
}

// Get window width for refresh
const { width, height } = useWindowSize()

// Calculate canvas size
const topBar = ref<HTMLElement>()
const sidebar = ref<HTMLElement>()
const canvasWidth = useState(`canvas-width-${props.question.question_id}`, () => 0)
const canvasHeight = useState(`canvas-height-${props.question.question_id}`, () => 0)

// Set canvas size on render
onMounted(() => {
    canvasWidth.value = width.value - (sidebar.value?.clientWidth ?? 0)
    canvasHeight.value = height.value - (topBar.value?.clientHeight ?? 0)
})

// Add the key so canvas will be redrawn after hiding the question
const topBarKey = ref(0)

// Update canvas width on resize
watch([width, topBarKey], () => {
    if (process.client) {
        canvasWidth.value = width.value - (sidebar.value?.clientWidth ?? 0)
        canvasHeight.value = height.value - (topBar.value?.clientHeight ?? 0)

        // Delay the redraw
        canvas.value.redraw()
    }
}, { flush: 'post' })

// Update canvas on image change
watch(() => canvasOptions.value.canvasAdditionalImage, () => {
    canvas.value.redraw()
}, { deep: true })

// If question type is image update the canvas image
watch(canvasImage, newCanvasImage => {
    if (props.imageStateName) {
        const canvasImageState = useState(props.imageStateName, () => "")
        canvasImageState.value = newCanvasImage
    }
})

// Custom to prevent default action
const { ctrl_s } = useMagicKeys({
    passive: false,
    onEventFired(e) {
        if (e.ctrlKey && e.key === 's' && e.type === 'keydown') e.preventDefault()
    },
})

watch(ctrl_s, (isPressed) => {
  if (isPressed && props.question.type === 'open_question' && !isPending.value) saveImage()
})

// Convert image to dataURL to avoid canvas errors
async function imageURLToDataUrl(imageUrl: string) {
    try {
        // Fetch the image data from the URL
        const response = await fetch(imageUrl)
        const blob = await response.blob()

        // Create a FileReader to read the image data as a Data URL
        const reader = new FileReader()

         // Create an Image element to get the width and height
         const image = new Image();

        // Set up a promise to handle the FileReader's asynchronous operation
        const dataUrlPromise = new Promise((resolve, reject) => {
            reader.onload = () => {
                // When the FileReader is done, set the Data URL as the src of the Image element
                image.src = reader.result as string;

                // Once the image is loaded, you can access its width and height
                image.onload = () => {
                    additionalImageSize.value.width = image.naturalWidth;
                    additionalImageSize.value.height = image.naturalHeight;
                    resolve(reader.result);
                };
            };
            reader.onerror = reject;
        });

        // Read the image data as a Data URL
        reader.readAsDataURL(blob)

        // Wait for the promise to resolve and return the Data URL
        const dataUrl = await dataUrlPromise
        return dataUrl
    } catch (error) {
        console.error('Error converting image to Data URL:', error)
        return undefined
    }
}
</script>

<template>
    <div class="overlay !place-items-start bg-white">
        <div class="prose flex w-full max-w-none">
            <!-- Sidebar with controls -->
            <div class="flex items-start max-h-screen border-r-2 border-neutral" ref="sidebar">
                <WhiteboardSidebar
                    :save-image="saveImage"
                    :question="question"
                    :canvas="canvas"
                />
            </div>
            <!-- Sidebar with controls -->

            <div class="flex-1">
                <!-- Top bar -->
                <div ref="topBar">
                    <WhiteboardTopBar :question="question" :toggle-whiteboard="closeWhiteboard" :on-update="() => topBarKey++" />
                </div>
                <!-- Top bar -->

                <!-- Canvas -->
                <VueDrawingCanvas
                    class="cursor-crosshair"
                    v-model:image="canvasImage"
                    line-join="round"
                    line-cap="round"
                    background-image="/img/whiteboard-pattern.png"
                    :width="canvasWidth"
                    :height="canvasHeight"
                    :initialImage="canvasPreviousImage"
                    :additional-image="canvasOptions.canvasAdditionalImage?.show ? canvasOptions.canvasAdditionalImage : undefined"
                    :eraser="canvasOptions.eraser"
                    :line-width="canvasOptions.lineWidth"
                    :color="canvasOptions.lineColor"
                    :stroke-type="canvasOptions.strokeType"
                    ref="canvas"
                />
                <!-- Canvas -->

                <!-- Upload image overlay -->
                <ModalUploadingImage :upload-status="uploadStatus" />
                <!-- Upload image overlay -->
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/utilities/helpers.scss';
</style>
