import { userCurrentExamType } from "~/server/types"

// Check if the user doesnt have an active exam or query params
export default defineNuxtRouteMiddleware((to, from) => {
    // Check if all query params are set only if coming from /losuj
    if (from.name === 'zadania-losuj' && (!to.query.num_of_questions || !to.query.question_ids || !to.query.time_limit)) {
        return navigateTo('/zadania/losuj')
    }

    // Get saved exam
    const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())

    // Else if there are no query params check if exam is finished or exam type is wrong
    if (from.name !== 'zadania-losuj' && userCurrentExam.value && (userCurrentExam.value.exam_type === 'normal' || userCurrentExam.value.exam_stage === 'finished')) {
        return navigateTo('/zadania/losuj')
    }
})
