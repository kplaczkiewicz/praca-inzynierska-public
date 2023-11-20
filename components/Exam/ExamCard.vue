<script setup lang="ts">
import { examCompactTypeFormatted } from '~/server/types';

defineProps<{
    exam: examCompactTypeFormatted
    index: number
}>()

// Color helper
const colorVariants = useColorVariants()
</script>

<template>
    <div class="exam-card group" :style="`--variant: var(--${colorVariants[index % 3]});`">
        <div class="flex flex-col h-full gap-2 justify-between relative px-8 py-6 text-center">
            <div>
                <p class="mb-2">
                    <font-awesome-icon icon="fa-solid fa-calendar-days" class="mb-px mr-1" />
                    {{ exam.date }}
                </p>
                <h2 class="mb-4 text-3xl font-bold">{{ exam.title }}</h2>
            </div>

            <span
                class="flex items-center justify-center gap-2 rounded-lg border-2 border-current px-4 py-2 transition-colors"
            >
                <span>Rozwiąż</span>
                <font-awesome-icon icon="fa-solid fa-arrow-right-long" class="group-hover:translate-x-1.5 transition-transform" />
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.exam-card {
    @apply relative cursor-pointer overflow-hidden border-2 bg-white shadow transition-all duration-500 hover:text-primary-content rounded-xl;
    
    border-color: hsl(var(--variant) / 1);
    box-shadow: 0 10px 15px -3px hsl(var(--variant) / 0.15);

    &::before {
        @apply absolute -left-[125%] top-0 z-0 h-full w-[125%] transition-all duration-700;
        clip-path: ellipse(100% 125% at 0% 50%);
        background-color: hsl(var(--variant) / 1);
        content: '';
    }

    &:hover {
        &::before {
            @apply left-0;
        }
    }
}
</style>
