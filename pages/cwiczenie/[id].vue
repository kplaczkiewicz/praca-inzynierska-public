<!-- Display single interactive question -->
<script setup lang="ts">
// Get the route to get the id of the question
const route = useRoute()

// Get the question and throw an error if it's not found
const { data, pending } = await useLazyFetch(`/api/interactive/${Number(route.params.id)}`)

// Handle error
if (data.value?.error) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono pytania: ${route.path}`, fatal: true })
}
</script>

<template>
    <!-- Loading -->
    <InteractiveQuestionSkeleton v-if="pending" />

    <!-- Interactive question -->
    <InteractiveQuestion :interactive-question="data.interactive_question" v-else-if="data?.interactive_question" />
</template>

<style lang="scss" scoped>
</style>
