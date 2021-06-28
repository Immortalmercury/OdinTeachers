/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import ClientJS from 'clientjs';
import { AuthHeader, getRefreshToken, setTokens, unsetTokens, getAccessToken } from './JWT';

const secured = false;
const baseRoute = 'http' + (secured ? 's' : '') + '://lara.cr/api';

export const loginRoute = baseRoute + '/auth/login';
export const refreshTokensRoute = baseRoute + '/auth/refresh';
export const logoutRoute = baseRoute + '/auth/logout';
export const defaultRoute = baseRoute + '/data';

/**
 * Call to API with authorization
 * @param {path to api} route 
 * @param {object of params} data 
 * @returns Promise
 */
export const call = async (data) => {
    var headers = await AuthHeader();
    return axios.post(defaultRoute, data, {headers})
    .then((response) => {
        let result = response.data;
        if (result.success) {
            console.log('Successful request to ' + defaultRoute);
        } else {
            console.log('Failed request to ' + defaultRoute);
        }
        console.log({requestParameters:{data,headers},resultData:result});
        return result;
    }, (error) => {
        return {
            success: false,
            state: 'HTTP_EXCEPTION',
            message: error,
        }
    });
}


export const filecall = async (data,filename) => {
    var headers = await AuthHeader();
    return axios.request({
        url: defaultRoute,
        method: 'POST',
        responseType: 'blob',
        encoding: "binary", // Important
        headers,
        data
    })
    .then((response) => {
        // console.log(response);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        if (response.status === 200) {
            return {
                success: true,
                message: "FILE_RECEIVED",
            };
        }else{
            return {
                success: false,
                state: 'EXCEPTION',
                message: response,
            }
        }
        
    })
    .catch((error) => {
        return {
            success: false,
            state: 'HTTP_EXCEPTION',
            message: error,
        }
    });
}

export const login = async (login, password, remember = false) => {
    if (getAccessToken() !== null) await logout();
    var client = new ClientJS();
    return axios.post(loginRoute, {
        login,
        password,
        remember,
        device: client.getBrowser()
    })
    .then((response) => {
        let result = response.data;
        if (result.success && !!result.data.accessToken) {
            setTokens(result.data.accessToken, result.data.accessTokenExpired, result.data.refreshToken);
            // console.log('tokens_setted');
        }
        return result;
    }, (error) => {
        return {
            success: false,
            state: 'HTTP_EXCEPTION',
            message: error,
        }
    });
}

export const logout = async (tokenSessionId = null) => {
    var headers = await AuthHeader();
    var refreshToken = getRefreshToken();
    var client = new ClientJS();

    return axios.post(logoutRoute, {
        refresh: refreshToken,
        tokenSessionId,
        device: client.getBrowser(),
    }, {
        headers
    })
    .then((response) => {
        let result = response.data;
        if (result.success) {
            // console.log('Tokens are deleted, result code = ' + result.status);
            unsetTokens();
        } else {
            if (result.status === 'UNAUTHENTICATED') {
                // console.log('AccessToken was not provided, result code = ' + result.status);
                // console.log('All tokens deleted once again');
                unsetTokens();
            } else if (result.status === 'TOKEN_INVALID') {
                // console.log('AccessToken is invalid, result code = ' + result.status);
                // console.log('All tokens deleted once again');
                unsetTokens();
            } else if (result.status === 'TOKEN_EXPIRED') {
                // console.log('Wow! TOKEN_EXPIRED, I did not think for such posibility. Ok... Let\'s retry');
                return logout(tokenSessionId);
            }
        }
        return result;
    }, (error) => {
        return {
            success: false,
            state: 'HTTP_EXCEPTION',
            message: error,
        }
    });
}

export default {filecall,call,login,logout};