<script setup lang="ts">
import { colorType } from '~/server/types';

defineProps<{
    title: string
    icon: string
    color: colorType
}>()

// Grab the activeTabTitle from the wrapper component
const activeTabTitle = ref(inject('activeTabTitle'))
</script>

<template>
    <div class="active-tab" v-if="activeTabTitle === title">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/utilities/animations.scss';

.active-tab {
    animation: fade-in 0.4s ease;
}

@include move-animation('fade-in', 0 1.25rem, 0.6);
</style>
