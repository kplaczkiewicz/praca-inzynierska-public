<!-- Sort data by date -->
<script setup lang="ts">
import vSelect from 'vue-select'

// Types
type SortValueType = 'desc' | 'asc'
type selectOptionType = {
    label: string
    value: SortValueType
}

const props = defineProps<{
    setSortValue: (value: SortValueType) => void
}>()

// Current option
const currentSortOption = ref<SortValueType>('desc')

// Update parent value
watch(currentSortOption, (sort) => {
    props.setSortValue(sort)
})

// Helper to display sorting options
const sortOptions = <selectOptionType[]>[
    {
        label: 'Od najnowszych',
        value: 'desc',
    },
    {
        label: 'Od najstarszych',
        value: 'asc',
    },
]

// Add select options
const { removeDelete } = useSelectOptions()
</script>

<template>
    <div class="w-full max-w-[15rem]">
        <p class="mb-0.5">
            Sortuj:
        </p>
        <div class="relative">
            <!-- Sort select -->
            <v-select
                class="w-full v-select-neutral v-select-icon hide-clear"
                v-model="currentSortOption"
                :options="sortOptions"
                :reduce="(solution : selectOptionType) => solution.value"
                :map-keydown="removeDelete"
                :searchable="false"
            >
            </v-select>
            <!-- Sort select -->
    
            <!-- Sort icon -->
            <span class="absolute left-2.5 top-1.5">
                <font-awesome-icon icon="fa-solid fa-arrow-up-a-z" v-if="currentSortOption === 'desc'" />
                <font-awesome-icon icon="fa-solid fa-arrow-up-z-a" v-else/>
            </span>
            <!-- Sort icon -->
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>
