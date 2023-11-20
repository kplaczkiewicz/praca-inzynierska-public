<!-- Modal to show on upload -->
<script setup lang="ts">
defineProps<{
    uploadStatus: 'in_progress' | 'success' | 'error'
}>()
</script>

<template>
    <BaseModal name="uploadingImageModal" :close-on-backdrop="false">
        <div class="text-center py-3 px-4">
            <div v-if="uploadStatus === 'in_progress'">
                <h1>
                    <font-awesome-icon icon="fa-solid fa-upload" class="text-primary text-5xl mr-3 -mb-1" />
                    Dodawanie zdjęcia
                </h1>
        
                <div class="text-center -mb-6">
                    <span class="loading loading-dots w-16 text-primary"></span>
                </div>
            </div>

            <div v-else-if="uploadStatus === 'success'">
                <h1 class="!m-0 !mb-6 !leading-snug">
                    <font-awesome-icon icon="fa-solid fa-circle-check" class="-mb-1 mr-3 text-5xl text-success" />
                    Zdjęcie dodane!
                </h1>
                <h3 class="!m-0">Pomyślnie dodano twoje rozwiązanie</h3>
            </div>

            <div v-else-if="uploadStatus === 'error'">
                <h1 class="!m-0 !mb-5 !leading-snug">
                    <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="text-error text-5xl mr-3 -mb-1" />
                    Wystąpił błąd!
                </h1>
                <h3 class="!m-0">Wystąpił nieoczekiwany błąd, spróbuj ponownie</h3>
            </div>
        </div>
    </BaseModal>
</template>

<style scoped lang="scss">
</style>
