<!-- Whiteboard sidebar with all the tools -->
<script setup lang="ts">
import { canvasQuestionType, canvasOptionsType } from '~/server/types'
import { ColorPicker } from 'vue-accessible-color-picker'

const props = defineProps<{
    saveImage: () => Promise<void>
    question: canvasQuestionType
    canvas: any
}>()

// Get the settings
const canvasOptions = useState<canvasOptionsType>(`canvas-settings-${props.question.question_id}`)

// Options for tools
const toolOptions = useToolOptions()

// Get current tool option icon
const getCurrentToolIcon = computed(() => {
    return toolOptions.find((e) => e.value === canvasOptions.value.strokeType)?.icon ?? 'fa-solid fa-paintbrush'
})

const getCurrentToolIconClasses = computed(() => {
    return toolOptions.find((e) => e.value === canvasOptions.value.strokeType)?.iconClasses
})

// Additional image size
const canvasWidth = useState(`canvas-width-${props.question.question_id}`, () => 0)
const canvasHeight = useState(`canvas-height-${props.question.question_id}`, () => 0)

type additionalImageSizeType = {
    width: number
    height: number
}
const additionalImageSize = useState<additionalImageSizeType>(`additional-image-size-${props.question.question_id}`)

// Calculate options for image position
const imagePositions = ref<number[][]>()
imagePositions.value = calculateImagePositions()

function calculateImagePositions() {
    const xMiddle = (canvasWidth.value - additionalImageSize.value.width) / 2
    const xEnd = canvasWidth.value - additionalImageSize.value.width

    const yMiddle = (canvasHeight.value - additionalImageSize.value.height) / 2
    const yEnd = canvasHeight.value - additionalImageSize.value.height

    return [
        [0, 0],
        [xMiddle, 0],
        [xEnd, 0],
        [0, yMiddle],
        [xMiddle, yMiddle],
        [xEnd, yMiddle],
        [0, yEnd],
        [xMiddle, yEnd],
        [xEnd, yEnd],
    ]
}

const currentImagePosition = useState(`current-image-position-${props.question.question_id}`, () => 0)

// Update positions on canvas size change
watch([canvasWidth, canvasHeight], () => {
    imagePositions.value = calculateImagePositions()
    // Update image position
    setImagePosition(imagePositions.value[currentImagePosition.value], currentImagePosition.value)
})

// Set image position
function setImagePosition(coords: number[], index: number) {
    if (!canvasOptions.value.canvasAdditionalImage) return
    canvasOptions.value.canvasAdditionalImage.x = coords[0]
    canvasOptions.value.canvasAdditionalImage.y = coords[1]

    // Update to show in grid
    currentImagePosition.value = index
}

// Canvas keyboard shortcuts
const keys = useMagicKeys()
const { Ctrl_Z, Ctrl_Y, Ctrl_C, Ctrl_X, Ctrl_Q, Ctrl_1, Ctrl_2, Ctrl_3, Ctrl_4, Ctrl_5, Ctrl_6 } = useMagicKeys()

const ctrl_left_carot = keys['Ctrl+,']
const ctrl_right_carot = keys['Ctrl+.']

whenever(Ctrl_Z, () => props.canvas.undo())
whenever(Ctrl_Y, () => props.canvas.redo())
whenever(Ctrl_Q, () => props.canvas.reset())
whenever(Ctrl_X, () => (canvasOptions.value.eraser = !canvasOptions.value.eraser))

whenever(Ctrl_1, () => (canvasOptions.value.strokeType = 'dash'))
whenever(Ctrl_2, () => (canvasOptions.value.strokeType = 'line'))
whenever(Ctrl_3, () => (canvasOptions.value.strokeType = 'circle'))
whenever(Ctrl_4, () => (canvasOptions.value.strokeType = 'square'))
whenever(Ctrl_5, () => (canvasOptions.value.strokeType = 'triangle'))
whenever(Ctrl_6, () => (canvasOptions.value.strokeType = 'half_triangle'))

whenever(ctrl_left_carot, () => {
    if (canvasOptions.value.lineWidth > 1) canvasOptions.value.lineWidth--
})

whenever(ctrl_right_carot, () => {
    if (canvasOptions.value.lineWidth < 25) canvasOptions.value.lineWidth++
})

// Handle color picker
const showColorPicker = ref(false)
const colorPicker = ref<HTMLElement>()

onClickOutside(colorPicker, () => {
    showColorPicker.value = false
})

whenever(Ctrl_C, () => (showColorPicker.value = true))

// Sidebar button classes
const buttonClasses = 'btn btn-square btn-ghost'
</script>

<template>
    <div class="flex h-full flex-col justify-between px-1.5 py-6">
        <div class="text-center">
            <font-awesome-icon icon="fa-solid fa-sliders" class="text-2xl text-primary" />
        </div>

        <div class="flex flex-col gap-2">
            <!-- General controls -->
            <div class="tooltip tooltip-right" data-tip="Zapisz (ctrl + s)">
                <button :class="buttonClasses" @click="saveImage" v-if="question.type === 'open_question'">
                    <font-awesome-icon icon="fa-solid fa-floppy-disk" class="text-lg" />
                </button>
            </div>

            <div class="tooltip tooltip-right" data-tip="Wyczyść (ctrl + q)">
                <button class="btn-icon-rotate-right" :class="buttonClasses" @click="canvas.reset()">
                    <font-awesome-icon icon="fa-solid fa-arrows-rotate" class="text-lg" />
                </button>
            </div>

            <div class="tooltip tooltip-right" data-tip="Cofnij (ctrl + z)">
                <button class="btn-icon-rotate-left" :class="buttonClasses" @click="canvas.undo()">
                    <font-awesome-icon icon="fa-solid fa-rotate-left" class="text-lg" />
                </button>
            </div>

            <div class="tooltip tooltip-right" data-tip="Powtórz (ctrl + y)">
                <button class="btn-icon-rotate-right" :class="buttonClasses" @click="canvas.redo()">
                    <font-awesome-icon icon="fa-solid fa-rotate-right" class="text-lg" />
                </button>
            </div>
            <!-- General controls -->

            <!-- Line width -->
            <div class="dropdown-right dropdown">
                <label tabindex="0">
                    <div
                        class="tooltip tooltip-right"
                        :data-tip="`Grubość linii: ${canvasOptions.lineWidth}px (ctrl + < / ctrl + >)`"
                    >
                        <button :class="buttonClasses">
                            <font-awesome-icon icon="fa-solid fa-arrows-left-right-to-line" class="text-lg" />
                        </button>
                    </div>
                </label>

                <!-- Change width -->
                <div
                    tabindex="0"
                    class="dropdown-content ml-1 w-max rounded-lg border-2 border-neutral/50 bg-base-100 px-4 py-2 shadow-lg"
                >
                    <span class="block text-center font-semibold"> {{ canvasOptions.lineWidth }}px </span>
                    <input
                        type="range"
                        min="1"
                        max="25"
                        step="1"
                        class="range range-primary range-xs"
                        v-model="canvasOptions.lineWidth"
                    />
                    <div class="flex w-full justify-between text-xs">
                        <div v-for="i in 6" :key="i">
                            {{ (i - 1) * 5 }}
                        </div>
                    </div>
                </div>
                <!-- Change width -->
            </div>
            <!-- Line width -->

            <!-- Color -->
            <div class="dropdown-right dropdown" :class="{ 'dropdown-open': showColorPicker }" ref="colorPicker">
                <label tabindex="0">
                    <div class="tooltip tooltip-right" data-tip="Kolor (ctrl + c)">
                        <div class="cursor-pointer rounded border-2 border-neutral">
                            <div
                                class="m-1 h-6 w-[36px] rounded"
                                :style="`background-color: ${canvasOptions.lineColor}`"
                            ></div>
                        </div>
                    </div>
                </label>

                <!-- Color picker -->
                <div
                    tabindex="0"
                    class="dropdown-content ml-1 w-60 rounded-lg border-2 border-neutral/50 bg-base-100 px-4 py-2 shadow-lg"
                >
                    <ColorPicker
                        class="cursor-pointer"
                        default-format="hex"
                        alpha-channel="hide"
                        color="#000000"
                        @color-change="(color : any) => canvasOptions.lineColor = color.cssColor"
                    />
                </div>
                <!-- Color picker -->
            </div>
            <!-- Color -->

            <!-- Main tool -->
            <div class="tooltip tooltip-right" data-tip="Rysuj (ctrl + x)">
                <button
                    class="btn btn-square btn-secondary btn-outline"
                    :class="[!canvasOptions.eraser && 'btn-active']"
                    @click="canvasOptions.eraser = false"
                >
                    <font-awesome-icon icon="fa-solid fa-pen" class="text-lg" />
                </button>
            </div>

            <div class="tooltip tooltip-right" data-tip="Gumka (ctrl + x)">
                <button
                    class="btn btn-square btn-secondary btn-outline"
                    :class="[canvasOptions.eraser && 'btn-active']"
                    @click="canvasOptions.eraser = true"
                >
                    <font-awesome-icon icon="fa-solid fa-eraser" class="text-lg" />
                </button>
            </div>
            <!-- Main tool -->

            <!-- Tool selection -->
            <div class="dropdown-right dropdown dropdown-end">
                <label tabindex="0">
                    <div class="tooltip tooltip-right" data-tip="Narzędzie (ctrl + 1 od 6)">
                        <button class="group btn-accent btn-outline" :class="buttonClasses">
                            <font-awesome-icon
                                :icon="getCurrentToolIcon"
                                :class="getCurrentToolIconClasses"
                                class="text-lg text-accent group-hover:text-accent-content"
                            />
                        </button>
                    </div>
                </label>

                <!-- Select tool -->
                <ul
                    tabindex="0"
                    class="menu dropdown-content -mb-12 ml-1 w-max gap-0.5 rounded-lg border-2 border-neutral/50 bg-base-100 shadow-lg"
                >
                    <li
                        class="m-0 min-w-[150px] p-0"
                        v-for="(toolOption, i) in toolOptions"
                        :key="i"
                        @click="canvasOptions.strokeType = toolOption.value"
                    >
                        <a
                            class="no-underline"
                            :class="{
                                '!bg-accent !text-accent-content': canvasOptions.strokeType === toolOption.value,
                            }"
                        >
                            <font-awesome-icon
                                :icon="toolOption.icon"
                                class="mr-1.5 text-lg"
                                :class="[
                                    { '!text-accent-content': canvasOptions.strokeType === toolOption.value },
                                    toolOption.iconClasses,
                                ]"
                            />
                            {{ toolOption.label }}
                        </a>
                    </li>
                </ul>
                <!-- Select tool -->
            </div>
            <!-- Tool selection -->

            <!-- Additional image -->
            <div class="dropdown-right dropdown dropdown-end" v-if="canvasOptions.canvasAdditionalImage">
                <label tabindex="0">
                    <div class="tooltip tooltip-right" data-tip="Rysunek pomocniczy">
                        <button class="btn-primary btn-outline" :class="buttonClasses">
                            <font-awesome-icon icon="fa-solid fa-image" class="text-lg" />
                        </button>
                    </div>
                </label>

                <!-- Image options -->
                <div
                    tabindex="0"
                    class="dropdown-content -mt-12 ml-1 w-max rounded-lg border-2 border-neutral/50 bg-base-100 px-4 py-3 shadow-lg"
                >
                    <!-- Image position -->
                    <p class="mb-2 mt-0 text-sm font-semibold">
                        <font-awesome-icon icon="fa-solid fa-up-down-left-right" class="-mb-px mr-0.5 text-primary" />
                        Pozycja rysunku:
                    </p>
                    <div class="image-position">
                        <div
                            v-for="(imagePosition, i) in imagePositions"
                            :key="i"
                            @click="setImagePosition(imagePosition, i)"
                            :class="{ active: i === currentImagePosition }"
                        >
                            <div></div>
                        </div>
                    </div>
                    <!-- Image position -->

                    <!-- Image show -->
                    <div class="mt-3 text-center">
                        <button
                            class="btn btn-primary btn-outline w-full"
                            @click="
                                canvasOptions.canvasAdditionalImage.show = !canvasOptions.canvasAdditionalImage.show
                            "
                        >
                            <span v-if="canvasOptions.canvasAdditionalImage.show">
                                <font-awesome-icon icon="fa-solid fa-eye-slash" class="mr-1" />
                                Ukryj
                            </span>
                            <span v-else>
                                <font-awesome-icon icon="fa-solid fa-eye" class="mr-1" />
                                Pokaż
                            </span>
                        </button>
                    </div>
                    <!-- Image show -->
                </div>
                <!-- Image options -->
            </div>
        </div>

        <!-- For correct flex alignment -->
        <div class="invisible text-center">
            <font-awesome-icon icon="fa-solid fa-sliders" class="text-lg" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dropdown {
    &:focus-within {
        label {
            .btn-accent {
                @apply bg-accent/20;
            }
            .btn-primary {
                @apply bg-primary/20;
            }
        }
    }
}

.image-position {
    @apply grid grid-cols-3 gap-[3px] bg-neutral;

    > div {
        @apply grid aspect-square w-12 cursor-pointer place-items-center bg-base-200;

        &:hover {
            > div {
                @apply opacity-70;
            }
        }

        &.active {
            > div {
                @apply opacity-100;
            }
        }

        > div {
            @apply aspect-square w-3 rounded-full bg-primary opacity-0 transition-opacity;
        }
    }
}
</style>
