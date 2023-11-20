
<!-- Skeleton component for loading the user stats -->
<script setup lang="ts">
defineProps<{
    quantity: number
}>()
</script>

<template>
    <div v-for="n in quantity" class="mb-8" :key="n">
        <!-- Title -->
        <div class="loading-div w-[250px] h-[40px] mx-auto mb-4"></div>
    
        <!-- Stat -->
        <div class="loading-div max-w-3xl h-[100px] mx-auto"></div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/partials/skeleton.scss';
</style>
