function rabinKarp(text: string, pattern: string, prime: number = 101): number[] {
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
                result.push(i);
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
}

export {
    rabinKarp,
}
