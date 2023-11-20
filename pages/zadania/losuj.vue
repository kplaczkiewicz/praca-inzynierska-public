<!-- Select x number of random single choice questions -->
<script setup lang="ts">
import { selectOptionType } from '~/server/types'

// Get filters data
const { data, pending } = await useLazyFetch(`/api/interactive/filters?pick=exam_types,math_fields&question_type=1`)

// Handle error
if (data.value?.error) {
    throw createError({ statusCode: 404, statusMessage: `Nie znaleziono pytań`, fatal: true })
}

// Time limits (values in seconds)
const timeLimits: selectOptionType[] = []

// Populate the time limits data by intervals of 10 minutes
for (let i = 1; i <= 6; i++) {
    timeLimits.push({
        label: `${i * 10} minut`,
        value: (i * 600).toString(),
    })
}

// Number of questions
const numOfQuestions: selectOptionType[] = [
    {
        label: '5 pytań',
        value: '5',
    },
]

// Populate the number of questions by values of 10
for (let i = 1; i <= 4; i++) {
    numOfQuestions.push({
        label: `${i * 10} pytań`,
        value: (i * 10).toString(),
    })
}

// Store select values
const examTypes = ref<string[]>([])
const mathFields = ref<string[]>([])
const numberOfQuestions = ref('20')
const timeLimit = ref('')

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

// Generate random exam from single choice questions
async function generateRandomExam() {
    // Set flags
    isLoading.value = true;
    showErrorMsg.value = false;

    // Get ids
    const { data } = await useFetch(`/api/question/random`, {
        query: {
            exam_types: examTypes,
            math_fields: mathFields
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
    if (!data.value?.question_ids?.length) {
        showErrorMsg.value = true;
        isLoading.value = false;
        errorMsg.value = 'Brak wyników dla podanych kryteriów!';
        return
    }

    // Copy of random ids
    const dataRandomIDs = data.value.question_ids.map(obj => obj.id);

    // If there are less questions than selected just select this less amount
    const randomIDCount = (dataRandomIDs.length < Number(numberOfQuestions.value)) ? dataRandomIDs.length : Number(numberOfQuestions.value) 

    // Select random ids
    let randomIDs : number[] = []

    for (let i = 0; i < randomIDCount; i++) {
        // Add random id and remove it from original array
        const randomIndex = Math.floor(Math.random() * dataRandomIDs.length);
        const randomItem = dataRandomIDs.splice(randomIndex, 1)[0]
        randomIDs.push(randomItem)
    }

    // Sort IDs
    randomIDs = randomIDs.sort((a, b) => a - b)

    // Create query params
    const queryParams = new URLSearchParams();

    // Add parameters to the query string
    queryParams.append('question_ids', randomIDs.join(','));
    queryParams.append('num_of_questions', numberOfQuestions.value);
    queryParams.append('time_limit', timeLimit.value || '-1');

    // Add tags
    const allTags = getLabelsFromFilters()
    queryParams.append('tags', allTags.join(','))

    // Get the final query string
    const queryString = queryParams.toString();
    
    // Go to /zadania/rozwiazuj with query params: question_ids, num of questions time limit
    navigateTo(`/zadania/rozwiazuj?${queryString}`)
}

// Get labels from values
function getLabelsFromFilters() {
    const labels : string[] = []

    // Add exam types
    examTypes.value.forEach(type => {
        data.value?.filters?.exam_types.forEach(exam_type => {
            if (type === exam_type.value) labels.push(exam_type.label)
        });
    });

    // Add math fields
    mathFields.value.forEach(field => {
        data.value?.filters?.math_fields.forEach(math_field => {
            if (field === math_field.value) labels.push(math_field.label)
        });
    });
    
    return labels;
}

// Set background pattern
useSetBackgroundPattern('oscillate-secondary')
</script>

<template>
    <NuxtLayout name="random-layout">
        <h1 class="mb-8 text-center text-3xl font-bold uppercase text-secondary">zadania zamknięte - losuj</h1>

        <!-- Loading -->
        <RandomSelectSkeleton :quantity="4" v-if="pending" />

        <!-- Data loaded -->
        <div v-else>
            <!-- Select exam type -->
            <RandomSelect
                label="Wybierz typ egzaminu:"
                label-icon="fa-solid fa-graduation-cap"
                :select-options="data?.filters?.exam_types"
                select-placeholder="Brak wybranego typu"
                color-variant="secondary"
                :select-multiple="true"
                :select-value="examTypes"
                :on-value-change="(value : string[]) => examTypes = value"
            />

            <!-- Select math fields -->
            <RandomSelect
                label="Wybierz działy:"
                label-icon="fa-solid fa-square-poll-vertical"
                :select-options="data?.filters?.math_fields"
                select-placeholder="Brak wybranych działów"
                color-variant="secondary"
                :select-multiple="true"
                :select-value="mathFields"
                :on-value-change="(value : string[]) => mathFields = value"
            />

            <!-- Select number of questions -->
            <RandomSelect
                label="Wybierz ilość pytań:"
                label-icon="fa-solid fa-hashtag"
                :select-options="numOfQuestions"
                select-placeholder="Brak wybranej ilości pytań (domyślnie 20)"
                color-variant="secondary"
                :select-value="numberOfQuestions"
                :on-value-change="(value : string) => numberOfQuestions = value"
                select-classes="hide-clear"
            />

            <!-- Select time -->
            <RandomSelect
                label="Wybierz limit czasu:"
                label-icon="fa-solid fa-clock"
                :select-options="timeLimits"
                select-placeholder="Brak limitu czasowego"
                color-variant="secondary"
                :select-value="timeLimit"
                :on-value-change="(value : string) => timeLimit = value"
            />

            <!-- Go to button -->
            <RandomButton
                info-text="Brak wyboru opcji oznacza że losowane zadania będą wybierane ze wszystkich możliwych opcji! W przypadku nie znalezienia określonej ilości pytań liczba pytań w egzaminie będzie mniejsza!"
                button-class="btn-secondary"
                :on-button-click="generateRandomExam"
                :loading="isLoading"
                :show-error-msg="showErrorMsg"
                :error-msg="errorMsg"
            />
        </div>
    </NuxtLayout>
</template>

<style lang="scss" scoped></style>
