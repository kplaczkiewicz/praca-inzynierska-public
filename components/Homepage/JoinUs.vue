<script setup lang="ts">
// Set background pattern
useSetBackgroundPattern('dots-random-size')

// Helper for list
const listElements = [
    'zapisywanie rozwiązanych arkuszy i zadań',
    'kontynuowanie rozwiązywania arkusza na innym urządzaniu',
    'dostęp do statystyk dla zadań i arkuszy',
]
</script>

<template>
    <div class="relative -mb-28 bg-base-400">
        <BackgroundPattern />

        <div class="container relative pb-32 pt-20 text-center">
            <SectionTitle title="Dołącz do nas" subtitle="Uzyskaj dodatkowe korzyści" />

            <p
                class="-mt-2 mb-5 text-lg"
                v-motion
                :initial="{
                    opacity: 0,
                    y: 50,
                }"
                :visibleOnce="{
                    opacity: 1,
                    y: 0,
                    transition: {
                        delay: 450,
                        duration: 350,
                    },
                }"
            >
                <font-awesome-icon icon="fa-solid fa-circle-info" class="mr-1 text-xl" />
                Założenie konta jest w 100% opcjonalne, zalogowani użytkownicy uzyskują:
            </p>

            <ul class="mt-0 flex list-none flex-col items-center gap-2.5 text-lg">
                <li
                    class="m-0"
                    v-for="(li, index) in listElements"
                    :key="index"
                    v-motion
                    :initial="{
                        opacity: 0,
                        x: -50,
                    }"
                    :visibleOnce="{
                        opacity: 1,
                        x: 0,
                        transition: {
                            delay: 650 + index * 100,
                            duration: 300,
                        },
                    }"
                >
                    <font-awesome-icon icon="fa-solid fa-check" class="-mb-0.5 mr-2 text-2xl text-success" />
                    {{ li }}
                </li>
            </ul>

            <!-- Join us buttons -->
            <div class="mt-12 flex justify-center gap-10">
                <NuxtLink
                    class="btn-icon-move-right btn btn-primary btn-wide"
                    to="/login"
                    v-motion
                    :initial="{
                        opacity: 0,
                        x: -50,
                    }"
                    :visibleOnce="{
                        opacity: 1,
                        x: 0,
                        transition: {
                            duration: 300,
                            delay: 1100,
                        },
                    }"
                >
                    <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" class="mb-px mr-1 text-lg" />
                    Zaloguj się
                </NuxtLink>
                <NuxtLink
                    class="btn btn-secondary btn-wide"
                    to="/login"
                    v-motion
                    :initial="{
                        opacity: 0,
                        x: 50,
                    }"
                    :visibleOnce="{
                        opacity: 1,
                        x: 0,
                        transition: {
                            duration: 300,
                            delay: 1100,
                        },
                    }"
                >
                    <font-awesome-icon icon="fa-solid fa-user" class="mb-px mr-2 text-lg" />
                    Załóż konto
                </NuxtLink>
            </div>
            <!-- Join us buttons -->
        </div>
    </div>
</template>

<style scoped></style>
