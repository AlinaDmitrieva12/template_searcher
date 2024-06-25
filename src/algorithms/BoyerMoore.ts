function boyerMoore(text: string, pattern: string): { count: number; lineNumbers: number[]; positions: number[] } {
    let count = 0;
    const lineNumbers: number[] = [];
    const positions: number[] = [];

    // Создаем таблицу сдвигов
    const shiftTable = createShiftTable(pattern.toLowerCase());

    let i = 0;
    while (i <= text.length - pattern.length) {
        let j = pattern.length - 1;
        while (j >= 0 && text[i + j].toLowerCase() === pattern[j].toLowerCase()) {
            j--;
        }
        if (j < 0) {
            // Найдено совпадение
            count++;
            const lineNumber = getLineNumber(text, i);
            const position = getPositionInLine(text, i);
            lineNumbers.push(lineNumber);
            positions.push(position);
            i += shiftTable[pattern.length];
        } else {
            i += Math.max(1, j - shiftTable[text[i + j].toLowerCase().charCodeAt(0)]);
        }
    }

    return { count, lineNumbers, positions };
}

function createShiftTable(pattern: string): Record<string, number> {
    const shiftTable: Record<string, number> = {};
    for (let i = 0; i < pattern.length; i++) {
        shiftTable[pattern[i]] = pattern.length - i - 1;
    }
    return shiftTable;
}

function getLineNumber(text: string, index: number): number {
    let lineNumber = 1;
    for (let i = 0; i < index; i++) {
        if (text[i] === '\n') {
            lineNumber++;
        }
    }
    return lineNumber;
}

function getPositionInLine(text: string, index: number): number {
    let position = 1;
    for (let i = 0; i < index; i++) {
        if (text[i] === '\n') {
            position = 1;
        } else {
            position++;
        }
    }
    return position;
}

export {
    boyerMoore
}