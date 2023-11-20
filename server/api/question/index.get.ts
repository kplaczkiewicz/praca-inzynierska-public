// Get questions by ids
// Initialize prisma
import prisma from '~/server/db'
import { questionsTransformer } from '~/server/transformers/exam_questions';

export default defineEventHandler(async (event) => {
    // How many exams to retrieve
    const questionIDs = getQuery(event).question_ids?.toString().split(',').map(id => Number(id)) ?? [];

    try {
        // Retrieve most recent exams
        const questions = await prisma.questions.findMany({
            where: {
                id: {
                    in: questionIDs
                }
            },
            include: {
                question_type: true,
                single_choice_question: true,
            }
        })

        // For some reason the error is back
        await prisma.$disconnect()

        // for (let i = 0; i < 3000000000; i++) {}

        // If the data retrieved is empty
        if (questions === null) throw Error

        // Return the transformed data
        return {
            questions: questionsTransformer(questions),
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            questions: null,
            error: true,
        }
    }
})
