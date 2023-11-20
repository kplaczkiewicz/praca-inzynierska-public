// Get stats for user

// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {    
    // Retrieve user stats
    try {
        // Get user id
        const user_id = getQuery(event).user_id?.toString() ?? ''

        // Get all data
        // Get number of exams
        const examCount = await prisma.user_exams.count({
            where: {
                user_id: user_id
            }
        })

        // Get average score
        const averageScore = await prisma.user_exams.aggregate({
            _avg: {
                score: true
            },
            where: {
                user_id: user_id
            }
        })

        // Get number of passed exams
        const passedCount = await prisma.user_exams.count({
            where: {
                AND: [
                    {
                        user_id: user_id
                    },
                    {
                        score: {
                            gte: 30
                        }
                    }
                ]
            }
        })

        // Get data from last 30 days
        // Get the current date
        const currentDate = new Date();

        // Set the date to 30 days ago
        currentDate.setDate(currentDate.getDate() - 30);

        // Get number of exams
        const examCountRecent = await prisma.user_exams.count({
            where: {
                AND: [
                    {
                        user_id: user_id
                    },
                    {
                        date: {
                            gte: currentDate
                        }
                    }
                ]
            }
        })

        // Get average score
        const averageScoreRecent = await prisma.user_exams.aggregate({
            _avg: {
                score: true
            },
            where: {
                AND: [
                    {
                        user_id: user_id
                    },
                    {
                        date: {
                            gte: currentDate
                        }
                    }
                ]
            }
        })

        // Get number of passed exams
        const passedCountRecent = await prisma.user_exams.count({
            where: {
                AND: [
                    {
                        user_id: user_id
                    },
                    {
                        score: {
                            gte: 30
                        }
                    },
                    {
                        date: {
                            gte: currentDate
                        }
                    }
                ]
            }
        })


        // For some reason the error is back
        await prisma.$disconnect();

        // If the data retrieved is empty
        if (examCount === null || passedCount === null) throw Error

        // for (let i = 0; i < 3000000000; i++) {}

        const all_data = {
            exam_count: examCount,
            average_score: Math.round(averageScore._avg.score ?? 0),
            passed_count: passedCount,
        }

        const recent_data = {
            exam_count: examCountRecent,
            average_score: Math.round(averageScoreRecent._avg.score ?? 0),
            passed_count: passedCountRecent,
        }

        // Return the transformed data
        return {
            user_stats: {
                all_data,
                recent_data
            },
            error: false,
        }
    } catch (err: any) {
        console.log(err)

        // Return an error
        return {
            user_stats: null,
            error: true,
        }
    }
})