import { userCurrentExamType } from "~/server/types"

// Check if the user doesnt have an active exam
export default defineNuxtRouteMiddleware((to, from) => {
    // Get id of the current exam
    const examID = Number(to.params.id.toString());

    // Get id of saved exam
    const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())

    // If the exams are confilcting redirect to homepage
    if (userCurrentExam.value && userCurrentExam.value.exam_stage !== 'finished' && userCurrentExam.value.exam_id !== examID) {
        return navigateTo('/arkusze')
    }
})
