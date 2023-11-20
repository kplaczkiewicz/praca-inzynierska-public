<!-- User profile settings -->
<script setup lang="ts">
</script>

<template>
    <NuxtLayout name="login-layout">
		<!-- Change password and metadata forms -->
        <TabWrapper ref="tabsWrapper">
            <Tab title="Zmień dane" icon="fa-solid fa-user" color="accent">
                <FormChangeUserData />        
            </Tab>

            <Tab title="Zmiana hasła" icon="fa-solid fa-arrows-rotate" color="primary">
                <FormResetPassword />
            </Tab>
        </TabWrapper>
		<!-- Change password and metadata forms -->
    </NuxtLayout>
</template>

<style lang="scss" scoped></style>
