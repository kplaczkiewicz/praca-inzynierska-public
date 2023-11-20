<!-- Shows login button or user menu -->
<script setup lang="ts">
import { userCurrentExamType } from '~/server/types';

// Supabase
const user = useSupabaseUser()
const client = useSupabaseAuthClient()

// Get current route
const route = useRouter().currentRoute

// Logout
async function userLogout() {
    await client.auth.signOut()

    // Clear the cookie after logout
    const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())
    userCurrentExam.value.exam_stage = 'finished'

    navigateTo('/')
}

// Removes the focus after clicking on a button
const key = ref(0)
</script>

<template>
    <!-- Not logged in -->
    <NuxtLink to="/login" class="btn-icon-move-right btn btn-primary btn-outline flex" v-if="!user">
        <span class="hidden xs:block">
            <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="mr-2" />
        </span>
        <span class="mt-px">dołącz</span>
    </NuxtLink>
    <!-- Not logged in -->

    <!-- Logged in -->
    <div class="menu-dropdown dropdown-end dropdown" v-else>
        <label tabindex="0" class="avatar btn btn-circle btn-ghost h-12 w-12 sm:h-14 sm:w-14" :class="{ 'btn-active' : route.fullPath.startsWith('/profil') }">
            <div class="mask mask-squircle w-8 sm:w-10">
                <img
                    :src="`https://api.dicebear.com/5.x/initials/svg?seed=${user?.user_metadata.username}&backgroundColor=26A699,0077FF&backgroundType=gradientLinear`"
                    alt="Awatar"
                />
            </div>
        </label>

        <ul tabindex="0" class="dropdown-content min-w-[13rem]" :key="key">
            <li>
                <NuxtLink to="/profil" @click="key++">
                    <font-awesome-icon icon="fa-solid fa-user" />
                    Profil
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/profil/ustawienia" @click="key++">
                    <font-awesome-icon icon="fa-solid fa-gear" />
                    Ustawienia
                </NuxtLink>
            </li>
            <li>
                <a @click="userLogout">
                    <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
                    Wyloguj się
                </a>
            </li>
        </ul>
    </div>
    <!-- Logged in -->
</template>

<style lang="scss" scoped>
@import '@/assets/scss/components/dropdown.scss';
</style>
