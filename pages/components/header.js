import Link from "next/link"
import "../../app/css/default.css"

const Header = () => {
    return(
        <nav>
            <ul>
                <li>
                    <Link href="/">홈</Link>
                </li>

                <li>
                    <Link href="/board">게시판</Link>
                </li>

                <li>
                    <Link href="/login">로그인</Link>
                </li>

                <li>
                    <Link href="/join">회원가입</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Header;