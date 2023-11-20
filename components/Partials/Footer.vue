<!-- Main footer of the entire site -->
<script setup lang="ts">
const config = useConfig()
</script>

<template>
    <footer class="z-10 -mt-36 text-primary-content">
        <div class="overlay-footer"></div>
        <div class="-mt-5 bg-neutral pb-7 sm:pb-10">
            <div class="container flex flex-col items-center gap-6 text-center">
                <Logo :logo-size="'large'" :logo-color="'gradient'" />
                <p>{{ config.siteTitle }} © {{ new Date().getFullYear() }} - Wszystkie prawa zastrzeżone</p>
            </div>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
.overlay-footer {
    @apply h-[150px] w-full bg-cover bg-center sm:h-[200px];
    background-image: url('/svg/waves/footer-waves.svg');
}
</style>
