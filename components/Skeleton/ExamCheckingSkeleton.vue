<!-- Skeleton component for loading the exam checking -->
<script setup lang="ts"></script>

<template>
    <!-- Exam title -->
    <div class="loading-div h-[180px]"></div>
    <!-- Exam title -->

    <!-- Questions -->
    <div class="exam-container exam-finished container">
        <div class="mb-24" v-for="index in 2" :key="index">
            <div class="loading-div w-[300px] h-12 mb-5"></div>
            <div class="flex gap-10 mb-6">
                <div class="loading-div h-[500px] w-full"></div>
                <div class="loading-div h-[500px] w-full"></div>
            </div>
        </div>
    </div>
    <!-- Questions -->
</template>

<style scoped lang="scss">
@import '@/assets/scss/partials/skeleton.scss';
</style>
