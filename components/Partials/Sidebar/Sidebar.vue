<!-- Wrapper for all sidebars -->
<script setup lang="ts">
defineProps<{
    borderPosition: string
}>()
</script>

<template>
    <div class="sidebar" :class="`gradient-border-${borderPosition} gradient-secondary`">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.sidebar {
    @apply sticky top-28 h-fit rounded bg-white px-6 pb-2 pt-6 text-center shadow border border-neutral/20;
}
</style>
