// Render all math in document
import * as math from 'mathlive'

// Needed for production
if (process.env.NODE_ENV !== 'development' && math.MathfieldElement) {
    math.MathfieldElement.fontsDirectory = '../fonts'
}

export default function () {
    // Render math first
    const renderMath = () =>
        math.renderMathInDocument({
            TeX: {
                delimiters: {
                    inline: [['**', '**']],
                    display: [['$$', '$$']],
                },
            },
        })

    // Add correct classes if math is inline or block
    const addMathClasses = (nodes: (HTMLElement | undefined)[]) => {
        if (!nodes) return
        
        for (let i = 0; i < nodes.length; i++) {
            const children = nodes[i]?.children
            if (!children) continue

            for (let j = 0; j < children.length; j++) {
                // Last child has the actual content
				if (!children[j].lastChild) continue;
                const lastChild = children[j].lastChild as HTMLElement


                // Add correct class
                if (lastChild.style.display === 'flex') {
                    lastChild.classList.add('math-block')
                } else {
                    lastChild.classList.add('math-inline')
                }
            }
        }
    }

    return { renderMath, addMathClasses }
}
