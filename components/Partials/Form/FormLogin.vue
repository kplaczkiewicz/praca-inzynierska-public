<!-- Login form -->
<script setup lang="ts">
const config = useConfig()
const client = useSupabaseAuthClient()

// Objects to store and validate login data
const loading = ref(false)
const errorLogin = ref(false)
const errorLoginMsg = ref('')
const msgLogin = ref(false)

const loginData = ref({
    email: '',
    password: '',
})

// Forgot password flag
const showForgotPassword = ref(false)

// Login user
async function handleLogin() {
    try {
        resetFlags()

        const { data, error } = await client.auth.signInWithPassword({
            email: loginData.value.email,
            password: loginData.value.password,
        })

        // Show error message
        if (error) throw error
    } catch (error: any) {
        let errorMessage = error?.message;
        if (errorMessage === 'Email not confirmed') errorMessage = 'Przed zalogowaniem potwierdź swój adres email!';
        else errorMessage = 'Niepoprawne dane logowania!'

        showError(errorMessage)
    } finally {
        loading.value = false
    }
}

// Reset password
async function handleResetPassword() {
    try {
        resetFlags()

        const { data, error } = await client.auth.resetPasswordForEmail(loginData.value.email, {
            redirectTo: `${config.siteURL}/reset-hasla`,
        })

        console.log(data, error)

        // Show error message
        if (error) throw error

        // Show the user the message
        msgLogin.value = true
    } catch (error: any) {
        showError('Wystąpił problem, spróbuj ponownie!')
    } finally {
        loading.value = false
    }
}

// Helper functions for supabase calls
function resetFlags() {
    loading.value = true
    errorLogin.value = false
    msgLogin.value = false
}

function showError(message: string) {
    errorLogin.value = true
    errorLoginMsg.value = message
}

// Switch between login and forgot password
function switchLoginViews() {
    showForgotPassword.value = !showForgotPassword.value
    errorLogin.value = false
    msgLogin.value = false
}
</script>

<template>
    <form class="form-wrapper relative" @submit.prevent="showForgotPassword ? handleResetPassword() : handleLogin()">
        <!-- Form heading -->
        <div class="form-heading relative">
            <TransitionWrapper name="switch-right">
                <h1 v-if="!showForgotPassword">Logowanie</h1>
                <h1 v-else>Reset hasła</h1>
            </TransitionWrapper>
        </div>
        <!-- Form heading -->

        <!-- Form inputs -->
        <FormLabel text="Email" for="login-email" icon="fa-solid fa-envelope" />
        <input
            id="login-email"
            type="email"
            placeholder="Email"
            class="form-input"
            v-model="loginData.email"
            pattern=".+@.+\..+"
            required
        />

        <TransitionWrapper name="fade-right">
            <FormLabel text="Hasło" for="login-password" icon="fa-solid fa-lock" v-if="!showForgotPassword" />
        </TransitionWrapper>

        <TransitionWrapper name="fade-right">
            <input
                id="login-password"
                type="password"
                placeholder="Hasło"
                class="form-input"
                v-model="loginData.password"
                required
                v-if="!showForgotPassword"
            />
        </TransitionWrapper>
        <!-- Form inputs -->

        <!-- Reset password message -->
        <span class="form-message text-success" v-if="msgLogin">
            <font-awesome-icon icon="fa-solid fa-square-check" class="-mb-0.5" />
            Link do zresetowania hasła został pomyślnie wysłany na twojego maila.
        </span>
        <!-- Reset password message -->

        <!-- Login error message -->
        <span class="form-message text-error" v-if="errorLogin">
            <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="-mb-0.5" />
            {{ errorLoginMsg }}
        </span>
        <!-- Login error message -->

        <!-- Reset password switch -->
        <p class="mt-3 text-right">
            <a href="#" class="text-sm hover:text-primary-focus" @click.prevent="switchLoginViews">
                <font-awesome-icon
                    :icon="showForgotPassword ? 'fa-solid fa-arrow-left' : 'fa-solid fa-circle-question'"
                    class="-mb-[1.5px] mr-0.5 text-base"
                />
                {{ showForgotPassword ? 'Powrót do logowania' : 'Zapomaniałeś hasła?' }}
            </a>
        </p>
        <!-- Reset password switch -->

        <!-- Submit form button -->
        <FormSubmit
            text="Zaloguj"
            icon="fa-solid fa-right-to-bracket"
            :loading="loading"
            :class="'btn-icon-move-right'"
            v-if="!showForgotPassword"
        />
        <FormSubmit
            text="Resetuj hasło"
            icon="fa-solid fa-rotate"
            :loading="loading"
            :class="'btn-icon-rotate-right'"
            v-else
        />
    </form>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/partials/form.scss';
</style>
