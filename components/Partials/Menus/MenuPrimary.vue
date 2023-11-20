<!-- Main menu in the header -->
<script setup lang="ts">
// Get menu structure
const mainMenu = useMainMenu()

// Get current route
const route = useRouter().currentRoute

// Removes the focus after clicking on a link
const key = ref(0)
</script>

<template>
    <ul class="menu menu-horizontal px-1 text-base md:gap-3" :key="key">
        <li class="menu-dropdown dropdown" v-for="menuItem in mainMenu" :key="menuItem.title">
            <label class="py-3" tabindex="0" :class="{ '!text-primary' : route.fullPath.startsWith(menuItem.basePath) }">
                {{ menuItem.title }}
                <font-awesome-icon icon="fa-solid fa-chevron-down" />
            </label>

            <ul tabindex="0" class="dropdown-content min-w-[200px]">
                <li v-for="subMenuItem in menuItem.submenu" :key="subMenuItem.title">
                    <NuxtLink class="icon-grid" :to="subMenuItem.link" @click="key++">
                        <font-awesome-icon :icon="subMenuItem.icon" />
                        {{ subMenuItem.title }}
                    </NuxtLink>
                </li>
            </ul>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/dropdown.scss';

.icon-grid {
    @apply grid;
    grid-template-columns: 25px 1fr;
}
</style>
