<!-- Go to random interactive question -->
<script setup lang="ts">
// Get filters data
const { data, pending } = await useLazyFetch(`/api/interactive/filters?pick=exam_types,math_fields&question_type=2`)

// Handle error
if (data.value?.error) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono pytań`, fatal: true })
}

// Store select values
const examTypes = ref<string[]>([])
const mathField = ref('')

// User
const user = useSupabaseUser()

// If logged in add exam type filter
if (user.value) {
    // If both
    if (user.value.user_metadata.exam_tier === 'basic_and_advanced') {
        examTypes.value.push('basic')
        examTypes.value.push('advanced')
    } else {
        examTypes.value.push(user.value.user_metadata.exam_tier)
    }
}

// Flags to show on form
const isLoading = ref(false)
const showErrorMsg = ref(false)
const errorMsg = ref('')

// Go to random question
async function goToRandomQuestion() {
    // Set flags
    isLoading.value = true;
    showErrorMsg.value = false;

    // Get ids
    const { data } = await useFetch(`/api/interactive/random`, {
        query: {
            exam_types: examTypes,
            math_field: mathField,
        },
        watch: false
    })

    // Handle error
    if (data.value?.error) {
        showErrorMsg.value = true;
        isLoading.value = false;
        errorMsg.value = 'Wystąpił nieoczekiwany błąd! Spróbuj ponownie!';
        return
    }

    // If no data show msg and return
    if (!data.value?.interactive_ids?.length) {
        showErrorMsg.value = true;
        isLoading.value = false;
        errorMsg.value = 'Brak wyników dla podanych kryteriów!';
        return
    }

    // Get random id
    const randomIndex = Math.floor(Math.random() * data.value.interactive_ids.length);
    const randomID = data.value.interactive_ids[randomIndex].id

    // Go to random question
    navigateTo(`/cwiczenie/${randomID}`)
}

// Set background pattern
useSetBackgroundPattern('oscillate-primary')
</script>

<template>
    <NuxtLayout name="random-layout">
        <h1 class="mb-8 text-center text-3xl font-bold uppercase text-primary">tryb interaktywny - losuj</h1>

        <!-- Loading -->
        <RandomSelectSkeleton :quantity="2" v-if="pending" />

        <!-- Data loaded -->
        <div v-else>
            <!-- Select exam type -->
            <RandomSelect
                label="Wybierz typ egzaminu:"
                label-icon="fa-solid fa-graduation-cap"
                :select-options="data?.filters?.exam_types"
                select-placeholder="Brak wybranego typu"
                color-variant="primary"
                :select-multiple="true"
                :select-value="examTypes"
                :on-value-change="(value : string[]) => examTypes = value"
            />

            <!-- Select math field -->
            <RandomSelect
                label="Wybierz dział:"
                label-icon="fa-solid fa-square-poll-vertical"
                :select-options="data?.filters?.math_fields"
                select-placeholder="Brak wybranego działu"
                color-variant="primary"
                :select-value="mathField"
                :on-value-change="(value : string) => mathField = value"
            />

            <!-- Go to button -->
            <RandomButton
                info-text="Brak wyboru opcji oznacza że losowane pytanie będzie wybierane ze wszystkich możliwych opcji!"
                button-class="btn-primary"
                :on-button-click="goToRandomQuestion"
                :loading="isLoading"
                :show-error-msg="showErrorMsg"
                :error-msg="errorMsg"
            />
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped></style>
