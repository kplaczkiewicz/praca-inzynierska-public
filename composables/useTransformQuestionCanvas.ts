// Transorm both question and step type to be used inside whiteboard
import { canvasQuestionType, questionType, interactiveContentStepType } from "~/server/types";

export default function(question : questionType | interactiveContentStepType, question_type: 'question' | 'step') {
    // For step use its index instead of the id
    const questionId = (question as questionType)?.question_id ?? (question as interactiveContentStepType)?.index

    // For question type its the number for step type is the step index
    const questionNumber = (question as questionType)?.question_number ?? (question as interactiveContentStepType)?.index

    return <canvasQuestionType> {
        question_id: questionId,
        question: question.question,
        annotation: question.annotation,
        points: (question as questionType)?.points,
        image_url: question.image_url,
        question_number: questionNumber,
        type: question.type,
        question_type: question_type
    };
}