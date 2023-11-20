<!-- Layout for the pages that select random exams/questions -->
<script setup lang="ts"></script>

<template>
    <div class="base-container container relative">
        <div class="relative mx-auto max-w-2xl">
            <div class="random-card">
                <slot />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/utilities/animations.scss';

.random-card {
    @apply rounded-lg border-2 border-neutral bg-base-100 px-8 py-6 shadow-xl;
    animation: fade-in 0.4s ease;
}

@include move-animation('fade-in', 0 1rem, 0.7);
</style>
