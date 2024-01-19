import {getCookie, setCookie, deleteCookie } from 'cookies-next'

export function deleteUserCookie(){
    console.log("정보 삭제");

    deleteCookie("id");
    deleteCookie("name");
    deleteCookie("accessToken");
    deleteCookie("refreshToken");      
}