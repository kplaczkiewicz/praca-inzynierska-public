<!-- Filter data by given criterias -->
<script setup lang="ts">
import { examFiltersFullType, examFiltersType } from "~/server/types"

const props = defineProps<{
    filterOptions: examFiltersFullType[] | null
    updateFilters: (filters: examFiltersType) => void
}>()

// Save all filters in one object so it can used in v-model
const selectedFilters = ref<examFiltersType>({
    exam_types: [],
    exam_date_types: [],
    years: []
})

// Apply filters
function applyFilters() {
    props.updateFilters(selectedFilters.value);
    key.value++
}

// Reset filters
function resetFilters() {
    selectedFilters.value.exam_types = []
    selectedFilters.value.exam_date_types = []
    selectedFilters.value.years = []
    applyFilters()
}

// Remove one value from given filter
function removeFilter(filter: string, value: string) {
    const filterName = filter as keyof examFiltersType

    // Remove element form it's array
	selectedFilters.value[filterName] = selectedFilters.value[filterName].filter((elt) => elt !== value)
    applyFilters()
}

// Remove one value from given filter
function addFilter(filter: string, value: string) {
    const filterName = filter as keyof examFiltersType

	// Add it to array if not already in there
	if (!selectedFilters.value[filterName].includes(value)) {
		selectedFilters.value[filterName].push(value)
	}

    setTimeout(() => {
        window.scrollTo(0, 0)
    }, 100)

    applyFilters()
}

// Allow usage of these functions in parent components
defineExpose({
    removeFilter,
    addFilter
})

// Removes the focus after clicking on a button
const key = ref(0)
</script>

<template>
    <div class="filter-dropdown dropdown dropdown-end" :key="key">
        <!-- Open filter dropdown -->
        <FilterToggle label="Filtruj" />

        <div tabindex="0" class="dropdown-content min-w-[575px] px-5 py-4">
            <div class="flex">
                <!-- Filter section -->
                <div
                    v-for="filterOption in filterOptions"
                    :key="filterOption.sectionTitle"
                    :class="filterOption.sectionClasses"
                >
                    <p class="mb-0.5 font-bold uppercase text-primary">{{ filterOption.sectionTitle }}</p>

                    <!-- Filter options -->
                    <ul class="menu m-0 -ml-4 p-0 gap-1 max-h-[300px] flex-nowrap overflow-y-auto overflow-x-hidden">
                        <li v-for="option in filterOption.options" :key="option.value">
                            <label class="hover:bg-base-300" :class="{ 'bg-base-300' : selectedFilters[filterOption.filterName]?.includes(option.value.toString()) }">
                                <input type="checkbox" class="checkbox checkbox-xs" :value="option.value" v-model="selectedFilters[filterOption.filterName]" />
                                {{ option.label }}
                            </label>
                        </li>
                    </ul>
                    <!-- Filter options -->
                </div>

                <!-- Filter section -->
            </div>

            <!-- Filter actions -->
            <FilterActions :apply-filters="applyFilters" :reset-filters="resetFilters" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/dropdown.scss';
</style>
