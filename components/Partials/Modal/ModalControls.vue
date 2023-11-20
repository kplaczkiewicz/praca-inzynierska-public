<!-- Basic modal prev next controls -->
<script setup lang="ts">
defineProps<{
    prevText: string
    nextText: string
    onModalNext: () => void
}>()
</script>

<template>
    <div class="flex justify-end gap-4">
        <!-- Go back -->
        <button class="btn-icon-move-left btn btn-secondary btn-outline">
            <font-awesome-icon icon="fa-solid fa-chevron-left" class="text-lg" />
            {{ prevText }}
        </button>

        <!-- Finish -->
        <button class="btn btn-primary btn-icon-move-right" @click="onModalNext">
            {{ nextText }}
            <font-awesome-icon icon="fa-solid fa-chevron-right" class="text-lg" />
        </button>
    </div>
</template>

<style scoped>

</style>