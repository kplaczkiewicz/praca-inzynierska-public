import { examQuestionOptionType } from "./exam";

// Helper types
export type colorType = 'primary' | 'secondary' | 'accent'

export type transitionOptionsType = 'fade' | 'crossfade' | 'fade-right' | 'fade-bottom' | 'switch-right' | 'switch-bottom';

export type toastType = {
    message: string
    status: 'info' | 'success' | 'error' | 'warning'
}

export type canvasQuestionType = {
    question_id: number
    question_number: number
    type: examQuestionOptionType | null
    points: number
    question: string
    annotation: string | null
    image_url: string | null
    question_type: 'question' | 'step'
}

export type canvasImgType = {
    src: string
    x: number
    y: number
    show: boolean
}

export type canvasOptionsType = {
    eraser: boolean
    lineWidth: number
    lineColor: string
    strokeType: string
    canvasAdditionalImage: canvasImgType | undefined
}

export type selectOptionType = {
    label: string
    value: number | string
}

export type backgroundPatternType = 'dots' | 'dots-grid' | 'grid' | 'dots-empty' | 'dots-half-empty' | 'dots-random-size' | 'squares' | 'squares-half-empty' | 'rhombi' | 'rhombi-and-squares' | 'rhombi-half-empty' | 'oscillate-primary' | 'oscillate-secondary' | 'oscillate-accent' | 'ten-primary' | 'ten-secondary' | 'ten-accent' | 'dots-random-size-primary'

export type examStatsType = {
    examsCount: number,
    fieldsCount: number,
    questionsCount: number,
    singleChoiceQuestionsCount: number,
    openQuestionsCount: number,
}

export type sortValueType = 'desc' | 'asc'

export type filtersFullType = {
    sectionTitle: string,
    sectionClasses: string,
    sectionType: 'list' | 'grid' | 'select'
    options: selectOptionType[],
}