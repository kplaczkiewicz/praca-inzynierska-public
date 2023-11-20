// Composable that allows cookie to share state between components
// https://github.com/nuxt/nuxt/issues/13020#issuecomment-1505548242

import { CookieOptions, CookieRef } from '#app'

export default function useStatefulCookie<T = string>(name: string, options?: CookieOptions<T>): CookieRef<T> {
    // Save cookie in state
    const cookie = useCookie(name, options)
    const state = useState(name, () => cookie.value)

    // Update the cookie whenever the state changes thus updating both the state and the cookie
    watch(state, () => {
        cookie.value = state.value
    }, { deep: true })

    // Return the state not the cookie
    return state
}
