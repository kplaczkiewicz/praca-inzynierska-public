// Get user current exam
// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    try {
        // Get user id
        const user_id = getQuery(event).user_id?.toString() ?? ''

        // Create or update user current exam
        const current_exam = await prisma.user_current_exams.findFirst({
            where: {
                user_id: user_id,
            },
            select: {
                exam_content: true
            },
        })

        // For some reason the error is back
        await prisma.$disconnect()

        // for (let i = 0; i < 3000000000; i++) {}

        // If the data retrieved is empty
        if (current_exam === null) throw Error

        // Return the data
        return {
            current_exam: current_exam,
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            current_exam: null,
            error: true,
        }
    }
})
