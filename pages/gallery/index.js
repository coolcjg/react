import {useState, useEffect, useRef} from 'react';
import Header from "../components/header";
import {useRouter} from 'next/router'
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import { DateRange  } from 'react-date-range';
import CloseButton from 'react-bootstrap/CloseButton';
import { format } from "date-fns"

const Index = () => {

    const galleryServerDomain = process.env.NEXT_PUBLIC_GALLERY_SERVER_DOMAIN;
    const boardServerDomain = process.env.NEXT_PUBLIC_BOARD_SERVER_DOMAIN;

    const router = useRouter(); 

    const [pageNumber, setPageNumber] = useState(0);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastPage, setLastPage] = useState(false);
    const [type, setType] = useState('all');
    const [day, setDay] = useState('all');
    const [dateRange, setDateRange] = useState('');

    const [showCalendar, setShowCalendar] = useState(false);
    
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }  
    ])

    useEffect(()=>{
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll);
    }, [onScroll])

    useEffect(()=>{
        galleryRequest(1);
    }, [])

    function  onScroll(){
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        const scrollHeight = document.documentElement.scrollHeight;
        
        if(scrollTop + clientHeight >= scrollHeight-50){
            nextPage();
        }
    }

    function nextPage(){
        if(!lastPage){
            galleryRequest(pageNumber+1)
        }
    }

    async function galleryRequest(pageNumber){

        setLoading(true)

        try{
            
            var url = `${galleryServerDomain}/gallery/list?pageNumber=${pageNumber}&pageSize=40`

            if(type != 'all'){
                url = url + `&type=${type}`
            }

            if(day != ''){
                url = url + `&day=${day}`
            }

            if(day == 'manual'){
                url = url + `&dateRange=${dateRange}`
            }
            
            
            const res = await fetch(url);
            const resJson = await res.json();

            if(resJson.data.length > 0){

                resJson.data.forEach(function(gallery, index, array){
                    setList(list => [...list, gallery]);
                })

                setPageNumber(pageNumber)

                if(resJson.data.length < 40){
                    setLastPage(true)    
                }
            }else{
                setLastPage(true)
            }
            
        }catch(error){
            return {props:{data:{code:'500', message:'서버와 연결되지 않았습니다.'}}};
        }   

        setLoading(false);
       
    }

    const changeType = (e) => {
        setType(e.target.value)
    }

    const changeDay  = (e) => {
        setDay(e.target.value)

        if(e.target.value === 'manual'){
            setShowCalendar(true);
        }else{
            setDateRange('')
        }
    }

    const search = (e) => {
        setList([]);
        setLastPage(false);
        galleryRequest(1);
    }

    function changeDate(item){
        setState([item.selection]);
        const dateRangeText = format(item.selection.startDate, "yyyy-MM-dd") + "~" + format(item.selection.endDate, "yyyy-MM-dd");
        setDateRange(dateRangeText);
    }


    const [mainDisplay, setMainDisplay] = useState(false)

    async function openMainContent(item){

        const res = await fetch(boardServerDomain + '/media/' + item.mediaId);
        const data = await res.json();

        item["title"] = data.data.title;
        item["boardUrl"] = '/board/' + data.data.boardId

        setMainDisplay(true);
        setMainContent(item);

        if(item.type == 'video'){
            mainVideo.current.pause();
            mainVideo.current.setAttribute('src', item.encodingFileUrl)
            mainVideo.current.load();
            mainVideo.current.play();
        }
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            // cleanup
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleResize = () => {
    };

    const mainRef = useRef(null);
    const mainVideo = useRef(null);

    const [mainContent, setMainContent] = useState('');


    const [galleryIds, setGalleryIds] = useState([]);
    
    function check(id){
        const isChecked = galleryIds.includes(id);

        if(isChecked){
            setGalleryIds((prev) => prev.filter((el) => el !== id));
        }else{
            setGalleryIds((prev) => [...prev, id]);
        }
    }   

    const deleteGallery = async () =>{
        if(galleryIds.length == 0){
            alert('선택된 게시물이 없습니다.');
            return;
        }

        const bodyParam = {galleryIds: galleryIds};
        const res = await fetch(galleryServerDomain + "/gallery", {
            headers :{
                /*
                accessToken: getCookie("accessToken")
                ,refreshToken: getCookie("refreshToken")
                */
                'Content-Type':'application/json'
            }
            , method:'DELETE'
            ,body : JSON.stringify(bodyParam)
        });

        const data = await res.json();        

        if(data.message == "success"){
            setGalleryIds((prev) => prev.filter((el) => galleryIds.indexOf(el) == -1))
            setList((prev) => prev.filter((el) => galleryIds.indexOf(el.galleryId) == -1))
        }
        
    }

    function checkAll(e){
        if(galleryIds.length != list.length){
            const idArray = [];
            list.forEach((el) => idArray.push(el.galleryId));
            setGalleryIds(idArray);
        }else{
            setGalleryIds([]);
        }
    }

    return (
        <>
            <Header></Header>

            <div className="contentsDiv">

                <div className="funcDiv">

                    <div className="searchDiv">
                        <select onChange={changeType} value={type}>
                            <option value="all">종류</option>
                            <option value="image">이미지</option>
                            <option value="video">비디오</option>
                        </select>

                        <select onChange={changeDay} value={day}>
                            <option value="all">날짜</option>
                            <option value="day">1일</option>
                            <option value="week">1주</option>
                            <option value="month">1달</option>
                            <option value="year">1년</option>
                            <option value="manual">직접 설정</option>
                        </select>

                        <input type="text" className={day =='manual' ? '' : "d-none"} size="21" value={dateRange} readOnly/>

                        <button type="button" onClick={(e) => search()}>검색</button>

                        <div className={"searchCalendar2  justify-content-center " + (showCalendar ? "" : "d-none")}>
                                    <div className="close">
                                        <CloseButton onClick={()=> setShowCalendar(false)}/>
                                    </div>                                    
                                    <DateRange
                                        editableDateInputs={true}
                                        onChange={(item) => changeDate(item)}
                                        moveRangeOnFirstSelection={false}
                                        ranges={state}
                                    />
                        </div>
                    </div>

                    <div className="buttonDiv">
                        <button type="button" className="btn btn-outline-primary" onClick={(e) => checkAll()}>{galleryIds.length != list.length ? "전체선택" : "전체해제"}</button>
                        <button type="button" className="btn btn-outline-danger" onClick={(e) => deleteGallery()}>삭제</button>
                    </div>

                </div>

                {
                    list.length > 0 && 
                    <div className="galleryDiv">

                            {
                                list.map((item, index) =>(
                                    <div className="item" key={item.galleryId} onClick={(e) => openMainContent(item)}>
                                        <div className="item2">
                                            <div className="form-check" onClick={(e) => {e.stopPropagation()}}>
                                                <input className="form-check-input" type="checkbox" value={item.galleryId} 
                                                    checked={galleryIds.includes(item.galleryId) ? true : false} id="flexCheckDefault"
                                                    onChange={(e)=>{check(item.galleryId)}}/>
                                            </div>
                                            <img src={item.thumbnailFileUrl}></img>
                                        </div>
                                    </div>
                                ))
                            }
                        
                    </div>
                }
                {
                    list.length == 0 && 
                    <div className="galleryDiv">
                        <div>자료없음</div>
                    </div>
                }

                <div className={"mainContent " + (mainDisplay==false ? 'd-none':'')}>
                    <div className="closeDiv">
                        <bottom type="button" className="closeButton btn btn-outline-success" onClick={(e) => setMainDisplay(false)}>닫기</bottom>
                    </div>
                    
                    <div className={"mainVideo " + (mainContent.type == 'video' ? '' : 'd-none')} ref={mainRef}>
                        <video autoPlay  controls ref={mainVideo} type="video/mp4">
                            <source src={mainContent.encodingFileUrl}/>
                        </video>
                    </div>
                    
                    <div className={"mainImage " + (mainContent.type == 'image' ? '' : 'd-none')}>
                        <img src={mainContent.encodingFileUrl}/>
                    </div>
                    
                    
                    <div className="title">
                        <h2 onClick={(e) => router.push(mainContent.boardUrl)}>{mainContent.title}</h2>
                    </div>
                </div>

                <div className={"borderDiv " + ((loading ? "" : "d-none"))}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>  

            </div>
        </>
    )        

    

};

function validParam(query){
    let {pageNumber, pageSize} = query;
    
    if(pageNumber == undefined || pageNumber < 1 || pageSize == undefined || pageSize < 1){
        return false;
    }else{
        return true;
    }    
}

export default Index;