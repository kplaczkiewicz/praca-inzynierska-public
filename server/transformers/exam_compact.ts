// Return transformed exams with only necessary data for the card element
import { examCompactTypeFormatted } from '~/server/types'
import { exams } from '@prisma/client'

export function examCompactTransformer(exams: exams[]) {
    const examsFormatted: examCompactTypeFormatted[] = []

    // Format all exams
    exams.forEach((exam) => {
        // Format the date
        const dateFormatter = Intl.DateTimeFormat('pl-PL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })

        examsFormatted.push({
            id: exam.id,
            title: exam.title,
            date: `${dateFormatter.format(exam.date)}r.`,
        })
    })

    return examsFormatted
}

