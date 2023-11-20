// Save user exam for later viewing
// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    try {
        // Get user id and exam data
        const requestBody = await readBody<{
            user_id: string
            title: string
            date: Date
            score: number
            exam_content: string
            open_question_solutions: string
            correct_answers: string
            user_answers: string
        }>(event)

        // Save the exam
        const data = await prisma.user_exams.create({
            data: requestBody
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
