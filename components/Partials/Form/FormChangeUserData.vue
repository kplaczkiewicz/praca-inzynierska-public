<!-- Reset password form -->
<script setup lang="ts">
import { examTierType } from '~/server/types'

// Supabase composables
const user = useSupabaseUser()

// Helper variables for changing data
const loading = ref(false)
const errorUserData = ref(false)
const successUserData = ref(false)

// Userdata with default values
const userData = ref({
    username: user.value?.user_metadata.username as string,
    exam_tier: user.value?.user_metadata.exam_tier as examTierType,
})

// Control exam tier with custom selection fields
function changeExamTier(tier: examTierType) {
    userData.value.exam_tier = tier
}

// Handle password reset
async function handleChangeUserData() {
    try {
        loading.value = true
        errorUserData.value = false
        successUserData.value = false

        // Update data via prisma
        const { data } = await useFetch('/api/user/update-data', {
            method: 'POST',
            body: {
                user_id: user.value!.id,
                username: userData.value.username,
                exam_tier: userData.value.exam_tier,
            },
        })

        // Show error message
        if (data.value?.error) throw Error

        // If no error show success message
        successUserData.value = true
    } catch (error: any) {
        console.log(error)
        errorUserData.value = true
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <form class="form-wrapper relative" @submit.prevent="handleChangeUserData()">
        <!-- Form heading -->
        <div class="form-heading -mt-1">
            <h1 class="pt-1">Zmiana danych</h1>
        </div>
        <!-- Form heading -->

        <!-- Form inputs -->
        <FormLabel text="Nazwa użytkownika*" for="register-username" icon="fa-solid fa-face-smile-beam" />
        <input
            id="register-username"
            type="text"
            placeholder="Nazwa użytkownika (min. 3 litery)"
            class="form-input form-accent"
            v-model="userData.username"
            required
            minlength="3"
        />

        <!-- Tiles with exam tier -->
        <FormLabel text="Zakres materiału*" for="" icon="fa-solid fa-book" />
        <ExamTiers :changeExamTier="changeExamTier" :selectedExamTier="userData.exam_tier" />

        <p class="prose mt-3 text-sm sm:text-base">
            <font-awesome-icon icon="fa-solid fa-circle-info" class="mr-2" />Zakres materiału możesz zmienić w każdym
            momencie!
        </p>
        <!-- Tiles with exam tier -->

        <!-- Success message -->
        <span class="form-message !mt-5 text-success" v-if="successUserData">
            <font-awesome-icon icon="fa-solid fa-square-check" class="-mb-0.5 !text-2xl" />
            Pomyślnie zmieniono dane!
        </span>
        <!-- Success message -->

        <!-- Success message -->
        <span class="form-message !mt-5 text-error" v-if="errorUserData">
            <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="-mb-0.5 !text-2xl" />
            Wystąpił błąd podczas zmiany danych!
        </span>
        <!-- Success message -->

        <!-- Submit form button -->
        <FormSubmit
            text="Zmień dane"
            icon="fa-solid fa-arrow-right-arrow-left"
            :class="'btn-accent'"
            :loading="loading"
        />
        <!-- Submit form button -->
    </form>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/partials/form.scss';
</style>
