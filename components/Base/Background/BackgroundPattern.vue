<script setup lang="ts">
import { backgroundPatternType } from '~/server/types'

// Get the current background pattern
const backgroundPattern = useState<backgroundPatternType>('backgroundPattern')
</script>

<template>
    <div class="background-overlay pattern-overlay" :class="`background-${backgroundPattern}`"></div>
</template>

<style lang="scss" scoped>
.pattern-overlay {
    @apply z-0 bg-contain bg-center max-sm:hidden;

    &::after {
        @apply container block h-full w-full bg-base-400 px-0 blur-3xl;
        content: '';
    }

    &.background-dots {
        @apply opacity-40;
        background-size: 200px;
        background-image: url('/svg/patterns/dots.svg');
    }

    &.background-dots-grid {
        @apply opacity-[0.15];
        background-size: 200px;
        background-image: url('/svg/patterns/dots-grid.svg');
    }

    &.background-dots-empty {
        @apply opacity-40;
        background-size: 200px;
        background-image: url('/svg/patterns/dots-empty.svg');
    }

    &.background-dots-half-empty {
        @apply opacity-30;
        background-size: 200px;
        background-image: url('/svg/patterns/dots-half-empty.svg');
    }

    &.background-dots-random-size {
        @apply opacity-30;
        background-size: 200px;
        background-image: url('/svg/patterns/dots-random-size.svg');
    }

    &.background-dots-random-size-primary {
        @apply opacity-40;
        background-size: 300px;
        background-image: url('/svg/patterns/dots-random-size-color.svg');

        &::after {
            @apply max-w-6xl;
        }
    }

    &.background-grid {
        @apply opacity-10;
        background-size: 150px;
        background-image: url('/svg/patterns/grid.svg');
    }

    &.background-squares {
        @apply opacity-20;
        background-size: 175px;
        background-image: url('/svg/patterns/squares.svg');
    }

    &.background-squares-half-empty {
        @apply opacity-25;
        background-size: 200px;
        background-image: url('/svg/patterns/squares-half-empty.svg');
    }

    &.background-rhombi {
        @apply opacity-20;
        background-size: 225px;
        background-image: url('/svg/patterns/rhombi.svg');
    }

    &.background-rhombi-and-squares {
        @apply opacity-20;
        background-size: 250px;
        background-image: url('/svg/patterns/rhombi-and-squares.svg');
    }

    &.background-rhombi-half-empty {
        @apply opacity-40;
        background-size: 225px;
        background-image: url('/svg/patterns/rhombi-half-empty.svg');
    }

    &.background-oscillate-primary {
        @apply background-oscillate;
        background-image: url('/svg/backgrounds/oscillate-primary-secondary.svg');
    }

    &.background-oscillate-secondary {
        @apply background-oscillate;
        background-image: url('/svg/backgrounds/oscillate-secondary-accent.svg');
    }

    &.background-oscillate-accent {
        @apply background-oscillate;
        background-image: url('/svg/backgrounds/oscillate-primary-accent.svg');
    }

    &.background-ten-primary {
        @apply background-ten;
        background-image: url('/svg/backgrounds/ten-primary.svg');
    }

    &.background-ten-secondary {
        @apply background-ten;
        background-image: url('/svg/backgrounds/ten-secondary.svg');
    }

    &.background-ten-accent {
        @apply background-ten;
        background-image: url('/svg/backgrounds/ten-accent.svg');
    }
}

.background-oscillate {
    @apply bg-cover opacity-80;
    background-position: center 65%;

    &::after {
        @apply max-w-3xl;
    }
}

.background-ten {
    @apply bg-contain bg-fixed bg-center opacity-20;

    &::after {
        @apply max-w-6xl;
    }
}
</style>
