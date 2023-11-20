<script setup lang="ts">
defineProps<{
    title: string
    icon: string
    background_image: string
}>()
</script>

<template>
    <div class="prose max-w-none relative bg-center bg-cover" :style="`background-image: url('${background_image}')`">
        <div class="container px-28 text-center py-12">
            <h1 class="text-primary-content m-0 text-5xl">
                <font-awesome-icon :icon="icon" class="mr-4" />
                {{ title }}
            </h1>
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>