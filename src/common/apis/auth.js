import request from '@/common/request';
import util from '@/common/Util';

let baseUrl = '/api/manager/m';

export const userLogin = (params) => {
    return request.post(`${baseUrl}/manager/login`, util.paramsToFormData(params));
};

export const refreshToken = () => {
    return request.get(`${baseUrl}/manager/getToken`);
};

export const logout = () => {
    return request.post(`${baseUrl}/manager/logout`);
};

export const updateMe = (params) => {
    return request.post(`${baseUrl}/manager/editMe`,util.paramsToFormData(params));
};

export default {
    userLogin,
    refreshToken,
    logout,
    updateMe
}