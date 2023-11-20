// Global middleware
import { userCurrentExamType } from '~/server/types'

export default defineNuxtRouteMiddleware(async (to, from) => {
    // Check if the user is logged in
    const user = useSupabaseUser()

    if (user.value) {
        // If so pull their current exam
        const { data } = await useLazyFetch(`/api/user/get-current-exam?user_id=${user.value.id}`)

        // If there is value save it in the cookie
        if (!data.value?.error && data.value?.current_exam?.exam_content) {
            const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())
            userCurrentExam.value = JSON.parse(data.value.current_exam.exam_content)
        }
    }

    // Always scroll to top when switching pages
    if (to.path !== from.path && process.client) {
        setTimeout(() => {
            window.scrollTo(0, 0)
        }, 100)
    }
})
