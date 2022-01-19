import React from 'react'
import generateIcon from "../helpers/generateIcon"
import styles from '../../styles/Header.module.css'
interface Props {
    title: string
}
function Header(props:Props) {
    
    return (
        <div className={styles.headerContainer}>
            {generateIcon(props.title)}
            <h1>{props.title}</h1>
        </div>
    )
}

export default Header
