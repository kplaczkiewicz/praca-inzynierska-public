import { userAnswerType, examAnswerType, openQuestionPointsType } from '~/server/types'

// Initialize prisma
import prisma from '~/server/db'

export default defineEventHandler(async (event) => {
    // Get user answers
    const requestBody = await readBody<{
        userCurrentExam: userAnswerType[]
        openQuestionsUserSolutions?: openQuestionPointsType[]
    }>(event)

    // Get all the question ids
    const questionIds = requestBody.userCurrentExam.map((q) => q.question_id)

    // Check the user answers
    try {
        // Retrieve all the questions by the id
        const all_questions = await prisma.questions.findMany({
            where: {
                id: { in: questionIds },
            },
            select: {
                id: true,
                points: true,
                question_type: true,
                single_choice_question: {
                    select: {
                        correct_answer: true,
                    },
                },
            },
        })

        // For some reason the error is back
        await prisma.$disconnect();
        
        // If the data retrieved is empty
        if (all_questions === null) throw Error

        // Check the answers
        const checkedAnswers = <examAnswerType[]>[]

        // Check only the choice questions
        all_questions.forEach((question) => {
            // Get user answer
            const userAnswer = requestBody.userCurrentExam.find((e) => e.question_id === question.id)
            
            // Add the points for the open questions
            if (question.question_type.type === 'open_question' && requestBody.openQuestionsUserSolutions) {
                const userPoints = requestBody.openQuestionsUserSolutions.find(q => q.question_id === question.id)?.points
                const questionExplanation = requestBody.openQuestionsUserSolutions.find(q => q.question_id === question.id)?.open_question_explanation ?? null

                checkedAnswers.push({
                    question_id: question.id,
                    correct_answer: null,
                    user_answer: userAnswer?.answer ?? null,
                    is_correct: userPoints === question.points,
                    points: userPoints ?? 0,
                    total_points: question.points,
                    open_question_explanation: questionExplanation
                })
                return
            }

            // Check each question, if no answer given default to false
            checkedAnswers.push({
                question_id: question.id,
                correct_answer: question.single_choice_question!.correct_answer,
                user_answer: userAnswer ? userAnswer.answer : null,
                is_correct: userAnswer ? userAnswer.answer === question.single_choice_question?.correct_answer : false,
                points: userAnswer?.answer === question.single_choice_question?.correct_answer ? 1 : 0,
                total_points: question.points,
                open_question_explanation: null
            })
        })

        // for (let i = 0; i < 3000000000; i++) {}

        // Return the transformed data
        return {
            checked_answers: checkedAnswers,
            error: false,
        }
    } catch(err : any) {
        console.log(err);

        // Return an error
        return {
            checked_answers: null,
            error: true,
        }
    }
})
