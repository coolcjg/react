import {useState} from 'react'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import Header from "../components/header";
import Container from 'react-bootstrap/Container'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Calendar from 'react-calendar'
import moment from 'moment'
import 'react-calendar/dist/Calendar.css';


const Index = () => {

    const [value, onChange] = useState(new Date());

    const [show, setShow] = useState('d-none');
    const [date, setDate] = useState('');
    const [id, setId] = useState('');
    const [validId, setValidId] = useState(false);
    const [validPassword, setValidPassword] = useState(false);

    function showCalendar(){
        if(show === 'd-none'){
            setShow('');
        }else{
            setShow('d-none');
        }
    }

    function changeId(id){
        console.log("changeId : " + id);
        setValidId(false);
        setId(id);
    }

    async function checkId(){
        console.log(id);

        var regex  = /^[a-z]+[a-z0-9]{3,19}$/g;
        const result = regex.test(id);

        if(result == false){
            alert('아이디는 영문 소문자로 시작, 영문소문자 + 숫자 조합 4~20자리만 가능합니다.');
            return;
        }

        try{
            const res = await fetch('http://localhost:8080/user/count/?userId='+id);
            const data = await res.json();                    

            if(data.code == 200){

                if(data.count == 0){
                    alert('사용 가능한 아이디입니다.');
                    setValidId(true);

                }else{
                    alert('사용 불가능한 아이디입니다.');
                    setValidId(false);
                }

            }else{
                alert('서버 에러 발생');
            }

        }catch(error){
            console.log("checkId error");
            return {props:{data:{code:'F500'}}};
        }

    }

    function checkPassword(password){
        console.log("password : " + password);

        var regex  = /^(?=.*[0-9])(?=.*[A-Za-z])(?=.*[`~!@#$%^&*\\(\\)\-_=+]).{8,20}$/g
    
        const result = regex.test(password);        
        if(result == true){
            setValidPassword(true);
        }else{
            setValidPassword(false);
        }
    }

    function updateDate(date){
        setDate(moment(value).format('YYYY-MM-DD'));
        showCalendar();
    }

    const [validated, setValidated] = useState(false);

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
                                <Form.Control type="password" placeholder="비밀번호" onChange={(evnet) => checkPassword(evnet.target.value)} isInvalid={!validPassword} />
                                <Form.Control.Feedback type="invalid">
                                {'영문자, 숫자 특수문자(`~!@#$%^&*()-_=+) 조합 8~20자리'}
                                </Form.Control.Feedback>                                
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password2">
                                <Form.Control type="password" placeholder="비밀번호 확인"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="name">
                                <Form.Control placeholder="이름"/>
                            </Form.Group>

                            <InputGroup className="mb-3">
                                <Form.Control 
                                    placeholder="생년월일"
                                    value={date}
                                    readOnly
                                />
                                <Button variant="outline-secondary" onClick={()=>showCalendar()}>달력</Button>
                            </InputGroup>

                            <Form.Group className={'position-relative mb-3 ' + show}>
                                <Calendar 
                                    className='position-absolute start-50 translate-middle-x'
                                    onChange={onChange} value={value} locale="ko"
                                    formatDay={(locale, date) => moment(date).format("D")}
                                    formatMonth={(locale, date) => moment(date).format("M")}
                                    formatYear={(locale, date) => moment(date).format("YYYY")}
                                    onClickDay={(value, event) => updateDate(value)}
                                    ></Calendar>
                            </Form.Group>
                            
                            <Button type="submit">가입</Button>
                            
                        </Form>
                    </Col>
                </Row>
            </Container>


        </>
    )
}

export default Index;