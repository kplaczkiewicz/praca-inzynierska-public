<!-- Interactive question with animated showcase -->
<script setup lang="ts">
// Helper for list
const listElements = [
    'Każde zadanie otwarte można rozwiązać w tym trybie.',
    'Zadanie rozbite jest na najprostsze kroki.',
    'Do każdego kroku dostępna jest podpowiedź oraz wyjaśnienie.',
    'W razie problemów można pokazać poprawną odpowiedź.',
    'W ten sposób każde zadanie rozwiązuje się do końca.',
]
</script>

<template>
    <div class="relative border-b-2 border-neutral/50 bg-base-400">
        <div class="background-overlay"></div>

        <div class="container relative z-[1] py-20 text-center">
            <SectionTitle title="Tryb interaktywny" subtitle="Zadania rozbite na czynniki pierwsze" />

            <div class="mb-10 mt-16 flex gap-12 text-left">
                <!-- Interactive question explanation -->
                <div class="flex-1">
                    <h4
                        class="-ml-1.5 mb-7 mt-0 text-2xl"
                        v-motion
                        :initial="{
                            opacity: 0,
                            y: -50,
                        }"
                        :visibleOnce="{
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: 400,
                                duration: 350,
                            },
                        }"
                    >
                        <font-awesome-icon
                            icon="fa-solid fa-circle-question"
                            class="-mb-0.5 mr-1 text-3xl text-accent"
                        />
                        Jak to działa?
                    </h4>

                    <ul class="list">
                        <li
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
                                    delay: 550 + index * 100,
                                    duration: 300,
                                },
                            }"
                        >
                            <span>{{ index + 1 }}.</span>
                            {{ li }}
                        </li>
                    </ul>

                    <!-- Showcase buttons -->
                    <div class="flex gap-6">
                        <NuxtLink
                            class="btn btn-primary btn-wide mt-10"
                            to="/cwiczenie"
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
                                    delay: 1200,
                                },
                            }"
                        >
                            <font-awesome-icon icon="fa-solid fa-graduation-cap" class="mb-0.5 mr-1 text-lg" />
                            Zobacz zadania
                        </NuxtLink>

                        <NuxtLink
                            class="btn btn-secondary btn-wide mt-10"
                            to="/cwiczenie/losuj"
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
                                    delay: 1200,
                                },
                            }"
                        >
                            <font-awesome-icon icon="fa-solid fa-shuffle" class="mr-1 text-lg" />
                            Losuj zadanie
                        </NuxtLink>
                    </div>
                    <!-- Showcase buttons -->
                </div>
                <!-- Interactive question explanation -->

                <!-- Interactive question animation -->
                <div class="flex-1">
                    <InteractiveQuestionAnimation />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.background-overlay {
    @apply z-0 bg-cover bg-center opacity-20;
    background-image: url('/svg/backgrounds/blurry-color.svg');
}

.list {
    @apply m-0 flex list-none flex-col gap-5 p-0;

    li {
        @apply m-0 grid  text-lg;
        grid-template-columns: 35px 1fr;

        span {
            @apply -mt-0.5 mr-1 text-2xl font-bold text-primary;
        }
    }
}
</style>
