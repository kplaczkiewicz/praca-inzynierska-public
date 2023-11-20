// Types only for interactive questions

import { filtersFullType, selectOptionType } from ".."

// Type returned by the transformer
export type interactiveQuestionType = {
    question_id: number
    question_number: number
    question: string
    points: number
    annotation: string | null
    image_url: string | null
    exam_type: string
    math_field: string
    interactive_content: interactiveContentType
}

// Type only for the interactive content
export type interactiveContentType = {
    steps: interactiveContentStepType[]
}

// Type for single step
export type interactiveContentStepType = {
    index: number
    question: string
    annotation: string | null
    image_url: string | null
    hint: string
    explanation: string
    helpful_links: string[]
    type: "single_choice" | "fill_in"
    content: interactiveSingleChoiceType | interactiveFillInType
}

// Type for choose correct answer
export type interactiveSingleChoiceType = {
    options: string[]
    correct_answer: number
}

// Type for fill in correct math
export type interactiveFillInType = {
    correct_answers: string[]
}

// Question filters from transformer
export type questionCompactTypeFormatted = {
    id: number
    date: string
    question: string
    annotation: string | null
    image_url: string | null
    points: number
    question_number: number
    exam_title: string
    exam_id: number
    field: string
    field_type: string
}

// Question filter
export type questionFiltersType = {
    exam_types: string[],
    math_fields: string[],
    exam: string
}

// Question filters returned by the composable
export type questionFiltersFullType = filtersFullType & {
    filterName: keyof questionFiltersType
}

// Question filters from transformer
export type questionFiltersTransformedType = {
    exam_types: selectOptionType[]
    math_fields: selectOptionType[]
    exams: selectOptionType[]
}