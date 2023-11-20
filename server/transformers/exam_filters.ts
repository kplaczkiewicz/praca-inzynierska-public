// Transform exam filters to be used by filter component
import { examFiltersTransformedType } from "../types"

// Type for the argument
type examFilterType = {
    exam_types: {
        exam_type: {
            type: string
            name: string
        }
    }[]
    exam_date_types: {
        exam_date_types: {
            type: string
            name: string
        }
    }[]
    exam_years: {
        date: Date
    }[]
}

export function examFiltersTransformer(exams: examFilterType) {
    // Prepare data
    const examFilters: examFiltersTransformedType = {
        exam_types: exams.exam_types.map(type => {
            return {
                value: type.exam_type.type,
                label: type.exam_type.name
            }
        }),
        exam_date_types: exams.exam_date_types.map(date_type => {
            return {
                value: date_type.exam_date_types.type,
                label: date_type.exam_date_types.name
            }
        }),
        exam_years: [],
    }

    // Add only unique years
    exams.exam_years.forEach(date => {
        const year = new Date(date.date).getUTCFullYear().toString()
        if (!examFilters.exam_years.some(elt => elt.value === year)) {
            examFilters.exam_years.push({
                value: year,
                label: year
            })
        }
    })

    // Sort years
    examFilters.exam_years.sort((a, b) => a.value.toString().localeCompare(b.value.toString()))

    return examFilters;
}
