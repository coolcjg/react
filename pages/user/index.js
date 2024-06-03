import {useState, useEffect, useRef} from 'react';
import Header from "../components/header";

const Index = () => {

    const boardServerDomain = process.env.NEXT_PUBLIC_BOARD_SERVER_DOMAIN;

    useEffect(()=>{
        userListRequest(1);
    }, [])

    async function userListRequest(pageNumber){

        try{
            
            var url = `${boardServerDomain}/user/list?pageNumber=${pageNumber}&pageSize=40`           
            
            const res = await fetch(url);
            const resJson = await res.json();

            if(resJson.data.length > 0){
                resJson.data.forEach(function(gallery, index, array){
                    setList(list => [...list, gallery]);
                });
            }
            
        }catch(error){
            alert('서버 에러 발생');
            
        }          
    }    

    return (
        <>
            <Header></Header>

            <div className="tableDiv">
                <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                    <th scope="col"></th>
                    <th scope="col">아이디</th>
                    <th scope="col">이름</th>
                    <th scope="col">권한</th>
                    <th scope="col">등록일</th>

                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                    </tr>

                    <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@mdo</td>
                    </tr>

                    <tr>
                    <th scope="row">3</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@mdo</td>
                    </tr>
                </tbody>
                </table>                

            </div>
        </>
    )
}

export default Index;