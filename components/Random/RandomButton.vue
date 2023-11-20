<script setup lang="ts">
defineProps<{
    infoText: string
    buttonClass: string
    loading: boolean
    showErrorMsg: boolean
    errorMsg: string
    onButtonClick: () => Promise<void>
}>()
</script>

<template>
    <!-- Info for user -->
    <p class="mt-5 text-neutral">
        <font-awesome-icon icon="fa-solid fa-circle-info" class="mr-1 -mb-px text-lg" />
        {{ infoText }}
    </p>
    <!-- Info for user -->

    <p class="mt-6 text-error text-xl font-semibold text-center" v-if="showErrorMsg">
        <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="text-2xl mr-1.5 -mb-0.5" />
        {{ errorMsg }}
    </p>

    <!-- Go to question -->
    <button class="btn mt-10 w-full" @click="onButtonClick" :class="[loading ? 'pointer-events-none' : '', buttonClass ]">
        <font-awesome-icon icon="fa-solid fa-shuffle" class="mr-2 text-lg" v-if="!loading" />
        <span class="loading loading-spinner" v-else></span>
        Losuj
    </button>
    <!-- Go to question -->
</template>

<style scoped></style>
