import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Router, {useRouter} from 'next/router'

const Header = () => {

    const router = useRouter();    
    
    return(
        <>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                    <Navbar.Brand href="/">여행중</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/board">게시판</Nav.Link>
                    </Nav>

                    <Button variant="outline-success" size="sm" className="mx-1">로그인</Button>
                    <Button variant="outline-success" size="sm" onClick={()=> router.push({pathname:"/join"})}>회원가입</Button>

                </Container>
            </Navbar>
        </>
    );
}

export default Header;