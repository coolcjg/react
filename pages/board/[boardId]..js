import {useState, useEffect} from 'react';
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
import { ListGroup } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import Spinner from 'react-bootstrap/Spinner';

const Index = ({data}) => {

    const backServer = process.env.NEXT_PUBLIC_BACK_SERVER;

    const [id, setId] = useState("");
    const [name, setName] = useState("");    

    useEffect(()=>{
        const id = getCookie("id");
        const name = getCookie("name");

        if(id != undefined){
            setId(id);
            setName(name);
        }

    }, []);

    const router = useRouter();
    const {boardId} = router.query;

    const [board, setBoard] = useState(data.board);
    const [mainMedia, setMainMedia] = useState(data.board.mediaDTOList[0]);

    function list(){
        router.push("/board");
    }

    function modify(boardId){
        router.push("/board/modify/" + boardId);
    }

    async function deleteBoard(){

        if(checkedId.length == 0){
            alert('선택된 게시글이 없습니다.');
            return;
        }

        if(!confirm('삭제하시겠습니까?')){
            return;
        }

        let boardIdArray = "";
        for(let i=0; i<checkedId.length; i++ ){
            if(boardIdArray === ""){
                boardIdArray += checkedId[i];
            }else{
                boardIdArray += ("," + checkedId[i]);
            }
        }

        const bodyParam = {boardIdArray : boardIdArray};        
        const res = await fetch(backServer + "/board", {
            headers :{
                accessToken: getCookie("accessToken")
                ,refreshToken: getCookie("refreshToken")
                ,'Content-Type':'application/json'
            }
            , method:'DELETE'
            ,body : JSON.stringify(bodyParam)
        });

        const data = await res.json();
        if(data.status == 200){
            alert('게시글이 삭제됐습니다.');
            router.reload();
        }
        
    }    

    return (
        <>
            <Header></Header>

            <Container className="mt-4 mb-4">
                {board.mediaDTOList.length > 0 &&                    
                    <div className="mb-5">
                        <div className="mediaOut mb-4">
                            <div className="mediaIn">
                                {
                                    mainMedia.type === 'video' &&
                                        <video controls src={mainMedia.encodingFileUrl}></video>
                                }
                                {
                                    mainMedia.type === 'audio' &&
                                        <audio controls src={mainMedia.encodingFileUrl}></audio>
                                }
                                {
                                    mainMedia.type === 'image' &&
                                        <img src={mainMedia.encodingFileUrl}></img>
                                }   
                                {
                                    mainMedia.type === 'document' &&
                                        <img src={mainMedia.encodingFileUrl}></img>
                                }                                                               
                            </div>
                        </div>

                        <div className="mediaThumbListDiv">
                            {
                                board.mediaDTOList.map((media, index) => (
                                    <div key={media.mediaId} className="mediaImgDiv">
                                        {
                                            media.type === 'video' &&
                                                <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-film" viewBox="0 0 16 16">
                                                    <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z"/>
                                                </svg>
                                                </>
                                        }
                                        {
                                            media.type === 'audio' &&
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-music-note-beamed" viewBox="0 0 16 16">
                                                <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2"/>
                                                <path fillRule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z"/>
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
                                            media.status != 'success' &&
                                            <>
                                                <div className="wrap2">
                                                <Spinner animation="border" role="status" >
                                                <span className="visually-hidden">Loading...</span>
                                                </Spinner>             
                                                </div>                               
                                            </>
                                        }

                                        {
                                            media.status == 'success' &&
                                            <>
                                                <div className="wrap2">
                                                <img  src={media.thumbnailImgUrl} onClick={()=> setMainMedia(media)}/>   
                                                </div>
                                            </>                                            
                                        }
                                        
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
                                <h1>{board.title}</h1>
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
                            {
                                (id != "" && id == board.userDTO.userId) &&
                                <>
                                    <Button variant="outline-success" onClick={()=> modify(board.boardId)}>수정</Button>
                                    <Button variant="outline-danger" onClick={() => deleteBoard()}>삭제</Button>
                                </>
                            }

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