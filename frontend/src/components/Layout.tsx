import React, {useState} from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap';
import LoginModal from "./LoginModal"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import Image from 'next/image'
import titleImage from '../../public/title.png'
function Layout({ children }:any) {
    const [open, setOpen] = useState<boolean>(false)
    const { data: session, status } = useSession()
    const isUser = !!session?.user

    return (
        <>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{zIndex: 1}} id="navbar">
            <Container>
            <Navbar.Brand href="#home" style={{paddingBottom:0}}>
            <Image src={titleImage} width={100}/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" style={{justifyContent: "end"}}>
                <Nav>
                    {!isUser?
                    <Nav.Link href="#login" onClick={() => setOpen(true)}>ログイン</Nav.Link>:
                    <>
                    <Nav.Link href="/mypage">マイページ</Nav.Link>
                    <Nav.Link href="#logout" onClick={() => signOut()}>ログアウト</Nav.Link>
                    </>
                    }
                </Nav>
            </Navbar.Collapse>
            </Container>
            </Navbar>
            {open?<LoginModal open={open} setOpen={setOpen}/>:<></>}
            {children}
        </>
    )
}

export default Layout
