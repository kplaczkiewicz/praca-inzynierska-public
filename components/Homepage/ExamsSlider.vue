<!-- Slider with the newest exams -->
<script setup lang="ts">
import { examCompactTypeFormatted } from '~/server/types'

defineProps<{
    exams: examCompactTypeFormatted[] | undefined
    pending: boolean
}>()

// Get the modal and the examID to pass it to composable
const goToExamID = ref(0)

// Get ready function from the composable
const goToExam = useGoToExamCheck(goToExamID)

// Helper for color classes
const colorVariants = useColorVariants()
</script>

<template>
    <div class="relative border-b-2 border-neutral/50 bg-white">
        <div class="background-overlay"></div>

        <div class="container relative z-[1] py-20 text-center">
            <SectionTitle title="Arkusze maturalne" subtitle="Pełne arkusze z wyjaśnieniami do zadań" />

            <!-- Slider-->
            <div class="mb-14">
                <!-- Slider Loader -->
                <ExamSliderSkeleton v-if="pending" />

                <Swiper
                    :modules="[SwiperAutoplay]"
                    :autoplay="{
                        delay: 5000,
                        pauseOnMouseEnter: true,
                    }"
                    :slides-per-view="3"
                    :loop="true"
                    :space-between="20"
                    :speed="800"
                    v-motion
                    :initial="{
                        opacity: 0,
                    }"
                    :visibleOnce="{
                        opacity: 1,
                        transition: {
                            delay: 500,
                            duration: 500,
                        },
                    }"
                    v-else
                >
                    <!-- Single exam -->
                    <SwiperSlide class="!flex !h-auto" v-for="(exam, i) in exams" :key="exam.id">
                        <div class="exam-card" :style="`--variant: var(--${colorVariants[i % 3]})`">
                            <div>
                                <p class="!mt-0 mb-2">
                                    <font-awesome-icon icon="fa-solid fa-calendar-days" class="mb-px mr-1" />
                                    {{ exam.date }}
                                </p>
                                <h2 class="!m-0 text-[28px] font-bold text-primary-content">
                                    {{ exam.title }}
                                </h2>
                            </div>

                            <button
                                class="group btn btn-outline mt-5 w-full text-white hover:border-white hover:bg-white"
                                @click="goToExam(exam.id)"
                            >
                                Rozwiąż
                                <font-awesome-icon
                                    icon="fa-solid fa-arrow-right-long"
                                    class="mb-px ml-1 text-lg transition-all group-hover:translate-x-1.5"
                                />
                            </button>
                        </div>
                    </SwiperSlide>
                    <!-- Single exam -->
                </Swiper>
            </div>
            <!-- Slider-->

            <div
                v-motion
                :initial="{
                    opacity: 0,
                    x: -30,
                }"
                :visibleOnce="{
                    opacity: 1,
                    x: 0,
                    transition: {
                        delay: 1000,
                        duration: 300,
                    },
                }"
            >
                <NuxtLink
                    class="group gap-1 text-xl font-semibold text-neutral no-underline transition-all hover:text-primary"
                    to="/arkusze"
                >
                    Zobacz wszystkie
                    <span class="transition-transform group-hover:translate-x-1.5">
                        <font-awesome-icon
                            icon="fa-solid fa-arrow-right"
                            class="-mb-0.5 ml-2.5 text-2xl"
                        />
                    </span>
                </NuxtLink>
            </div>
        </div>
    </div>

    <!-- Exam switch modal -->
    <ModalExamSwitch :exam-id="goToExamID" />
</template>

<style lang="scss" scoped>
.background-overlay {
    @apply z-0 opacity-20;
    background-image: url('/svg/backgrounds/noise-secondary.svg');
}

.exam-card {
    @apply m-2 flex flex-col justify-between rounded-lg border-2 border-white p-6 text-primary-content outline outline-2 outline-offset-2;
    outline-color: hsl(var(--variant) / 1);
    background-color: hsl(var(--variant) / 1);

    button {
        &:hover {
            color: hsl(var(--variant) / 1);
        }
    }
}
</style>
