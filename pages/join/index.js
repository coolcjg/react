import {useEffect, useState, useRef } from 'react'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import Header from "../components/header";
import Container from 'react-bootstrap/Container'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Calendar from 'react-calendar'
import moment from 'moment'
import crypto from "crypto"
import Router, {useRouter} from 'next/router'
import 'react-calendar/dist/Calendar.css';
import { GSP_NO_RETURNED_VALUE } from 'next/dist/lib/constants';


const Index = () => {

    const boardServerDomain = process.env.NEXT_PUBLIC_BOARD_SERVER_DOMAIN;

    const router = useRouter();
    
    const [id, setId] = useState('');
    const [validId, setValidId] = useState(false);
    
    const [password1, setPassword1] = useState('')
    const [validPassword, setValidPassword] = useState(true);

    const [password2, setPassword2] = useState('')
    const [equalPassword, setEqualPassword] = useState(true);

    const [name, setName] = useState('');
    const [validName, setValidName] = useState(true);

    const [today, setToday] = useState(new Date());
    const [birthDay, setBirthDay] = useState('');
    const [calendarShow, setCalendarShow] = useState('d-none');

    const [auth, setAuth] = useState("");

    function showCalendar(){
        if(calendarShow === 'd-none'){
            setCalendarShow('');
        }else{
            setCalendarShow('d-none');
        }
    }

    function changeId(id){
        setValidId(false);
        setId(id);
    }

    async function checkId(){

        var regex  = /^[a-z]+[a-z0-9]{3,19}$/g;
        const result = regex.test(id);

        if(result == false){
            alert('아이디는 영문 소문자로 시작, 영문소문자 + 숫자 조합 4~20자리만 가능합니다.');
            return;
        }

        try{
            const res = await fetch(boardServerDomain + '/user/count/?userId='+id);
            const data = await res.json();                    

            if(data.message == "success"){

                if(data.count == 0){
                    alert('사용 가능한 아이디입니다.');
                    setValidId(true);

                }else{
                    alert('사용 불가능한 아이디입니다.');
                    setValidId(false);
                }

            }else{
                alert('서버 에러가 발생했습니다 : ' + message);
            }

        }catch(error){
            alert('서버응답이 없습니다.')
        }

    }

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

    function updateBirthDay(date){
        setBirthDay(moment(date).format('YYYY-MM-DD'));
        showCalendar();
    }

    function checkName(name){

        setName(name);

        if(name.search(/\s/) == -1){
            setValidName(true);
        }else{
            setValidName(false);
        }
    }


    async function join(){
        if(!validId){
            alert('아이디 중복확인을 해주세요.');
            return;
        }

        if(password1 == '' || !validPassword){
            alert('비밀번호를 형식에 맞게 입력해주세요.');
            return;
        }

        if(password2 == '' || !equalPassword){
            alert('비밀번호 한번 더 입력헤주세요.');
            return;
        }

        if(name == '' || !validName){
            alert('이름을 형식에 맞게 입력해주세요.');
            return;
        }

        if(birthDay === ''){
            alert('생일을 선택해주세요.');
            return;
        }       

        if(auth == ""){
            alert('권한을 선택해주세요.');
            return;
        }

        try{
            const res = await fetch(boardServerDomain + '/user', {
                method:'POST'
                , headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    userId : id
                    , password : crypto.createHash('sha256').update(password1).digest('hex')
                    , name : name
                    , birthDay : birthDay
                    , auth : auth
                })
            });
            
            const data = await res.json();

            if(data.message == "success"){
                alert('회원가입이 성공했습니다.');
                router.push({pathname:"/"});    
            }else{
                alert('회원가입 도중 문제가 발생하였습니다. : ' + data.message);
            }

        }catch(error){
            console.log("error;");
            console.log(error);
            alert('서버응답이 없습니다.');            
        }

    }

    return(
        <>
            <Header></Header>

            <Container>

                <Row className="my-5 justify-content-md-center">회원가입</Row>

                <Row className="justify-content-md-center">
                    <Col md={{span:6}}>

                        <Form>
                            <InputGroup className="mb-3">
                                <Form.Control placeholder="아이디" id="id" value={id} onChange={(event) => changeId(event.target.value)}/>
                                <Button variant="outline-secondary" onClick={()=>checkId()}>중복확인</Button>
                            </InputGroup>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Control type="password" placeholder="비밀번호" value={password1} onChange={(event) => checkPassword(event.target.value)} isInvalid={!validPassword} />
                                <Form.Control.Feedback type="invalid">
                                {'영문자, 숫자 특수문자(`~!@#$%^&*()-_=+) 조합 8~20자리'}
                                </Form.Control.Feedback>                                
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password2">
                                <Form.Control type="password" placeholder="비밀번호 확인" value={password2} onChange={(event) => checkPasswordEqual(event.target.value)} isInvalid={!equalPassword}/>
                                <Form.Control.Feedback type="invalid">
                                {'비밀번호가 맞지 않습니다'}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="auth">
                                <Form.Select value={auth} onChange={(e) => setAuth(e.target.value)}>
                                    <option value="">권한</option>
                                    <option value="admin">관리자</option>
                                    <option value="user">사용자</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="name">
                                <Form.Control placeholder="이름" value={name} onChange={(event) => checkName(event.target.value)} isInvalid={!validName}/>
                                <Form.Control.Feedback type="invalid">
                                {'이름에 공백을 제거해주세요.'}
                                </Form.Control.Feedback>                                
                            </Form.Group>

                            <InputGroup className="mb-3">
                                <Form.Control 
                                    placeholder="생년월일"
                                    value={birthDay}
                                    readOnly
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
                            
                            <Button onClick={join}>가입</Button>
                            
                        </Form>
                    </Col>
                </Row>
            </Container>


        </>
    )
}

export default Index;