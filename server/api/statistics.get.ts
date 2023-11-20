// Get stats for exams and questions

// Initialize prisma
import prisma from '~/server/db'
import { examStatsType } from '../types/helpers';

export default defineEventHandler(async () => {
    // Retrieve the exam with all questions
    try {
        const examsCount = await prisma.exams.count();
        const fieldsCount = await prisma.math_fields.count();
        const questionsCount = await prisma.questions.count();
        const singleChoiceQuestionsCount = await prisma.questions.count({
            where: {
                exam_type: 1
            }
        });

        // For some reason the error is back
        await prisma.$disconnect();

        // If the data retrieved is empty
        if (examsCount === null || fieldsCount === null) throw Error

        // for (let i = 0; i < 3000000000; i++) {}

        // Return the transformed data
        return {
            stats: <examStatsType>{
                examsCount: examsCount,
                fieldsCount: fieldsCount,
                questionsCount: questionsCount,
                singleChoiceQuestionsCount: singleChoiceQuestionsCount,
                openQuestionsCount: questionsCount - singleChoiceQuestionsCount,
            },
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            stats: null,
            error: true,
        }
    }
})