<!-- Component that creats an overlay with image lightbox -->
<script setup lang="ts">
defineProps<{
    images: string[]
}>()

// Show lightbox
const showLightbox = ref(false)

// Save index
const swiperIndex = ref(0)

// Toggle lightbox visibility
function toggleLightbox(index?: number) {
    if (index !== undefined) swiperIndex.value = index
    showLightbox.value = !showLightbox.value
}

// Allow usage of these functions in parent components
defineExpose({
    toggleLightbox,
})

// On every slider initilization go to the correct index
function goToSlideIndex(swiper: any) {
    swiper.slideToLoop(swiperIndex.value, 0)
}

// Disable scroll on overlay
const bodyOverflowHidden = useState('overflowHidden', () => false)

watchEffect(() => {
    bodyOverflowHidden.value = showLightbox.value
})

// Lightbox controls button classes
const buttonClasses = 'btn btn-square btn-ghost h-14 w-14 cursor-pointer text-4xl text-white'
</script>

<template>
    <!-- Main wrapper -->
    <TransitionWrapper name="fade">
        <div class="overlay backdrop-blur" v-if="showLightbox">
            <!-- Overlay -->
            <div class="background-overlay bg-neutral/70" @click="toggleLightbox()"></div>

            <!-- Image lightbox -->
            <div class="max-w-6xl">
                <Swiper
                    @swiper="goToSlideIndex"
                    :modules="[SwiperNavigation, SwiperPagination]"
                    :slides-per-view="1"
                    :centeredSlides="true"
                    :loop="true"
                    :navigation="{
                        enabled: true,
                        prevEl: '.swiper-prev',
                        nextEl: '.swiper-next',
                    }"
                    :pagination="{
                        enabled: true,
                        clickable: true,
                    }"
                    :auto-height="true"
                >
                    <SwiperSlide v-for="(image, index) in images" :key="index">
                        <img :src="image" class="mx-auto max-h-[80vh] shadow-xl" />
                    </SwiperSlide>
                </Swiper>

                <!-- Lightbox controls -->
                <div class="absolute left-0 top-1/2 flex w-full justify-between">
                    <div class="relative left-12" :class="buttonClasses">
                        <font-awesome-icon icon="fa-solid fa-chevron-left" class="swiper-prev" />
                    </div>
                    <div class="relative right-12" :class="buttonClasses">
                        <font-awesome-icon icon="fa-solid fa-chevron-right" class="swiper-next" />
                    </div>
                </div>
                <!-- Lightbox controls -->

                <!-- Close button -->
                <div class="fixed right-12 top-8" :class="buttonClasses">
                    <font-awesome-icon icon="fa-solid fa-xmark" @click="toggleLightbox()" />
                </div>
                <!-- Close button -->
            </div>
            <!-- Image lightbox -->
        </div>
    </TransitionWrapper>
    <!-- Main wrapper -->
</template>

<style lang="scss" scoped>
</style>
