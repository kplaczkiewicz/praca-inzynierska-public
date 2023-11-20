// Return transformed exam with only necessary data for frontend
import { examType, examTypeFormatted } from '~/server/types'
import { questionsTransformer } from './exam_questions'

export function examTransformer(exam: examType) {
    // Format the date
    const dateFormatter = Intl.DateTimeFormat('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    return <examTypeFormatted>{
        id: exam.id,
        title: exam.title,
        type: exam.exam_type.type,
        date: `${dateFormatter.format(exam.date)}r.`,
        time_to_complete: exam.time_to_complete,
        has_time_limit: true,
        questions: questionsTransformer(exam.questions),
        tags: []
    }
}
