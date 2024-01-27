import Header from "../components/header";
import {useState} from 'react';
import {Client} from '@stomp/stompjs'
import { WebSocket } from "ws";



const Index = ({}) => {

    const [roomId, setRoomId] = useState('traveling');
    const [userId, setUserId] = useState('');
    const [chatList, setChatList] = useState([
        {type:'enter', userId:'coolcjg', message:'', time:'15:00'},
        {type:'enter', userId:'testUser', message:'', time:'15:01'},
        {type:'enter', userId:'testUser2', message:'', time:'15:02'},
        {type:'exit', userId:'testUser2', message:'', time:'15:03'},
        {type:'message', userId:'coolcjg', message:'아무말이나 하자11', time:'16:00'},
        {type:'message', userId:'testUser', message:'아무말이나 하자22', time:'16:01'},
        {type:'message', userId:'testUser', message:'아무말이나 하자33', time:'16:02'},
        {type:'quit', userId:'', message:'', time:'16:02'},
    ]);

    let client = null;

    function initChat() {

        if(userId === ''){
            alert('이름을 입력하세요');
            return;
        }

        client = new Client({
            brokerURL : 'ws://localhost:8100/ws',
            onConnect: () => {
                
                client.subscribe('/sub/chat/room/' + roomId, message =>
                    showChat(message)
                );
                               
                client.publish({destination:'/pub/chat/message', body:JSON.stringify({userId : userId, roomId:roomId, type:"enter", message:""})});
            }
        });
    
        client.activate();
    }

    function showChat(message){
        console.log(message);
        console.log(message.body);
    }

    return (
        <>
            <Header></Header>

                <div className="chatDiv">
                    <div className="chatTitle">
                        <p>방제목<span>90명</span></p>
                        <input id="userId" type="text" onChange={(e) => setUserId(e.target.value)}/>
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
                                        </div>                                   
                                    )
                                }else if(chat.type === 'exit'){
                                    return(
                                            <div className="chat-notice" key={index}>
                                                {chat.userId + "님이 퇴장하였습니다."}
                                            </div>                                   
                                        )
                                }else if(chat.type === 'message' ){
                                    if(chat.userId === userId){
                                        return(
                                            <div className="chat-me" key={index}>
                                                <div className="chat-message-user"><span>{chat.time}</span>{chat.userId}</div>
                                                <div>
                                                {chat.message}
                                                </div>
                                            </div>
                                        )
                                    }else{
                                        return(
                                            <div className="chat-other" key={index}>
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
                        <div className="messageDiv" contentEditable="true">
                        </div>
                        <div className="sendDiv">
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