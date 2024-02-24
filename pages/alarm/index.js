import {useState, useEffect} from 'react';
import Header from "../components/header";
import {useRouter} from 'next/router'
import {getCookie} from 'cookies-next'

import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 

const Index = () => {

    const backServer = process.env.NEXT_PUBLIC_ALARM_SERVER;
    const travelingServer = process.env.NEXT_PUBLIC_BACK_SERVER;
    const router = useRouter(); 

    const [alarm, setAlarm] = useState([]);
    const [count, setCount] = useState(0);
    const [newAlarm, setNewAlarm] = useState();
    const [id, setId] = useState(getCookie("id"));

    async function checkAlarm(alarmParam){

        try{
            const res = await fetch(travelingServer + "/alarm/check/" + alarmParam.alarmId, {
                headers :{
                    accessToken: getCookie("accessToken")
                    ,refreshToken: getCookie("refreshToken")
                }
                , method:'PUT'
            });

            const data = await res.json();

            if(data.code == 200){

                const newAlarm = alarm.map((e, index) =>{
                    if(e.alarmId == alarmParam.alarmId){
                        e.checked = "Y";
                    }
                    return e;
                });
                
                setAlarm(newAlarm);

                if(confirm('해당 페이지로 이동하시겠습니까?')){
                    moveAlarmPage(alarmParam.boardId);
                }
            }else{
                console.error('serverError :  code : ' +  data.code + ', message : ' + data.message);
            }

        }catch(e){
            console.error(e);
        }
    }

    function moveAlarmPage(boardId){
        router.push('/board/' + boardId);
    }

    async function deleteAlarm(e, alarmId){

        //클릭 이벤트 전파 금지
        e.stopPropagation();

        try{

            const res = await fetch(travelingServer + "/alarm/" + alarmId, {
                headers :{
                    accessToken: getCookie("accessToken")
                    ,refreshToken: getCookie("refreshToken")
                }
                , method:'DELETE'
            });

            if(res.ok === true){
                const data = await res.json();
            
                if(data.code == 200){
                    list(id);
                }else{
                    console.error('serverError :  code : ' +  data.code + ', message : ' + data.message);
                }                
            }

        }catch(e){
            console.error(e);
        }         

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
            if(alarm.length >= 10){
                let copiedAlarm = alarm;
                copiedAlarm.pop();
                copiedAlarm.splice(0,0,newAlarm);
                setAlarm(copiedAlarm);
            }else{
                setAlarm(alarm => [newAlarm, ...alarm]);
            }
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

            if(data.code == 200){
                data.list.map((temp, index) => {
                    temp["message"] = getAlarmMessage(temp);
                });

                setAlarm(data.list);
                setCount(data.count);
            }else{
                console.error('serverError :  code : ' +  data.code + ', message : ' + data.message);
            }

        }catch(e){
            console.error(e);
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
                <div className="alarmFullTitle"><h4>알람{count}</h4></div>

                {alarm.length > 0 &&
                    alarm.map((alarmOne, index) => (
                        <div key={alarmOne.alarmId} className={"alarm" + (alarmOne.checked != "Y" ? " notCheck" : "")} onClick={e => checkAlarm(alarmOne)}>
                            <div className="title">
                                <div>
                                    <span className="type">{alarmOne.type}</span><span className="date">{alarmOne.regDate}</span>
                                </div>
                                <div onClick={e => deleteAlarm(e, alarmOne.alarmId)}>
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