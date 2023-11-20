// Redirect non-authenticeted users to homepage
export default defineNuxtRouteMiddleware(() => {
    const user = useSupabaseUser()

    if (!user.value) {
        return navigateTo('/login')
    }
})
