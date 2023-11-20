<!-- List all exams with filters -->
<script setup lang="ts">
import FilterExams from '~/components/Filtering/FilterExams.vue'
import SearchData from '~/components/Filtering/SearchData.vue'
import { examFiltersFullType, examFiltersType, sortValueType } from '~/server/types'

// Reactive query params
const currentPage = ref(1)
const sortDate = ref<sortValueType>('desc')

// Data filters
const filterYears = ref<string[]>([])
const filterExamTypes = ref<string[]>([])
const filterExamDateTypes = ref<string[]>([])

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

// Get exams with filters and pagination
const { data, pending } = await useLazyFetch(`/api/exam`, {
    query: {
        count: 12,
        add_pagination: true,
        current_page: currentPage,
        sort_date: sortDate,
        years: filterYears,
        exam_types: filterExamTypes,
        exam_date_types: filterExamDateTypes,
        search: searchString,
    },
})

// Handle error
if (data.value?.error) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono arkuszy`, fatal: true })
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
const filterComponent = ref<InstanceType<typeof FilterExams> | null>(null)

function updateFilters(filters: examFiltersType) {
    filterYears.value = filters.years
    filterExamTypes.value = filters.exam_types
    filterExamDateTypes.value = filters.exam_date_types
    currentPage.value = 1
}

// Go to top of the page after page change
watch(currentPage, () => {
    setTimeout(() => {
        window.scrollTo(0, 0)
    }, 100)
})

// Get filters data
const filterData = await useLazyFetch(`/api/exam/filters?pick=exam_types,exam_date_types,exam_years`)

// Handle error
if (filterData.error.value) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono arkuszy`, fatal: true })
}

// Set filter data from the api
const filters = ref<examFiltersFullType[] | null>(null)
filters.value = useFiltersExam(filterData.data.value?.filters ?? null)

// Sometimes the data doesnt load
watch(filterData.data, (newData) => {
	if (newData) {
		filters.value = useFiltersExam(newData.filters)
	}
})

// Get the modal and the examID to pass it to composable
const goToExamID = ref(0)

// Get ready function from the composable
const goToExam = useGoToExamCheck(goToExamID)

// Animation of badges
import { useAutoAnimate } from '@formkit/auto-animate/vue'
const [badgesWrapper] = useAutoAnimate()

// Set background pattern
useSetBackgroundPattern('dots-half-empty')
</script>

<template>
    <!-- Page header -->
    <PageHeader
        title="Arkusze maturalne"
        icon="fa-solid fa-book"
        background_image="/svg/gradients/mesh-primary-secondary.svg"
    />

    <div class="container relative pb-10 pt-5">
        <!-- Search and filter -->
        <div class="mb-7 border-b-2 border-b-neutral/60 px-1 pb-7">
            <div
                class="flex items-end justify-between"
                :class="{ 'pointer-events-none': filterData.pending.value || pending }"
            >
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
                    <FilterExams
                        :filter-options="filters"
                        :update-filters="(filters: examFiltersType) => updateFilters(filters)"
                        ref="filterComponent"
                    />
                </div>
            </div>

            <!-- Show current filters -->
            <div
                class="-mb-2 mt-5 flex flex-wrap gap-2"
                ref="badgesWrapper"
                :class="{ '-mb-2 mt-5' : searchString.length || filterYears.length || filterExamTypes.length || filterExamDateTypes.length }"
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
                    label="Matura"
                    :filters="filterExamDateTypes"
                    :filter-element="filterComponent"
                    filter-name="exam_date_types"
                    :all-filters="filters"
                />
                <FilterBadge
                    label="Rok"
                    :filters="filterYears"
                    :filter-element="filterComponent"
                    filter-name="years"
                    :all-filters="filters"
                />
                <!-- Show each filter -->
            </div>
            <!-- Show current filters -->
        </div>
        <!-- Search and filter -->

        <!-- Loading exam cards -->
        <ExamCardsSkeletion v-if="pending || filterData.pending.value" />

        <div v-else-if="data?.exams && data?.pagination">
            <!-- Exam cards -->
            <div class="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3" v-if="data.exams.length">
                <ExamCard v-for="(exam, i) in data.exams" :exam="exam" :index="i" @click="goToExam(exam.id)" />
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

    <!-- Exam switch modal -->
    <ModalExamSwitch :exam-id="goToExamID" />
</template>

<style lang="scss" scoped></style>
