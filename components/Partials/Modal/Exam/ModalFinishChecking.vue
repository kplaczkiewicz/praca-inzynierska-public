<!-- Modal to show at the end of the checking section -->
<script setup lang="ts">
defineProps<{
    onFinishChecking: () => void
}>()
</script>

<template>
    <BaseModal name="checkingEndModal" :close-on-backdrop="true">
        <h1>Czy jesteś pewny?</h1>
        <p class="!mb-8 mt-0">
            Upewnij się że sprawdziłeś wszystkie zadania!
        </p>

        <ModalControls prev-text="Powrót" next-text="Przejdź do wyników" :on-modal-next="onFinishChecking" />
    </BaseModal>
</template>

<style scoped lang="scss">
</style>
