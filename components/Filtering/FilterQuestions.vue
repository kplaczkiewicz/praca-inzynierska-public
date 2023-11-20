<!-- Filter data by given criterias -->
<script setup lang="ts">
import { questionFiltersFullType, questionFiltersType, selectOptionType } from '~/server/types'
import vSelect from 'vue-select'

const props = defineProps<{
    filterOptions: questionFiltersFullType[] | null
    updateFilters: (filters: questionFiltersType) => void
}>()

// Save all filters in one object so it can used in v-model
const selectedFilters = ref<questionFiltersType>({
    exam_types: [],
    math_fields: [],
    exam: '',
})

// Apply filters
function applyFilters() {
    props.updateFilters(selectedFilters.value)
    key.value++
}

// Reset filters
function resetFilters() {
    selectedFilters.value.exam_types = []
    selectedFilters.value.math_fields = []
    selectedFilters.value.exam = ''
    applyFilters()
}

// Remove one value from given filter
function removeFilter(filter: string, value: string) {
    const filterName = filter as keyof questionFiltersType

    // For exam clear the value
    if (filterName === 'exam') {
        selectedFilters.value['exam'] = ''
    } else {
        // For others just remove it
        selectedFilters.value[filterName] = selectedFilters.value[filterName].filter((elt) => elt !== value)
    }
    applyFilters()
}

// Remove one value from given filter
function addFilter(filter: string, value: string) {
    const filterName = filter as keyof questionFiltersType

    // For exam set the value
    if (filterName === 'exam') {
        selectedFilters.value['exam'] = value
    } else {
        // For others add it to array if not already in there
		if (!selectedFilters.value[filterName].includes(value)) {
			selectedFilters.value[filterName].push(value)
		}
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

// Render correct option in select
function renderSelectedOption(label: string, filterName: string) {
    // If its a number search through labels and return correct one
    if (/^\d+$/.test(label) && props.filterOptions) {
        let correctLabel = '';

        // Check all options
        props.filterOptions.forEach(filterOption => {
            // If names check the option
            if (filterOption.filterName === filterName) {
                // The first one is the correct label
                correctLabel = filterOption.options.filter(option => option.value === Number(label))[0].label;
            }
        })

        return correctLabel;
    }

    // Else just return the string
    return label;
}

// Add select options
const { removeDelete } = useSelectOptions()

// Removes the focus after clicking on a button
const key = ref(0)
</script>

<template>
    <div class="filter-dropdown dropdown-end dropdown" :key="key">
        <!-- Open filter dropdown -->
        <FilterToggle label="Filtruj" />

        <div tabindex="0" class="dropdown-content min-w-[900px] px-5 py-4">
            <div class="flex flex-wrap">
                <!-- Filter section -->
                <div
                    v-for="(filterOption, i) in filterOptions"
                    :key="filterOption.sectionTitle"
                    :class="filterOption.sectionClasses"
                >
                    <p class="mb-0.5 font-bold uppercase text-primary">{{ filterOption.sectionTitle }}</p>

                    <!-- Filter list -->
                    <ul
                        class="menu m-0 -ml-4 max-h-[300px] flex-nowrap gap-1 overflow-y-auto overflow-x-hidden p-0"
                        v-if="filterOption.sectionType === 'list'"
                    >
                        <li v-for="option in filterOption.options" :key="option.value">
                            <label
                                class="hover:bg-base-300"
                                :class="{
                                    'bg-base-300': selectedFilters[filterOption.filterName]?.includes(
                                        option.value.toString()
                                    ),
                                }"
                            >
                                <input
                                    type="checkbox"
                                    class="checkbox checkbox-xs"
                                    :value="option.value"
                                    v-model="selectedFilters[filterOption.filterName]"
                                />
                                {{ option.label }}
                            </label>
                        </li>
                    </ul>
                    <!-- Filter list -->

                    <!-- Filter grid -->
                    <ul
                        class="menu m-0 -ml-4 grid grid-cols-2 gap-1 p-0"
                        v-else-if="filterOption.sectionType === 'grid'"
                    >
                        <li v-for="option in filterOption.options" :key="option.value">
                            <label
                                class="hover:bg-base-300"
                                :class="{
                                    'bg-base-300': selectedFilters[filterOption.filterName]?.includes(
                                        option.value.toString()
                                    ),
                                }"
                            >
                                <input
                                    type="checkbox"
                                    class="checkbox checkbox-xs"
                                    :value="option.value"
                                    v-model="selectedFilters[filterOption.filterName]"
                                />
                                {{ option.label }}
                            </label>
                        </li>
                    </ul>
                    <!-- Filter grid -->

                    <!-- Filter select -->
                    <v-select
                        class="v-select-neutral v-select-sm mt-2 w-full hide-search"
                        v-model="selectedFilters[filterOption.filterName]"
                        :options="filterOption.options"
                        :reduce="(option : selectOptionType) => option.value"
                        :map-keydown="removeDelete"
                        :searchable="false"
                        v-else-if="filterOption.sectionType === 'select'"
                    >
                        <template #selected-option="option">
                            {{ renderSelectedOption(option.label, filterOption.filterName) }}
                        </template>
                    </v-select>
                    <!-- Filter select -->
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
