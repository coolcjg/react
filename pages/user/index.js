import {useState, useEffect} from 'react';
import Header from "../components/header";
import { isAdminAuth } from '@/pages/components/common';
import {useRouter} from 'next/router'
import {getCookie, setCookie, deleteCookie } from 'cookies-next'

const Index = () => {

    const [list, setList]  = useState([]);
    const [userIds, setUserIds] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [prevList, setPrevList] = useState("");
    const [nextList, setNextList] = useState("");
    const [pageNumber, setPageNumber] = useState("");
    const [totalPages, setTotalPages] = useState(0);
    const [show, setShow] = useState(false);

    const router = useRouter();
    const boardServerDomain = process.env.NEXT_PUBLIC_BOARD_SERVER_DOMAIN;

    useEffect(()=>{
        console.log("adminAuth : " + isAdminAuth());
        if(isAdminAuth()){
            setShow(true);
            userListRequest(1);
        }else{
            router.push("/error/auth");
        }
    }, [])

    async function userListRequest(pageNumber){

        try{

            setUserIds([]);
            var url = `${boardServerDomain}/user/list?pageNumber=${pageNumber}&pageSize=2`           
            
            const res = await fetch(url, {
                headers :{
                    accessToken: getCookie("accessToken")
                    ,refreshToken: getCookie("refreshToken")
                }
                , method:'GET'
            });

            const resJson = await res.json();

            setList(resJson.data.list);
            setPagination(resJson.data.pagination);
            setPrevList(resJson.data.prevList);
            setNextList(resJson.data.nextList);
            setPageNumber(pageNumber);
            setTotalPages(resJson.data.totalPages);
            
        }catch(error){
            alert('서버 에러 발생');
            console.log(error)
        }          
    }    

    function checkAll(e){
        if(userIds.length != list.length){
            const idArray = [];
            list.forEach((el) => idArray.push(el.userId));
            setUserIds(idArray);
        }else{
            setUserIds([]);
        }
    }
    
    function check(id){
        const isChecked = userIds.includes(id);

        if(isChecked){
            setUserIds((prev) => prev.filter((el) => el !== id));
        }else{
            setUserIds((prev) => [...prev, id]);
        }
    }


    async function deleteUser(){
        if(userIds.length == 0){
            alert('선택된 유저가 없습니다.');
            return;
        }

        const bodyParam = {userIds:  userIds};
        const res = await fetch(boardServerDomain + "/user", {
            headers :{
                accessToken: getCookie("accessToken")
                , refreshToken: getCookie("refreshToken")
                , 'Content-Type':'application/json'
            }
            , method:'DELETE'
            ,body : JSON.stringify(bodyParam)
        });

        const data = await res.json();
        
        if(data.message == "success"){
            alert('유저 삭제가 완료됐습니다.');
            userListRequest(1);
        }
        
    }

    return (

        show &&
        <>
            <Header></Header>
            <div>
                <div className="userListButtonDiv">
                    <button type="button" className="btn btn-outline-danger" onClick={(e) => deleteUser()}>삭제</button>
                </div>

                <div className="tableDiv">

                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={e => checkAll(e)}
                                        checked = {list.length == userIds.length && userIds.length > 0  ? true : false}
                                    />
                                </th>
                                <th scope="col">아이디</th>
                                <th scope="col">이름</th>
                                <th scope="col">권한</th>
                                <th scope="col">등록일</th>
                                <th scope="col">수정일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                list.length > 0  &&
                                
                                list.map((user) =>(
                                    <tr key={user.userId} className="">
                                        
                                        <th scope="row">
                                                <input className="form-check-input" type="checkbox" id="flexCheckDefault" value={user.userId} 
                                                checked={userIds.includes(user.userId) ? true : false} onChange={(e)=>{check(user.userId)}}/>
                                        </th>
                                        <td><a href={"/user/" + user.userId}>{user.userId}</a></td>
                                        <td>{user.name}</td>
                                        <td>{user.auth}</td>
                                        <td>{user.regDate}</td>
                                        <td>{user.modDate}</td>
                                        
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>


                    {
                        list.length > 0 &&
                        <div>
                            <nav aria-label="Page navigation example" >
                                <ul className="pagination justify-content-center">

                                    <li className={"page-item " + (prevList == "" ? "disabled":"")}>
                                        <a className="page-link" href="#" aria-label="Previous" onClick={(e) => userListRequest(1)}>
                                            <span aria-hidden="true">&laquo;</span>
                                        </a>
                                    </li>

                                    <li className={"page-item " + (prevList == "" ? "disabled":"")}>
                                        <a className="page-link" href="#" aria-label="Previous" onClick={(e) => userListRequest(pageNumber-1)}>
                                            <span aria-hidden="true">&lt;</span>
                                        </a>
                                    </li>                                

                                    {
                                        pagination.length > 0 &&
                                            pagination.map((page) => (
                                                <li key={page} className={"page-item " + (page == pageNumber ? "active":"")} onClick={(e) => userListRequest(page)}>
                                                    <a className="page-link" href="#">{page}</a>
                                                </li>
                                            ))
                                    }

                                    <li className={"page-item " + (nextList == "" ? "disabled":"")}>
                                        <a className="page-link" href="#" aria-label="Next" onClick={(e) => userListRequest(pageNumber+1)}>
                                            <span aria-hidden="true">&gt;</span>
                                        </a>
                                    </li>                                

                                    <li className={"page-item " + (nextList == "" ? "disabled":"")}>
                                        <a className="page-link" href="#" aria-label="Next" onClick={(e) => userListRequest(totalPages)}>
                                            <span aria-hidden="true">&raquo;</span>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    }

                </div>
            </div>
        </>
    )
}

export default Index;