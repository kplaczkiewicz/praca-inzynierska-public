<!-- Form submit button -->
<script setup lang="ts">
defineProps<{
    textError: string
}>()
</script>

<template>
    <span class="form-message">
        <div class="mb-3 text-error text-lg">
            <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="-mb-px" />
            {{ textError }}
        </div>
    </span>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/partials/form.scss';
</style>
