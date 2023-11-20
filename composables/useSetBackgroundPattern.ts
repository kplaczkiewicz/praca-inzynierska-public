import { backgroundPatternType } from "~/server/types";

export default function (pattern : backgroundPatternType) {
    const backgroundPattern = useState<backgroundPatternType>('backgroundPattern', () => 'dots')

    onMounted(() => {
        backgroundPattern.value = pattern
    })
}