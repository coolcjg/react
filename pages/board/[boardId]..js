import {useState} from 'react';
import Header from "../components/header";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Pagination from 'react-bootstrap/Pagination'
import {useRouter} from 'next/router'
import {getCookie, deleteCookie } from 'cookies-next'
import Link from 'next/link';
import '../../public/css/Style.css'
import { ListGroup } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';

const Index = ({data}) => {

    const backServer = process.env.NEXT_PUBLIC_BACK_SERVER;

    console.log("프론트 data");
    console.log(data);

    const router = useRouter();
    const {boardId} = router.query;

    const [board, setBoard] = useState(data.board);    

    function list(){
        router.push("/board");
    }

    function modify(boardId){
        router.push("/board/modify/" + boardId);
    }

    return (
        <>
            <Header></Header>

            <Container fluid="md" className="mt-4 mb-4">
                {board.mediaDTOList.length > 0 &&                    
                    <div>
                        <div className="mediaOut mb-4">
                            <div className="mediaIn">
                                <img className="" src={board.mediaDTOList[1].originalFileUrl}/>
                            </div>
                        </div>

                        <div>
                            {
                                board.mediaDTOList.map((media, index) => (
                                    <div>{media.mediaId}</div>
                                ))
                            }
                        </div>
                    </div>
                }

                <Row>
                    <Col>
                        { 
                            board != undefined &&
                            <>
                            <h6 className="main-color">{board.region}</h6>
                            <div>
                                <h1>{board.boardId}</h1>
                            </div>
                            <div className="mb-4">
                                {board.userDTO.name}[{board.userDTO.userId}] - {board.regDate}
                            </div>
                            <div>
                                <p className="contents">
                                {board.contents}
                                </p>
                            </div>                            
                            </>

                        }

                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="gap-2 d-flex justify-content-end">
                            <Button variant="outline-secondary" onClick={()=> list()}>목록</Button>
                            <Button variant="outline-success" onClick={()=> modify(board.boardId)}>수정</Button>
                        </div>                                        
                    </Col>
                </Row>

            </Container>
        </>
    )        

};

export async function getServerSideProps(context){

    try{
        let {boardId} = context.query;

        const url = 'http://localhost:8080/board/'+boardId;
        const res = await fetch(url);
        const data = await res.json();

        console.log("서버단");
        console.log(data);

        return {props:{data}}
    }catch(error){
        return {props:{data:{code:'F500', message:'서버와 연결되지 않았습니다.'}}};
    }

}

export default Index;