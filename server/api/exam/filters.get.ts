// Get data for exam filters

// Initialize prisma
import prisma from '~/server/db'
import { examFiltersTransformer } from '~/server/transformers/exam_filters'

export default defineEventHandler(async (event) => {
    try {
        // Which filters to query
        const filtersPick: string[] = getQuery(event).pick?.toString().split(',') ?? []

        // Get all data needed for filters, that is specified in pick argument
        const exam_types = filtersPick.includes('exam_types')
            ? await prisma.exams.findMany({
                  distinct: ['type'],
                  select: {
                      exam_type: {
                          select: {
                              type: true,
                              name: true,
                          },
                      },
                  },
                  orderBy: {
                      exam_type: {
                          id: 'asc',
                      },
                  },
              })
            : []

        const exam_date_types = filtersPick.includes('exam_date_types')
            ? await prisma.exams.findMany({
                  distinct: ['date_type'],
                  select: {
                      exam_date_types: {
                          select: {
                              type: true,
                              name: true,
                          },
                      },
                  },
                  orderBy: {
                      exam_date_types: {
                          id: 'asc',
                      },
                  },
              })
            : []

        const exam_years = filtersPick.includes('exam_years')
            ? await prisma.exams.findMany({
                  distinct: ['date'],
                  select: {
                      date: true,
                  },
              })
            : []

        // For some reason the error is back
        await prisma.$disconnect()

        // for (let i = 0; i < 3000000000; i++) {}

        // If the data retrieved is empty
        if (exam_types === null || exam_date_types === null || exam_years === null) throw Error

        const filters_data = {
            exam_types,
            exam_date_types,
            exam_years,
        }

        // Return the transformed data
        return {
            filters: examFiltersTransformer(filters_data),
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            filters: null,
            error: true,
        }
    }
})
