// Remove backspace from select and position select with popper
import { createPopper } from '@popperjs/core'

export default function () {
    // Prevent value deletion in select
    const removeDelete = (map: any) => {
        return {
            ...map,
            // Map backspace key to nothing
            8: () => {},
        }
    }

    // Control the position of select to always be on screen
    const withPopper = (dropdownList: any, component: any, { width }: { width: number }) => {
		dropdownList.style.width = width

        const popper = createPopper(component.$refs.toggle, dropdownList, {
            modifiers: [
                // add modifier to open or top or bottom
                {
                    name: 'offset',
                    options: {
                        offset: [0, -1],
                    },
                },
                // add class to select element when opened on top
                {
                    name: 'toggleClass',
                    enabled: true,
                    phase: 'write',
                    fn({ state }) {
                        component.$el.classList.toggle('drop-up', state.placement === 'top')
                    },
                  },
            ],
        })

        return () => popper.destroy()
    }

    return { removeDelete, withPopper }
}
