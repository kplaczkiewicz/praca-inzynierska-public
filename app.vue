<!-- Start point of the application-->

<script lang="ts" setup>
const config = useConfig();

// Add meta tags
useHead({
    title: config.siteTitle,
    htmlAttrs: {
        'data-theme': config.siteTheme,
    },
})
</script>

<template>
    <!-- Using layouts/default.vue -->
    <NuxtLayout>
        <NuxtLoadingIndicator :color="'hsl(var(--p))'" />
        <NuxtPage />
    </NuxtLayout>
    <!-- Using layouts/default.vue -->
</template>

<style lang="scss"></style>
