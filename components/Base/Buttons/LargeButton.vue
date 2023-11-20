<script setup lang="ts">
defineProps<{
    text: string
    icon: string
}>()
</script>

<template>
    <button class="btn mx-auto flex px-12 text-lg relative">
        <font-awesome-icon :icon="icon" class="mb-px mr-3 text-2xl" />
        {{ text }}
        <font-awesome-icon :icon="icon" class="mb-px ml-3 text-2xl" />
    </button>
</template>

<style scoped></style>
