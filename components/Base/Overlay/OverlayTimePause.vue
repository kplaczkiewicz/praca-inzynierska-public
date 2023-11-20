<!-- Overlay for time paused -->

<script setup lang="ts">
const props = defineProps<{
    timeLeft: number
}>()

const pauseTime = inject<() => void>('pauseTime')

// Return formatted time
const formattedTime = computed(() => {
    return useFormatTime(props.timeLeft)
})
</script>

<template>
    <div class="time-paused-overlay overlay prose !z-[1099]">
        <div class="text-center z-10">
            <h1>Czas zatrzymany!</h1>

            <h2>
                <font-awesome-icon icon="fa-solid fa-clock" class="mr-2 text-primary" />
                Pozostały czas:
                <CountdownSimple
                    class="ml-1 text-primary"
                    :hours="formattedTime.hours"
                    :minutes="formattedTime.minutes"
                    :seconds="formattedTime.seconds"
                />
            </h2>

            <button class="btn-icon-move-right btn btn-primary btn-wide mt-4" @click="pauseTime">
                <font-awesome-icon icon="fa-solid fa-play" class="mr-2 text-2xl" />
                Wznów
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.time-paused-overlay {
    @apply max-w-none bg-cover bg-center;
    background-image: url('/svg/waves/bg-waves-green.svg');
}
</style>
