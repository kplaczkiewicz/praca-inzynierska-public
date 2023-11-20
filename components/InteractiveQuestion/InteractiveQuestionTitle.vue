<!-- Page header -->
<script setup lang="ts">
defineProps<{
    title: string | undefined
    icon: string
    tags: string[]
}>()
</script>

<template>
    <div class="page-header relative prose max-w-none pt-12 pb-[15.5rem] text-center">
        <!-- <div class="absolute inset-0 gg"></div> -->
        <div class="container">    
            <!-- The header -->
            <h1 class="text-primary-content m-0">
                <font-awesome-icon :icon="icon" class="mr-2.5" />
                {{ title }}
            </h1>

            <!-- Optional tags -->
            <div class="flex justify-center gap-4 text-white mt-6" v-if="tags">
                <div v-for="tag in tags" :key="tag">
                    <div class="badge badge-outline badge-lg transition-all">{{tag}}</div> 
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-header {
    @apply bg-center bg-cover;
    background-image: url('/svg/gradients/mesh-primary-secondary.svg');
}
</style>
