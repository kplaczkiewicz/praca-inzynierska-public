<!-- Main layout of the website -->
<script lang="ts" setup>
import { backgroundPatternType } from '~/server/types';

// Set background pattern in state so it can be changed per page
const backgroundPattern = useState<backgroundPatternType>('backgroundPattern', () => 'dots')

// Get the size and scroll of the window
const windowSize = useWindowSize()
const windowScroll = useWindowScroll()

// Set the width of the scrollbar
const scrollbar = ref<HTMLElement | null>(null)
const scrollbarWidth = useCssVar('--scrollbarWidth', scrollbar)

// Get the height of the header to set the correct padding
const headerElement = ref<HTMLElement | null>(null)
const headerSize = useElementSize(headerElement)

// Save header size on main element
const mainElement = ref<HTMLElement | null>(null)
const headerHeight = useCssVar('--headerHeight', mainElement)

// Disable scroll on overlay
const bodyOverflowHidden = useState('overflowHidden', () => false)

// Update the offset
watchEffect(() => {
    if (process.client) {
        // Change the width of the scrollbar
        const scrollPercentage = (windowScroll.y.value / (document.body.offsetHeight - windowSize.height.value)) * 100
        scrollbarWidth.value = `${scrollPercentage}%`

        // Change overflow
        document.body.style.overflowY = bodyOverflowHidden.value ? 'hidden' : 'initial';

        // Add scroll padding
        document.documentElement.style.scrollPaddingTop = ((headerSize.height.value + 10) / 16).toString() + 'rem'
    }

    // Set the offset on the main based on header height
    headerHeight.value = (headerSize.height.value / 16).toString() + 'rem'
})
</script>

<template>
    <!-- Mobile side menu sidebar wrapper for entire page -->
    <div class="drawer block">
        <!-- Scrollbar -->
        <div id="custom-scrollbar" ref="scrollbar"></div>

        <!-- Hidden input for sidebar -->
        <input id="side-mobile-menu" type="checkbox" class="drawer-toggle" />

        <!-- Entire page content -->
        <div class="drawer-content flex flex-col scroll-smooth min-h-screen">
            <Header :scrollY="windowScroll.y.value" ref="headerElement" />

            <main ref="mainElement">
                <BackgroundPattern />
                <slot />
            </main>

            <Footer />
        </div>
        <!-- Entire page content -->

        <!-- Toasts -->
        <Toasts />

        <!-- To top button -->
        <ToTopButton :scrollY="windowScroll.y.value" />

        <!-- Actual sidebar -->
        <MenuMobile />
    </div>
    <!-- Mobile side menu sidebar wrapper for entire page -->
</template>

<style lang="scss" scoped>
main {
    @apply relative flex-1 pb-36 overflow-x-clip bg-base-400;
}

#custom-scrollbar {
    @apply fixed top-0 z-[1100] h-[3px] bg-primary bg-gradient-to-r from-primary to-accent;
    width: var(--scrollbarWidth);
}
</style>
