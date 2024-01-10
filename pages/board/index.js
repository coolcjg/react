import {useState} from 'react';
import Header from "../components/header";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Pagination from 'react-bootstrap/Pagination'
import {useRouter} from 'next/router'
import {getCookie, deleteCookie } from 'cookies-next'
import Link from 'next/link';
import {Calendar} from 'react-date-range'
import { DateRange  } from 'react-date-range';
import { format } from "date-fns"
import CloseButton from 'react-bootstrap/CloseButton';

import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

const Index = ({data}) => {

    const router = useRouter(); 

    const [pageNumber, setPageNumber] = useState(data.pageNumber);
    const [totalPage, setTotalPage] = useState(data.totalPage);
    const [boardList, setBoardList] = useState(data.boardList);

    const [pagination, setPagination] = useState(data.pagination);

    const [checkedId, setCheckedId] = useState([]);

    const [searchParam, setSearchParam] = useState({searchType:"all", searchText:""});
    
    const [showCalendar, setShowCalendar] = useState(false);

    function checkAll(e){
        if(e.target.checked){
            const idArray = [];
            data.boardList.forEach((el) => idArray.push(el.boardId));
            setCheckedId(idArray);
        }else{
            setCheckedId([]);
        }
    }
    
    function check(id){

        const isChecked = checkedId.includes(id);

        if(isChecked){
            setCheckedId((prev) => prev.filter((el) => el !== id));
        }else{
            setCheckedId((prev) => [...prev, id]);
        }
    }

    function goWrite(){

        const id = getCookie("id");
        
        if(id === undefined){
            router.push("/login");
        }else{
            router.push("/board/write");
        }

    }

    async function search(){
        
        try{
            const param = 'searchType=' + searchParam.searchType + '&searchText=' + searchParam.searchText;
            const res = await fetch('http://localhost:8080/board/list?' + param);
            const data = await res.json();

            setPageNumber(data.pageNumber);
            setTotalPage(data.totalPage);
            setBoardList(data.boardList);
            setPagination(data.pagination);

        }catch(error){
            alert('서버 응답이 없습니다.');
        }

    }

    async function goList(pageNumber){

        try{
            const param = 'pageNumber=' + pageNumber + '&searchType=' + searchParam.searchType + '&searchText=' + searchParam.searchText;
            const res = await fetch('http://localhost:8080/board/list?' + param);
            const data = await res.json();

            setPageNumber(data.pageNumber);
            setTotalPage(data.totalPage);
            setBoardList(data.boardList);
            setPagination(data.pagination);

        }catch(error){
            alert('서버 응답이 없습니다.');
        }        

    }

    function changeSearchType(e){
        setSearchParam({...searchParam, searchType:e.target.value});
        setShowCalendar(e.target.value === 'regDate');
        
    }    

    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }  
    ])

    function changeDate(item){
        setState([item.selection]);
        const dateRangeText = format(item.selection.startDate, "yyyy-MM-dd") + "~" + format(item.selection.endDate, "yyyy-MM-dd");
        setSearchParam({...searchParam, searchText:dateRangeText});
    }

    function searchFocus(){
        if(searchParam.searchType === 'regDate'){
            setShowCalendar(true);
        }
    }

    if(data.code == 200){

        return (
            <>
                <Header></Header>

                <Container fluid="md" className="mt-4 mb-4">

                    <Row>
                        <Col>
                            <div>{pageNumber}/{totalPage}페이지</div>  
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div className="p-relative">
                                <div className="boardTable">
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                            <th style={{width:"0%"}}><Form.Check checked = {data.boardList.length == checkedId.length ? true : false} onChange={e => checkAll(e)}/></th>
                                            <th style={{width:"30%"}} className="text-center">제목</th>
                                            <th style={{width:"5%"}} className="text-center">지역</th>
                                            <th style={{width:"10%"}} className="text-center">작성자</th>
                                            <th style={{width:"10%"}} className="text-center">날짜</th>
                                            <th style={{width:"5%"}} className="text-center">조회수</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {boardList.length > 0 && boardList.map((board, index) =>(
                                                <tr key = {index}>
                                                <td><Form.Check value={board.boardId} checked={checkedId.includes(board.boardId) ? true : false} onChange={(e)=>check(board.boardId)}/></td>
                                                <td><Link style={{ textDecoration: 'none' }} href={"/board/" + board.boardId}>{board.title}</Link></td>
                                                <td>{board.region}</td>
                                                <td className="text-center">{board.userDTO.userId}</td>
                                                <td className="text-center">{board.regDate}</td>
                                                <td className="text-center">{board.view}</td>
                                                </tr>
                                            ))
                                            }
                                            {boardList.length == 0 &&
                                                <tr>
                                                    <td className="td-empty text-center" colSpan={6}>검색 결과가 없습니다.</td>
                                                </tr>
                                            }

                                        </tbody>    
                                    </Table>
                                </div>

                                <div className={"searchCalendar  justify-content-center " + (showCalendar ? "" : "d-none")}>
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


                            <div className="justify-content-center mb-3 search-wrap">
                                <div>
                                    <Form.Select value={searchParam.searchType} onChange={(e)=>changeSearchType(e)}>
                                        <option value="all">전체</option>
                                        <option value="title">제목</option>
                                        <option value="region">지역</option>
                                        <option value="userId">작성자</option>
                                        <option value="regDate">날짜</option>
                                    </Form.Select>
                                </div>
                                
                                <div className="">
                                    <Form.Group className="searchText">
                                        <Form.Control type="text" placeholder="검색어" value={searchParam.searchText} onFocus={(e) => searchFocus()} onChange={(e) => setSearchParam({...searchParam, searchText:e.target.value})}/>
                                    </Form.Group>                                
                                </div>

                                <div>
                                    <Button variant="outline-secondary" onClick={()=> search()}>검색</Button>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center">
                                <Pagination>
                                    {
                                        pageNumber >= 2 &&
                                        <>
                                        <Pagination.First onClick={(e)=>goList(1)}/>
                                        <Pagination.Prev onClick={(e)=>goList(pageNumber-1)}/>
                                        </>
                                    }

                                    {
                                        pagination.map((page, index) =>(
                                            <Pagination.Item key={page} active={page == pageNumber} onClick={(e) =>goList(page)}>{page}</Pagination.Item>
                                        ))    
                                    }

                                    {
                                        pageNumber != totalPage &&
                                        <>
                                            <Pagination.Next onClick={(e)=>goList(pageNumber+1)}/>
                                            <Pagination.Last onClick={(e)=>goList(totalPage)}/>                                    
                                        </>
                                    }

                                </Pagination>
                            </div>

                            <div className="gap-2 d-flex justify-content-end">
                                <Button variant="outline-danger">삭제</Button>
                                <Button variant="outline-primary" onClick={()=> goWrite()}>글쓰기</Button>
                            </div>

                        </Col>
                    </Row>

                </Container>
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

    try{
       
        let {pageNumber} = context.query;

        if(pageNumber == null){
            pageNumber = 1;
        }

        const res = await fetch('http://localhost:8080/board/list?pageNumber='+pageNumber);
        const data = await res.json();

        return {props:{data}}
    }catch(error){
        return {props:{data:{code:'F500', message:'서버와 연결되지 않았습니다.'}}};
    }

    
}


export default Index;