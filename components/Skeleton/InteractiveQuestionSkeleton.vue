<!-- Skeleton component for loading the interactive question -->
<script setup lang="ts"></script>

<template>
    <!-- Exam title -->
    <div class="loading-div h-[230px] mb-20"></div>
    <!-- Exam title -->

    <div class="max-w-5xl mx-auto !pt-0">
        <!-- Questions -->
        <div class="mb-20" v-for="index in 4" :key="index">
            <div class="loading-div w-[250px] h-12 mb-6"></div>
            <div class="loading-div h-[100px] mb-8"></div>
            <div class="loading-div h-[250px] prose mx-auto"></div>
        </div>
        <!-- Questions -->
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/partials/skeleton.scss';
</style>
