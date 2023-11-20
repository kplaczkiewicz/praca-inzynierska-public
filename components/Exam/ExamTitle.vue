<!-- Page title -->
<script setup lang="ts">
defineProps<{
    title: string | undefined
    icon: string
    subtitle?: string
    tags?: string[]
    date?: string | undefined
}>()
</script>

<template>
    <div class="page-title prose bg-gradient-to-r">
        <div class="container px-28">
            <!-- Exam date -->
            <p class="mb-3 mt-0 font-semibold text-primary-content" v-if="date">
                <font-awesome-icon icon="fa-solid fa-calendar-days" class="mr-1 text-xl" />
                {{ date }}
            </p>

            <!-- The title -->
            <h1 class="m-0 text-primary-content">
                <font-awesome-icon :icon="icon" class="mr-2.5" />
                {{ title }}
            </h1>

            <h2 class="mb-0 mt-2 text-primary-content" v-if="subtitle && !tags?.length">{{ subtitle }}</h2>

            <div class="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3 text-white" v-if="tags?.length && tags[0] !== ''">
                <div class="badge badge-outline badge-lg transition-all" v-for="tag in tags" :key="tag">
                    {{ tag.toLowerCase() }}
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-title {
    @apply max-w-none pb-14 pt-9 text-center;
    clip-path: ellipse(80% 100% at 50% 0%);
}
</style>
