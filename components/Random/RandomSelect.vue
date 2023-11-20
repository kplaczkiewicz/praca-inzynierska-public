<script setup lang="ts">
import vSelect from 'vue-select'
import { selectOptionType } from '~/server/types'

const props = defineProps<{
    label: string
    labelIcon: string
    selectOptions: string
    selectPlaceholder: string
    selectValue: string | string[]
    colorVariant: string
    selectMultiple?: boolean
    selectClasses?: string
    onValueChange: (value : string | string[]) => void
}>()

// Local value for selects
const localValue = ref(props.selectValue)

// Update the value on parent
watchEffect(() => {
    props.onValueChange(localValue.value)
})

// Add select options
const { removeDelete } = useSelectOptions()
</script>

<template>
    <p class="mb-2 mt-6">
        <font-awesome-icon :icon="labelIcon" class="mr-1.5 text-lg" :class="`text-${colorVariant}`" />
        {{ label }}
    </p>

    <v-select
        class="v-select-neutral w-full"
        :options="selectOptions"
        :reduce="(option : selectOptionType) => option.value"
        :map-keydown="removeDelete"
        :searchable="false"
        :placeholder="selectPlaceholder"
        :class="`v-select-${colorVariant} ${selectClasses}`"
        v-model="localValue"
        multiple
        v-if="selectMultiple"
    >
    </v-select>

    <v-select
        class="v-select-neutral w-full"
        :options="selectOptions"
        :reduce="(option : selectOptionType) => option.value"
        :map-keydown="removeDelete"
        :searchable="false"
        :placeholder="selectPlaceholder"
        :class="`v-select-${colorVariant} ${selectClasses}`"
        v-model="localValue"
        v-else
    >
    </v-select>
</template>

<style scoped></style>
