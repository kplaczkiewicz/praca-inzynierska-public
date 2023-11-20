<!-- Modal to show when swithcing exams -->
<script setup lang="ts">
import { userCurrentExamType } from '~/server/types';

const props = defineProps<{
    examId: number
}>()

// User
const user = useSupabaseUser()

const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())

// Reset data from the current exam
async function resetAndGoToExam() {
    // By switching the stage the finished new exam will be automatically pulled
    userCurrentExam.value.exam_stage = 'finished'

    // If user is logged in also save to database
    if (user.value) {
        await useSaveCurrentExam(user.value.id, userCurrentExam.value);
    }

    navigateTo(`/arkusze/${props.examId}`)
}
</script>

<template>
    <BaseModal name="examSwitchModal" :close-on-backdrop="true" v-if="userCurrentExam">
        <h1>Czy jesteś pewny?</h1>

        <p class="!mb-6">
            Obecnie masz zapisane postępy z egzaminu: <span class="block font-semibold mb-2 text-neutral">{{ userCurrentExam.exam_title }}</span>Jeśli przejdziesz dalej te
            <span class="text-error font-semibold">postępy zostaną usunięte!</span>
        </p>

        <ModalControls
            prev-text="Powrót"
            next-text="Kontynuuj"
            :on-modal-next="resetAndGoToExam"
        />
    </BaseModal>
</template>

<style scoped lang="scss"></style>
