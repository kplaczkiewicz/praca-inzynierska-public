// Update user data
// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    try {
        // Get user data
        const requestBody = await readBody<{
            user_id: string
            username: string
            exam_tier: string
        }>(event)

        // Update user data
        const userData = await prisma.profiles.update({
            where: {
                id: requestBody.user_id,
            },
            data: {
                username: requestBody.username,
                exam_tier: requestBody.exam_tier,
            },
        })

        // For some reason the error is back
        await prisma.$disconnect()

        // for (let i = 0; i < 3000000000; i++) {}

        // If the data retrieved is empty
        if (userData === null) throw Error

        // Return the transformed data
        return {
            user_data: userData,
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            data: null,
            error: true,
        }
    }
})
