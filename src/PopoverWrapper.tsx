import {PropsWithChildren, useState} from 'react'
import styles from './PopoverWrapper.module.css'

type PopoverWrapperProps = PropsWithChildren & {
    title: string
}

function PopoverWrapper({
    title,
    children,
}: PopoverWrapperProps) {
    const [opened, setOpened] = useState(false)
    const toggle = () => setOpened(!opened)

    return (
        <div className={styles.container}>
            <button className={styles.button} onClick={toggle}>{title}</button>
            <div className={styles.children}>
                {opened && children}
            </div>
        </div>
    )
}

export {
    PopoverWrapper
}

