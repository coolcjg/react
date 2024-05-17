"use client"

import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Router, {useRouter} from 'next/router'
import {useEffect, useState, useLayoutEffect} from 'react';
import {getCookie, setCookie, deleteCookie } from 'cookies-next'
import '../../public/css/Style.css'
import { deleteUserCookie } from '@/pages/components/common';

const Header = () => {

    const backServer = process.env.NEXT_PUBLIC_BACK_SERVER;

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

        if(id != undefined){
            getAccessTokenByRefreshToken();
        }else{
        }
        

    }, []);

    function logout(){
        deleteUserCookie();
        router.push({pathname:"/"});
    }

    async function getAccessTokenByRefreshToken(){

        console.log("getAccessTokenByRefreshToken");

        try{       
            const res = await fetch(backServer + "/jwt/accessToken", {
                headers :{
                    refreshToken: getCookie("refreshToken")
                }
                , method:'GET'
            });

            const data = await res.json();

            if(data.code == 200){
                console.log("new Access Token : " + data.accessToken);
                setCookie("accessToken", data.accessToken);
            }else if(data.code == 401){
                alert('로그인이 만료됐습니다.');
                router.push("/login");
            }

        }catch(error){
            console.error(error);
            alert('서버 에러가 발생하였습니다.');
        }
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
                        <Nav.Link onClick={()=> router.push({pathname:"/chat"})}>채팅방</Nav.Link>
                        <Nav.Link onClick={()=> router.push({pathname:"/alarm"})}>알람</Nav.Link>
                        <Nav.Link onClick={()=> router.push({pathname:"/gallery"})}>갤러리</Nav.Link>
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