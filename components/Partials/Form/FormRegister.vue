<!-- Register form -->
<script setup lang="ts">
import FormPasswordStrength from '@/components/Partials/Form/PasswordStrength.vue'
import TabsWrapper from '@/components/Base/Tab/TabWrapper.vue'
import { examTierType } from '@/server/types'

const props = defineProps<{
    updateRegisterData: (isRegistered: boolean, newUserData: string) => void
}>()

const config = useConfig()
const supabase = useSupabaseClient()

// Helper variables for register
const loading = ref(false)
const errorRegister = ref(false)
const msgRegister = ref(false)

// Register data
const registerData = ref({
    username: '',
    exam_tier: <examTierType>'basic',
    email: '',
    password: '',
    password_repeat: '',
})

// Control exam tier with custom selection fields
function changeExamTier(tier: examTierType) {
    registerData.value.exam_tier = tier
}

// Password strength
const passwordStrength = ref<InstanceType<typeof FormPasswordStrength>>()
const strength = ref(0)

function validatePassword() {
    strength.value = passwordStrength?.value?.validatePassword(registerData.value.password, registerData.value.password_repeat) ?? 0
}

// Register function
async function handeleRegister() {
    // In case the user triggered the event exit it if the password is not secure
    if (strength.value !== 5) return false

    try {
        loading.value = true
        errorRegister.value = false
        msgRegister.value = false
        props.updateRegisterData(false, '')

        const { data, error } = await supabase.auth.signUp({
            email: registerData.value.email,
            password: registerData.value.password,
            options: {
                emailRedirectTo: `${config.siteURL}/profil`,
                data: {
                    username: registerData.value.username,
                    exam_tier: registerData.value.exam_tier,
                },
            },
        })

        // Show error message
        if (error) throw error

        // If user exists show message
        if (data.user?.recovery_sent_at) {
            msgRegister.value = true
            return
        }

        // New user
        if (data.user) {
            props.updateRegisterData(true, data.user.user_metadata.username)
            return
        }

        // No new user so throw an error
        throw new Error()
    } catch (error: any) {
        console.log(error);
        errorRegister.value = true
    } finally {
        loading.value = false
    }
}

// Change the tab to login
const tabsWrapper = ref<InstanceType<typeof TabsWrapper> | undefined>(inject('tabs-wrapper-ref'))

function changeToLogin() {
    msgRegister.value = false
    tabsWrapper.value?.changeTab('Logowanie', 0)

    setTimeout(() => {
        window.scrollTo(0, 0)
    }, 100)
}
</script>

<template>
    <form class="form-wrapper relative" @submit.prevent="handeleRegister">
        <!-- Form heading -->
        <div class="form-heading">
            <h1>Rejestracja</h1>
        </div>
        <!-- Form heading -->

        <!-- Form inputs -->
        <FormLabel text="Nazwa użytkownika*" for="register-username" icon="fa-solid fa-face-smile-beam" />
        <input
            id="register-username"
            type="text"
            placeholder="Nazwa użytkownika (min. 3 litery)"
            class="form-input form-accent"
            v-model="registerData.username"
            required
            minlength="3"
        />

        <!-- Tiles with exam tier -->
        <FormLabel text="Zakres materiału*" for="" icon="fa-solid fa-book" />
        <ExamTiers :changeExamTier="changeExamTier" :selectedExamTier="registerData.exam_tier" />

        <p class="prose mt-3 text-sm sm:text-base">
            <font-awesome-icon icon="fa-solid fa-circle-info" class="mr-2" />Zakres materiału możesz zmienić w każdym
            momencie!
        </p>
        <!-- Tiles with exam tier -->

        <div class="divider"></div>

        <FormLabel text="Email*" for="register-email" icon="fa-solid fa-envelope" class="pt-0"/>
        <input
            id="register-email"
            type="email"
            placeholder="Email"
            class="form-input form-accent"
            v-model="registerData.email"
            pattern=".+@.+\..+"
            title="Podaj poprawny adres email"
            required
        />

        <FormLabel text="Hasło*" for="register-password" icon="fa-solid fa-lock" />
        <input
            id="register-password"
            type="password"
            placeholder="Hasło"
            class="form-input form-accent"
            v-model="registerData.password"
            @input="validatePassword()"
            required
        />

        <FormLabel text="Powtórz hasło*" for="register-password-repeat" icon="fa-solid fa-lock" />
        <input
            id="register-password-repeat"
            type="password"
            placeholder="Powtórz hasło"
            class="form-input form-accent"
            v-model="registerData.password_repeat"
            @input="validatePassword()"
            required
        />
        <!-- Form inputs -->

        <!-- Show password strength -->
        <PasswordStrength ref="passwordStrength" />

        <!-- Registration error message -->
        <FormMessageError textError="Wystąpił błąd podczas rejestracji!" v-if="errorRegister" />

        <!-- Account exists message -->
        <span class="form-message" v-if="msgRegister">
            <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="-mb-px mr-2 text-warning" />
            Wygląda na to że masz już konto,
            <a href="#" class="link mt-2" @click.prevent="changeToLogin"> zaloguj się. </a>
        </span>
        <!-- Account exists message -->

        <!-- Submit form button -->
        <FormSubmit
            text="Załóż konto"
            icon="fa-solid fa-right-to-bracket"
            :loading="loading"
            :class="'btn-icon-move-right btn-accent'"
            :disabled="strength < 5"
        />
        <!-- Submit form button -->
    </form>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/partials/form.scss';
</style>
