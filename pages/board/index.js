import {useState} from 'react';
import Header from "../components/header";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import {useRouter} from 'next/router'
import {getCookie, deleteCookie } from 'cookies-next'

const Index = ({data}) => {

    console.log("Index");

    const router = useRouter();
    const [pageNumber, setPageNubmer] = useState(data.pageNumber);
    const [totalPage, setTotalPage] = useState(data.totalPage);
    const [checkedId, setCheckedId] = useState([]);
    
    function checkAll(e){
        if(e.target.checked){
            const idArray = [];
            data.boardList.forEach((el) => idArray.push(el.boardId));
            setCheckedId(idArray);
        }else{
            setCheckedId([]);
        }
    }
    
    function check(id){

        const isChecked = checkedId.includes(id);

        if(isChecked){
            setCheckedId((prev) => prev.filter((el) => el !== id));
        }else{
            setCheckedId((prev) => [...prev, id]);
        }
    }

    function goWrite(){

        const id = getCookie("id");
        
        if(id === undefined){
            router.push("/login");
        }else{
            router.push("/board/write");
        }

    }

    if(data.code == 200){

        return (
            <>
                <Header></Header>

                <Container fluid="md" className="mt-4">

                    <Row>
                        <Col>
                            <div>{pageNumber}/{totalPage}페이지</div>  
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th style={{width:"0%"}}><Form.Check checked = {data.boardList.length == checkedId.length ? true : false} onChange={e => checkAll(e)}/></th>
                                <th style={{width:"30%"}} className="text-center">제목</th>
                                <th style={{width:"10%"}} className="text-center">작성자</th>
                                <th style={{width:"10%"}} className="text-center">날짜</th>
                                <th style={{width:"5%"}} className="text-center">조회수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.boardList.map((board, index) =>(
                                    <tr key = {index}>
                                    <td><Form.Check value={board.boardId} checked={checkedId.includes(board.boardId) ? true : false} onChange={(e)=>check(board.boardId)}/></td>
                                    <td>{board.title}</td>
                                    <td className="text-center">{board.user.userId}</td>
                                    <td className="text-center">{board.regDate}</td>
                                    <td className="text-center">{board.view}</td>
                                    </tr>
                                ))
                                }

                            </tbody>
                            </Table>

                            <div className="gap-2 d-md-flex justify-content-md-end">
                                <Button size="sm">삭제</Button>
                                <Button size="sm" onClick={()=> goWrite()}>글쓰기</Button>
                            </div>

                        </Col>
                    </Row>

                </Container>
            </>
        )        

    } else {
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