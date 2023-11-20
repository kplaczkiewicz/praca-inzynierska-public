<script setup lang="ts">
defineProps<{
    hours: string,
    minutes: string,
    seconds: string
}>()
</script>

<template>
    <span class="countdown font-mono">
        <span :style="`--value: ${hours}`"></span>:
        <span :style="`--value: ${minutes}`"></span>:
        <span :style="`--value: ${seconds}`"></span>
    </span>
</template>

<style scoped></style>