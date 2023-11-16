import { useSearchParams } from "next/navigation";

const Index = ({data}) => {

    const params = useSearchParams();
    const pageNum = params.get('pageNum');
    


    return (
        <>
        <div>pageNum = {pageNum}</div>
        {data.map((board, index) =>(
            <div>
                <p>{board.title}</p>
            </div>            
        ))}
        </>
    )
};

export async function getStaticProps(){

    const res = await fetch('http://localhost:8080/board/list?pageNum=1')
    const data = await res.json();

    return {props:{data}}
}


export default Index;