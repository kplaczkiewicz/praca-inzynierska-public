<script setup lang="ts">
defineProps<{
    currentPage: number
    lastPage: number
    changePage: (page : number) => void
}>()
</script>

<template>
    <div class="join">
        <button
            class="btn btn-neutral btn-outline join-item"
            :class="{ 'btn-disabled': currentPage === 1 }"
            @click="currentPage > 1 && changePage(currentPage - 1)"
        >
            <font-awesome-icon icon="fa-solid fa-chevron-left" />
        </button>

        <div v-for="pageNum in lastPage" :key="pageNum">
            <button
                class="btn btn-neutral btn-outline join-item"
                :class="{ 'btn-active': pageNum === currentPage }"
                @click="changePage(pageNum)"
            >
                {{ pageNum }}
            </button>
        </div>

        <button
            class="btn btn-neutral btn-outline join-item"
            :class="{ 'btn-disabled': currentPage === lastPage }"
            @click="currentPage < lastPage && changePage(currentPage + 1)"
        >
            <font-awesome-icon icon="fa-solid fa-chevron-right" />
        </button>
    </div>
</template>

<style scoped></style>
