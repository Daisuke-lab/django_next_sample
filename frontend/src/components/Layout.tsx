import React, {useState} from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap';
import LoginModal from "./LoginModal"
function Layout({ children }:any) {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{zIndex: 1}} id="navbar">
            <Container>
            <Navbar.Brand href="#home">薬事ロボ</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" style={{justifyContent: "end"}}>
                <Nav>
                <Nav.Link href="#login" onClick={() => setOpen(true)}>ログイン</Nav.Link>
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
