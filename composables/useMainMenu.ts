// Return full menu structure
export default function () {
    return [
        {
            title: 'Arkusze',
            basePath: '/arkusze',
            submenu: [
                {
                    title: 'Losuj',
                    link: '/arkusze/losuj',
                    icon: 'fa-solid fa-shuffle',
                    iconClasses: 'mr-1',
                },
                {
                    title: 'Wszystkie',
                    link: '/arkusze',
                    icon: 'fa-solid fa-graduation-cap',
                    iconClasses: 'mr-0.5',
                },
            ],
        },
        {
            title: 'Zadania',
            basePath: '/zadania',
            submenu: [
                {
                    title: 'Losuj',
                    link: '/zadania/losuj',
                    icon: 'fa-solid fa-shuffle',
                },
                {
                    title: 'Rozwiązuj',
                    link: '/zadania/rozwiazuj',
                    icon: 'fa-solid fa-pen-to-square',
                }
            ],
        },
        {
            title: 'Ćwiczenie',
            basePath: '/cwiczenie',
            submenu: [
                {
                    title: 'Losuj',
                    link: '/cwiczenie/losuj',
                    icon: 'fa-solid fa-shuffle',
                },
                {
                    title: 'Wszystkie',
                    link: '/cwiczenie',
                    icon: 'fa-solid fa-graduation-cap',
                },
            ],
        },
    ]
}
