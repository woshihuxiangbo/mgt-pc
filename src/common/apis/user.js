/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:15:31
 * @LastEditTime: 2019-08-12 14:05:03
 * @LastEditors: Please set LastEditors
 */
import request from '@/common/request';
import util from '@/common/Util';

let baseUrl = '/api';

/**
 * 获取用户列表
 * @param storeId
 * @param params
 * @returns {*}
 */
export const userBackUserList = (storeId, params) => {
    if (storeId === undefined) {
        util.toSelectStorePage();
    } else {
        return request.get(`${baseUrl}/user/back/m/userList/${storeId}`, {params});
    }
};
/**
 * 获取用户列表(新) storeId丢到了params中
 * @param params
 * @returns {*}
 */
export const getUserList = (params) => {
    return request.get(`${baseUrl}/user/back/m/userList1`, {params});
};
/**
 * 用户禁用启用(新)
 * @param params
 * @returns {*}
 */
export const userDisabled = (params) => {
    return request.get(`${baseUrl}/user/back/m/deleteUser`, {params});
};
/**
 * 获取用户关系
 * @param userId
 * @param params
 * @returns {*}
 */
export const userBackFindUserTeam = (userId, params) => {
    return request.get(`${baseUrl}/user/back/m/findUserTeam/${userId}`, {params});
};
/**
 * 获取用户关系（新）
 * @param userId
 * @param params
 * @returns {*}
 */
export const getUserRelation = (params) => {
    return request.get(`${baseUrl}/user/back/m/getTeamRelation`, {params});
};

/**
 * 更新用户详情
 * @param params
 * @returns {*}
 */
export const userBackUserUpdate = (params) => {
    return request.post(`${baseUrl}/user/back/m/userUpdate`, util.paramsToFormData(params));
};

/**
 * 获取用户详情
 * @param userId
 * @returns {*}
 */
export const getUserInfo = (userId) => {
    return request.get(`${baseUrl}/user/back/m/userInfo/${userId}`);
};

/**
 * 获取用户等级列表
 * @param storeId
 * @returns {*}
 */
export const getUserLevel = (storeId) => {
    return request.get(`${baseUrl}/user/back/m/userLevel/` + storeId);
};

/**
 * 团队关系
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const findUserTeamRelationList = (params) => {
    return request.get(`${baseUrl}/user/back/m/findUserTeamRelationList`, {params});
};

/**
 * 生成小程序码
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const miniProgramQrcode = (params) => {
    request.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return request.post(`${baseUrl}/user/back/m/qrCode`, util.paramsToFormData(params));
};

/**
 * 导出用户列表
 *
 * @param params
 * @param config
 * @returns {AxiosPromise<any>}
 */
export const exportUserList = (params, config = {}) => {
    let reqConfig = {
        responseType: 'blob',
        ...config
    };
    return request.post(`${baseUrl}/user/back/m/exportUserList`, util.paramsToFormData(params), reqConfig);
};


export default {
    userBackUserList,
    getUserList,
    userDisabled,
    userBackFindUserTeam,
    getUserRelation,
    userBackUserUpdate,
    getUserInfo,
    getUserLevel,
    findUserTeamRelationList,
    miniProgramQrcode,
    exportUserList
};
