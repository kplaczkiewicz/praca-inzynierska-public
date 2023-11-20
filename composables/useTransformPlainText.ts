// Transform the text turning img urls into html images
export default function () {
    return (explanation : string) => {
        const regex = /&&(.*?)&&/g;
    
        // Replace all occurrences of "&&src&&" with <img> tags
        return explanation.replace(regex, '<img class="my-4 mx-auto max-h-[350px]" src="$1" alt="Rysnek z wyjaśnieniem" />');
    }
}