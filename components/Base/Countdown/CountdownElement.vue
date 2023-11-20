<script setup lang="ts">
defineProps<{
    value: string
    label: string
}>()
</script>

<template>
    <div class="flex flex-col items-center">
        <span class="countdown font-mono text-4xl">
            <span :style="`--value: ${value}`"></span>
        </span>
        <span>{{label}}</span>
    </div>
</template>

<style scoped></style>
