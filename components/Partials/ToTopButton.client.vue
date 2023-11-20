<!-- To top button -->
<script setup lang="ts">
defineProps<{
    scrollY: number
}>()
</script>

<template>
    <TransitionWrapper :name="'fade-bottom'">
        <a class="to-top-button" href="#" v-if="scrollY > 250">
            <font-awesome-icon icon="fa-solid fa-chevron-up" />
        </a>
    </TransitionWrapper>
</template>

<style lang="scss" scoped>
.to-top-button {
    @apply fixed bottom-8 right-12 z-10 grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-primary text-white;

    &:hover {
        @apply bg-primary-focus;
    }
}
</style>
