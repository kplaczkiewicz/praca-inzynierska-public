// Types only for answers
import { examQuestionOptionType, examStageType } from '../index'

// Type for a single user answer
export type userAnswerType = {
    question_id: number
    question_type: examQuestionOptionType
    answer: string | string[]
}

// Type to store points in open questions
export type openQuestionPointsType = {
    question_id: number
    points: number
    open_question_explanation: openQuestionExplanationType | 'no_answer'
}

// Type for storing user answers with additional info about current exam
export type userCurrentExamType = {
    id: string
    exam_id: number
    exam_title: string
    answers: userAnswerType[]
    time_left: number
    exam_stage: examStageType
    exam_type: 'normal' | 'random'
    has_time_limit: boolean
    question_ids: string[]
    tags: string[]
}

// Type for storing the answers to exam
export type examAnswerType = {
    question_id: number
    correct_answer: string | null
    user_answer: string | string[] | null
    is_correct: boolean
    points: number
    total_points: number
    open_question_explanation: openQuestionExplanationType | 'no_answer' | null
}


export type openQuestionExplanationType = {
    solution: number | 'own_scoring'
    selectedQuestions: number[]
    explanations: string[]
}

// Type returned from the transformer
export type openQuestionSolutionsFormattedType = {
    questionId: number
    solutions: openQuesionSolutionType[]
}

// Type for storing open question solutions from the database
export type openQuesionSolutionType = {
    name: string
    questions: scoringQuestionType[]
    scoring: scoringRuleType[]
}

// Type for storing questions asked to the user for scoring
export type scoringQuestionType = {
    index: number
    options: string[]
    explanation: string
    explanationImage: string
}

// Type for storing rules for scoring open questions
export type scoringRuleType = {
    points: number
    rules: number[][]
}
