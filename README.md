평소 관심 기술을 공부하기 위하여 '여행중' 이라는 프로젝트를 구성해보았습니다.

사이트의 서버  구성도입니다.
![슬라이드1](https://github.com/user-attachments/assets/5d43bed9-e63c-4367-8de4-02cf0d1fd1eb)

서버 구성은 다음과 같습니다.

게시판, 사용자 관리 서버
- 게시글 및 사용자를 관리하는 역할.
- 동영상, 오디오, 이미지가 업로드될 경우 인코딩 서버로 REST API를 호출하여 인코딩 요청을 한다.
- 게시글을 좋아요를 누를 경우 Kafka에 메시지를 발신한다. 이후 알람서버에서 수신할 예정이다.
- 기술스택 : Java, SpringBoot, Spring Security, JPA, MariaDB, JWT, Kafka, Junit
- https://github.com/coolcjg/board


인코더 서버
- 스프링 스케줄러, Ffmpeg, ImageMagicK를 활용하여 동영상, 오디오, 이미지 인코딩작업을 진행
- 게시판 서버로부터 인코딩 요청이 왔을 때 인코딩 작업을 진행하고, 결괏값을 게시판 서버로 REST API를 통하여 전달한다.
- 기술스택 : Java, SpringBoot, JPA, MariaDB, Junit
- https://github.com/coolcjg/encoder


알람 서버
- Server Sent Event기술을 활용, 자바스크립트의 EventSource객체를 이용한 알람 기능 개발.
- 서버에서 Kafka 토픽을 구독하고 있는 상태이다.
- 토픽에 대한 메시지를 수신하면 클라이언트에게 해당 메시지를 전달한다.
- 기술스택 : Java, SpringBoot, JPA, MariaDB, Kafka, Junit
- https://github.com/coolcjg/alarm


채팅 서버
- Websocket, stomp.js를 이용한 채팅기능 개발
- 기술스택 : Java, SpringBoot, Redis, Websocket, Junit
- https://github.com/coolcjg/chat


갤러리 서버
- 동영상, 이미지관련 게시글을 모아서 볼 수 있는 페이지
- MongoDB에 있는 데이터를 조회하여 동영상, 이미지 데이터를 제공해준다.
- 기술스택 : Kotlin, SpringBoot, MongoDB, Kotest
- https://github.com/coolcjg/gallery

 
갤러리 배치 서버
- 스프링 배치기술을 활용하여 MariaDB에 있는 데이터를 MongoDB로 주기적으로 데이터 이동작업을 한다.
- 기술스택 : Kotlin, SpringBoot, JPA, MariaDB, MongoDB, Kotest
- https://github.com/coolcjg/gallery_batch
