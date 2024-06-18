import {useState, useEffect} from 'react';
import Header from "../components/header";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import {useRouter} from 'next/router'
import {getCookie} from 'cookies-next'

import Spinner from 'react-bootstrap/Spinner';

const Index = ({data}) => {

    const boardServerDomain = process.env.NEXT_PUBLIC_BOARD_SERVER_DOMAIN;

    const router = useRouter();
    const {boardId} = router.query;

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [board,setBoard] = useState(data.board);
    const [mainMedia, setMainMedia] = useState(data.board != undefined ? data.board.mediaDTOList[0] : null);
    const [opinion, setOpinion] = useState(""); // 기본 : "", 좋아요 : 'Y', 싫어요 : 'N'

    useEffect(()=>{
        const id = getCookie("id");
        const name = getCookie("name");

        if(id != undefined){
            setId(id);
            setName(name);
            getUserOpinion(id);
        }

    }, []);    

    function list(){
        router.push("/board");
    }

    function modify(boardId){
        router.push("/board/modify/" + boardId);
    }

    async function deleteBoard(boardId){

        if(!confirm('삭제하시겠습니까?')){
            return;
        }

        const bodyParam = {boardIdArray : boardId};        
        const res = await fetch(boardServerDomain + "/board", {
            headers :{
                accessToken: getCookie("accessToken")
                ,refreshToken: getCookie("refreshToken")
                ,'Content-Type':'application/json'
            }
            , method:'DELETE'
            ,body : JSON.stringify(bodyParam)
        });

        const data = await res.json();

        if(data.message === "success"){
            alert('게시글이 삭제됐습니다.');
            router.push("/board");
        }else if(data.code == 401){
            alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
            router.push('/login');
        }else{
            alert('서버 에러가 발생했습니다.');
        }
        
    }

    async function opinionEvent(param){

        if(id === ""){
            alert('로그인이 필요합니다.');
            return;
        }

        let method;
        if(opinion === param){
            param = ''
            method = 'DELETE'
        }else{
            method = 'POST'
        }

        const bodyParam = {boardId: boardId, userId : id, value:param, type:"like"};        
        const res = await fetch(boardServerDomain + "/board/opinion", {
            headers :{
                accessToken: getCookie("accessToken")
                ,refreshToken: getCookie("refreshToken")
                ,'Content-Type':'application/json'
            }
            , method:method
            ,body : JSON.stringify(bodyParam)
        });

        const data = await res.json();

        if(data.message === "success"){
            setOpinion(param);
        }else if(data.code == 401){
            alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
            router.push('/login');
        }else{
            alert('서버 에러가 발생했습니다.');
        }

    }

    async function getUserOpinion(userId){

        const bodyParam = {boardId: boardId, userId : userId};
        const res = await fetch(boardServerDomain + "/board/userOpinion", {
            headers :{
                accessToken: getCookie("accessToken")
                ,refreshToken: getCookie("refreshToken")
                ,'Content-Type':'application/json'
            }
            , method:'POST'
            ,body : JSON.stringify(bodyParam)
        });

        const data = await res.json();

        if(data.message === "success"){
            setOpinion(data.opinion.value);
        }else{
            alert('서버 에러가 발생했습니다. : ' + data.message);
        }

    }    

    return (
        <>
            <Header></Header>

            <Container className="mt-4 mb-4">
                {
                    board == undefined &&
                    <div className="mb-5">
                        게시글이 존재하지 않습니다.
                    </div>
                }
                {board != undefined && board.mediaDTOList.length > 0 &&                    
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
                            <div className="mb-4 userInfo">
                                <div>
                                {board.userDTO.name}[{board.userDTO.userId}] - {board.regDate}
                                </div>

                                <div className="like" onClick={e => opinionEvent('Y')}>
                                    <svg width="2.4rem" height="2.4rem" viewBox="0 0 24 24" fill={opinion === 'Y' ? "pink":"none"} xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>

                                <div className="dislike" onClick={e => opinionEvent('N')}>
                                    <svg width="2.4rem" height="2.4rem" viewBox="0 0 24 24" fill={opinion === 'N' ? "pink":"none"} xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 14V4M8 14L4 14V4.00002L8 4M8 14L13.1956 20.0615C13.6886 20.6367 14.4642 20.884 15.1992 20.7002L15.2467 20.6883C16.5885 20.3529 17.1929 18.7894 16.4258 17.6387L14 14H18.5604C19.8225 14 20.7691 12.8454 20.5216 11.6078L19.3216 5.60779C19.1346 4.67294 18.3138 4.00002 17.3604 4.00002L8 4" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>

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
                                (id != "" && board != undefined && id == board.userDTO.userId) &&
                                <>
                                    <Button variant="outline-success" onClick={()=> modify(board.boardId)}>수정</Button>
                                    <Button variant="outline-danger" onClick={() => deleteBoard(board.boardId)}>삭제</Button>
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

    const boardServerDomain = process.env.NEXT_PUBLIC_BOARD_SERVER_DOMAIN;

    try{
        let {boardId} = context.query;

        const url = boardServerDomain + '/board/'+boardId;
        const res = await fetch(url);
        const data = await res.json();

        return {props:{data}}
    }catch(error){
        return {props:{data:{code:'F500', message:'서버와 연결되지 않았습니다.'}}};
    }

}

export default Index;