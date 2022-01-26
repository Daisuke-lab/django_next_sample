import React, {useState, useEffect} from 'react'
import Header from './Header'
import SideBar from './SideBar'
import styles from '../../styles/Container.module.css'

export interface PagesName {
    [key: string] : string
    "/products": string,
    "/conditions": string,
    "/results": string,
    "/domains": string
  }

  

function Container({children}:any) {
    const pages = {
        "/products": "調査対象商品一覧／登録",
        "/conditions": "チェック条件設定",
        "/results": "チェック結果一覧",
        "/domains": "ドメイン設定"
    } as PagesName
    const [currentTitle, setCurrentTitle] = useState<string>("")
    useEffect(() => {
        const pathname:string= window.location.pathname;
        setCurrentTitle(pages[pathname])

        if (pathname.includes("results")) {
            setCurrentTitle("チェック結果詳細")
        }
    }, [])

    const getContainerHeight = () => {
        const navbar = document.getElementById('navbar')
        const navbarHeight = navbar!== null?navbar.clientHeight:0;
        const headerHeight = 90
        const containerHeight = window.innerHeight - navbarHeight - headerHeight
        return containerHeight
    }
    return (
        <div>
            <Header title={currentTitle}/>
            <div className={styles.contentContainer} style={{height: `${getContainerHeight()}px`}}>
                <SideBar title={currentTitle} pages={pages}/>
                <div className={styles.content}>
                {children}
                </div>
            </div>
        </div>
    )
}

export default Container
