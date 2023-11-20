<!-- Error page for all potential error -->
<script setup lang="ts">
const config = useConfig();

// Show error in console for debugging
const props = defineProps(['error'])
console.error(props.error)

// Add meta tags
useHead({
    title: `${config.siteTitle} - Error`,
    htmlAttrs: {
        'data-theme': config.siteTheme,
    },
})

// Clear the error and redirect to homepage
function handleClearError() {
    clearError({ redirect: '/' })
}

// Set background pattern
useSetBackgroundPattern('squares')
</script>

<template>
    <NuxtLayout>
        <NuxtLoadingIndicator :color="'hsl(var(--p))'" />

        <div class="base-container container h-full relative mt-24">
            <div class="prose mx-auto flex h-full flex-col items-center justify-center text-center">
                <!-- Error message -->
                <h1 class="mb-5 text-[4.5rem] sm:mb-6 sm:text-[8rem]">
                    <font-awesome-icon icon="fa-solid fa-person-digging" class="sm:mr-1" />
                    {{ error.statusCode }}
                </h1>
                <h2 class="text-xl sm:text-3xl mt-0" v-if="error.statusMessage">{{ error.statusMessage }}</h2>
                <!-- Error message -->

                <!-- Only for development -->
                <DevOnly>
                    {{ error.message }}
                    <div v-html="error.stack"></div>
                </DevOnly>
                <!-- Only for development -->
                
                <!-- Back to homepage -->
                <button class=" btn btn-primary mt-2 sm:mt-4" @click="handleClearError">
                    <font-awesome-icon icon="fa-solid fa-house" class="-mt-0.5 mr-2 text-base" />
                    Strona główna
                </button>
                <!-- Back to homepage -->
            </div>
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped></style>
