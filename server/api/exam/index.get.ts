// Get the most recent exams with pagination and filters
import { examCompactTransformer } from '~/server/transformers/exam_compact'
import { sortValueType } from '~/server/types'

// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    // How many exams to retrieve
    const count = Number(getQuery(event).count)

    // Flag wheter to add pagination information
    const addPagination = !!getQuery(event).add_pagination
    const currentPage = Number(getQuery(event).current_page)

    // Sorting
    const sortDate: sortValueType = getQuery(event).sort_date === 'asc' ? 'asc' : 'desc'

    // Set global filter for both calls
    let globalFilter : any = {}

    // Get years
    const filterYears : string[] = getQuery(event).years?.toString().split(',') ?? [];
    
    if (filterYears.length) {
        // Add years as an OR relation
        globalFilter.OR = []

        // Add each year as an option
        filterYears.forEach(year => {
            globalFilter.OR.push({
                date: {
                    gte: new Date(`${year}-01-01`),
                    lte: new Date(`${year}-12-31`),
                }
            })
        })
    }

    // Get exam types
    const filterExamTypes : string[] = getQuery(event).exam_types?.toString().split(',') ?? [];
    if (filterExamTypes.length) {
        // Add exam types as an AND relation
        // Inside AND make exam types an OR using 'in' operator
        globalFilter.AND = [
            {
                exam_type: {
                    type: {
                        in: filterExamTypes
                    }
                }
            }
        ]
    }

    // Get exam date types
    const filterExamDateTypes : string[] = getQuery(event).exam_date_types?.toString().split(',') ?? [];
    if (filterExamDateTypes.length) {
        // Prepare the data
        const dateTypeFilter = {
            exam_date_types: {
                type: {
                    in: filterExamDateTypes
                }
            }
        }

        // If AND exists add to it else create it
        if (globalFilter.hasOwnProperty('AND')) {
            globalFilter.AND.push(dateTypeFilter)
        } else {
            globalFilter.AND = [dateTypeFilter]
        }
    }

    // Get search string
    const search : string = getQuery(event).search?.toString() ?? '';
    if (search.length) {
        // Prepare the data
        const searchFilter = {
            title: {
                contains: search,
                mode: 'insensitive'
            }
        }

        // If AND exists add to it else create it
        if (globalFilter.hasOwnProperty('AND')) {
            globalFilter.AND.push(searchFilter)
        } else {
            globalFilter.AND = [searchFilter]
        }
    }

    try {
        // Set pagination data
        let pagination_data = null

        // Add pagination data only when needed
        if (addPagination && currentPage) {
            const exam_count = await prisma.exams.count({
                where: globalFilter
            })

            pagination_data = {
                currentPage: currentPage,
                lastPage: Math.ceil(exam_count / count),
            }
        }

        // Retrieve most recent exams
        const exams_data = await prisma.exams.findMany({
            skip: currentPage ? (currentPage - 1) * count : 0,
            take: count,
            orderBy: {
                date: sortDate,
            },
            // Filters
            where: globalFilter,
        })

        // For some reason the error is back
        await prisma.$disconnect()

        // for (let i = 0; i < 3000000000; i++) {}

        // If the data retrieved is empty
        if (exams_data === null) throw Error

        // Return the transformed data
        return {
            exams: examCompactTransformer(exams_data),
            pagination: pagination_data,
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            exams: null,
            error: true,
        }
    }
})
