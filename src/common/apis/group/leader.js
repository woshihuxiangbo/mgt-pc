import request from '@/common/request';
import Util from '@/common/Util';

let baseUrl = '/api/user/back/m/leader/';

/**
 * 获取店铺信息
 * @returns {AxiosPromise<any>}
 */
export const getOne = () => {
    return request.get(`${baseUrl}getOne`);
};

/**
 * 店铺修改
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const updateStore = (params) => {
    return request.post(`${baseUrl}updateStore`, params, {headers: {'Content-Type': 'application/json'}});
};

/**
 * 店铺街列表
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const getLeaderList = (params) => {
    return request.post(`${baseUrl}getLeaderList`, params, {headers: {'Content-Type': 'application/json'}});
};

/**
 * 店铺街转移
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const updateLeader = (params) => {
    return request.get(`${baseUrl}updateLeader`, {params});
};

/**
 * 上架下架
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const changeLeaderRelation = (params) => {
    return request.get(`${baseUrl}changeLeaderRelation`, {params});
};

/**
 * 店铺街列表
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const getLeaderListSpecial = (params) => {
    return request.post(`${baseUrl}getLeaderListSpecial`, params, {headers: {'Content-Type': 'application/json'}});
};

export default {
    getOne,
    updateStore,
    getLeaderList,
    updateLeader,
    changeLeaderRelation,
    getLeaderListSpecial
};
