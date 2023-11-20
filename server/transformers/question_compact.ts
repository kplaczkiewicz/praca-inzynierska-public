// Return transformed questions with only necessary data for the card element
import { questions } from '@prisma/client'
import { questionCompactTypeFormatted } from '../types'

type questionsArgumentType = (questions & {
    exams: {
        id: number
        title: string
        date: Date
    }
    math_fields: {
        type: string
        name: string
    }
})[]

export function questionCompactTransformer(questions: questionsArgumentType) {
    const questionsFormmated: questionCompactTypeFormatted[] = []

    // Format all questions
    questions.forEach((question) => {
        // Format the date
        const dateFormatter = Intl.DateTimeFormat('pl-PL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })

        questionsFormmated.push({
            id: question.id,
            date: `${dateFormatter.format(question.exams.date)}r.`,
            question: question.question,
            annotation: question.annotation,
            image_url: question.image_url,
            points: question.points,
            question_number: question.question_number,
            exam_title: question.exams.title,
            exam_id: question.exams.id,
            field: question.math_fields.name,
            field_type: question.math_fields.type
        })
    })

    return questionsFormmated
}
