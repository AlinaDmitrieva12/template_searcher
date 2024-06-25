function knuthMorrisPratt(text: string, pattern: string): { count: number; positions: { line: number; position: number }[] } {
    let count = 0;
    const positions: { line: number; position: number }[] = [];
    const lowerText = text.toLowerCase();
    const lowerPattern = pattern.toLowerCase();

    const prefixTable = buildPrefixTable(lowerPattern);

    let i = 0;
    let j = 0;
    let lineNumber = 1;
    let charPosition = 0;

    while (i < lowerText.length) {
        if (lowerPattern[j] === lowerText[i]) {
            i++;
            j++;
            charPosition++;

            if (j === lowerPattern.length) {
                count++;
                positions.push({ line: lineNumber, position: charPosition - j });
                j = prefixTable[j - 1];
            }
        } else {
            if (j !== 0) {
                j = prefixTable[j - 1];
            } else {
                i++;
                charPosition++;
            }

            if (lowerText[i] === '\n') {
                lineNumber++;
                charPosition = 0;
            }
        }
    }

    return { count, positions };
}

function buildPrefixTable(pattern: string): number[] {
    const prefixTable = new Array(pattern.length).fill(0);

    let j = 0;
    for (let i = 1; i < pattern.length; i++) {
        while (j > 0 && pattern[i] !== pattern[j]) {
            j = prefixTable[j - 1];
        }

        if (pattern[i] === pattern[j]) {
            j++;
        }

        prefixTable[i] = j;
    }

    return prefixTable;
}

export {
    knuthMorrisPratt
}