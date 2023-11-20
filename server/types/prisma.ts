// Additional types for prisma
import { openQuesionSolutionType, interactiveContentType } from './index'

declare global {
    namespace PrismaJson {
        // Type for JSON field in solutions
        type openQuesionSolutionPrismaType = openQuesionSolutionType[]
        type interactiveContentPrismaType =  interactiveContentType
    }
}
