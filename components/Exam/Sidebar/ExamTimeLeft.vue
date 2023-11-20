<!-- Sidebar to display timer and controls for the exam -->
<script setup lang="ts">
type SidebarPositionType = 'left' | 'right'

const props = defineProps<{
    borderPosition: SidebarPositionType
    timeLeft: number
    isPaused: boolean
    hasTimeLimit: boolean
}>()

const pauseTime = inject<() => void>('pauseTime')

// Return formatted time
const formattedTime = computed(() => {
    return useFormatTime(props.timeLeft)
})
</script>

<template>
    <Sidebar :border-position="borderPosition">
        <!-- Timer -->
        <div class="font-semibold">
            <div class="flex justify-center gap-2">
                <font-awesome-icon icon="fa-regular fa-clock" class="mr-1 mt-0.5 text-primary text-3xl" />

                <div class="flex gap-2" v-if="hasTimeLimit">
                    <CountdownElement :value="formattedTime.hours" :label="'h'" />
                    <CountdownElement :value="formattedTime.minutes" :label="'min'" />
                    <CountdownElement :value="formattedTime.seconds" :label="'sec'" />
                </div>

                <div v-else>
                    <p class="text-2xl mt-0.5 pb-5">
                        Bez limitu czasowego
                    </p>
                </div>
            </div>
        </div>
        <!-- Timer -->

        <!-- Exam controls -->
        <button class="btn-ghost btn text-primary text-lg mt-2" @click="pauseTime" v-if="hasTimeLimit">
            <font-awesome-icon icon="fa-solid fa-pause" class="text-2xl mr-2" />
            pauza
        </button>
    </Sidebar>
</template>

<style lang="scss" scoped></style>
