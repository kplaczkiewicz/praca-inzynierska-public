import { userCurrentExamType } from "~/server/types";

export default async function(userID: string, examContent: userCurrentExamType) {
    const { data } = await useLazyFetch('/api/user/save-current-exam', {
        method: 'POST',
        body: {
            user_id: userID,
            exam_content: JSON.stringify(examContent),
        },
    })

    if (data.value?.error) {
        console.error(data.value.error);
    }
}