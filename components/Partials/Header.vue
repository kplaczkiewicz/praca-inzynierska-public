<!-- Main header of the entire site -->
<script setup lang="ts">
defineProps({
    scrollY: Number,
})
</script>

<template>
    <header class="custom-header" :class="{ 'header-scroll': (scrollY || 0) > 0 }">
        <div class="container navbar justify-between py-3 pl-2 pr-6 sm:px-8">
            <div class="navbar-start sm:w-auto md:w-1/2">
                <!-- Sidebar toggle -->
                <label for="side-mobile-menu" class="btn btn-square btn-ghost drawer-button mr-2 text-xl sm:hidden">
                    <font-awesome-icon icon="fa-solid fa-bars-staggered" />
                </label>
                <!-- Sidebar toggle -->

                <Logo :logo-size="'responsive'" :logo-color="'gradient'" />
            </div>

            <!-- Menu -->
            <div class="navbar-center hidden sm:flex">
                <MenuPrimary />
            </div>
            <!-- Menu -->

            <!-- User -->
            <div class="navbar-end sm:w-auto md:w-1/2">
                <UserMenu />
            </div>
            <!-- User -->
        </div>
    </header>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/dropdown.scss';
.custom-header {
    @apply sticky top-0 z-[1050] w-full border-b border-neutral/20 bg-transparent text-base-content backdrop-blur transition-all;

    &.header-scroll {
        @apply bg-base-100/90 shadow-md border-transparent;
    }
}
</style>
