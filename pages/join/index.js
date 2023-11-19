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

    

    function showCalendar(){
        if(show === 'd-none'){
            setShow('');
        }else{
            setShow('d-none');
        }
    }

    async function checkId(){
        console.log(id);

        try{
            const res = await fetch('http://localhost:8080/user/count/?userId='+id);
            const data = await res.json();                    

            console.log("checkId result data : " + data);
            console.log( data);

        }catch(error){
            console.log("checkId error");
            return {props:{data:{code:'F500'}}};
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
                                <Form.Control placeholder="아이디" id="id" value={id} onChange={(event) => setId(event.target.value)}/>
                                <Button variant="outline-secondary" onClick={()=>checkId()}>중복확인</Button>
                            </InputGroup>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Control type="password" placeholder="비밀번호"/>
                                <Form.Control.Feedback type="invalid">Looks good!</Form.Control.Feedback>
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