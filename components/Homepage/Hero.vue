<!-- Hero for homepage -->
<script setup lang="ts">
defineProps<{
    arrowClick(): void
}>()
</script>

<template>
    <div class="hero">
        <ClientOnly>
            <div class="hero-inside">
                <h2
                    class="mb-5 mt-0 font-secondary text-3xl italic text-accent"
                    v-motion
                    :initial="{
                        opacity: 0,
                        y: 60,
                    }"
                    :visibleOnce="{
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 600,
                            delay: 100,
                        },
                    }"
                >
                    Twoje miejsce do nauki matematyki
                </h2>
                <h1
                    class="text-gradient mb-8 text-8xl tracking-wide"
                    v-motion
                    :initial="{
                        opacity: 0,
                        y: 40,
                    }"
                    :visibleOnce="{
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 800,
                        },
                    }"
                >
                    Mathlink
                </h1>

                <!-- Hero buttons -->
                <div class="mt-12 flex gap-10">
                    <NuxtLink
                        class="btn btn-accent btn-wide"
                        to="/arkusze"
                        v-motion
                        :initial="{
                            opacity: 0,
                            x: -30,
                        }"
                        :visibleOnce="{
                            opacity: 1,
                            x: 0,
                            transition: {
                                duration: 500,
                                delay: 300,
                            },
                        }"
                    >
                        <font-awesome-icon icon="fa-solid fa-graduation-cap" class="mb-0.5 mr-1 text-lg" />
                        Rozwiązuj arkusze
                    </NuxtLink>

                    <NuxtLink
                        class="btn btn-primary btn-wide"
                        to="/zadania/losuj"
                        v-motion
                        :initial="{
                            opacity: 0,
                            x: 30,
                        }"
                        :visibleOnce="{
                            opacity: 1,
                            x: 0,
                            transition: {
                                duration: 400,
                                delay: 300,
                            },
                        }"
                    >
                        <font-awesome-icon icon="fa-solid fa-square-poll-vertical" class="mr-1 text-lg" />
                        Rozwiązuj zadania
                    </NuxtLink>
                </div>
                <!-- Hero buttons -->
            </div>

            <div
                class="absolute bottom-5 left-1/2 z-[1]"
                v-motion
                :initial="{
                    opacity: 0,
                    scale: 0.9,
                }"
                :visibleOnce="{
                    opacity: 1,
                    scale: 1,
                    transition: {
                        duration: 400,
                        delay: 800,
                    },
                }"
            >
                <button class="-translate-x-1/2 transition-transform hover:translate-y-2" @click="arrowClick">
                    <font-awesome-icon icon="fa-solid fa-angles-down" class="text-5xl text-primary" />
                </button>
            </div>
        </ClientOnly>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/utilities/animations.scss';

.hero {
    @apply relative border-b-2 border-neutral/50 bg-white bg-cover bg-center;
    min-height: calc(100vh - var(--headerHeight, 6rem));
    background-image: url('/svg/backgrounds/scribble-primary-accent.svg');

    &::after {
        @apply absolute inset-0;
        z-index: 0;
        content: '';
        background: radial-gradient(
            circle,
            rgb(247, 248, 248) 0%,
            rgb(247, 248, 248, 0.85) 50%,
            rgba(255, 255, 255, 0) 100%
        );
    }

    .hero-inside {
        @apply z-[1] text-center;
        margin-top: calc(var(--headerHeight, 6rem) * -1);
    }
}
</style>
