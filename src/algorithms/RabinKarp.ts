{/*function rabinKarp(text: string, pattern: string, prime: number = 101): number[] {
    const n = text.length;
    const m = pattern.length;
    const base = 256; // размер алфавита (256 для ASCII)
    let patternHash = 0;
    let textHash = 0;
    let h = 1;

    // Вычисление хеш-значения для первых m символов текста
    for (let i = 0; i < m - 1; i++) {
        h = (h * base) % prime;
    }

    // Вычисление хеш-значений для образца и первых m символов текста
    for (let i = 0; i < m; i++) {
        patternHash = (base * patternHash + pattern.charCodeAt(i)) % prime;
        textHash = (base * textHash + text.charCodeAt(i)) % prime;
    }

    const result: number[] = [];

    // Поиск совпадений
    for (let i = 0; i <= n - m; i++) {
        // Если хеш-значения совпадают, проверяем на точное совпадение
        if (patternHash === textHash) {
            let j;
            for (j = 0; j < m; j++) {
                if (text[i + j] !== pattern[j]) {
                    break;
                }
            }
            if (j === m) {
                result.push(i + 1); // Индексы в TypeScript начинаются с 0, поэтому добавляем 1
            }
        }

        // Вычисление хеш-значения для следующих m символов текста
        if (i < n - m) {
            textHash = (base * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % prime;
            if (textHash < 0) {
                textHash += prime;
            }
        }
    }

    return result;
}*/}

function rabinKarp(text: string, pattern: string, prime: number = 101): [number, number, number][] {
    const lines = text.split('\n');
    const result: [number, number, number][] = [];
    let totalCount = 0;
    let lineStart = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        const n = line.length;
        const m = pattern.toLowerCase().length;
        const base = 256; // размер алфавита (256 для ASCII)
        let patternHash = 0;
        let lineHash = 0;
        let h = 1;

        // Вычисление хеш-значения для первых m символов текста
        for (let j = 0; j < m - 1; j++) {
            h = (h * base) % prime;
        }

        // Вычисление хеш-значений для образца и первых m символов текста
        for (let j = 0; j < m; j++) {
            patternHash = (base * patternHash + pattern.toLowerCase().charCodeAt(j)) % prime;
            lineHash = (base * lineHash + line.charCodeAt(j)) % prime;
        }

        // Поиск совпадений
        for (let j = 0; j <= n - m; j++) {
            // Если хеш-значения совпадают, проверяем на точное совпадение
            if (patternHash === lineHash) {
                let k;
                for (k = 0; k < m; k++) {
                    if (line[j + k] !== pattern.toLowerCase()[k]) {
                        break;
                    }
                }
                if (k === m) {
                    result.push([i + 1, j + 1, ++totalCount]); // Индексы в TypeScript начинаются с 0, поэтому добавляем 1
                }
            }

            // Вычисление хеш-значения для следующих m символов текста
            if (j < n - m) {
                lineHash = (base * (lineHash - line.charCodeAt(j) * h) + line.charCodeAt(j + m)) % prime;
                if (lineHash < 0) {
                    lineHash += prime;
                }
            }
        }

        lineStart += line.length + 1; // Добавляем длину строки и символ новой строки
    }

    return result;
}

// Пример использования
const text = "мама папа сестра\nсестра папа мама\nМАМА мама\nмама папа МАМА";
const pattern = "мама";
const result = rabinKarp(text, pattern);

console.log(`Всего найдено слов: ${result.length}`);
for (const [lineNum, pos, count] of result) {
    console.log(`Строка: ${lineNum}, Позиция: ${pos}, Всего найдено: ${count}`);
}


// Пример использования
{/*
const text = "мама папа сестра\nсестра папа мама\nмама мама\nмама папа мама";
const pattern = "мама";
const result = rabinKarp(text, pattern);

console.log(`Всего найдено слов: ${result.length}`);
for (const [lineNum, pos, count] of result) {
    console.log(`Строка: ${lineNum}, Позиция: ${pos}, Всего найдено: ${count}`);
}*/}


export {
    rabinKarp
}