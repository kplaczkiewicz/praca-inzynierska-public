<!-- Modal to show at the end of the exam -->
<script setup lang="ts">
import { polishPlurals } from 'polish-plurals';

const props = defineProps<{
    unansweredQuestions: number
    timeLeft: number
    nextText: string
    hasTimeLimit: boolean
    onEndExam: () => void
}>()

// Return formatted time
const formattedTime = computed(() => {
    return useFormatTime(props.timeLeft)
})
</script>

<template>
    <BaseModal name="examEndModal" :close-on-backdrop="true">
        <h1>Czy jesteś pewny?</h1>
        
        <p v-if="unansweredQuestions !== 0" class="!mb-3 text-lg text-error">
            Nie udzieliłeś jeszcze odpowiedzi na {{ unansweredQuestions }} {{ polishPlurals('zadanie', 'zadania', 'zadań', unansweredQuestions) }}!
        </p>

        <p class="!mb-8 mt-0">
            <span v-if="hasTimeLimit">
                Pozostał czas do ukończenia:
                <CountdownSimple
                    class="text-primary font-semibold"
                    :hours="formattedTime.hours"
                    :minutes="formattedTime.minutes"
                    :seconds="formattedTime.seconds"
                />
            </span>
        </p>

        <ModalControls prev-text="Powrót" :next-text="nextText" :on-modal-next="onEndExam" />
    </BaseModal>
</template>

<style scoped lang="scss">
</style>
