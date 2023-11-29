import {useState} from 'react';
import { useSearchParams } from "next/navigation";
import Header from "../components/header";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table';


const Index = ({data}) => {

    console.log("data");
    console.log(data);

    const [pageNumber, setPageNubmer] = useState(data.pageNumber);
    const [totalPage, setTotalPage] = useState(data.totalPage);

    if(data.code == 200){

        return (
            <>
                <Header></Header>

                <Container fluid="md">

                    <Row>
                    <div>{pageNumber}/{totalPage}페이지</div>
                    </Row>

                    <Row>
                        <div>

                        </div>
                    </Row>

                    <Row>
                        <Col>
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th></th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>날짜</th>
                            <th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.boardList.map((board, index) =>(
                                <tr key = {index}>
                                <td></td>
                                <td>{board.title}</td>
                                <td>{board.user.userId}</td>
                                <td>{board.regDate}</td>
                                <td>{board.view}</td>
                                </tr>
                            ))
                            }

                        </tbody>
                        </Table>
                        </Col>
                    </Row>

                </Container>
            </>
        )        

    }else{
        return (
            <>
                <Header></Header>
                <div>에러 코드 : {data.code}</div>
            </>
        )         

    }

};

export async function getServerSideProps(context){

    try{
       
        let {pageNumber} = context.query;

        if(pageNumber == null){
            pageNumber = 1;
        }

        console.log('http://localhost:8080/board/list?pageNumber='+pageNumber);

        const res = await fetch('http://localhost:8080/board/list?pageNumber='+pageNumber);
        const data = await res.json();
        return {props:{data}}
    }catch(error){
        return {props:{data:{code:'F500'}}};
    }

    
}


export default Index;