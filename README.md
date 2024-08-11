관심 기술을 공부하기 위하여 '여행중' 이라는 프로젝트를 구성해보았습니다.

사이트의 서버 구성도입니다.

게시판, 인코딩
- 게시글 관리 및 인코딩 담당.
- 동영상, 오디오, 이미지가 업로드될 경우 Kafka서버로 'encoding'이라는 토픽으로 인코딩 요청 메시지 전달
- 인코더 서버가 'encoding'토픽을 수신하여 FFMPEG, ImageMagick를 사용하여 파일 인코딩하여 DB에 결과 업데이트
- 사용자가 해당 콘텐츠 요청시 서비스
- Kafka 연동 이유 : 인코더 서버가 여러대일 경우 분산목적
- 기술스택 : Java, Spring Boot, Spring Security, MariaDB, Kafka, Redis, JWT, Junit
- https://github.com/coolcjg/board
- https://github.com/coolcjg/encoder

알람
- Server Sent Event기술을 활용, 자바스크립트의 EventSource객체를 이용한 알람 기능 구현.
- 사용자가 게시글에 대한 '좋아요' 버튼을 누를 경우, 서버에서 해당 이벤트를 Redis로 Pub
- 알람서버는 Redis를 바라보고있고, 이벤트를 수신하여 사용자에게 전달한다.
- Redis 연동 이유 : 알람서버가 여러개 구동중일 경우 모든 서버에 이벤트가 가야하므로, Redis의 Pub/Sub모델을 사용.
- 기술스택 : Java, Spring Boot, Redis, Junit
- https://github.com/coolcjg/alarm

채팅
- Websocket, stomp.js를 이용한 채팅기능 구현.
- 채팅 기능을 처음부터 구현하고싶어서 프로젝트를 진행함.
- 현재 접속자 리스트, 강제 퇴장 기능, 채팅 삭제 기능 구현.
- Redis 연동 이유 : 채팅서버가 여러개 구동중일 경우 모든 서버에 이벤트가 가야하므로, Redis의 Pub/Sub모델을 사용.
- 기술스택 : Java, Spring Boot, Redis, Junit
- https://github.com/coolcjg/chat

갤러리
- 동영상, 이미지관련 게시글을 모아서 볼 수 있는 페이지
- 스프링 배치기술을 활용하여 MariaDB에 있는 데이터를 MongoDB로 주기적으로 데이터 이동
- MongoDB에 있는 데이터를 조회하여 동영상, 이미지 데이터를 제공
- 기술스택 : Kotlin, Spring Boot, Spring Batch, JPA, MariaDB, MongoDB, Kotest
- https://github.com/coolcjg/gallery
- https://github.com/coolcjg/gallery_batch 
