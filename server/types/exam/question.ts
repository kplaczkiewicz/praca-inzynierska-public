// Types only for questions
import { examQuestionOptionType } from '.'

// Type returned by the transformer and used in app
export type singleChoiceQuestionType = {
    id: number
    answers: {
        option: string
        answer: string
    }[]
}

// Type returned by the transformer and used in app
export type questionType = {
    question_number: number
    question_id: number
    type: examQuestionOptionType
    points: number
    question: string
    annotation: string | null
    image_url: string | null
    question_content: singleChoiceQuestionType | null
    explanation: string | null
    helpful_links: string[] | undefined
    official_answers: string | null
}
