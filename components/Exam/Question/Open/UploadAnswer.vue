<!-- Uppy form to upload answers as images -->
<script setup lang="ts">
import { userCurrentExamType, toastType } from '~/server/types'

// Import all Uppy dependecies
import { Dashboard } from '@uppy/vue'
import Uppy from '@uppy/core' // @ts-ignore
import Polish from '@uppy/locales/lib/pl_PL'
import XHR from '@uppy/xhr-upload'
import ImageEditor from '@uppy/image-editor'
import Webcam from '@uppy/webcam'

// Uppy css
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/image-editor/dist/style.min.css'
import '@uppy/webcam/dist/style.min.css'

// Custom css
import '@/assets/scss/vendor/uppy.scss'

const props = defineProps<{
    addAnswer: (answer: string) => void
}>()

// Get supabase key
const runtimeConfig = useRuntimeConfig()

// Show message about upload
const toasts = useState<toastType[]>('toasts', () => [])

// Get user id from cookie
const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())

// Uppy configuration
const uppy = new Uppy({
    locale: Polish,
    restrictions: {
        maxFileSize: 1024 * 1024 * 5, // 5 MB
        maxNumberOfFiles: 10,
        allowedFileTypes: ['image/jpeg', 'image/png'],
    },
})
    .use(XHR, {
        // No endpoint because it's set dynamically
        endpoint: '',
        headers: {
            authorization: `Bearer ${runtimeConfig.public.supabase.key}`,
        },
    })
    .use(ImageEditor, {
        locale: Polish,
    })

if (process.client) {
    uppy.use(Webcam, {
        modes: ['picture'],
        locale: {
            ...Polish,
            strings: {
                pluginNameCamera: 'Kamera'
            }
        },
    })
}

// Set correct upload url for each file
uppy.on('file-added', (file) => {
    const fileId = file.id

    // Add random string at the end of filename
    const lastDot = file.name.lastIndexOf('.')
    const name = file.name.slice(0, lastDot)
    const extension = file.name.slice(lastDot + 1)
    file.name = `${name}_${crypto.randomUUID()}.${extension}`

    // Change upload endpoint for a specific file
    uppy.setFileState(fileId, {
        xhrUpload: {
            endpoint: `${runtimeConfig.public.supabase.url}/storage/v1/object/question_answers_temp/${userCurrentExam.value.id}/${file.name}`,
        },
    })
})

// Store filenames after upload
uppy.on('upload-success', (file) => {
    if (!file) return
    props.addAnswer(
        `${runtimeConfig.public.supabase.url}/storage/v1/object/public/question_answers_temp/${userCurrentExam.value.id}/${file.name}`
    )

    // Show toast
    toasts.value.push({
        message: 'Pomyślnie dodano zdjęcie',
        status: 'success',
    })
})

uppy.on('upload-error', () => {
    // Show toast
    toasts.value.push({
        message: 'Wystąpił błąd przy dodawaniu zdjęcia',
        status: 'error',
    })
})

// Uppy dashboard props
const dashboardProps = {
    width: '100%',
    note: 'Dozwolone formaty: jpg, png / do 10 plików / maksymalny rozmiar pliku 5MB',
    locale: {
        strings: {
            editFile: 'Edycja pliku',
            editFileWithFilename: 'Edycja pliku %{file}',
            save: 'Zapisz',
        },
    },
}
</script>

<template>
    <div class="mb-10">
        <Dashboard :uppy="uppy" :props="dashboardProps" :plugins="['ImageEditor', 'Webcam']" />
    </div>
</template>

<style lang="scss"></style>
