import { useSearchParams } from "next/navigation";

const Index = ({data}) => {

    console.log("data");
    console.log(data);

    const params = useSearchParams();
    let pageNum = params.get('pageNum');

    if(pageNum === null){
        pageNum = 1;
    }      
    if(data != null){
        return (
            <>
            <div>{data.pageNumber}/{data.pageSize}페이지</div>
            {data.boardList.map((board, index) =>(
                    <div key = {index}>
                        <p >{board.title}</p>
                    </div>            
                ))
            }
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
        console.log("aaa");
        const data = await res.json();
        return {props:{data}}
    }catch(error){
        return {props:{}};
    }

    
}


export default Index;