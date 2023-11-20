// Return ready to use math field
import * as math from 'mathlive'

// Needed for production
if (process.env.NODE_ENV !== 'development' && math.MathfieldElement) {
    math.MathfieldElement.fontsDirectory = '../fonts'
}

export default function () {
    if (process.client) {
        // Locale
        math.MathfieldElement.locale = 'pl-PL'

        // Keyboard layouts
        window.mathVirtualKeyboard.layouts = [
            {
              label: "<span class='MLK__tex-math'>123</span>",
              tooltip: "Podstawowe operacje",
              displayEditToolbar: false,
              // Basic keyboard
              rows: [
                [
                    { class: 'small', latex: '\\frac{#@}{#0}' }, // fraction
                    { class: 'small', latex: '#@^{#?}' }, // power
                    { class: 'small', latex: '\\sqrt#@' }, // square root
                    { label: '[separator]', width: 0.5 },
                    '[7]', '[8]', '[9]', '[+]', 
                    { label: '[separator]', width: 0.5 },
                    '[undo]', '[redo]',
                ],
                [
                    '[(]', '[)]', 
                    { latex: "\\lt", variants: ["\\lt", "\\le"], shift: '\\le',  },
                    {label: '[separator]', width: 0.5 },
                    '[4]', '[5]', '[6]', '[-]', 
                    { label: '[separator]', width: 0.5 },
                    { label: '[backspace]', width: 2 },
                ],
                [
                    '\\pi',
                    '\\alpha',
                    { latex: "\\gt", variants: ["\\gt", "\\ge"], shift: '\\ge',  }, // greater than
                    { label: '[separator]', width: 0.5 },
                    '[1]', '[2]', '[3]', '\\cdot', 
                    {label: '[separator]', width: 0.5 },
                    { label: '[shift]', width: 2 },
                ],
                [
                    'x', 'y', 
                    { latex: "=", variants: ["=", "\\ne"], shift: '\\ne',  }, // equals
                    { label: '[separator]', width: 0.5 },
                    { label: '[0]', width: 2 },
                    { latex: ".", variants: [".", ","], shift: ',',  }, // period
                    '[/]', // divide
                    { label: '[separator]', width: 0.5 },
                    '[left]', '[right]',
                ],
              ]
            }, 
            {
                label: "<span class='MLK__tex-math'>∞≠∈</span>",
                tooltip: "Dodatkowe symbole i funkcje",
                displayEditToolbar: false,
                // Advanced keyobard
                rows: [
                    [
                        '\\sin',
                        '\\cos',
                        { label: '[separator]', width: 0.5 },
                        { latex: '\\rarr', shift: '\\rArr' },
                        '\\exists',
                        { latex: '\\in', shift: '\\notin' },
                        '\\cup',
                        { label: '[separator]', width: 0.5 },
                        '\\lim_{#@}',
                        '\\pi',
                    ],
                    [
                        '\\tan',
                        '\\ctg',
                        { label: '[separator]', width: 0.5 },
                        { latex: '\\larr', shift: '\\lArr' },
                        '\\forall',
                        { latex: '\\ni', shift: '\\not\\owns' },
                        '\\cap',
                        { label: '[separator]', width: 0.5 },
                        'x',
                        '\\infty',
                    ],
                    [
                        '\\vert#@\\vert', // absolute value
                        '\\log_{#0}{#@}', 
                        { label: '[separator]', width: 0.5 },
                        { latex: '\\lrArr', shift: '\\leftrightarrow' },
                        '!',
                        '\\degree',
                        { latex: '\\subset', shift: '\\subseteq' },
                        { label: '[separator]', width: 0.5 },
                        { label: '[backspace]', width: 2 },
                    ],
                    [
                        { label: '[shift]', width: 2 },
                        { label: '[separator]', width: 0.5 },
                        '[undo]',
                        '[redo]',
                        { label: '[separator]', width: 0.5 },
                        '[left]', '[right]'
                    ]
                ]
            },
            'alphabetic',
            'greek'
          ];

        // Disable sound
        math.MathfieldElement.soundsDirectory = null
    }
}
