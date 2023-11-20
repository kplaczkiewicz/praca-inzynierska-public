<script setup lang="ts">
// Show the password strength
const validations = ref<Array<any>>([])

//Password validation
function validatePassword(password: string, password_repeat: string): number {
    // Declare the rules
    validations.value = [
        password === password_repeat && password.length > 0, // same passwords
        password.length >= 8, //  min length
        password.search(/[a-z]/) > -1, // at least one small letter
        password.search(/[A-Z]/) > -1, // at least one big letter
        password.search(/[0-9]/) > -1, // at least one digit
    ]

    // Calculate the strength
    return validations.value.reduce((acc, cur) => acc + cur)
}

// Allow other components to use call method
defineExpose({
    validatePassword,
})

// Steps helper variable
const steps: string[] = [
    'Hasła są takie same',
    'Hasło ma minialmną długość 8 znaków',
    'Hasło zawiera małą literę',
    'Hasło zawiera dużą literę',
    'Hasło zawiera cyfrę',
]
</script>

<template>
    <ul class="steps steps-vertical mt-4">
        <li
            v-for="(step, index) in steps"
            :key="index"
            class="step before:bg-base-100"
            :class="validations[index] ? 'step-success' : 'step-error'"
            :data-content="validations[index] ? '✓' : '✕'"
        >
            {{ step }}
        </li>
    </ul>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/utilities/animations.scss';

.steps {
    *,
    *::before,
    *::after {
        @apply transition-all duration-300;
    }

    .step {
        @apply text-left text-sm sm:text-base;
        min-height: 3.25rem;

        @screen sm {
            min-height: 3.5rem;
        }

        &[data-content] {
            &:first-child {
                &::before {
                    content: none;
                }
            }

            &::after,
            &::before {
                @apply bg-center bg-no-repeat content-[''];
            }
        }

        &.step-success {
            &::after {
                animation: pulse-up 0.5s linear;
                background-size: 17px;
                background-image: url('/svg/icons/check.svg');
            }
        }

        &.step-error {
            &::after {
                animation: pulse-down 0.5s linear;
                background-size: 11px;
                background-image: url('/svg/icons/xmark.svg');
            }
        }
    }
}

@include pulse-animation('pulse-up', 1.2);
@include pulse-animation('pulse-down', 0.8);
</style>
