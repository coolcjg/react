import {useState} from 'react';
import Header from "../components/header";
import {useRouter} from 'next/router'
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

const Index = ({data}) => {

    const backServer = process.env.NEXT_PUBLIC_GALLERY_SERVER;

    const router = useRouter(); 

    const [pageNumber, setPageNumber] = useState('');
    const [totalPage, setTotalPage] = useState('');
    const [thumbList, setThumbList] = useState('');

    const [pagination, setPagination] = useState(data.pagination);


    // if(data.code == 200){
    if(true){

        return (
            <>
                <Header></Header>

                <div className="contentsDiv">
                    <div className="galleryDiv">
                        <div className="item">
                            <img src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20160926_278%2Fbluesky77889_1474879540406wepNf_JPEG%2F%25BB%25E7%25BA%25BB_-%25B0%25DC%25BF%25EF14.jpg&type=sc960_832"></img>
                        </div>

                        <div className="item">
                            <img src="https://search.pstatic.net/sunny/?src=https%3A%2F%2Fimg.lovepik.com%2Fphoto%2F20230422%2Fmedium%2Flovepik-winter-calm-mountain-landscape-with-beautiful-frosting-trees-and-footpath-track-photo-image_352438586.jpg&type=sc960_832"></img>
                        </div>

                        <div className="item">
                            <img src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20160926_278%2Fbluesky77889_1474879540406wepNf_JPEG%2F%25BB%25E7%25BA%25BB_-%25B0%25DC%25BF%25EF14.jpg&type=sc960_832"></img>
                        </div>

                        <div className="item">
                            <img src="https://search.pstatic.net/sunny/?src=https%3A%2F%2Fimg.lovepik.com%2Fphoto%2F20230422%2Fmedium%2Flovepik-winter-calm-mountain-landscape-with-beautiful-frosting-trees-and-footpath-track-photo-image_352438586.jpg&type=sc960_832"></img>
                        </div>

                        <div className="item">
                            <img src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20160926_278%2Fbluesky77889_1474879540406wepNf_JPEG%2F%25BB%25E7%25BA%25BB_-%25B0%25DC%25BF%25EF14.jpg&type=sc960_832"></img>
                        </div>

                        <div className="item">
                            <img src="https://search.pstatic.net/sunny/?src=https%3A%2F%2Fimg.lovepik.com%2Fphoto%2F20230422%2Fmedium%2Flovepik-winter-calm-mountain-landscape-with-beautiful-frosting-trees-and-footpath-track-photo-image_352438586.jpg&type=sc960_832"></img>
                        </div>

                        <div className="item">
                            <img src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20160926_278%2Fbluesky77889_1474879540406wepNf_JPEG%2F%25BB%25E7%25BA%25BB_-%25B0%25DC%25BF%25EF14.jpg&type=sc960_832"></img>
                        </div>

                        <div className="item">
                            <img src="https://search.pstatic.net/sunny/?src=https%3A%2F%2Fimg.lovepik.com%2Fphoto%2F20230422%2Fmedium%2Flovepik-winter-calm-mountain-landscape-with-beautiful-frosting-trees-and-footpath-track-photo-image_352438586.jpg&type=sc960_832"></img>
                        </div>

                        <div className="item">
                            <img src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20160926_278%2Fbluesky77889_1474879540406wepNf_JPEG%2F%25BB%25E7%25BA%25BB_-%25B0%25DC%25BF%25EF14.jpg&type=sc960_832"></img>
                        </div>

                        <div className="item">
                            <img src="https://search.pstatic.net/sunny/?src=https%3A%2F%2Fimg.lovepik.com%2Fphoto%2F20230422%2Fmedium%2Flovepik-winter-calm-mountain-landscape-with-beautiful-frosting-trees-and-footpath-track-photo-image_352438586.jpg&type=sc960_832"></img>
                        </div>

                      
                    </div>

                    <div className="borderDiv">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>  

                </div>
            </>
        )        

    } else {
        return (
            <>
                <Header></Header>
                <div>{data.message}</div>
            </>
        )         

    }

};

export async function getServerSideProps(context){

    const galleryServerDomain = process.env.NEXT_PUBLIC_GALLERY_SERVER_DOMAIN;

    try{
       
        let {pageNumber} = context.query;

        if(pageNumber == null){
            pageNumber = 1;
        }

        const res = await fetch(backServer + '/gallery/list?pageNumber='+pageNumber + '&pageSize=50');
        const data = await res.json();

        return {props:{data}}
    }catch(error){
        return {props:{data:{code:'500', message:'서버와 연결되지 않았습니다.'}}};
    }

    
}


export default Index;