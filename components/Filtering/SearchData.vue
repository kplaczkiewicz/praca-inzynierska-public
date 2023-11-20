<!-- Search dataset, update on enter, losing focus and click -->
<script setup lang="ts">
const props = defineProps<{
    updateSearch: (search: string) => void
}>()

// Save the search
const search = ref('')

// Clear search
function clearSearch() {
    search.value = ''
    props.updateSearch(search.value)
}

// Allow usage of these functions in parent components
defineExpose({
    clearSearch,
})
</script>

<template>
    <div class="relative">
        <!-- Search input -->
        <input
            type="text"
            class="peer input input-bordered h-12 border-2 border-neutral pl-14 pr-12 transition-colors focus:border-primary focus:outline-none"
            placeholder="Szukaj..."
            @blur="() => updateSearch(search)"
            @keyup.enter="() => updateSearch(search)"
            v-model="search"
        />
        <!-- Search input -->

        <!-- Search icon / button -->
        <span
            class="group absolute left-0 top-0 grid h-12 cursor-pointer place-items-center rounded-lg rounded-r-none border-2 border-r-0 border-transparent px-3.5 text-xl transition-all hover:border-neutral hover:bg-base-300 peer-focus:hover:border-primary"
            @click="() => updateSearch(search)"
        >
            <font-awesome-icon
                icon="fa-solid fa-magnifying-glass"
                class="scale-100 transition-transform group-active:scale-[0.85]"
            />
        </span>
        <!-- Search icon / button -->

        <!-- Clear search -->
        <span
            class="absolute right-3 top-2.5 grid aspect-square h-7 w-7 cursor-pointer place-items-center rounded-full bg-base-300 transition-colors hover:bg-neutral/30"
            @click="clearSearch"
            v-if="search.length"
        >
            <font-awesome-icon icon="fa-solid fa-xmark" />
        </span>
        <!-- Clear search -->
    </div>
</template>

<style scoped></style>
