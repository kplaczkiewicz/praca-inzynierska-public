<!-- General error modal -->
<script setup lang="ts"></script>

<template>
    <BaseModal name="errorModal" :close-on-backdrop="true">
        <h1 class="!mb-3">Błąd!</h1>
        <p>Wystąpił nieoczekiwany błąd, spróbuj ponownie</p>

        <div class="mt-6 flex justify-end">
            <button class=" btn btn-primary">
                <font-awesome-icon icon="fa-solid fa-times" class="-mt-px text-xl" />
                Zamknij
            </button>
        </div>
    </BaseModal>
</template>

<style scoped lang="scss">
</style>
