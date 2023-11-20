// Return only the neccessery data for the interactive question
import { questions } from '@prisma/client'
import { interactiveQuestionType } from '../types';

type interactiveQuestionPrismaType = questions & {
    interactive_questions: {
        interactive_content: PrismaJson.interactiveContentPrismaType;
    } | null
    exam_types: {
        name: string;
    } 
    math_fields: {
        name: string;
    }
}

export function interactiveQuestionTransformer(interactive_question: interactiveQuestionPrismaType) {
    return <interactiveQuestionType> {
        question_id: interactive_question.id,
        question_number: interactive_question.question_number,
        points: interactive_question.points,
        question: interactive_question.question,
        annotation: interactive_question.annotation,
        image_url: interactive_question.image_url,
        exam_type: interactive_question.exam_types.name,
        math_field: interactive_question.math_fields.name,
        interactive_content: interactive_question.interactive_questions?.interactive_content
    }
}