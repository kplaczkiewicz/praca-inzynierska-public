<!-- Filter buttons that opens the dropdown -->
<script setup lang="ts">
defineProps<{
    label: string
}>()
</script>

<template>
    <label tabindex="0" class="dropdown-label btn btn-neutral btn-outline bg-base-400">
        <font-awesome-icon icon="fa-solid fa-filter" class="mr-1" />
        {{ label }}
    </label>
</template>

<style scoped></style>
