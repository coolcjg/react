import { useSearchParams } from "next/navigation";
import Header from "../components/header";

const Index = ({data}) => {

    console.log("data");
    console.log(data);

    const params = useSearchParams();
    let pageNum = params.get('pageNum');

    if(pageNum === null){
        pageNum = 1;
    }
    if(data.code == 200){

        return (
            <>
                <Header></Header>
                
                <div>{data.pageNumber}/{data.pageSize}페이지</div>

                <div>
                {data.boardList.map((board, index) =>(
                        <div key = {index}>
                            <p >{board.title}</p>
                        </div>            
                    ))
                }
                </div>
            </>
        )        

    }else{
        return (
            <>
                <Header></Header>
                <div>에러 코드 : {data.code}</div>
            </>
        )         

    }

};

export async function getServerSideProps(context){

    try{
        let {pageNumber} = context.query;

        if(pageNumber == null){
            pageNumber = 1;
        }

        const res = await fetch('http://localhost:8080/board/list?pageNumber='+pageNumber);
        const data = await res.json();
        return {props:{data}}
    }catch(error){
        return {props:{data:{code:'F500'}}};
    }

    
}


export default Index;