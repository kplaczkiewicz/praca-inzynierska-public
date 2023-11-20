<!-- Users solution to open question -->
<script setup lang="ts">
import { questionType } from '~/server/types'

defineProps<{
    question: questionType
    userAnswers: string | string[] | null
}>()

// Store current index for image in new tab open
const currentIndex = ref(0)
</script>

<template>
    <div>
        <h3 class="mb-5 text-lg font-medium">
            <font-awesome-icon icon="fa-solid fa-pen-to-square" class="-mb-px mr-2 text-2xl text-primary" />Twoje
            rozwiązanie:
        </h3>

        <!-- Answers -->
        <div class="relative">
            <!-- User answers slider -->
            <Swiper
                @slideChange="(swiper : any) => currentIndex = swiper.realIndex"
                class="bg-white shadow-xl"
                :slides-per-view="1"
                :modules="[SwiperNavigation, SwiperPagination]"
                :loop="true"
                :navigation="{
                    enabled: true,
                    prevEl: '.swiper-prev',
                    nextEl: '.swiper-next',
                }"
                :auto-height="true"
            >
                <SwiperSlide v-for="userAnswer in userAnswers" :key="userAnswer">
                    <img :src="userAnswer" :alt="`Rozwiązanie do zadania ${question.question_number}`" />
                </SwiperSlide>
            </Swiper>
            <!-- User answers slider -->

            <div >
                <!-- Navigation arrows -->
                <div class="swiper-navigation left-3" v-if="userAnswers!.length > 1">
                    <font-awesome-icon icon="fa-solid fa-angle-left" class="swiper-prev" />
                </div>

                <a
                    class="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 transition-colors hover:text-primary"
                    :href="userAnswers![currentIndex]"
                    target="_blank"
                >
                    <font-awesome-icon
                        icon="fa-solid fa-arrow-up-right-from-square"
                        class="mr-1.5 text-lg text-primary"
                    />
                    Otwórz zdjęcie
                </a>

                <div class="swiper-navigation right-3" v-if="userAnswers!.length > 1">
                    <font-awesome-icon icon="fa-solid fa-angle-right" class="swiper-next" />
                </div>
                <!-- Navigation arrows -->

                <div class="relative z-[1] h-14 bg-white shadow-xl"></div>
            </div>
        </div>
        <!-- Answers -->
    </div>
</template>

<style lang="scss" scoped>
.swiper-navigation {
    @apply btn btn-square btn-ghost absolute bottom-1 z-10;

    svg {
        @apply cursor-pointer text-2xl text-primary;
    }
}
</style>
