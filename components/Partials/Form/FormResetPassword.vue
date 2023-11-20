<!-- Reset password form -->
<script setup lang="ts">
import FormPasswordStrength from '@/components/Partials/Form/PasswordStrength.vue'

// Supabase composables
const client = useSupabaseAuthClient()
const user = useSupabaseUser()

// Reset password data
const errorResetMsg = ref('')
const errorReset = ref(false)
const successReset = ref(false)
const loading = ref(false)
const resetData = ref({
    password: '',
    password_repeat: '',
})

// Password strength
const passwordStrength = ref<InstanceType<typeof FormPasswordStrength>>()
const strength = ref(0)

function validatePassword() {
    strength.value = passwordStrength?.value?.validatePassword(resetData.value.password, resetData.value.password_repeat) ?? 0
}

// Redirect to dashboard
const timeToRedirect = ref(5)
function triggerRedirect() {
    const countDown = setInterval(() => {
        timeToRedirect.value -= 1

        if (timeToRedirect.value === 0) {
            clearInterval(countDown)
            navigateTo('/profil')
        }
    }, 1000)
}

// Handle password reset
async function handleResetPassword() {
    // In case the user triggered the event exit it if the password is not secure
    if (strength.value !== 5 || successReset.value === true) return false
    loading.value = true

    try {
        errorReset.value = false
        successReset.value = false

        // Change the password
        const { data, error } = await client.auth.updateUser({ password: resetData.value.password })

        // Show error message
        if (error) throw error

        // If no error then show success and redirect
        successReset.value = true
        triggerRedirect()
    } catch (error: any) {
        let errorMessage = error?.message;
        if (errorMessage === 'New password should be different from the old password.') errorMessage = 'Nowe hasło nie może być takie same jak stare hasło!';
        else errorMessage = 'Wystąpił błąd podczas zmiany hasła!'

        errorResetMsg.value = errorMessage
        errorReset.value = true
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <form class="form-wrapper relative" @submit.prevent="handleResetPassword()">
        <!-- Form heading -->
        <div class="form-heading">
            <h1>Zmiana hasła</h1>
        </div>
        <!-- Form heading -->

        <!-- Form inputs -->
        <FormLabel text="Nowe hasło" for="reset-password-password" icon="fa-solid fa-lock" />
        <input
            id="reset-password-password"
            type="password"
            placeholder="Nowe hasło"
            class="form-input"
            v-model="resetData.password"
            @input="validatePassword()"
            required
        />

        <FormLabel text="Powtórz nowe hasło" for="reset-password-password-repeat" icon="fa-solid fa-lock" />
        <input
            id="reset-password-password-repeat"
            type="password"
            placeholder="Powtórz nowe hasło"
            class="form-input"
            v-model="resetData.password_repeat"
            @input="validatePassword()"
            required
        />
        <!-- Form inputs -->

        <!-- Show password strength -->
        <FormPasswordStrength ref="passwordStrength" />

        <!-- Password reset error message -->
        <FormMessageError :textError="errorResetMsg" v-if="errorReset"/>

        <!-- Password reset success message -->
        <span class="form-message" v-if="successReset">
            <div class="text-success mb-3">
                <font-awesome-icon icon="fa-solid fa-check" class="-mb-px mr-1 text-2xl" />
                Hasło zmienione pomyślnie
            </div>
            <font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" class="mt-2 -mb-px" />
            Zostaniesz przekierowany za {{ timeToRedirect }}s...
        </span>
        <!-- Password reset success message -->

        <!-- Submit form button -->
        <FormSubmit
            text="Zmień hasło"
            icon="fa-solid fa-arrow-right-arrow-left"
            :loading="loading"
            :disabled="strength < 5 || successReset"
        />
        <!-- Submit form button -->
    </form>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/partials/form.scss';
</style>
