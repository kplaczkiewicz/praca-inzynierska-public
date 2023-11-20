module.exports = {
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1.5rem',
                sm: '2rem',
            },
        },
        screens: {
            xs: '420px',
            sm: '769px',
            md: '992px',
            lg: '1280px',
            xl: '1600px',
        },
        extend: {
            fontFamily: {
                primary: 'Poppins',
                secondary: 'Merriweather',
            },
            colors: {
                'success-focus': 'hsl(142, 76%, 33%)',
                'error-focus': 'hsl(354, 77%, 42%)',
                'warning-focus': 'hsl(41, 82%, 44%)',
                'base-400': 'hsl(180,7%,97%)'
            },
        },
    },
    daisyui: {
        themes: [
            {
                light: {
                    ...require('daisyui/src/theming/themes')['[data-theme=light]'],
                    primary: 'hsl(212, 100%, 51%)',
                    'primary-focus': 'hsl(212, 100%, 41%)',
                    'primary-content': 'hsl(0, 0%, 100%)',
                    secondary: 'hsl(269, 94%, 51%)',
                    'secondary-focus': 'hsl(259, 94%, 41%)',
                    'secondary-content': 'hsl(0, 0%, 100%)',
                    accent: 'hsl(174, 75%, 43%)',
                    'accent-focus': 'hsl(174, 75%, 33%)',
                    'accent-content': 'hsl(0, 0%, 100%)',
                    success: 'hsl(142, 85%, 42%)',
                    'success-content': 'hsl(0, 0%, 100%)',
                    warning: 'hsl(41, 82%, 51%)',
                    'warning-content': 'hsl(0, 0%, 100%)',
                    error: 'hsl(354, 79%, 58%)',
                    'error-content': 'hsl(0, 0%, 100%)',
                },
            },
        ],
    },
    plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
