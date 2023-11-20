<!-- Single exam tier -->
<script setup lang="ts">
import { examTierType, colorType } from '@/server/types'

defineProps<{
    color: colorType
    selectedExamTier: examTierType
    examTier: examTierType
    changeExamTier: (tier: examTierType) => void
}>()
</script>

<template>
    <div
        ref="examTier"
        @click="changeExamTier(examTier)"
        @keypress.space.enter.prevent="changeExamTier(examTier)"
        :class="[selectedExamTier == examTier ? 'active' : '', `exam-tier-${color}`]"
        tabindex="0"
    >
        <slot />
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/utilities/animations.scss';

div {
    @apply flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-primary bg-white bg-center bg-no-repeat px-3 py-5 text-sm transition-all duration-500 max-sm:min-h-[5rem] sm:text-base;

    &:hover,
    &.active {
        @apply bg-primary/20 duration-300;
        box-shadow: 0 0 15px -3px hsl(var(--p) / 0.35);
    }

    &.exam-tier-secondary {
        @apply border-secondary;

        &:hover,
        &.active {
            @apply bg-secondary/20;
            box-shadow: 0 0 15px -3px hsl(var(--s) / 0.35);
        }
    }

    &.exam-tier-accent {
        @apply border-accent;

        &:hover,
        &.active {
            @apply bg-accent/20;
            box-shadow: 0 0 15px -3px hsl(var(--a) / 0.35);
        }
    }

    &.active {
        animation: pulse 0.15s linear;
    }

    svg {
        @apply mr-2 text-lg;
    }
}

@include pulse-animation('pulse', 0.95);
</style>
