<!-- Parent component for all toasts -->
<script setup lang="ts">
import { toastType } from '~/server/types'

// Store all toasts in state so that any component can add them
const toasts = useState<toastType[]>('toasts', () => [])

// Remove toast after 5s
watch(toasts.value, (newToasts) => {
    // Don't trigger again after removing the toast
    if (toasts.value.length < newToasts.length) return

    setTimeout(() => {
        toasts.value.shift()
    }, 5000)
})

// Animation of taosts
import { useAutoAnimate } from '@formkit/auto-animate/vue'
const [toastsWrapper] = useAutoAnimate()

// Get icon for toast type
function getIcon(type: string) {
    if (type === 'success') return "fa-solid fa-circle-check";
    else if (type === 'info') return "fa-solid fa-circle-info";
    else if (type === 'warning') return "fa-solid fa-circle-exclamation";
    else if (type === 'error') return "fa-solid fa-circle-xmark";
}
</script>

<template>
    <div class="toast toast-start z-[1200]" ref="toastsWrapper">
        <div v-for="(toast, i) in toasts" :key="i" :class="`alert alert-${toast.status} text-primary-content`">
            <font-awesome-icon :icon="getIcon(toast.status)" />
            <span>{{toast.message}}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.alert-success {
    @apply bg-success;
}

.alert-info {
    @apply bg-info;
}

.alert-error {
    @apply bg-error;
}

.alert-warning {
    @apply bg-warning;
}
</style>