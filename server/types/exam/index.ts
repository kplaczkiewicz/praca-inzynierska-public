// All the types for exam
import { exams, exam_types, question_types, questions, single_choice_questions } from '@prisma/client'
import { questionType } from './question'
import { filtersFullType, selectOptionType } from '..'

// Type only for the transformer
export type examType = exams & {
    exam_type: exam_types
    questions: (questions & {
        question_type: question_types
        single_choice_question: single_choice_questions | null
    })[]
}

// Type returned by the transformer
export type examTypeFormatted = {
    id: number
    title: string
    type: string
    date: string
    time_to_complete: number
    has_time_limit: boolean
    questions: questionType[]
    tags: string[]
}

// Type returned by the transformer
export type examCompactTypeFormatted = {
    id: number
    title: string
    date: string
}

// Type only for the transformer
export type examQuestionsType = (questions & {
    question_type: question_types
    single_choice_question: single_choice_questions | null
})[]

// Exam filter
export type examFiltersType = {
    exam_types: string[],
    exam_date_types: string[],
    years: string[]
}

// Exam filters from transformer
export type examFiltersTransformedType = {
    exam_types: selectOptionType[]
    exam_date_types: selectOptionType[]
    exam_years: selectOptionType[]
}

// Exam filters returned by the composable
export type examFiltersFullType = filtersFullType & {
    filterName: keyof examFiltersType
}

// Additional helper types
export type examStageType = 'in_progress' | 'checking' | 'finished'
export type examQuestionOptionType = 'single_choice' | 'open_question'
export type examTierType = 'basic' | 'advanced' | 'basic_and_advanced'
