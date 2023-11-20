// Save user current exam
// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    try {
        // Get user id and exam data
        const requestBody = await readBody<{
            user_id: string
            exam_content: string
        }>(event)

        // Create or update user current exam
        const data = await prisma.user_current_exams.upsert({
            where: {
                user_id: requestBody.user_id,
            },
            update: {
                exam_content: requestBody.exam_content,
            },
            create: {
                user_id: requestBody.user_id,
                exam_content: requestBody.exam_content,
            }
        })

        // For some reason the error is back
        await prisma.$disconnect()

        // for (let i = 0; i < 3000000000; i++) {}

        // If the data retrieved is empty
        if (data === null) throw Error

        // Return only the error
        return {
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            error: true,
        }
    }
})
