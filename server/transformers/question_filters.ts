// Transform question filters to be used by filter component
import { questionFiltersTransformedType } from "../types";

// Type for the argument
type questionFilterType = {
    exam_types: {
        exam_types: {
            type: string;
            name: string;
        };
    }[];
    math_fields: {
        math_fields: {
            type: string;
            name: string;
        };
    }[];
    exams: {
        id: number;
        title: string;
    }[];
}


export function questionFiltersTransformer(questions: questionFilterType) {
    // Populate data
    const questionFilters: questionFiltersTransformedType = {
        exam_types: questions.exam_types.map(type => {
            return {
                value: type.exam_types.type,
                label: type.exam_types.name
            }
        }),
        math_fields: questions.math_fields.map(field => {
            return {
                value: field.math_fields.type,
                label: field.math_fields.name,
            }
        }),
        exams: questions.exams.map(exam => {
            return {
                value: exam.id,
                label: exam.title
            }
        })
    }
    
    return questionFilters;
}
