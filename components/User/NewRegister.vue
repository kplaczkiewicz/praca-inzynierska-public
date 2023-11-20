<!-- Message to show a new registered user -->
<script setup lang="ts">
defineProps<{
    userData: string
	goBackToRegister: () => void
}>()
</script>

<template>
    <div class="form-wrapper relative">
        <font-awesome-icon icon="fa-solid fa-hand-sparkles" class="wave" />
        <h2 class="mt-12 text-3xl font-bold">
            Witaj <span class="text-accent">{{ userData }}</span>!
        </h2>
        <div class="text-base sm:text-lg">
            <p class="mt-3">Potwierdź swój email kilkając w link wysłany na twojego maila!</p>

            <p class="mb-2 mt-10">Problemy z rejestracją?</p>
            <a href="#" class="link" @click.prevent="goBackToRegister">
                <font-awesome-icon icon="fa-solid fa-rotate" class="text-lg" />
                Spróbuj ponownie
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/partials/form.scss';
.form-wrapper {
    @apply border-2 border-primary p-8 text-center sm:p-12;
}

.wave {
    @apply text-[150px] text-primary sm:text-[200px];
    animation: wave 0.9s ease-in-out alternate infinite;
    transform-origin: bottom;
}

@keyframes wave {
    from {
        rotate: -15deg;
    }

    to {
        rotate: 15deg;
    }
}
</style>
