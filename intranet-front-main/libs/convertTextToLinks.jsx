export function convertTextToLinks(inputText) {
    const linkRegex = /\@\[(.*?)\]\((.*?)\)/g;

    const linksArray = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(inputText)) !== null) {
        const [, text, href] = match;

        if (lastIndex < match.index) {
            const nonLinkText = inputText.slice(lastIndex, match.index);
            linksArray.push({ text: nonLinkText });
        }

        linksArray.push({ text, href });
        lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < inputText?.length) {
        const remainingText = inputText.slice(lastIndex);
        linksArray.push({ text: remainingText });
    }

    return linksArray;
}
