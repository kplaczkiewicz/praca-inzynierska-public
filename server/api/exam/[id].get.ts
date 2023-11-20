// Get all the questions of the exam
import { examTransformer } from '~/server/transformers/exam'

// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    // Get the id of the exam
    const id = Number(event.context.params?.id)

    // Retrieve the exam with all questions
    try {
        const exam_data = await prisma.exams.findFirstOrThrow({
            where: {
                id: id,
            },
            include: {
                exam_type: true,
                questions: {
                    include: {
                        question_type: true,
                        single_choice_question: true,
                    },
                    orderBy: {
                        id: 'asc'
                    }
                },
            },
        })

        // For some reason the error is back
        await prisma.$disconnect();

        // If the data retrieved is empty
        if (exam_data === null) throw Error

        // for (let i = 0; i < 3000000000; i++) {}

        // Return the transformed data
        return {
            exam: examTransformer(exam_data),
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            exam: null,
            error: true,
        }
    }
})
