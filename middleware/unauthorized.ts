// Redirect authenticeted users to the dashboard
export default defineNuxtRouteMiddleware(() => {
    const user = useSupabaseUser()

    if (user.value) {
        return navigateTo('/profil')
    }
})
