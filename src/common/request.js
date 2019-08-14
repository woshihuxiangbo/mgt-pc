import axios from 'axios';
import {Message} from 'element-ui';
import store from '@/store/index';
import authApi from '@/common/apis/auth';
import util from '@/common/Util';
import router from '@/router/router';

/**
 *
 * @type {AxiosInstance}
 */
let instance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

instance.interceptors.request.use((config) => {
    try {
        let now = parseInt(new Date().getTime() / 1000);
        if (store.getters.loginState && !window.isLoadToken) {
            let tokenExp = store.getters.tokenExp;

            let nowTime = now + 3600;
            if (tokenExp < now) {
                Message.warning('token 已过期');
            } else if (tokenExp < nowTime ) {
                window.isLoadToken = true;
                authApi.refreshToken().then(res => {
                    util.handelHttpResponseResult(res, false, '', false).then(({data}) => {
                        try {
                            store.dispatch('loginThenSetToken', data.managerToken).then(data => {
                                data.details.access = JSON.parse(data.details.access);
                                store.dispatch('setUserDataInfo', data).then();
                            }).catch((e) => {
                                console.error(e);
                            });
                        } catch (e) {
                            console.error(e);
                        }
                    });
                }).finally(() => window.isLoadToken = false);
            }
        }

    } catch (e) {
        console.error(e);
    }
    return config;
}, error => {
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
        if (response.data.error) {
            Message.error(response.data.error);
            return Promise.reject(response.data.error);
        }
        try {
            if (response.data.code === 401) {
                Message.error('验证失败');
                setTimeout(() => {
                    router.replace({name: 'sign'});
                }, 1000);
                return Promise.reject(response.data.msg);
            }
        } catch (e) {
        }
        return response;
    }, (error) => {
        try {
            if (error.response.status) {
                switch (error.response.status) {
                    case 401:
                        Message.error('验证失败');
                        router.push({name: 'sign'});
                        return;
                    case 404:
                        Message.error('请求的资源不存在');
                        break;
                    case 405:
                        Message.error('请求的方法不允许');
                        break;
                    case 500:
                        Message.error('系统错误');
                        break;
                    default:
                        Message.error(error.response.status + '错误');
                }
            } else {
                Message.error('未知错误');
            }
        } catch (e) {
            Message.error('未知错误');
        }
        return Promise.reject(error);
    }
);

/**
 * @type {AxiosInstance}
 */
export default instance;
