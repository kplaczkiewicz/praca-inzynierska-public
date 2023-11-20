<!-- Buttons to apply and reset filters -->
<script setup lang="ts">
defineProps<{
    applyFilters: () => void
    resetFilters: () => void
}>()
</script>

<template>
    <div class="mt-6 flex justify-end gap-3">
        <button class="btn btn-success h-10 min-h-[2.5rem] text-xs" @click="applyFilters">
            <font-awesome-icon icon="fa-solid fa-filter" />
            Zastosuj
        </button>

        <button class="btn btn-error h-10 min-h-[2.5rem] text-xs" @click="resetFilters">
            <font-awesome-icon icon="fa-solid fa-trash" />
            Wyczyść
        </button>
    </div>
</template>

<style scoped></style>
