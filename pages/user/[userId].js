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

import moment from 'moment'
import crypto from "crypto" 
import 'react-calendar/dist/Calendar.css';

import { isAdminAuth } from '@/common/common.js';


const Index = (data) => {  

    const router = useRouter();

    useEffect(()=>{
        if(!isAdminAuth()){
            router.push("/error/auth");
        }else{

            if(data.data.message == "error"){
                if (typeof window !== 'undefined') { 
                    alert('서버 에러 발생.') 
                }
            }            

            setShow(true);
        }
    }, [])

    const boardServerDomain = process.env.NEXT_PUBLIC_BOARD_SERVER_DOMAIN;

    const [user, setUser] = useState(data.data);

    const [password1, setPassword1] = useState('')
    const [validPassword, setValidPassword] = useState(true);

    const [password2, setPassword2] = useState('')
    const [equalPassword, setEqualPassword] = useState(true);    

    const [validName, setValidName] = useState(true);    

    const [calendarShow, setCalendarShow] = useState('d-none');
    
    const [today, setToday] = useState(new Date());

    const [show, setShow] = useState(false);

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

    function validInput(){

        if(password1 == '' || !validPassword){
            alert('비밀번호를 형식에 맞게 입력해주세요.');
            return false;
        }

        if(password2 == '' || !equalPassword){
            alert('비밀번호 한번 더 입력헤주세요.');
            return false;
        }

        if(user.auth == ""){
            alert('권한을 선택해주세요.');
            return false;
        }        

        if(user.name == '' || !validName){
            alert('이름을 형식에 맞게 입력해주세요.');
            return false;
        }

        return true;
    }

    async function modify(){

        if(validInput()){    
            try{
                const res = await fetch(boardServerDomain + '/user', {
                    method:'PUT'
                    , headers:{
                        'Content-Type':'application/json'
                        , accessToken: getCookie("accessToken")
                        , refreshToken: getCookie("refreshToken")
                    },
                    body:JSON.stringify({...user, password : crypto.createHash('sha256').update(password1).digest('hex')})
                });
                
                const data = await res.json();    

                if(data.message == "success"){
                    alert('사용자 정보가 변경됐습니다.');
                    router.push("/user");
                }
    
            }catch(e){
                alert('서버 에러가 발생했습니다.');
                console.error(e);
    
            }            
        }

    }

    function showCalendar(){
        if(calendarShow === 'd-none'){
            setCalendarShow('');
        }else{
            setCalendarShow('d-none');
        }
    }    

    function checkName(name){

        setUser({...user, name:name});

        if(name.search(/\s/) == -1){
            setValidName(true);
        }else{
            setValidName(false);
        }
    }

    function updateBirthDay(date){
        setUser({...user, birthDay:moment(date).format('YYYY-MM-DD')});
        showCalendar();
    }


    return (
        <>
            <Header></Header>
            {
                show && 
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
                                    <Form.Select value={user.auth} onChange={(e) => setUser({...user, auth:e.target.value})}>
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
                                        value={user.birthDay}
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
                                
                                <Button className={user.message=="error" ? "disabled" : ""} onClick={(e) => modify()}>수정</Button>
                                
                            </Form>
                        </Col>
                    </Row>
                    </Container>                 
            }
        </>
    )
};

export async function getServerSideProps(context){

    const boardServerDomain = process.env.NEXT_PUBLIC_BOARD_SERVER_DOMAIN;

    const cookieStringToObject = (cookieString) => {
        if (!cookieString) {
          return "";
        } else {
        
          cookieString = cookieString.split("; ");
          let result = {};
          
          for (var i = 0; i < cookieString.length; i++) {
            var cur = cookieString[i].split("=");
            result[cur[0]] = cur[1];
          }
          return result;
        }
      };

    try{
        let {userId} = context.query;       
        const cookieObj = cookieStringToObject(context.req.headers.cookie);

        const url = boardServerDomain + '/user/' + userId;
        const res = await fetch(url, {
            headers :{
                accessToken: cookieObj.accessToken
                ,refreshToken: cookieObj.refreshToken
            }
            , method:'GET'
        });
        
        const json = await res.json();

        return {props:json}
    }catch(error){
        console.log(error);
        return {props:{data:{message:"error", error:error.message}}};
    }

}

export default Index;