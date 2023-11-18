import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import Header from "../components/header";
import Container from 'react-bootstrap/Container'

const Index = () => {
    return(
        <>
            <Header></Header>

            <Container>

                <Row className="my-5 justify-content-md-center">회원가입</Row>

                <Row className="justify-content-md-center">
                    <Col md={{span:6}}>

                        <Form>
                            <Form.Group className="mb-3" controlId="id">
                                <Form.Control placeholder="id"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Control type="password" placeholder="password"/>
                            </Form.Group>                                
                            

                            <Form.Group className="mb-3" controlId="name">
                                <Form.Control placeholder="name"/>
                            </Form.Group>                


                        </Form>
                </Col>
                </Row>
            </Container>


        </>
    )
}

export default Index;