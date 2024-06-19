import {getCookie, setCookie, deleteCookie } from 'cookies-next'

export function deleteUserCookie(){

    deleteCookie("id");
    deleteCookie("name");
    deleteCookie("auth");
    deleteCookie("accessToken");
    deleteCookie("refreshToken");      
}

export function isAdminAuth(){

    const auth = getCookie("auth");

    if(auth == "admin"){
        return true;
    }else{
        return false;
    }

}