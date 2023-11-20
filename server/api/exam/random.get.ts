// Get random exam id
// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    let globalFilter : any = {
        AND: [

        ]
    }

    // Get exam types
    const examTypes: string[] = getQuery(event).exam_types?.toString().split(',') ?? []
    if (examTypes.length) {
        globalFilter.AND.push({
            exam_type: {
                type: {
                    in: examTypes,
                },
            },
        })
    }

    // Add ids to skip
    const skipIDs: string[] = getQuery(event).skip_ids?.toString().split(',') ?? []
    if (skipIDs.length) {
        globalFilter.AND.push({
            exam_type: {
                type: {
                    notIn: skipIDs,
                },
            },
        })
    }

    // Retrieve the exam ids that match the filters 
    try {
        const exam_ids = await prisma.exams.findMany({
            select: {
                id: true,
            },
            where: globalFilter
        })

        // For some reason the error is back
        await prisma.$disconnect();

        // If the data retrieved is empty
        if (exam_ids === null) throw Error

        // Return the ids
        return {
            exam_ids: exam_ids,
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            exam_ids: null,
            error: true,
        }
    }
})
