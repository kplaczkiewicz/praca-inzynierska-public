import { questionFiltersFullType, questionFiltersTransformedType } from "~/server/types"

// Store filters in separate file
export default function(filterOptions: questionFiltersTransformedType | null) {
    if (!filterOptions) return null;

    return <questionFiltersFullType[]>[
        {
            sectionTitle: 'Typ:',
            sectionClasses: 'flex-[0.15] pl-2 pr-2',
            sectionType: 'list',
            options: filterOptions.exam_types,
            filterName: 'exam_types'
        },
        {
            sectionTitle: 'Dział:',
            sectionClasses: 'flex-[0.5] border-x border-x-neutral/40 pl-6 pr-2',
            sectionType: 'grid',
            options: filterOptions.math_fields,
            filterName: 'math_fields'
        },
        {
            sectionTitle: 'Egzamin:',
            sectionClasses: 'flex-[0.35] pl-4',
            sectionType: 'select',
            options: filterOptions.exams,
            filterName: 'exam'
        },
    ]
}