<!-- Title for homepage with animations -->
<script setup lang="ts">
defineProps<{
    title: string
    subtitle: string
}>()
</script>

<template>
    <h3
        class="mt-0 font-secondary italic text-accent"
        v-motion
        :initial="{
            opacity: 0,
            y: 80,
        }"
        :visibleOnce="{
            opacity: 1,
            y: 0,
            transition: {
                delay: 200,
                duration: 350,
            },
        }"
    >
        {{ subtitle }}
    </h3>
    <h2
        class="text-5xl"
        v-motion
        :initial="{
            opacity: 0,
            y: 60,
        }"
        :visibleOnce="{
            opacity: 1,
            y: 0,
            transition: {
                delay: 300,
                duration: 300,
            },
        }"
    >
        {{ title }}
    </h2>
</template>

<style scoped></style>
