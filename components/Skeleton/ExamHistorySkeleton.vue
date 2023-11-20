
<!-- Skeleton component for loading the user stats -->
<script setup lang="ts">
defineProps<{
    quantity: number
}>()
</script>

<template>
    <div class="flex items-center gap-12 mb-8" v-for="n in quantity" :key="n">
        <!-- Title -->
        <div class="loading-div w-full flex-1 h-[80px]"></div>
    
        <!-- Stat -->
        <div class="loading-div w-[150px] h-[50px]"></div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/partials/skeleton.scss';
</style>
