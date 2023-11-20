<!-- Skeleton component for loading the random select filters -->
<script setup lang="ts">
defineProps<{
    quantity: number
}>()
</script>

<template>
    <!-- Selects -->
    <div v-for="n in quantity" class="mb-6" :key="n">
        <div class="loading-div h-10 w-[250px] mb-2"></div>
        <div class="loading-div h-10 w-full"></div>
    </div>

    <!-- Info and button -->
    <div class="loading-div h-14 w-full mb-10"></div>
    <div class="loading-div h-12 w-full"></div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/partials/skeleton.scss';
</style>
