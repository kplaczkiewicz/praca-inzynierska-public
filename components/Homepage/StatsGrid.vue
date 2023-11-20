<!-- Grid various stats about the exams and questions -->
<script setup lang="ts">
import { polishPlurals } from 'polish-plurals'
import { examStatsType } from '~/server/types/helpers'

defineProps<{
    pending: boolean
    stats: examStatsType | undefined
}>()


</script>

<template>
    <div class="relative border-b-2 border-neutral/50 bg-white">
        <div class="background-overlay"></div>

        <div class="container relative z-[1] py-20 text-center">
            <SectionTitle title="Zadania maturalne" subtitle="Obszerna baza zadań z odpowiedziami" />

            <!-- Statistics grid loading -->
            <StatsGridSkeleton v-if="pending" />

            <!-- Statistics grid -->
            <div class="stats-grid" v-else-if="stats">
                <div
                    class="col-span-2 bg-primary"
                    v-motion
                    :initial="{
                        opacity: 0,
                        x: -50,
                    }"
                    :visibleOnce="{
                        opacity: 1,
                        x: 0,
                        transition: {
                            delay: 600,
                            duration: 500,
                        },
                    }"
                >
                    <span>
                        <Counter :target="stats.examsCount" :duration="700" :offset="800" class="inline" />
                        {{ polishPlurals('arkusz', 'arkusze', 'arkuszy', stats.examsCount) }}

                        <NuxtLink to="/arkusze"> sprawdź sam </NuxtLink>
                    </span>
                </div>

                <div
                    class="col-span-4 bg-secondary"
                    v-motion
                    :initial="{
                        opacity: 0,
                        y: -60,
                    }"
                    :visibleOnce="{
                        opacity: 1,
                        y: 0,
                        transition: {
                            delay: 700,
                            duration: 500,
                        },
                    }"
                >
                    <span>
                        <Counter :target="stats.questionsCount" :duration="2000" :offset="900" class="inline" />
                        {{ polishPlurals('zadanie', 'zadania', 'zadań', stats.questionsCount) }}
                        <p class="mb-0 mt-2 text-lg font-normal">...dodawane na bieżąco</p>
                    </span>
                </div>

                <div
                    class="col-span-3 bg-accent"
                    v-motion
                    :initial="{
                        opacity: 0,
                        y: 60,
                    }"
                    :visibleOnce="{
                        opacity: 1,
                        y: 0,
                        transition: {
                            delay: 800,
                            duration: 500,
                        },
                    }"
                >
                    <span>
                        <Counter :target="stats.singleChoiceQuestionsCount" :duration="1500" :offset="1000" class="inline" />
                        {{
                            polishPlurals(
                                'zadanie zamknięte',
                                'zadania zamknięte',
                                'zadań zamkniętych',
                                stats.singleChoiceQuestionsCount
                            )
                        }}
                        <p class="mb-0 mt-2 text-lg font-normal">...z wyjaśnieniami i odpowiedziami</p>
                    </span>
                </div>

                <div
                    class="col-span-2 bg-primary"
                    v-motion
                    :initial="{
                        opacity: 0,
                        y: 70,
                    }"
                    :visibleOnce="{
                        opacity: 1,
                        y: 0,
                        transition: {
                            delay: 900,
                            duration: 500,
                        },
                    }"
                >
                    <span>
                        <Counter :target="stats.openQuestionsCount" :duration="1000" :offset="1100" class="inline" />
                        {{
                            polishPlurals(
                                'zadanie otwarte',
                                'zadania otwarte',
                                'zadań otwartych',
                                stats.openQuestionsCount
                            )
                        }}

                        <NuxtLink to="/cwiczenie"> w trybie interaktywnym </NuxtLink>
                    </span>
                </div>

                <div
                    class="bg-secondary"
                    v-motion
                    :initial="{
                        opacity: 0,
                        x: 60,
                    }"
                    :visibleOnce="{
                        opacity: 1,
                        x: 0,
                        transition: {
                            delay: 1000,
                            duration: 500,
                        },
                    }"
                >
                    <span>
                        <Counter :target="stats.fieldsCount" :duration="600" :offset="1300" class="inline" />
                        {{ polishPlurals('dział', 'działy', 'działów', stats.fieldsCount) }}

                        <p class="mb-0 mt-2 text-lg font-normal">...z podstawy i rozszerzenia</p>
                    </span>
                </div>
            </div>
            <!-- Statistics grid -->
        </div>
    </div>
</template>

<style lang="scss" scoped>
.background-overlay {
    @apply z-0 bg-cover bg-center opacity-20;
    background-size: 100px;
    background-image: url('/svg/patterns/grid.svg');
}

.stats-grid {
    @apply relative mb-10 grid grid-cols-6 gap-2;

    > div {
        @apply grid h-[250px] place-items-center rounded-lg px-8 py-6 text-4xl font-bold text-primary-content;

        a {
            @apply mt-2 block text-lg font-normal text-white underline-offset-[6px] transition-all hover:underline-offset-4;
        }
    }
}
</style>
