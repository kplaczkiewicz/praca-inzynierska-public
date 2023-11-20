import { userCurrentExamType } from "~/server/types"

// Check if the user has an active exam when trying to go to a new one
export default function (goToExamID: Ref<number>) {
    const userCurrentExam = useStatefulCookie<userCurrentExamType>('user-current-exam', useExamCookieOptions())
    const examSwitchModal = useState('examSwitchModal', () => ref<HTMLDialogElement | null>(null))

    // Check if user has active exam in cookie
    const goToExam = (examID: number) => {
        // If previous exam is finished
        // or the examID is the same as the current exam proceed
        if (
            !userCurrentExam.value ||
            userCurrentExam.value.exam_stage === 'finished' ||
            userCurrentExam.value.exam_id === examID
        ) {
            navigateTo(`/arkusze/${examID}`)
            return
        }

        // Else update exam id and show user a modal 
        goToExamID.value = examID
        examSwitchModal.value?.showModal()
    }

    return goToExam
}