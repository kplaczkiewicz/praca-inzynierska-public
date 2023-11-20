<script setup lang="ts">
// Get logo size as a value of an object
defineProps<{
    logoSize: 'responsive' | 'large'
    logoColor: 'gradient' | 'solid'
}>()
const logoSizes = {
    responsive: 'text-3xl md:text-4xl',
    large: 'text-4xl',
}
</script>

<template>
    <NuxtLink to="/" class="site-logo font-semibold" :class="logoSizes[logoSize]">
		<!-- Icon -->
        <span :class="{ 'max-sm:hidden': logoSize === 'responsive' }">
            <font-awesome-icon icon="fa-solid fa-diagram-project" class="-mb-px mr-3 text-primary" />
        </span>
        
		<!-- Normal text -->
        <span>math</span>
        
		<!-- Special text gradient or blue -->
        <span class="text-primary" :class="{ 'text-gradient': logoColor === 'gradient' }">link</span>
    </NuxtLink>
</template>

<style lang="scss" scoped></style>
