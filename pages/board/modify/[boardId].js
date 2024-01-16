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



const Index = ({data}) => {

    console.log("data-----");
    console.log(data);

    const backServer = process.env.NEXT_PUBLIC_BACK_SERVER;

    const router = useRouter();

    const [boardId, setBoardId] = useState(data.board.boardId);
    const [title, setTitle] = useState(data.board.title);
    const [region, setRegion] = useState(data.board.region);
    const [contents, setContents] = useState(data.board.contents);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [board, setBoard] = useState(data.board);

    function fileChange(e){

        if(e.target.files){
            setFiles(e.target.files);
        }

    }

    function list(){
        router.push("/board");
    }

    async function modify(){

        setUploading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("region", region);
        formData.append("contents", contents);
        
        for(let i=0; i<files.length; i++){
            formData.append("files", files[i]);
        }
        
        try{       
            const res = await fetch(backServer + "/board", {
                headers :{
                    accessToken: getCookie("accessToken")
                    ,refreshToken: getCookie("refreshToken")
                }
                , method:'PATCH'
                ,body : formData
            });

            const data = await res.json();

            if(res.ok === true){
                alert("게시물이 수정되었습니다");
                router.push("/board/" + boardId);
            }else{

                if(data.message === "ExpiredJwtException"){
                    console.log("ExpiredJwtException 체크");
                    getAccessTokenByRefreshToken();
                }else{
                    alert('게시글 수정이 실패했습니다.');
                    setUploading(false);   
                }
            }

        }catch(error){
            console.log(error);
            alert('서버응답이 없습니다.');
            setUploading(false);
        }
    }

    async function deleteMedia(mediaId){
        console.log(mediaId);

        console.log(board.mediaDTOList);
        const newMediaList = board.mediaDTOList.filter(media => media.mediaId != mediaId)
        console.log(newMediaList);                   
        
        setBoard({...board, mediaDTOList:newMediaList});
        console.log(board);

        /*
        try{       
            const res = await fetch(backServer + "/board" + mediaId, {
                headers :{
                    accessToken: getCookie("accessToken")
                    ,refreshToken: getCookie("refreshToken")
                }
                , method:'DELETE'
            });

            const data = await res.json();

            if(res.ok === true){
                alert("미디어가 삭제되었습니다");

                console.log(board.mediaDTOList);
                const newMediaList = board.mediaDTOList.filter(media => media.mediaId != mediaId)
                console.log(newMediaList);                   

                setBoard(...board, {mediaDTOList:newMediaList});

            }else{
                if(data.message === "ExpiredJwtException"){
                    console.log("ExpiredJwtException 체크");
                    alert('다시 로그인해주세요.');
                }else{
                    alert('게시글 수정이 실패했습니다.');
                }
            }

        }catch(error){
            console.log(error);
            alert('서버응답이 없습니다.');
        }    
        */


    }

    async function getAccessTokenByRefreshToken(){

        console.log("getAccessTokenByRefreshToken");

        try{       
            const res = await fetch(backServer + "/jwt/accessToken", {
                headers :{
                    refreshToken: getCookie("refreshToken")
                }
                , method:'GET'
            });

            const data = await res.json();

            if(data.status == 200){
                setCookie("accessToken", data.accessToken);
                write();
            }else{
                alert('로그인이 만료됐습니다.');
                router.push("/login");                
            }

        }catch(error){
            if(data.status == 401){
                alert('서버응답이 없습니다.');
            }
        }
    }

    return(
        <>
        <Header></Header>

        <Container>

            <Form className="mt-5" method="post">
                <Form.Group as={Row} className="mb-3" controlId="title">
                    <Form.Label column sm={2}>
                        제목
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" placeholder="제목" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="region">
                    <Form.Label column sm={2}>
                        지역
                    </Form.Label>
                    <Col sm={10}>
                    <Form.Select aria-label="" value={region} onChange={(e) => setRegion(e.target.value)}>
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
                                        <a href="#" onClick={()=> deleteMedia(media.mediaId)} className="btn btn-primary btn-sm">삭제</a>
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
                        <Form.Control as="textarea" row={6} rows={8} value={contents} onChange={(e) => setContents(e.target.value)}/>
                    </Col>
                </Form.Group>

            </Form>

            <div className="gap-2 d-flex justify-content-end">
                <Button onClick={()=> list()}>목록</Button>
                <Button variant="outline-primary" disabled={uploading} onClick={()=> write()}>등록</Button>
            </div>

        </Container>
        </>
    )

}

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


