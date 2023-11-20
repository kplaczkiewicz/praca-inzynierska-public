<!-- List all interactive questions with filters -->
<script setup lang="ts">
import SearchData from '@/components/Filtering/SearchData.vue'
import FilterQuestions from '@/components/Filtering/FilterQuestions.vue'
import { questionFiltersFullType, questionFiltersType, sortValueType } from '~/server/types'

// Reactive query params
const currentPage = ref(1)
const sortDate = ref<sortValueType>('desc')

// Data filters
const filterExamTypes = ref<string[]>([])
const filterMathFieds = ref<string[]>([])
const filterExam = ref<string>('')

// User
const user = useSupabaseUser()

// If logged in add exam type filter
if (user.value) {
    // If both
    if (user.value.user_metadata.exam_tier === 'basic_and_advanced') {
        filterExamTypes.value.push('basic')
        filterExamTypes.value.push('advanced')
    } else {
        filterExamTypes.value.push(user.value.user_metadata.exam_tier)
    }
}

// Search filter
const searchString = ref('')

// Get interactive questions with filters and pagination
const { data, pending } = await useLazyFetch(`/api/interactive`, {
    query: {
        count: 12,
        add_pagination: true,
        current_page: currentPage,
        sort_date: sortDate,
        search: searchString,
        exam_types: filterExamTypes,
        math_fields: filterMathFieds,
        exam: filterExam,
    },
})

// Handle error
if (data.value?.error) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono zadań`, fatal: true })
}

// Update filters data
function updateSort(sort: sortValueType) {
    sortDate.value = sort
    currentPage.value = 1
}

// Allows to call methods on this component
const searchComponent = ref<InstanceType<typeof SearchData> | null>(null)

function updateSearch(search: string) {
    searchString.value = search
    currentPage.value = 1
}

// Allows to call methods on this component
const filterComponent = ref<InstanceType<typeof FilterQuestions> | null>(null)

function updateFilters(filters: questionFiltersType) {
    filterExamTypes.value = filters.exam_types
    filterMathFieds.value = filters.math_fields
    filterExam.value = filters.exam
    currentPage.value = 1
}

// Go to top of the page after page change
watch(currentPage, () => {
    setTimeout(() => {
        window.scrollTo(0, 0)
    }, 100)
})

// Get filters data
const filterData = await useLazyFetch(`/api/interactive/filters?pick=exam_types,math_fields,exams&question_type=2`)

// Handle error
if (filterData.error.value) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono pytań`, fatal: true })
}

// Set filter data from the api
const filters = ref<questionFiltersFullType[] | null>(null)
filters.value = useFiltersInteractive(filterData.data.value?.filters ?? null)

// Sometimes the data doesnt load
watch(filterData.data, (newData) => {
	if (newData) {
		filters.value = useFiltersInteractive(newData.filters)
	}
})

// Animation of badges
import { useAutoAnimate } from '@formkit/auto-animate/vue'
const [badgesWrapper] = useAutoAnimate()

// Set background pattern
useSetBackgroundPattern('squares-half-empty')
</script>

<template>
    <!-- Page header -->
    <PageHeader
        title="Tryb interaktywny"
        icon="fa-solid fa-chalkboard"
        background_image="/svg/gradients/mesh-primary-accent.svg"
    />

    <div class="container relative pb-10 pt-5">
        <!-- Search and filter -->
        <div class="mb-7 border-b-2 border-b-neutral/60 px-1 pb-7" :class="{ 'pointer-events-none': pending }">
            <div class="flex items-end justify-between">
                <!-- Sort -->
                <div class="flex-1">
                    <SortData :set-sort-value="(value: sortValueType) => updateSort(value)" />
                </div>

                <!-- Search -->
                <div class="flex flex-1 justify-center">
                    <SearchData :update-search="(search : string) => updateSearch(search)" ref="searchComponent" />
                </div>

                <!-- Filter -->
                <div class="flex flex-1 justify-end">
                    <FilterQuestions
                        :filter-options="filters"
                        :update-filters="(filters: questionFiltersType) => updateFilters(filters)"
                        ref="filterComponent"
                    />
                </div>
            </div>

            <!-- Show current filters -->
            <div
                class="-mb-2 mt-5 flex flex-wrap gap-2"
                ref="badgesWrapper"
                :class="{ '-mb-2 mt-5' : searchString.length || filterExamTypes.length || filterMathFieds.length || filterExam }"
            >
                <!-- Show search -->
                <div class="badge badge-neutral badge-outline badge-lg" v-if="searchString.length">
                    Szukaj: "{{ searchString }}"
                    <span class="btn-circle-sm" @click="searchComponent?.clearSearch()">
                        <font-awesome-icon icon="fa-solid fa-xmark" class="-mb-px" />
                    </span>
                </div>

                <!-- Show each filter -->
                <FilterBadge
                    label="Typ"
                    :filters="filterExamTypes"
                    :filter-element="filterComponent"
                    filter-name="exam_types"
					:all-filters="filters"
                />
                <FilterBadge
                    label="Dział"
                    :filters="filterMathFieds"
                    :filter-element="filterComponent"
                    filter-name="math_fields"
					:all-filters="filters"
                />
                <FilterBadge
                    label="Egzamin"
                    :filters="filterExam ? [filterExam] : []"
                    :filter-element="filterComponent"
                    filter-name="exam"
					:all-filters="filters"
                />
                <!-- Show each filter -->
            </div>
            <!-- Show current filters -->
        </div>
        <!-- Search and filter -->

        <!-- Loading question cards -->
        <ExamCardsSkeletion v-if="pending || filterData.pending.value" />

        <div v-else-if="data?.questions && data?.pagination">
            <!-- Question cards -->
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3" v-if="data.questions.length">
                <InteractiveQuestionCard
                    v-for="(question, i) in data.questions"
                    :question="question"
                    :index="i"
                    :key="question.id"
                    :filter-element="filterComponent"
                />
            </div>

            <!-- No data -->
            <div class="mt-16 text-center text-2xl font-semibold" v-else>Brak wyników dla podanych kryteriów!</div>

            <!-- Pagination -->
            <div
                class="mt-10 flex justify-center border-t-2 border-t-neutral/60 pt-8"
                v-if="data.pagination.lastPage > 1"
            >
                <PaginateData
                    :current-page="currentPage"
                    :last-page="data.pagination.lastPage"
                    :change-page="(page : number) => currentPage = page"
                />
            </div>
            <!-- Pagination -->
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
