import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from 'react'
import styles from './workspace.module.css'
import {PopoverWrapper} from "./PopoverWrapper"
import {rabinKarp} from "./algorithms/RabinKarp"
import {knuthMorrisPratt} from "./algorithms/KnuthMorrisPratt";
import {boyerMoore} from "./algorithms/BoyerMoore";

const Workspace: React.FC = () => {
    const [times, setTimes] = useState<number[]>([])
    const [text, setText] = useState<string>('');
    const [result, setResult] = useState<number[]>([])
    const inputRef = useRef(null)
    const {
        value: pattern
    } = useInput(inputRef)

    useEffect(() => {
        if (text.length && pattern.length) {

        }
    }, [text, pattern])

    const textRef = useRef<HTMLDivElement>(null)

    const makeTextFile = function (text: string) {
        const data = new Blob([text], {type: 'text/plain'});
        return window.URL.createObjectURL(data);
    };

    const onResultClick = () => {
        const lines = text.split('\n')
        const linesData: {start: number, end: number}[] = []
        lines.forEach((line, i) => {
            if (!linesData.length) {
                linesData.push({
                    start: 0,
                    end: line.length,
                })
            }
            else {
                const prev =  linesData[i - 1].end + 1
                linesData.push({
                    start: prev,
                    end: prev + line.length,
                })
            }
        })
        const data: {line: number, pos: number}[] = result.map(i => {
            const lineIndex = linesData.findIndex(lineData => lineData.start <= i && lineData.end >= i)
            return ({
                line: lineIndex + 1,
                pos: i - linesData[lineIndex].start
            });
        })

        const fileName= './result.txt'
        const element = document.createElement('a');
        element.setAttribute('href', makeTextFile(makeResultText(data)));
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    const makeResultText = (data:  { line: number, pos: number }[]): string => (
        data.reduce((acc, occurrence, i) => (
            acc += `${i + 1}. Строка: ${occurrence.line}, позиция: ${occurrence.pos + 1}\n`
        ), `Всего вхождений: ${data.length}\n\n`)
    )

    const onClick = useCallback(() => {
        if (pattern) {
            const oneLineText = text.replaceAll('\n', ' ').toLowerCase()
            const newTimes = []

            const rkStart = performance.now()
            const result = rabinKarp(oneLineText, pattern)
            newTimes.push(performance.now() - rkStart)

            const kmStart = performance.now()
            knuthMorrisPratt(oneLineText, pattern)
            newTimes.push(performance.now() - kmStart)

            const bmStart = performance.now()
            boyerMoore(oneLineText, pattern)
            newTimes.push(performance.now() - bmStart)

            setTimes(newTimes)

            setResult(result)
            if (result.length) {
                const ranges = result?.map(i => ({start: i, end: i + pattern.length}))
                if (textRef?.current) {
                    const highlightedText = highlighter(text, ranges)
                    textRef.current.innerHTML = highlightedText.replaceAll('\n', '<br/>')
                }
            }
            else {
                alert('Ничего не найдено')
            }
        }
    }, [pattern, text])

    useEffect(() => {
        if (textRef?.current) {
            textRef.current.innerHTML = text.replaceAll('\n', '<br/>')
        }
    }, [text, textRef]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setText(content.replaceAll('\r\n', '\n').replaceAll('\n\r', '\n').replaceAll('\r', '\n'));
            };
            reader.readAsText(file);
        }
    };

    return (
        <>
            <div className={styles.workspace}>
                <input className={styles.input} ref={inputRef} type="text"/>
                <button className={styles.button} onClick={onClick}>Найти</button>
                <PopoverWrapper title="Помощь">
                    <ul className={styles.help_list}>
                        <button className={styles.help_buttons}>Алгоритм Рабина-Карпа</button>
                        Алгоритм поиска строки, который ищет шаблон, то есть подстроку, в тексте, используя хеширование.
                        Представляет собой модификацию линейного алгоритма. Он основан на весьма простой идее. Вырежем "окошечко" размером M и будем двигать его по тексту. Нас интересует, не совпадает ли слово в "окошечке" с заданным образцом. Сравнивать по всем буквам долго. Вместо этого фиксируем некоторую числовую функцию на словах длины M. Тогда задача сведется к сравнению чисел, что, несомненно, быстрее. Если значения этой функции на слове в "окошечке" и на образце различны, то совпадения нет. Только если значения одинаковы, необходимо проверять последовательно совпадение по буквам.

                        Сложность - O(M+N)

                        Алгоритм Рабина-Карпа применяется для поиска строк по нескольким образцам. В этом случае текущее хеш-значение подстроки эффективным образом сравнивается с множеством хеш-значений образцов.
                        Алгоритм Рабина-Карпа является алгоритмом с наименьшими предварительными трудозатратами, поэтому он годится для использования при решении некоторого класса задач.
                        <button className={styles.help_buttons}>Алгоритм Кнута–Морриса–Пратта</button>
                        Алгоритм Кнута – Морриса – Пратта (КМП).
                        Эффективный алгоритм, осуществляющий поиск подстроки в строке, используя то, что при возникновении несоответствия само слово содержит достаточно информации, чтобы определить, где может начаться следующее совпадение, минуя лишние проверки. Время работы алгоритма линейно зависит от объёма входных данных, то есть разработать асимптотически более эффективный алгоритм невозможно.
                        Алгоритм более полно использует информацию, полученную во время сканирования. После сдвига образца по тексту стоит вести сравнение посимвольно. Если не совпал первый символ, нет смысла переходить к следующему.

                        Сложность - O(n)
                        <button className={styles.help_buttons}>Алгоритм Бойера-Мура</button>
                        Алгоритм общего назначения, предназначенный для поиска подстроки в строке. Преимущество этого алгоритма в том, что ценой некоторого количества предварительных вычислений над шаблоном (но не над строкой, в которой ведётся поиск), шаблон сравнивается с исходным текстом не во всех позициях — часть проверок пропускается как заведомо не дающая результата. Имеет нелинейную оценку трудоемкости в худшем случае, но в среднем работает быстрее. Этот алгоритм считается наиболее быстрым среди алгоритмов общего назначения, предназначенных для поиска подстроки в строке.

                        Сложность - O (n+m)

                        Эффективность алгоритма Бойера – Мура в среднем выше по сравнению с алгоритмом КМП, но существенно зависит от длины текста и длины образца. Так при длине строки до 10 символов он показывает себя хуже, даже чем последовательный поиск.
                    </ul>
                </PopoverWrapper>
                <button className={styles.button} onClick={onResultClick}>Результат</button>
                <PopoverWrapper title="Анализ">
                    <ul className={styles.list}>
                        <button className={styles.help_buttons}>Алгоритм Рабина-Карпа: {times[0]} ms</button>
                        <button className={styles.help_buttons}>Алгоритм Кнута–Морриса–Пратта: {times[1]} ms</button>
                        <button className={styles.help_buttons}>Алгоритм Бойера-Мура: {times[2]} ms</button>
                    </ul>
                </PopoverWrapper>
            </div>
            <label className={styles.button} htmlFor="file-upload">
                Выберите файл
            </label>
            <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                style={{display: 'none'}}
            />
            <div ref={textRef} className={styles.text}></div>
        </>
    )
        ;
};

function highlighter(str: string, ixs: {start: number, end: number}[]){
    return ixs.reduceRight((s,ix) =>
        `${s.slice(0, ix.start)}<span class=${styles.selected}>${s.slice(ix.start, ix.end)}</span>${s.slice(ix.end)}`,
        str
    );
}

const useInput = (ref: MutableRefObject<HTMLInputElement | null>) => {
    const [value, setValue] = useState('')

    const onInput = () => {
        setValue(ref.current?.value || '')
    }

    let currentRef: HTMLInputElement
    useEffect(() => {
        if (ref?.current) {
            currentRef = ref.current
            currentRef.addEventListener('input', onInput)
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('input', onInput)
            }
        }
    }, [ref])

    return {
        value,
    }
}

export default Workspace;
