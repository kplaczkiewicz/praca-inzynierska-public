
<!-- Skeleton component for loading the exam cards -->
<script setup lang="ts"></script>

<template>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        <!-- Exam cards -->
        <div class="loading-div h-[250px] rounded-xl" v-for="index in 12" :key="index"></div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/partials/skeleton.scss';
</style>
