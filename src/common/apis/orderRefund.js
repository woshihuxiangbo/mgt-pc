import request from '@/common/request';
import {paramsToFormData} from '@/common/Util';

const baseUrl = '/api/order/m/refund';

/**
 * 零售售后列表
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const refundOrderList = (params) => {
    return request.get(`${baseUrl}/refundOrderList`, {params});
};
export const refundOrderList1 = (params) => {
    return request.get(`${baseUrl}/refundOrderList1`, {params});
};
export const refundrefundDetailsLog = (params) => {
    return request.get(`/api/order/m/refundDetailsLog`, {params});
};
export const getOrderExpress = (params) => {
    return request.get(`/api/order/m/getOrderExpress`, {params});
};

/**
 * 团长售后列表
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const refundGroupOrderList = (params) => {
    return request.get(`${baseUrl}/refundLeaderOrderList`, {params});
};

/**
 * 退款详情
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const refundDetails = (params) => {
    return request.get(`${baseUrl}/refundDetails`, {params});
};

/**
 * 同意
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const consent = (params) => {
    return request.post(`${baseUrl}/consent`, paramsToFormData(params));
};

/**
 * 拒绝
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const refuse = (params) => {
    return request.post(`${baseUrl}/refuse`, paramsToFormData(params));
};

/**
 * 收货
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const verify = (params) => {
    return request.post(`${baseUrl}/verify`, paramsToFormData(params));
};

/**
 * 退款
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const refund = (params) => {
    return request.post(`${baseUrl}/refund`, paramsToFormData(params));
};


export default {
    refundOrderList,
    refundOrderList1,
    refundrefundDetailsLog,
    getOrderExpress,
    refundDetails,
    consent,
    refuse,
    verify,
    refund,
    refundGroupOrderList
};
