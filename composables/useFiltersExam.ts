import { examFiltersFullType, examFiltersTransformedType } from "~/server/types"

// Store filters in separate file
export default function(filterOptions: examFiltersTransformedType | null) {
    if (!filterOptions) return null;

    return <examFiltersFullType[]>[
        {
            sectionTitle: 'Typ:',
            sectionClasses: 'flex-1 pl-2 pr-2',
            sectionType: 'list',
            options: filterOptions.exam_types,
            filterName: 'exam_types'
        },
        {
            sectionTitle: 'Matura:',
            sectionClasses: 'flex-1 border-x border-x-neutral/40 pl-6 pr-2',
            sectionType: 'list',
            options: filterOptions.exam_date_types,
            filterName: 'exam_date_types'
        },
        {
            sectionTitle: 'Rok:',
            sectionClasses: '-mr-2 flex-1 pl-6',
            sectionType: 'list',
            options: filterOptions.exam_years,
            filterName: 'years'
        },
    ]
}