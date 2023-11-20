// Return transformed single choice question with only necessary data for frontend
import { single_choice_questions } from '@prisma/client'
import { singleChoiceQuestionType } from '~~/server/types'

export function singleChoiceTransformer(singleChoiceQuestion: single_choice_questions | null) {
    return <singleChoiceQuestionType>{
        id: singleChoiceQuestion?.id,
        answers: [
            {
                option: 'a',
                answer: singleChoiceQuestion?.answer_a,
            },
            {
                option: 'b',
                answer: singleChoiceQuestion?.answer_b,
            },
            {
                option: 'c',
                answer: singleChoiceQuestion?.answer_c,
            },
            {
                option: 'd',
                answer: singleChoiceQuestion?.answer_d,
            },
        ],
    }
}
