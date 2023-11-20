// Get random questions ids
// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    // Only single choice questions
    let globalFilter : any = {
        AND: [
            {
                type: 1,
            },
        ],
    }

    // Get exam types
    const examTypes: string[] = getQuery(event).exam_types?.toString().split(',') ?? []
    if (examTypes.length) {
        globalFilter.AND.push({
            exam_types: {
                type: {
                    in: examTypes,
                },
            },
        })
    }

    // Get math fields
    const mathFields = getQuery(event).math_fields?.toString().split(',') ?? []
    if (mathFields.length) {
        globalFilter.AND.push({
            math_fields: {
                type: {
                    in: mathFields,
                },
            },
        })
    }

    // Retrieve the question ids that match the filters 
    try {
        const question_ids = await prisma.questions.findMany({
            select: {
                id: true,
            },
            where: globalFilter,
        })

        // For some reason the error is back
        await prisma.$disconnect();

        // If the data retrieved is empty
        if (question_ids === null) throw Error

        // Return the ids
        return {
            question_ids: question_ids,
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            question_ids: null,
            error: true,
        }
    }
})
