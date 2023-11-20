<!-- Form label -->
<script setup lang="ts">
defineProps<{
    text: string
    for: string
    icon: string
}>()
</script>

<template>
    <label class="label" :for="for">
        <span class="label-text">
            <font-awesome-icon :icon="icon" class="mr-1" />
            {{ text }}
        </span>
    </label>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/partials/form.scss';
</style>
