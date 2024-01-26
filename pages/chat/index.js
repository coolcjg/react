import Header from "../components/header";

const Index = ({}) => {

    return (
        <>
            <Header></Header>

                <div className="chatDiv">
                    <div className="chatTitle">
                        <p>방제목<span>90명</span></p>
                    </div>

                    <div className="chatBody">
                        <div>

                        </div>
                    </div>

                    <div className="chatInput">
                        <div className="messageDiv" contenteditable="true">
                        </div>
                        <div className="sendDiv">
                            <button>입력</button>
                        </div>
                    </div>



                </div>

        </>

    )

}

export default Index;