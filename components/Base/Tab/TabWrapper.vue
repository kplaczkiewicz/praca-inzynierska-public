<script setup lang="ts">
import { colorType } from '~/server/types';

// Get all tabs props
const slots = useSlots()

type tabOptionType = {
    title: string
    icon: string
    color: colorType
}

const tabOptions = ref(
    slots.default!().map((tab) => {
        return <tabOptionType>{ ...tab.props }
    })
)

// Control the active tab by the current title
const activeTabTitle = ref<string>(tabOptions.value[0].title)
provide('activeTabTitle', activeTabTitle)

// Store active tab color
const activeTabColor = ref<string>(tabOptions.value[0].color)

// Setup css variables for animation
const tabWrapper = ref(null)
const tabOffset = useCssVar('--tabOffset', tabWrapper)
const tabSize = useCssVar('--tabSize', tabWrapper)

// Start at the first one
tabOffset.value = '0.25rem'
tabSize.value = (1 / tabOptions.value.length) * 100 + '%'

// Change tab variable and the css variables
function changeTab(title: string, index: number) {
    let tabOffsetCalc = ' + 0%'

    if (index === 0) tabOffsetCalc = ' + 0.25rem'
    else if (index === tabOptions.value.length - 1 && window.innerWidth >= 420) tabOffsetCalc = ' - 0.25rem'

    tabOffset.value = index * ((1 / tabOptions.value.length) * 100) + '%' + tabOffsetCalc
    activeTabTitle.value = title
    activeTabColor.value = tabOptions.value[index].color
}

// Allow other components to call changeTab method
defineExpose({
    changeTab,
})
</script>

<template>
    <div>
        <div class="tabs-wrapper" :class="`tabs-${activeTabColor}`" ref="tabWrapper">
            <button
                :class="{ 'text-primary-content': activeTabTitle === tabOption.title }"
                @click="changeTab(tabOptions[index].title, index)"
                @keypress.space.enter.prevent="changeTab(tabOptions[index].title, index)"
                v-for="(tabOption, index) in tabOptions"
                :key="tabOption.title"
            >
                <font-awesome-icon :icon="tabOption.icon" class="mr-2" v-if="tabOption.icon" />
                <span>{{ tabOption.title }}</span>
            </button>
        </div>

        <slot />
    </div>
</template>

<style lang="scss" scoped>
.tabs-wrapper {
    @apply relative mb-6 flex flex-col rounded-lg border-2 border-neutral bg-base-100 p-1 xs:flex-row;

    > button {
        @apply flex flex-1 cursor-pointer items-center justify-center rounded-lg py-2;
    }

    &::before {
        @apply absolute left-1 z-[1] rounded-lg bg-primary transition-all duration-300 content-[''];
        // Vertical
        width: calc(100% - 0.5rem);
        height: calc(var(--tabSize) - 0.25rem);
        top: calc(var(--tabOffset));

        @screen xs {
            @apply top-1;
            // Horizontal
            width: var(--tabSize);
            height: calc(100% - 0.5rem);
            left: calc(var(--tabOffset));
        }
    }

    &.tabs-accent {
        &::before {
            @apply bg-accent;
        }
    }

    svg,
    span {
        @apply relative z-10;
    }
}
</style>
