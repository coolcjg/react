import {useState, useEffect} from 'react';
import Header from "../components/header";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Calendar from 'react-calendar'

import {useRouter} from 'next/router'
import {getCookie} from 'cookies-next'

import Spinner from 'react-bootstrap/Spinner';

import moment from 'moment'
import crypto from "crypto"
import 'react-calendar/dist/Calendar.css';

const Index = (data) => {

    console.log(data);

    const [user, setUser] = useState(data.data);


    const [birthDay, setBirthDay] = useState(data.data.birthDay);

    const [password1, setPassword1] = useState('')
    const [validPassword, setValidPassword] = useState(true);

    const [password2, setPassword2] = useState('')
    const [equalPassword, setEqualPassword] = useState(true);    

    const [validName, setValidName] = useState(true);    

    const [calendarShow, setCalendarShow] = useState('d-none');
    
    const [today, setToday] = useState(new Date());

    function checkPassword(password){
        setPassword1(password);

        var regex  = /^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[`~!@#$%^&*\\(\\)\-_=+]).{8,20}$/g
        const result = regex.test(password);

        if(result == true && password.search(/\s/) == -1){
            setValidPassword(true);
        }else{
            setValidPassword(false);
        }
    }
    
    function checkPasswordEqual(password){
        setPassword2(password);
        setEqualPassword(password1 == password);       
    }

    function modify(){

    }

    function showCalendar(){
        if(calendarShow === 'd-none'){
            setCalendarShow('');
        }else{
            setCalendarShow('d-none');
        }
    }    

    function checkName(name){

        setName(name);

        if(name.search(/\s/) == -1){
            setValidName(true);
        }else{
            setValidName(false);
        }
    }

    function updateBirthDay(date){
        setBirthDay(moment(date).format('YYYY-MM-DD'));
        showCalendar();
    }


    return (
        <>
            <Header></Header>

            <Container>

                <Row className="my-5 justify-content-md-center">정보 수정</Row>

                <Row className="justify-content-md-center">
                    <Col md={{span:6}}>

                        <Form>
                            <InputGroup className="mb-3">
                                <Form.Control placeholder="아이디" id="id" value={user.userId} readOnly={true} autoComplete="userId"/>
                            </InputGroup>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Control type="password" placeholder="비밀번호" autoComplete="new-password" value={password1} onChange={(event) => checkPassword(event.target.value)} isInvalid={!validPassword} />
                                <Form.Control.Feedback type="invalid">
                                {'영문자, 숫자 특수문자(`~!@#$%^&*()-_=+) 조합 8~20자리'}
                                </Form.Control.Feedback>                                
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password2">
                                <Form.Control type="password" placeholder="비밀번호 확인" autoComplete="new-password"  value={password2} onChange={(event) => checkPasswordEqual(event.target.value)} isInvalid={!equalPassword}/>
                                <Form.Control.Feedback type="invalid">
                                {'비밀번호가 맞지 않습니다'}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="auth">
                                <Form.Select value={user.auth} onChange={(e) => setAuth(e.target.value)}>
                                    <option value="">권한</option>
                                    <option value="admin">관리자</option>
                                    <option value="user">사용자</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="name">
                                <Form.Control placeholder="이름" value={user.name} onChange={(event) => checkName(event.target.value)} isInvalid={!validName}/>
                                <Form.Control.Feedback type="invalid">
                                {'이름에 공백을 제거해주세요.'}
                                </Form.Control.Feedback>                                
                            </Form.Group>

                            <InputGroup className="mb-3">
                                <Form.Control 
                                    placeholder="생년월일"
                                    value={birthDay}
                                    readOnly={true}
                                />
                                <Button variant="outline-secondary" onClick={()=>showCalendar()}>달력</Button>
                            </InputGroup>

                            <Form.Group className={'position-relative mb-3 ' + calendarShow}>
                                <Calendar 
                                    className='position-absolute start-50 translate-middle-x'
                                    onChange={setToday} value={today} locale="ko"
                                    formatDay={(locale, date) => moment(date).format("D")}
                                    formatMonth={(locale, date) => moment(date).format("M")}
                                    formatYear={(locale, date) => moment(date).format("YYYY")}
                                    onClickDay={(value, event) => updateBirthDay(value)}
                                    maxDate={new Date()}
                                    ></Calendar>
                            </Form.Group>
                            
                            <Button onClick={modify()}>수정</Button>
                            
                        </Form>
                    </Col>
                </Row>
            </Container>            
        </>
    )
};

export async function getServerSideProps(context){

    const boardServerDomain = process.env.NEXT_PUBLIC_BOARD_SERVER_DOMAIN;

    try{
        let {userId} = context.query;

    
        console.log("userId : " + userId);

        const url = boardServerDomain + '/user/' + userId;
        const res = await fetch(url);
        const data = await res.json();

        return {props:data}
    }catch(error){
        return {props:{data:{code:'F500', message:'서버와 연결되지 않았습니다.'}}};
    }

}

export default Index;