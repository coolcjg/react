import {useState} from 'react';
import Header from "../../components/header";
import {getCookie, setCookie, deleteCookie } from 'cookies-next'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import {useRouter} from 'next/router'
import Card from 'react-bootstrap/Card';
import { deleteUserCookie } from '@/common/common.js';

const Index = ({data}) => {

    const boardServerDomain = process.env.NEXT_PUBLIC_BOARD_SERVER_DOMAIN;
    const router = useRouter();

    const [board, setBoard] = useState(data.board);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    function fileChange(e){

        if(e.target.files){
            setFiles(e.target.files);
        }

    }

    function list(){
        router.push("/board");
    }

    async function update(){

        if(board.title.trim() === ''){
            alert('제목을 입력하세요.');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("boardId", board.boardId);
        formData.append("title", board.title);
        formData.append("region", board.region);
        formData.append("contents", board.contents);
        
        for(let i=0; i<files.length; i++){
            formData.append("files", files[i]);
        }
        
        try{       
            const res = await fetch(boardServerDomain + "/board/" + board.boardId, {
                headers :{
                    accessToken: getCookie("accessToken")
                    ,refreshToken: getCookie("refreshToken")
                }
                , method:'PUT'
                ,body : formData
            });

            const data = await res.json();

            if(data.message === "success"){
                alert("게시물이 수정되었습니다");
                router.push("/board/" + board.boardId);
            }else if(data.code === 401){
                console.log("ExpiredJwtException");
                alert('로그인이 만료되었습니다.');
                deleteUserCookie();
                router.push("/login");                
            }else{
                alert('게시글 수정이 실패했습니다.');
                setUploading(false);                   
            };

        }catch(error){
            console.log(error);
            alert('서버응답이 없습니다.');
            setUploading(false);
        }
        
    }

    async function deleteMedia(mediaId){

        if(!confirm('미디어를 삭제하시겠습니까?')){
            return;
        }
        
        try{       
            const res = await fetch(boardServerDomain + "/media/" + mediaId, {
                headers :{
                    accessToken: getCookie("accessToken")
                    ,refreshToken: getCookie("refreshToken")
                }
                , method:'DELETE'
            });

            const data = await res.json();

            if(data.message === "success"){
                alert("미디어가 삭제되었습니다");
                const newMediaList = board.mediaDTOList.filter(media => media.mediaId != mediaId)
                setBoard({...board, mediaDTOList:newMediaList});
            }else{
                if(data.message === "ExpiredJwtException"){
                    console.log("ExpiredJwtException 체크");
                    alert('로그인이 만료되었습니다. 새로운 accessToken을 가져옵니다. 삭제버튼을 다시 눌러주세요');
                    
                }else{
                    alert('게시글 수정이 실패했습니다.');
                }
            }

        }catch(error){
            console.error(error);
            alert('오류가 발생하였습니다.');
        }    
    }

    return(
        <>
        <Header></Header>

        <Container>
            {
                board == undefined &&
                <div>
                    게시글이 존재하지 않습니다.
                </div>
            }
            {
                board != undefined &&
                <>
                    <Form className="mt-5" method="post">
                    <Form.Group as={Row} className="mb-3" controlId="title">
                        <Form.Label column sm={2}>
                            제목
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="text" placeholder="제목" value={board.title} onChange={(e)=>setBoard({...board, title:e.target.value})}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="region">
                        <Form.Label column sm={2}>
                            지역
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Select aria-label="" value={board.region} onChange={(e) => setBoard({...board, region:e.target.value})}>
                            <option>지역을 선택해주세요</option>
                            <option value="서울">서울</option>
                            <option value="인천">인천</option>
                            <option value="경기">경기</option>
                            <option value="강원">강원</option>
                            <option value="충남">충남</option>
                            <option value="충북">충북</option>
                            <option value="세종">세종</option>
                            <option value="대전">대전</option>
                            <option value="전북">전북</option>
                            <option value="전남">전남</option>
                            <option value="광주">광주</option>
                            <option value="경북">경북</option>
                            <option value="경남">경남</option>
                            <option value="대구">대구</option>
                            <option value="울산">울산</option>
                            <option value="부산">부산</option>
                            <option value="제주">제주</option>
                        </Form.Select>                        

                        </Col>
                    </Form.Group>                

                    <Form.Group as={Row} controlId="file" className="mb-3" >
                        <Form.Label column sm={2}>
                            파일
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Control type="file" multiple onChange={(e) => fileChange(e)}/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="attachedFile" className="mb-3" >
                        <Form.Label column sm={2}>
                            첨부파일
                        </Form.Label>
                        <Col sm={10} className="cardDiv">
                            {
                                board.mediaDTOList.map((media, index) =>
                                    <div className="card" key={media.mediaId}>
                                        <div className="cardImgDiv">
                                            <img src={media.thumbnailImgUrl} className="card-img-top"/>
                                        </div>
                                        <div className="card-body">
                                            <p className="card-title">{media.originalFileClientName}</p>
                                            <button type="button" onClick={()=> deleteMedia(media.mediaId)} className="btn btn-primary btn-sm">삭제</button>
                                        </div>
                                    </div>
                                )
                            }                                                       

                        </Col>
                    </Form.Group>                

                    <Form.Group as={Row} className="mb-3" controlId="contents">
                        <Form.Label column sm={2}>
                            내용
                        </Form.Label>
                        
                        <Col sm={10}>
                            <Form.Control as="textarea" row={6} rows={8} value={board.contents} onChange={(e) => setBoard({...board, contents:e.target.value})}/>
                        </Col>
                    </Form.Group>

                    </Form>
                </>

            }

            <div className="gap-2 d-flex justify-content-end">
                <Button onClick={()=> list()}>목록</Button>
                <Button variant="outline-primary" disabled={uploading} onClick={()=> update()}>수정</Button>
            </div>

        </Container>
        </>
    )

}

export async function getServerSideProps(context){

    const boardServerDomain = process.env.NEXT_PUBLIC_BOARD_SERVER_DOMAIN;

    try{
        let {boardId} = context.query;

        const url = boardServerDomain + '/board/' + boardId;
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


