<!-- Skeleton component for loading the exam slider -->
<script setup lang="ts"></script>

<template>
    <!-- Exam slides -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        <div class="loading-div h-[250px]"></div>
        <div class="loading-div h-[250px] hidden md:block"></div>
        <div class="loading-div h-[250px] hidden xl:block"></div>
    </div>
    <!-- Exam slides -->
</template>

<style scoped lang="scss">
@import '@/assets/scss/partials/skeleton.scss';
</style>
