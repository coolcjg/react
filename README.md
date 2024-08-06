'여행중' 이라는 싸이트의 프론트엔드 서버입니다.

메뉴는 게시판, 채팅방, 알람, 갤러리, 계정관리 페이지로 나눠져 있습니다.

게시판 메뉴
- 게시글 및 첨부파일 CRUD기능
- 좋아요 기능
- 스프링 스케줄러, Ffmpeg, ImageMagicK를 활용하여 동영상, 오디오, 이미지 인코딩작업을 진행
- https://github.com/coolcjg/board
- https://github.com/coolcjg/encoder

채팅방 메뉴
- Websocket, stomp.js를 이용한 채팅기능 개발
- 현재 접속자 리스트 확인
- https://github.com/coolcjg/chat

알람 메뉴
- Server Sent Event, EventSource객체를 이용한 알람 기능 개발
- 알람 게시글 이동, 알람 삭제기능 개발
- https://github.com/coolcjg/alarm

갤러리 메뉴
- 동영상, 이미지관련 게시글을 모아서 볼 수 있는 페이지
- 스프링 배치기술을 활용하여 MariaDB에 있는 데이터를 MongoDB로 주기적으로 데이터 이동작업을 함.
- https://github.com/coolcjg/gallery
- https://github.com/coolcjg/gallery_batch
 
사용자 메뉴
- 관리자로 로그인하였을 경우 사용자 관리를 할 수 있는 페이지
- https://github.com/coolcjg/board (게시판 서버와 통합)
