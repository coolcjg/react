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

    const router = useRouter();
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    
    useLayoutEffect(()=>{

        const id = getCookie("id");
        const name = getCookie("name");        

        setId(id);
        setName(name);
    }, []);

    function logout(){
        deleteCookie("id");
        deleteCookie("name");
        setId('');
        setName('');
        router.push({pathname:"/"});
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
                            <Button variant="outline-success" size="sm" className="mx-1" onClick={() => logout()}>로그아웃</Button>
                            </>
                        ) : (
                            <>
                            <Button variant="outline-success" size="sm" className="mx-1" onClick={() => router.push({pathname:"/login"})}>로그인</Button>
                            <Button variant="outline-success" size="sm" onClick={()=> router.push({pathname:"/join"})}>회원가입</Button>
                            </>
                        )
                    }

                </Container>
            </Navbar>
        </>
    );   
    


    

}

export default Header;
