<script setup lang="ts">
defineProps<{
    visible: boolean
    duration?: number
}>()
</script>

<template>
    <div class="slide-wrapper grid transition-all duration-300" :class="visible ? 'row-visible' : 'row-hidden'" :style="duration ? `transition-duration: ${duration}ms` : ''">
        <div class="overflow-hidden">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.slide-wrapper {
    &.row-visible {
        grid-template-rows: 1fr;
    }

    &.row-hidden {
        grid-template-rows: 0fr;
    }
}
</style>