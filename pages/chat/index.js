import Header from "../components/header";
import {useState, useRef } from 'react';
import {Client} from '@stomp/stompjs'

const Index = ({}) => {

    const [roomId, setRoomId] = useState('');
    const [userId, setUserId] = useState('');
    const [chatList, setChatList] = useState([
        /*
        {type:'enter', userId:'coolcjg', message:'', time:'15:00'},
        {type:'enter', userId:'testUser', message:'', time:'15:01'},
        {type:'enter', userId:'testUser2', message:'', time:'15:02'},
        {type:'exit', userId:'testUser2', message:'', time:'15:03'},
        {type:'message', userId:'coolcjg', message:'아무말이나 하자11', time:'16:00'},
        {type:'message', userId:'testUser', message:'아무말이나 하자22', time:'16:01'},
        {type:'message', userId:'testUser', message:'아무말이나 하자33', time:'16:02'},
        {type:'quit', userId:'', message:'', time:'16:02'},
        */
    ]);
    const [message, setMessage] = useState('');

    let [client, setClient] = useState(null);

    const [authCheck, setAuthCheck] = useState(false);

    const [userCount, setUserCount] = useState(0);


    async function initChat(){

        if(roomId === ''){
            alert('방 이름을 입력하세요');
            return;
        }

        if(userId === ''){
            alert('이름을 입력하세요');
            return;
        }
        
        try{   
            const url = 'http://localhost:8100/isMember?roomId=' + roomId + "&userId=" + userId;
            const res = await fetch(url);
            const data = await res.json();

            if(data.code != 200){
                alert('동일한 접속자가 있습니다.');
                return;
            }
    
        }catch(error){
            alert('서버 오류가 발생하였습니다.');
            return;
        }   

        const newClient = new Client({
            brokerURL : 'ws://localhost:8100/ws',
            connectHeaders: {
                userId: userId,
                roomId : roomId,
            },            
        });

        newClient.onConnect = function(){
            newClient.subscribe('/sub/chat/room/' + roomId, receiveMessage);
            newClient.publish({destination:'/pub/chat/message', body:JSON.stringify({userId : userId, roomId:roomId, type:"enter", message:""})});
        }        
    
        newClient.activate();

        setClient(newClient);
    }

    function receiveMessage(message){
        console.log("message");
        console.log(message);

        const messageBody = JSON.parse(message.body);
        setChatList(chatList => [...chatList, messageBody]);

        if(messageBody.type === 'enter' || messageBody.type ==='exit'){
            setUserCount(messageBody.userCount);
        }
    };
    
    function sendMessage(){

        if(client == null){
            alert('채팅방에 접속해주세요.');
            return;
        }

        if(message === ''){
            alert('메시지를 입력해주세요.');
            return;
        }

        client.publish({destination:'/pub/chat/message', body:JSON.stringify({userId : userId, roomId:roomId, type:"message", message:message})});
        setMessage('');
    }

    function toggleDeleteDiv(){
        console.log("aaa");
    }

    const messageDiv = useRef();
    
    return (
        <>
            <Header></Header>

                <div className="chatDiv">
                    <div className="chatTitle">
                        <p>채팅방<span>{userCount}명</span></p>
                        <input id="roomId" type="text" onChange={(e) => setRoomId(e.target.value)}/>
                        <input id="userId" type="text" onChange={(e) => setUserId(e.target.value)}/>
                        관리자모드<input type="checkbox" checked={authCheck} onChange={(e) => setAuthCheck(e.target.checked)}/>
                        <button type="button" onClick={()=>initChat()}>채팅방 입장</button>
                    </div>

                    <div className="chatBody">
                        {
                            chatList.length == 0 &&
                            <div className="chat-notice">
                                채팅 내용이 없습니다.
                            </div>                           
                        }

                        {
                            chatList.length > 0 && chatList.map((chat, index) =>{

                                if(chat.type === 'enter'){
                                    return(
                                        <div className="chat-notice" key={index}>
                                            {chat.userId + "님이 접속하였습니다"}
                                            <span>{chat.time}</span>
                                        </div>                                   
                                    )
                                }else if(chat.type === 'exit'){
                                    return(
                                            <div className="chat-notice" key={index}>
                                                {chat.userId + "님이 퇴장하였습니다."}
                                                <span>{chat.time}</span>
                                            </div>                                   
                                        )
                                }else if(chat.type === 'message' ){
                                    if(chat.userId === userId){
                                        return(
                                            <div className="chatMessage chat-me" key={index} onClick={e => toggleDeleteDiv(e)}>
                                                <div className="chat-message-user"><span>{chat.time}</span>{chat.userId}</div>
                                                <div>
                                                {chat.message}
                                                </div>
                                            </div>
                                        )
                                    }else{
                                        return(
                                            <div className="chatMessage chat-other" key={index} onClick={e => toggleDeleteDiv(e)}>
                                                <div className="chat-message-user">{chat.userId}<span>{chat.time}</span></div>
                                                <div>
                                                {chat.message}
                                                </div>
                                            </div>                                            
                                        )

                                    }
                                }else if(chat.type ==='quit'){
                                    return(
                                        <div className="chat-notice" key={index}>
                                            채팅방이 종료되었습니다.
                                        </div>                                          
                                    )
                                }

                            })
                        }

                      
                        
                    </div>

                    <div className="chatInput">
                        <textarea className="messageDiv" ref={messageDiv} value={message} onInput={(e) => setMessage(e.target.value)}/>
                        <div className="sendDiv" onClick={(e) => sendMessage()}>
                            <svg width="3.9rem" height="3.9rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_15_829)">
                            <rect width="24" height="24" fill="white"/>
                            <path d="M19.364 5.05026L3.10051 8.58579L10.8787 13.5355M19.364 5.05026L15.8284 21.3137L10.8787 13.5355M19.364 5.05026L10.8787 13.5355" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_15_829">
                            <rect width="24" height="24" fill="white"/>
                            </clipPath>
                            </defs>
                            </svg>                        
                        </div>
                    </div>



                </div>

        </>

    )

}

export default Index;