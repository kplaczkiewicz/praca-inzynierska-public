<!-- Count up to a number when it is visible -->
<script setup lang="ts">
const props = defineProps<{
    target: number
    duration: number
    offset: number
}>()

const count = ref(0)
const observer = ref<IntersectionObserver>()
const counter = ref<HTMLElement>()

onMounted(() => {
    // Initialize the observer
    observer.value = new IntersectionObserver(handleIntersection, {
        rootMargin: '0px 0px -20% 0px', // Show at 75% of viewport
        threshold: 1,
    })

    if (counter.value) {
        observer.value.observe(counter.value)
    }
})

// Function for the observer
function handleIntersection(entries: any) {
    const entry = entries[0]

    // If element is visible start the animation
    if (entry.isIntersecting && observer.value && counter.value) {
        setTimeout(() => {
            countUpAnimation()
        }, props.offset)
        observer.value.unobserve(counter.value)
    }
}

// Count up animation
function countUpAnimation() {
    let startTime: number
    const updateCount = (timestamp: number) => {
        // Calculate progress based on time for different refresh rates
        if (!startTime) startTime = timestamp
        const progress = timestamp - startTime

        if (progress < props.duration) {
            // Increase the count
            count.value = Math.floor((progress / props.duration) * props.target)
            requestAnimationFrame(updateCount)
        } else {
            // Set count to target count and finish the animation
            count.value = props.target
        }
    }

    // Start the animation
    requestAnimationFrame(updateCount)
}
</script>

<template>
    <div ref="counter">
        {{ count }}
    </div>
</template>

<style lang="scss" scoped></style>
