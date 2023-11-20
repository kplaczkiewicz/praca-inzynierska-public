<script setup lang="ts">
import FilterQuestions from '@/components/Filtering/FilterQuestions.vue';
import FilterExams from '@/components/Filtering/FilterExams.vue';
import { examFiltersFullType, questionFiltersFullType } from '~/server/types';

const props = defineProps<{
    label: string
    filters: string[]
    filterName: string
    filterElement: InstanceType<typeof FilterQuestions> | InstanceType<typeof FilterExams> | null
	allFilters: questionFiltersFullType[] | examFiltersFullType[]
}>()

// Remove filter from global filters
function removeFilter(filter : string) {
    if (props.filterElement) {
        props.filterElement.removeFilter(props.filterName, filter)
    }
}

// Get filter label by the value
function getFilterLabel(value: string) {
	let label = '';

	// Loop through all filters
	props.allFilters.forEach(filters => {
		// Check if filter name matches
		if (filters.filterName === props.filterName) {
			// Then check each option
			filters.options.forEach(option => {
				if (option.value == value) label = option.label;
			})
		}
	})

	return label;
}
</script>

<template>
    <div class="badge badge-neutral badge-outline badge-lg bg-white" v-for="filter in filters" :key="filter">
        {{ label }}: "{{ getFilterLabel(filter) }}"

		<!-- Remove button -->
		<span class="btn-circle-sm" @click="removeFilter(filter)">
			<font-awesome-icon icon="fa-solid fa-xmark" class="-mb-px" />
		</span>
    </div>
</template>

<style scoped></style>
