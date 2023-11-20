// Return transformed exam questions
import { examQuestionsType, questionType } from '~~/server/types'
import { singleChoiceTransformer } from './single_choice_question'

export function questionsTransformer(examQuestions: examQuestionsType) {
    const transformedQuestions: questionType[] = []

    // Loop through every question and format it
    examQuestions.forEach((elt, i) => {
        const question: questionType = {
            question_number: i + 1,
            question_id: elt.id,
            type: elt.question_type.type === 'single_choice' ? 'single_choice' : 'open_question',
            points: elt.points,
            question: elt.question,
            annotation: elt.annotation,
            image_url: elt.image_url,
            question_content: null,
            explanation: elt.explanation,
            helpful_links: elt.helpful_links?.split(','),
            official_answers: elt.official_answers
        }

        // For single choice add options
        if (question.type === 'single_choice') {
            question.question_content = singleChoiceTransformer(elt.single_choice_question)
        }

        transformedQuestions.push(question)
    })

    return transformedQuestions
}
