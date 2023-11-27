import {useEffect, useState, useRef } from 'react'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import Header from "../components/header";
import Container from 'react-bootstrap/Container'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import crypto from "crypto"
import Router, {useRouter} from 'next/router'
import {setCookie} from 'cookies-next'

const Index = () => {

    const router = useRouter();

    const [id, setId] = useState('');
    const [validId, setValidId] = useState(true);

    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(true);    

    function changeId(id){
        setId(id.trim());
    }

    function checkPassword(password){
        setPassword(password);
    }    

    async function login(){

        if(id === ''){
            setValidId(false);
            return;
        }
        setValidId(true);

        if(password === ''){
            setValidPassword(false);
            return;
        }
        setValidPassword(true);

        try{
            const res = await fetch('http://localhost:8080/user/login', {
                method:'POST'
                , headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    userId : id
                    , password : crypto.createHash('sha256').update(password).digest('hex')
                })
            });
            
            const data = await res.json();

            console.log("login result data");
            console.log(data);

            if(data.code == "200"){
                alert('로그인이 성공했습니다.');

                const token = res.headers.get('Set-Cookie');

                setCookie('accessToken', data.accessToken);
                setCookie('refreshToken', data.refreshToken);
                setCookie('id', data.id);
                setCookie('name', data.name);

                router.push({pathname:"/"});
            }else{
                alert('로그인중 문제가 발생하였습니다. : ' + data.code);
            }

        }catch(error){
            console.log("error");
            console.log(error);
            alert('서버응답이 없습니다.');            
        }

    }

    return(
        <>
            <Header></Header>

            <Container>

                <Row className="mt-5 justify-content-md-center">
                    <Col md={{span:4}}>

                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Control placeholder="아이디" id="id" value={id} onChange={(event) => changeId(event.target.value)} isInvalid={!validId}/>
                                <Form.Control.Feedback type="invalid">
                                {'아이디를 입력하세요'}
                                </Form.Control.Feedback>                                
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Control type="password" placeholder="비밀번호" value={password} onChange={(event) => checkPassword(event.target.value)} isInvalid={!validPassword}/>
                                <Form.Control.Feedback type="invalid">
                                {'비밀번호를 입력하세요'}
                                </Form.Control.Feedback>                                  
                            </Form.Group>
                            
                            <InputGroup className="mb-3 justify-content-md-center">
                                <Button onClick={login} className="">로그인</Button>
                            </InputGroup>
                            
                        </Form>
                    </Col>
                </Row>
            </Container>


        </>
    )    
    
}

export default Index;
