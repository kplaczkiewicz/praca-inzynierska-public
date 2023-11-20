<!-- Password reset page -->
<script setup lang="ts">
// Supabase composables
const client = useSupabaseAuthClient()

// Listen for the auth event and only then show the frontend
const showResetPassword = ref(false)

watchEffect(() => {
    client.auth.onAuthStateChange(async (event) => {
        if (event == 'PASSWORD_RECOVERY') {
            showResetPassword.value = true
        }
    })
})
</script>

<template>
    <NuxtLayout name="login-layout" v-if="showResetPassword">
        <FormResetPassword />
    </NuxtLayout>
</template>

<style lang="scss" scoped></style>
