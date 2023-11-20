// Get the most recent interactive questions with pagination and filters

// Initialize prisma
import prisma from '~/server/db'
import { questionCompactTransformer } from '../../transformers/question_compact'
import { sortValueType } from '~/server/types'

export default defineEventHandler(async (event) => {
    // How many questions to retrieve
    const count = Number(getQuery(event).count)

    // Flag wheter to add pagination information
    const addPagination = !!getQuery(event).add_pagination
    const currentPage = Number(getQuery(event).current_page)

    // Sorting
    const sortDate: sortValueType = getQuery(event).sort_date === 'desc' ? 'desc' : 'asc'

    // Set global filter for both calls
    let globalFilter: any = {
        AND: [
            {
                type: 2,
            },
        ],
    }

    // Get exam types
    const filterExamTypes: string[] = getQuery(event).exam_types?.toString().split(',') ?? []
    if (filterExamTypes.length) {
        globalFilter.AND.push({
            exam_types: {
                type: {
                    in: filterExamTypes,
                },
            },
        })
    }

    // Get math fields
    const mathFields: string[] = getQuery(event).math_fields?.toString().split(',') ?? []
    if (mathFields.length) {
        globalFilter.AND.push({
            math_fields: {
                type: {
                    in: mathFields,
                },
            },
        })
    }

    // Get exam
    const exam: string = getQuery(event).exam?.toString() ?? ''
    if (exam.length) {
        // Add each year as an option
        globalFilter.AND.push({
            exams: {
                id: Number(exam)
            },
        })
    }

    // Get search string
    const search: string = getQuery(event).search?.toString() ?? ''
    if (search.length) {
        // Prepare the data
        const searchFilters = [
            {
                question: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            {
                annotation: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            {
                exams: {
                    title: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            },
            {
                math_fields: {
                    name: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            },
        ]

        // If AND exists add to it else create it
        if (globalFilter.hasOwnProperty('OR')) {
            searchFilters.forEach((search) => {
                globalFilter.OR.push(search)
            })
        } else {
            globalFilter.OR = searchFilters
        }
    }

    try {
        // Set pagination data
        let pagination_data = null

        // Add pagination data only when needed
        if (addPagination && currentPage) {
            const exam_count = await prisma.questions.count({
                where: globalFilter,
            })

            pagination_data = {
                currentPage: currentPage,
                lastPage: Math.ceil(exam_count / count),
            }
        }

        // Retrieve most recent questions
        const questions_data = await prisma.questions.findMany({
            skip: (currentPage - 1) * count,
            take: count,
            orderBy: [
                {
                    exams: {
                        date: sortDate,
                    },
                },
                {
                    question_number: 'desc',
                },
            ],
            where: globalFilter,
            include: {
                math_fields: {
                    select: {
                        type: true,
                        name: true,
                    },
                },
                exams: {
                    select: {
                        id: true,
                        title: true,
                        date: true,
                    },
                },
            },
        })

        // For some reason the error is back
        await prisma.$disconnect()

        // for (let i = 0; i < 3000000000; i++) {}

        // If the data retrieved is empty
        if (questions_data === null) throw Error

        // Return the transformed data
        return {
            questions: questionCompactTransformer(questions_data),
            pagination: pagination_data,
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
