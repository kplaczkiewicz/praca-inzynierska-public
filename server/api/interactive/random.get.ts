// Get random interactive question id
// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    // Only open questions
    let globalFilter : any = {
        AND: [
            {
                type: 2,
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

    // Get math field
    const mathField = getQuery(event).math_field?.toString() ?? ''
    if (mathField.length) {
        globalFilter.AND.push({
            math_fields: {
                type: mathField
            },
        })
    }

    // Retrieve the interactive question ids that match the filters 
    try {
        const interactive_ids = await prisma.questions.findMany({
            select: {
                id: true,
            },
            where: globalFilter
        })

        // For some reason the error is back
        await prisma.$disconnect();

        // If the data retrieved is empty
        if (interactive_ids === null) throw Error

        // Return the ids
        return {
            interactive_ids: interactive_ids,
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            interactive_ids: null,
            error: true,
        }
    }
})
