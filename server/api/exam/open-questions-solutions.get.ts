// Transformer
import { openQuestionSolutionsFormattedType } from '~/server/types'

// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    // Get question ids
    const questionIds = getQuery(event).id;

    //Convert to array of numbers
    const questionIdsArray = questionIds?.toString().split(',').map(x => Number(x));

    // If no question ids throw error
    if (questionIds === null || questionIds === undefined) throw Error

	try {
        // Get the solutions
		const questions_data = await prisma.questions.findMany({
            where: {
                id: {in: questionIdsArray}
            },
            select: {
                id: true,
                open_questions: {
                    select: {
                        solutions: true
                    }
                }
            }
        })

        // For some reason the error is back
        await prisma.$disconnect();

		// If the data retrieved is empty
		if (questions_data === null) throw Error

        // Prepare the solutions
        const questionSolutions : openQuestionSolutionsFormattedType[] = []
        questions_data.forEach(question => {
            if (!question.open_questions) return

            questionSolutions.push({
                questionId: question.id,
                // Cast the JSON type to the custom type
                solutions: question.open_questions.solutions
            })
        });

		// Return the transformed data
		return {
			question_solutions: questionSolutions,
			error: false,
		}
	} catch (err : any) {
        console.log(err);

		// Return an error
		return {
			question_solutions: null,
			error: true,
		}
	}
})
