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

            <Container className="mt-4 mb-4">
                {board.mediaDTOList.length > 0 &&                    
                    <div className="mb-5">
                        <div className="mediaOut mb-4">
                            <div className="mediaIn">
                                <img className="" src={board.mediaDTOList[1].originalFileUrl}/>
                            </div>
                        </div>

                        <div className="mediaThumbDiv">
                            {
                                board.mediaDTOList.map((media, index) => (
                                    <div key={media.mediaId} className="mediaImgDiv">
                                        {
                                            media.type === 'video' &&
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-film" viewBox="0 0 16 16">
                                                    <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z"/>
                                                </svg>
                                        }
                                        {
                                            media.type === 'audio' &&
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-music-note-beamed" viewBox="0 0 16 16">
                                                <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2"/>
                                                <path fill-rule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z"/>
                                                <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z"/>
                                                </svg>
                                        }
                                        {
                                            media.type === 'image' &&
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-image" viewBox="0 0 16 16">
                                                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12"/>
                                                </svg>
                                        }
                                        {
                                            media.type === 'document' &&
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-file-earmark-text" viewBox="0 0 16 16">
                                                <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
                                                <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                                                </svg>
                                        }
                                        <img className="mediaThumbImg" src={media.thumbImgUrl}/>
                                    </div>
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