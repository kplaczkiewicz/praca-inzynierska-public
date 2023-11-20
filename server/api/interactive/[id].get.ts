// Get interactive question data
import { interactiveQuestionTransformer } from '~/server/transformers/interactive_question'

// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    // Get the id of the question
    const id = Number(event.context.params?.id)

    // Retrieve the interactive question 
    try {
        const interactive_data = await prisma.questions.findFirstOrThrow({
            where: {
                id: id
            },
            include: {
                interactive_questions: {
                    select: {
                        interactive_content: true
                    }
                },
                exam_types: {
                    select: {
                        name: true
                    }
                },
                math_fields: {
                    select: {
                        name: true
                    }
                }
            }
        })

        // For some reason the error is back
        await prisma.$disconnect();

        // If the data retrieved is empty
        if (interactive_data === null) throw Error

        // Return the transformed data
        return {
            interactive_question: interactiveQuestionTransformer(interactive_data),
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            interactive_question: null,
            error: true,
        }
    }
})
