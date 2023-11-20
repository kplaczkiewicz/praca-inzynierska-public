<!-- Skeleton component for loading the exam finished -->
<script setup lang="ts"></script>

<template>
    <!-- Exam title -->
    <div class="loading-div h-[180px] mb-20"></div>
    <!-- Exam title -->

    <div class="exam-container exam-finished container !pt-0">
        <!-- Score -->
        <div class="flex flex-col items-center mb-24">
            <div class="loading-div w-[400px] h-16 mb-10"></div>
            <div class="loading-div w-[800px] h-[150px] mb-14"></div>
            <div class="loading-div w-[500px] h-20 "></div>
        </div>
        <!-- Score -->

        <!-- Questions -->
        <div class="mb-20" v-for="index in 4" :key="index">
            <div class="loading-div w-[250px] h-12 mb-6"></div>
            <div class="loading-div h-[200px] mb-8"></div>
            <div class="loading-div h-[250px] prose mx-auto"></div>
        </div>
        <!-- Questions -->
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/partials/skeleton.scss';
</style>
