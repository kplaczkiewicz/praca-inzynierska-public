<!-- Hello user on the dashboard -->
<script setup lang="ts">
import { userCurrentExamType } from '~/server/types'

// Supabase composables
const user = useSupabaseUser()
const client = useSupabaseAuthClient()

// Logout
async function userLogout() {
    await client.auth.signOut()

    // Clear the cookie after logout
    const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())
    userCurrentExam.value.exam_stage = 'finished'

    navigateTo('/')
}
</script>

<template>
    <div class="mx-auto flex max-w-5xl justify-between">
        <!-- Username -->
        <div class="flex items-center">
            <div class="mask mask-hexagon mr-4 w-20">
                <img
                    :src="`https://api.dicebear.com/5.x/initials/svg?seed=${user?.user_metadata.username}&backgroundColor=26A699,0077FF&backgroundType=gradientLinear`"
                    alt="Awatar"
                    class="m-0"
                />
            </div>
            <h1 class="m-0">Witaj {{ user?.user_metadata.username }}!</h1>
        </div>
        <!-- Username -->

        <!-- Buttons -->
        <div class="flex items-center gap-3">
            <NuxtLink class="btn-icon-rotate-right btn btn-secondary" to="/profil/ustawienia">
                <font-awesome-icon icon="fa-solid fa-gear" class="mb-px mr-1 text-lg" />
                Ustawienia
            </NuxtLink>

            <button class="btn-icon-move-right btn btn-primary" @click="userLogout">
                <font-awesome-icon icon="fa-solid fa-arrow-right-to-bracket" class="mb-px mr-1 text-lg" />
                Wyloguj
            </button>
        </div>
        <!-- Buttons -->
    </div>
</template>

<style scoped></style>
