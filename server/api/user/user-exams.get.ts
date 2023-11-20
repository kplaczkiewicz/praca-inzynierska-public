// Get user latest exams
// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    try {
        // Get the id of the exam
        const user_id = getQuery(event).user_id?.toString() ?? ''

        // Get exams
        const user_exams = await prisma.user_exams.findMany({
            where: {
                user_id: user_id,
            },
            select: {
                id: true,
                title: true,
                date: true,
                score: true,
            },
            orderBy: {
                date: 'desc'
            }
        })

        // For some reason the error is back
        await prisma.$disconnect()

        // for (let i = 0; i < 3000000000; i++) {}

        // If the data retrieved is empty
        if (user_exams === null) throw Error

        // Return the data
        return {
            user_exams: user_exams,
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            user_exams: null,
            error: true,
        }
    }
})
