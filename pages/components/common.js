import {getCookie, setCookie, deleteCookie } from 'cookies-next'

export function deleteUserCookie(){

    deleteCookie("id");
    deleteCookie("name");
    deleteCookie("accessToken");
    deleteCookie("refreshToken");      
}