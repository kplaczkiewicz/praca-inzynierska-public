<!-- Wrapper component for custom transitions -->
<script setup lang="ts">
import { transitionOptionsType } from '~/server/types';

defineProps<{
    name: transitionOptionsType
}>()
</script>

<template>
    <Transition :name="name">
        <slot></slot>
    </Transition>
</template>

<style lang="scss" scoped>
// fade
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

// crossfade
.crossfade-enter-active,
.crossfade-leave-active {
    transition: opacity .5s ease;
}

.crossfade-leave-active {
    position: absolute;
}

.crossfade-enter-from,
.crossfade-leave-to {
    opacity: 0;
}

// fade-right
.fade-right-enter-active,
.fade-right-leave-active {
    transition: opacity 0.3s ease, translate 0.3s ease;
}

.fade-right-enter-from,
.fade-right-leave-to {
    translate: 2.5rem 0;
    opacity: 0;
}

// fade-bottom
.fade-bottom-enter-active,
.fade-bottom-leave-active {
    transition: opacity 0.3s ease, translate 0.3s ease;
}

.fade-bottom-enter-from,
.fade-bottom-leave-to {
    translate: 0 1rem;
    opacity: 0;
}

// switch-bottom
.switch-bottom-enter-active,
.switch-bottom-leave-active {
    position: absolute;
    transition: opacity 0.3s ease, translate 0.3s ease;
}

.switch-bottom-enter-from,
.switch-bottom-leave-to {
    translate: 0 1rem;
    opacity: 0;
}

// switch-right
.switch-right-enter-active,
.switch-right-leave-active {
    transition: opacity 0.3s ease, translate 0.3s ease;
}

.switch-right-leave-active {
    position: absolute;
}

.switch-right-enter-from,
.switch-right-leave-to {
    translate: 2.5rem 0;
    opacity: 0;
}
</style>
