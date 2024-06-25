import React, {MutableRefObject, RefObject, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from './workspace.module.css'
import {PopoverWrapper} from "./PopoverWrapper";
import {rabinKarp, knuthMorrisPratt} from "./algorithms/RabinKarp";

const Workspace: React.FC = () => {
    const [text, setText] = useState<string>('');
    // const [result, setResult] = useState<number[]>([])
    const inputRef = useRef(null)
    const {
        value: pattern
    } = useInput(inputRef)



    //const [result, setResult] = useState<[number, string, number][]>([]);
    const [result, setResult] = useState<[number, number, number][]>([]);
    useEffect(() => {
        if (text.length && pattern.length) {
            setResult(rabinKarp(text, pattern))
        }
    }, [text, pattern])



    const textView = useMemo(() => {
        if (!result.length) {
            return <div className={styles.text}>{text}</div>
        }

        const start = result[0][0] - 1
        return (
            <div className={styles.text}>
                {text.slice(0, start)}
                <span className={styles.selected}>{pattern}</span>
                {text.slice(start + pattern.length)}
            </div>
        )
    }, [result, pattern, text])

    // const resultView = result.map(i => <span key={i}>{i}, </span>)
    const resultView = useMemo(() => {
        return result.map(([i]) => <span key={i}>{i}, </span>);
    }, [result]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setText(content);
            };
            reader.readAsText(file);
        }
    };

    return (
        <>
            <div className={styles.workspace}>
                <input ref={inputRef} type="text"/>
                {/*Вхождения: {resultView}*/}
                {result.map(([index, line, count], i) => (
                    <div key={i}>
                        <p>Всего найдено слов: {result.length}</p>
                        <p>Строка: {index}</p>
                        <p>Позиция в строке: {line}</p>
                    </div>
                ))}
                {/*<select>
                   <option>Сгенерировать</option>
                    <option>Еще что-то</option>
                </select>
                <select>
                    <option>Открыть</option>
                    <option>Консоль</option>
                </select>*/}
                <select>
                    <option>Метод</option>
                    <option>Рабина-Карпа</option>
                    <option>Кнута–Морриса–Пратта</option>
                    <option>Бойера-Мура</option>
                </select>
                <button>Результат</button>
                <button>Анализ</button>
                <PopoverWrapper title="Помощь" >
                    <ul>
                        <button className={styles.help_buttons}>Алгоритм Рабина-Карпа</button>
                        <button className={styles.help_buttons}>Алгоритм Кнута–Морриса–Пратта</button>
                        <button className={styles.help_buttons}>Алгоритм Бойера-Мура</button>
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
            {textView}
        </>
    )
        ;
};

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
