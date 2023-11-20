<!-- Skeleton component for loading the exam -->
<script setup lang="ts"></script>

<template>
    <!-- Exam title -->
    <div class="loading-div h-[180px] mb-4"></div>
    <!-- Exam title -->

    <div class="exam-container container">
        <!-- Left sidebar -->
        <div class="loading-div h-[300px]"></div>
        <!-- Left sidebar -->

        <!-- Main exam container -->
            <div>
                <!-- Questions -->
                <div class="loading-div h-[200px] mb-6" v-for="index in 4" :key="index"></div>
                <!-- Questions -->
            </div>
        <!-- Main exam container -->

        <!-- Right sidebar -->
        <div class="loading-div h-[150px]"></div>
        <!-- Right sidebar -->
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/partials/skeleton.scss';
</style>
