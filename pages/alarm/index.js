import {useState, useEffect} from 'react';
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

    const backServer = process.env.NEXT_PUBLIC_ALARM_SERVER;
    const travelingServer = process.env.NEXT_PUBLIC_BACK_SERVER;
    const router = useRouter(); 

    const [alarm, setAlarm] = useState([]);
    const [newAlarm, setNewAlarm] = useState();

    const [test, setTest] = useState([]);

    const [id, setId] = useState(getCookie("id"));

    function movePage(link){
        console.log(link);
    }

    function deleteAlarm(e, opinionId){
        //클릭 이벤트 전파 금지
        e.stopPropagation();
        console.log("delete ", opinionId);
    }

    useEffect(() =>{

        if(id != ''){

            list(id);

            const eventSource = new EventSource(backServer + "/sse?userId=" + id);
        
            eventSource.addEventListener("alarm", function(event){           
                const message = JSON.parse(event.data);
    
                if(message.type === '좋아요'){       
                    setNewAlarm(message);
                }
    
            });            
        }

    }, [id])

    useEffect(()=>{
        if(newAlarm != undefined){
            newAlarm["message"] = getAlarmMessage(newAlarm);
            setAlarm(alarm => [newAlarm, ...alarm]);
        }
    }, [newAlarm]);

    async function list(userId){
        try{       
            const res = await fetch(travelingServer + "/alarm/list?userId=" + userId, {
                headers :{
                    accessToken: getCookie("accessToken")
                    ,refreshToken: getCookie("refreshToken")
                }
                , method:'GET'
            });

            const data = await res.json();

            data.list.map((temp, index) => {
                temp["message"] = getAlarmMessage(temp);
            });

            setAlarm(data.list);

        }catch(e){
            console.log(e);
        }        

    }

    function getAlarmMessage(alarm){
        
        let message;

        if(alarm.type === '좋아요'){    
            if(alarm.value === 'Y'){
                message = alarm.alarmId + alarm.fromUserId + '님이 좋아요를 눌렀습니다.';
            }else if(alarm.value ==='N'){
                message = alarm.fromUserId + '님이 싫어요를 눌렀습니다.';
            }
        }
        
        return message;
    }

    return (
        <>
            <Header></Header>

            <div className="alarmFullDiv">
                <div className="alarmFullTitle"><h4>알람{alarm.length}</h4></div>

                {alarm.length > 0 &&
                    alarm.map((alarmOne, index) => (
                        <div key={alarmOne.alarmId} className="alarm">
                            <div className="title">
                                <div>
                                    <span className="type">{alarmOne.type}</span><span className="date">{alarmOne.regDate}</span>
                                </div>
                                <div onClick={e => deleteAlarm(e, alarmOne.opinionId)}>
                                    <svg width="2.2rem" height="2.2rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9 4.5V6H6V7.5H18V6H15V4.5H9ZM6.75 8.25H8.25V17.6893L8.56066 18H15.4393L15.75 17.6893V8.25H17.25V18.3107L16.0607 19.5H7.93934L6.75 18.3107V8.25Z" fill="#080341"/>
                                    </svg>
                                </div>
                            </div>
                            <p>{alarmOne.message}</p>
                        </div>
                    ))
                }

                {alarm.length == 0 &&
                        <div className="alarm">
                        <div className="title">
                            <div>
                                <span className="type">알림이 없습니다.</span>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )        



};

export default Index;