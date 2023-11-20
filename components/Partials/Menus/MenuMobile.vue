<!-- Main menu in the header -->
<script setup lang="ts">
// Get menu structure
const mainMenu = useMainMenu()
</script>

<template>
    <div class="drawer-side z-[1060]">
        <!-- Sidebar overlay -->
        <label for="side-mobile-menu" class="drawer-overlay"></label>

        <!-- Sidebar content -->
        <ul class="menu min-h-full w-80 bg-base-100 px-6 pb-10 pt-8 text-base-content !duration-300">
            <div class="menu-heading">
                <p class="text-gradient">MENU</p>
            </div>

            <div class="menu-section mb-4 pb-2" v-for="menuItem in mainMenu" :key="menuItem.title">
                <p class="mb-2 pl-2.5 font-medium uppercase text-primary">
                    {{ menuItem.title }}
                </p>

                <li v-for="subMenuItem in menuItem.submenu" :key="subMenuItem.title">
                    <NuxtLink :to="subMenuItem.link" class=" icon-grid hover:bg-accent hover:text-accent-content">
                        <font-awesome-icon :icon="subMenuItem.icon" class="text-base" />
                        {{ subMenuItem.title }}
                    </NuxtLink>
                </li>
            </div>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.menu {
    .menu-heading {
        @apply mb-4 flex items-center justify-between border-b-2 border-base-300 pb-4 pl-1 font-primary text-4xl font-bold tracking-wider;
    }

    .menu-section {
        &:not(:last-child) {
            @apply border-b-2 border-base-300;
        }

        .icon-grid {
            @apply grid;
            grid-template-columns: 22px 1fr;
        }

        a {
            &.router-link-active {
                @apply bg-accent text-accent-content;
            }
        }
    }
}
</style>
