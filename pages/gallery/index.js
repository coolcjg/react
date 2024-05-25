import {useState, useEffect, useCallback} from 'react';
import Header from "../components/header";
import {useRouter} from 'next/router'
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

const Index = () => {

    const galleryServerDomain = process.env.NEXT_PUBLIC_GALLERY_SERVER_DOMAIN;

    const router = useRouter(); 

    const [pageNumber, setPageNumber] = useState(0);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastPage, setLastPage] = useState(false);
    
    useEffect(()=>{
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll);
    }, [onScroll])

    useEffect(()=>{
        galleryRequest();
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
            galleryRequest()
        }
    }

    async function galleryRequest(){

        setLoading(true)

        try{

            const nextPage = pageNumber+1
            
            const res = await fetch(galleryServerDomain + '/gallery/list?pageNumber=' + nextPage + '&pageSize=40');
            const resJson = await res.json();

            if(resJson.data.length > 0){

                resJson.data.forEach(function(gallery, index, array){
                    setList(list => [...list, gallery]);
                })

                setPageNumber(nextPage)

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

    if(list.length > 0){

        return (
            <>
                <Header></Header>

                <div className="contentsDiv">
                    <div className="galleryDiv">

                        {
                            list.map((item, index) =>(
                                <div className="item" key={item.galleryId}>
                                    <img src={item.thumbnailFileUrl}></img>
                                </div>
                            ))
                        }
                      
                    </div>

                    <div className={"borderDiv " + ((loading ? "" : "d-none"))}>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>  

                </div>
            </>
        )        

    } else {
        return (
            <>
                <Header></Header>
                <div>자료없음</div>
            </>
        )         

    }

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