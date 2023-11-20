<script setup lang="ts">
defineProps<{
    label: string
    buttonLabel: string
    buttonLink: string
}>()
</script>

<template>
    <div class="relative">
        <p class="mt-14 text-center text-4xl font-bold text-neutral">
            <font-awesome-icon icon="fa-solid fa-star" class="mr-3 text-accent" />
            {{ label }}
            <font-awesome-icon icon="fa-solid fa-star" class="ml-3 text-accent" />
        </p>

        <div class="mt-12 flex justify-center gap-4">
            <NuxtLink class="btn btn-primary btn-wide" to="/">
                <font-awesome-icon icon="fa-solid fa-house" class="mb-px mr-0.5 text-lg" />
                Strona główna
            </NuxtLink>

            <NuxtLink class="btn btn-secondary btn-wide" :to="buttonLink">
                <font-awesome-icon icon="fa-solid fa-rectangle-list" class="mb-px mr-0.5 text-lg" />
                {{ buttonLabel }}
            </NuxtLink>
        </div>
    </div>
</template>

<style scoped></style>
