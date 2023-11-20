<script setup lang="ts">
defineProps<{
    title: string
    smallText: string
    smallTextIcon: string
    progressLabel: string
    progressValue: number
    progressValueLabel: string
    buttonLink: string
    buttonText: string
    colorTheme: 'primary' | 'secondary' | 'accent'
}>()
</script>

<template>
    <div class="flex items-center justify-between gap-12 text-left">
        <div class="flex-1">
            <!-- Title and time left -->
            <div class="flex gap-4 justify-between">
                <h3 class="mb-0 mt-0">
                    <font-awesome-icon icon="fa-solid fa-star" class="mb-px mr-1" :class="`text-${colorTheme}`" />
                    {{ title }}
                </h3>

                <div class="mt-0.5 shrink-0 text-right">
                    <font-awesome-icon :icon="smallTextIcon" class="-mb-px mr-2" :class="`text-${colorTheme}`" />
                    <span class="text-sm font-medium">
                        {{ smallText }}
                    </span>
                </div>
            </div>
            <!-- Title and time left -->

            <!-- Exam percantage -->
            <div class="-mb-1.5 mt-2 flex w-full justify-between text-sm font-medium">
                <span class="text-left">{{ progressLabel }}</span>
                <span class="text-right">
                    {{ progressValueLabel }}
                </span>
            </div>

            <progress
                class="progress w-full"
                :class="`progress-${colorTheme}`"
                :value="progressValue"
                :max="100"
            ></progress>
            <!-- Exam percantage -->
        </div>

        <div class="shrink-0">
            <NuxtLink
                class="btn-icon-move-right btn w-full"
                :class="`btn-${colorTheme}`"
                :to="buttonLink"
            >
                {{ buttonText }}
                <font-awesome-icon icon="fa-solid fa-arrow-right-long" class="ml-1 text-lg" />
            </NuxtLink>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.progress-secondary {
    &::-moz-progress-bar,
    &::-webkit-progress-bar {
        @apply bg-secondary;
    }
}

.progress-accent {
    &::-moz-progress-bar,
    &::-webkit-progress-bar {
        @apply bg-accent;
    }
}
</style>
