<!-- Login page -->
<script setup lang="ts">
import TabsWrapper from '@/components/Base/Tab/TabWrapper.vue'

// Middleware
definePageMeta({
    middleware: 'unauthorized',
})

// Supabse composables
const user = useSupabaseUser()

// Show the message for the new account
const successRegister = ref(false)
const userData = ref('')

// Change the tab to login
const tabsWrapper = ref<InstanceType<typeof TabsWrapper>>()
provide('tabs-wrapper-ref', tabsWrapper)

// Update user data and set the new user email
function updateRegisterData(isRegistered: boolean, newUserData: string) {
    successRegister.value = isRegistered
    userData.value = newUserData
}

// Reset back to registration form
function goBackToRegister() {
    updateRegisterData(false, '')
    setTimeout(() => {
        tabsWrapper.value?.changeTab('Rejestracja', 1)
    }, 100)
}

// When user has a value (it's logged in) redirect to the dashboard
watchEffect(() => {
    if (user.value) {
        navigateTo('/profil')
    }
})
</script>

<template>
    <NuxtLayout name="login-layout">
		<!-- Login and register forms -->
        <TabWrapper ref="tabsWrapper" v-if="!successRegister">
            <Tab title="Logowanie" icon="fa-solid fa-right-to-bracket" color="primary">
                <FormLogin />
            </Tab>

            <Tab title="Rejestracja" icon="fa-solid fa-user" color="accent">
                <FormRegister :update-register-data="updateRegisterData" />
            </Tab>
        </TabWrapper>
		<!-- Login and register forms -->

		<!-- New user welcome message -->
        <NewRegister :userData="userData" :goBackToRegister="goBackToRegister" v-else/>
    </NuxtLayout>
</template>

<style lang="scss" scoped></style>
