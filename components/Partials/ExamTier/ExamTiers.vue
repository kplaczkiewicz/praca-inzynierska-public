<!-- Component that let's the user choose their exam tier -->
<script setup lang="ts">
import { examTierType } from '@/server/types'

// Prop is the current exam tier in the parent component and function to change it
defineProps<{
    selectedExamTier: examTierType
    changeExamTier: (tier: examTierType) => void
}>()

const iconClasses = 'mr-1.5';
</script>

<template>
    <div class="exam-tier">
        <ExamTierSingle examTier="basic" :selectedExamTier="selectedExamTier" :changeExamTier="changeExamTier" color="primary">
            <font-awesome-icon icon="fa-solid fa-not-equal" :class="iconClasses" />Podstawa
        </ExamTierSingle>

        <ExamTierSingle examTier="advanced" :selectedExamTier="selectedExamTier" :changeExamTier="changeExamTier" color="secondary">
            <font-awesome-icon icon="fa-solid fa-square-root-variable" :class="iconClasses" />Rozszerzenie
        </ExamTierSingle>

        <ExamTierSingle examTier="basic_and_advanced" :selectedExamTier="selectedExamTier" :changeExamTier="changeExamTier" color="accent" class="flex-col">
            <div><font-awesome-icon icon="fa-solid fa-not-equal" :class="iconClasses"/>Podstawa</div>
            <div class="divider my-1 text-xl sm:my-2">+</div>
            <div><font-awesome-icon icon="fa-solid fa-square-root-variable" :class="iconClasses"/>Rozszerzenie</div>
        </ExamTierSingle>
    </div>
</template>

<style lang="scss" scoped>
.exam-tier {
    @apply mt-1 flex flex-col gap-5 uppercase sm:flex-row sm:gap-8;
}
</style>
