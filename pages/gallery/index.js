import {useState} from 'react';
import Header from "../components/header";
import {useRouter} from 'next/router'
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

const Index = (res) => {

    console.log('넘어온 res');
    console.log(res);

    const backServer = process.env.NEXT_PUBLIC_GALLERY_SERVER;

    const router = useRouter(); 

    const [pageNumber, setPageNumber] = useState('');
    const [totalPage, setTotalPage] = useState('');
    const [thumbList, setThumbList] = useState('');
    
    const [list, setList] = useState(res.data);
    const [error, setError] = useState(res.error);
    const [loading, setLoading] = useState(false);

    console.log(list);

    if(error == undefined || error == ''){

        return (
            <>
                <Header></Header>

                <div className="contentsDiv">
                    <div className="galleryDiv">

                        {
                            list.map((item, index) =>(
                                <>
                                <div className="item" key={item.galleryId}>
                                    <img src={item.thumbnailFileUrl}></img>
                                </div>
                                </>
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
                <div>{error}</div>
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

export async function getServerSideProps(context){

    const galleryServerDomain = process.env.NEXT_PUBLIC_GALLERY_SERVER_DOMAIN; 

    try{

        if(validParam(context.query)){
            const res = await fetch(galleryServerDomain + '/gallery/list?pageNumber=' + context.query.pageNumber + '&pageSize=' + context.query.pageSize);
            const resJson = await res.json();
            return {props:resJson}            
        }else{
            var obj = new Object();
            obj.error = "paramError"
            return {props:obj}
        }
        
    }catch(error){
        return {props:{data:{code:'500', message:'서버와 연결되지 않았습니다.'}}};
    }
    
}


export default Index;