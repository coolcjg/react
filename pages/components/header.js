"use client"

import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Router, {useRouter} from 'next/router'
import {getCookie, deleteCookie } from 'cookies-next'
import {useEffect, useState, useLayoutEffect} from 'react';

const Header = () => {

    const [loaded, setLoaded] = useState(false);

    const router = useRouter();
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    
    useEffect(()=>{
        setLoaded(true);

        const id = getCookie("id");
        const name = getCookie("name");        

        setId(id);
        setName(name);
    }, []);

    function logout(){
        deleteCookie("id");
        deleteCookie("name");
        deleteCookie("accessToken");
        deleteCookie("refreshToken");

        setId('');
        setName('');
        router.push({pathname:"/"});
    }

    if(!loaded){
        return null;
    }

    return(
        <>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                    <Navbar.Brand href="/">여행중</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link onClick={()=> router.push({pathname:"/board"})}>게시판</Nav.Link>
                    </Nav>

                    {
                        name ? (
                            <>
                            {name} 님
                            <Button variant="outline-danger" size="sm" className="mx-1" onClick={() => logout()}>로그아웃</Button>
                            </>
                        ) : (
                            <>
                            <Button variant="outline-primary" size="sm" className="mx-1" onClick={() => router.push({pathname:"/login"})}>로그인</Button>
                            <Button variant="outline-primary" size="sm" onClick={()=> router.push({pathname:"/join"})}>회원가입</Button>
                            </>
                        )
                    }

                </Container>
            </Navbar>
        </>
    );   
    


    

}

export default Header;
