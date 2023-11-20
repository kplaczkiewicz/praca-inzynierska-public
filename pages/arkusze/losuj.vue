<!-- Go to random exam -->
<script setup lang="ts">
import { userCurrentExamType } from '~/server/types';

// Get filters data
const { data, pending } = await useLazyFetch(`/api/exam/filters?pick=exam_types`)

// Handle error
if (data.value?.error) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono arkuszy`, fatal: true })
}

// Store select values
const examTypes = ref<string[]>([])

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

// Get current exam to not go to it
const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())
const skipIDs = ref<number[]>([])

// If exam in progress add it to skip ids
if (userCurrentExam.value && userCurrentExam.value.exam_stage !== 'finished') {
    skipIDs.value.push(userCurrentExam.value.exam_id)
}

// Go to random exam
async function goToRandomExam() {
    // Set flags
    isLoading.value = true;
    showErrorMsg.value = false;

    // Get ids
    const { data } = await useFetch(`/api/exam/random`, {
        query: {
            exam_types: examTypes,
            skip_ids: skipIDs
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
    if (!data.value?.exam_ids?.length) {
        showErrorMsg.value = true;
        isLoading.value = false;
        errorMsg.value = 'Brak wyników dla podanych kryteriów!';
        return
    }

    // Get random id
    const randomIndex = Math.floor(Math.random() * data.value.exam_ids.length);
    const randomID = data.value.exam_ids[randomIndex].id

    // Go to exam
    isLoading.value = false;
    goToExam(randomID);
}

// Get the modal and the examID to pass it to composable
const goToExamID = ref(0)

// Get ready function from the composable
const goToExam = useGoToExamCheck(goToExamID)

// Set background pattern
useSetBackgroundPattern('oscillate-accent')
</script>

<template>
    <NuxtLayout name="random-layout">
        <h1 class="mb-8 text-center text-3xl font-bold uppercase text-accent">arkusze maturalne - losuj</h1>

        <!-- Loading -->
        <RandomSelectSkeleton :quantity="1" v-if="pending" />

        <!-- Data loaded -->
        <div v-else>
            <!-- Select exam type -->
            <RandomSelect
                label="Wybierz typ egzaminu:"
                label-icon="fa-solid fa-graduation-cap"
                :select-options="data?.filters?.exam_types"
                select-placeholder="Brak wybranego typu"
                color-variant="accent"
                :select-multiple="true"
                :select-value="examTypes"
                :on-value-change="(value : string[]) => examTypes = value"
            />

            <!-- Go to button -->
            <RandomButton
                info-text="Brak wyboru opcji oznacza że losowany arkusz będzie wybierane ze wszystkich możliwych opcji!"
                button-class="btn-accent"
                :on-button-click="goToRandomExam"
                :loading="isLoading"
                :show-error-msg="showErrorMsg"
                :error-msg="errorMsg"
            />
        </div>
    </NuxtLayout>

     <!-- Exam switch modal -->
     <ModalExamSwitch :exam-id="goToExamID" />
</template>

<style lang="scss" scoped></style>
