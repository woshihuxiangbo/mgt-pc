import MasterApi from '@/common/apis/MasterApi';

let api = new MasterApi('/api/event-coupon/back/m/events/');

/**
 * 新增优惠券
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.addEvents = (params) => {
    return MasterApi.postRequestJSON(`${api.prefix}addEvents`, params, api.jsonContentType);
};

/**
 * 列表
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.eventsList = (params) => {
    return MasterApi.getRequest(`${api.prefix}eventsList`, params);
};

/**
 * 编辑优惠券
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.eventsEdit = (params) => {
    return MasterApi.postRequestJSON(`${api.prefix}eventsEdit`, params, api.jsonContentType);
};

/**
 * 禁用或启用活动
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.eventDel = (params) => {
    return MasterApi.postRequest(`${api.prefix}eventDel`, params);
};

/**
 * 领取记录
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.receiveRecord = (params) => {
    return MasterApi.getRequest(`${api.prefix}receiveRecord`, params);
};

export default api;
