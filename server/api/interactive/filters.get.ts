// Get data for questions filters
import { questionFiltersTransformer } from '~/server/transformers/question_filters'

// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    try {
        // Which type of questions to query
        const questionType: number = Number(getQuery(event).question_type)

        // Which filters to query
        const filtersPick: string[] = getQuery(event).pick?.toString().split(',') ?? []

        // Get all data needed for filters
        const exam_types = filtersPick.includes('exam_types')
            ? await prisma.questions.findMany({
                  distinct: ['exam_type'],
                  select: {
                      exam_types: {
                          select: {
                              type: true,
                              name: true,
                          },
                      },
                  },
                  where: {
                      type: questionType,
                  },
                  orderBy: {
                      exam_types: {
                          id: 'asc',
                      },
                  },
              })
            : []

        const math_fields = filtersPick.includes('math_fields')
            ? await prisma.questions.findMany({
                  distinct: ['math_field'],
                  select: {
                      math_fields: {
                          select: {
                              name: true,
                              type: true,
                          },
                      },
                  },
                  where: {
                      type: questionType,
                  },
                  orderBy: {
                      math_fields: {
                          name: 'asc',
                      },
                  },
              })
            : []

        const exams = filtersPick.includes('exams')
            ? await prisma.exams.findMany({
                  select: {
                      title: true,
                      id: true,
                  },
                  orderBy: {
                      date: 'desc',
                  },
              })
            : []

        // For some reason the error is back
        await prisma.$disconnect()

        // for (let i = 0; i < 3000000000; i++) {}

        // If the data retrieved is empty
        if (exam_types === null || math_fields === null || exams === null) throw Error

        const filters_data = {
            exam_types,
            math_fields,
            exams,
        }

        // Return the transformed data
        return {
            filters: questionFiltersTransformer(filters_data),
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
