<!-- Form submit button -->
<script setup lang="ts">
defineProps<{
    text: string
    icon: string
    loading: boolean
}>()
</script>

<template>
    <button class="btn btn-primary mt-6 sm:mt-8" type="submit" :class="{ 'pointer-events-none' : loading }">
        <font-awesome-icon :icon="icon" class="-mt-0.5 mr-2 text-lg" v-if="!loading" />
        <span class="loading loading-spinner" v-else></span>
        {{ text }}
    </button>
</template>

<style lang="scss" scoped>
</style>
