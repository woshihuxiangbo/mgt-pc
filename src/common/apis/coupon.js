import request from '@/common/request';
import util from '@/common/Util';

let baseUrl = '/api';

export const add = (params) => {
    return request.post(`${baseUrl}/event-coupon/back/m/add`, util.paramsToFormData(params));
};

export const update = (params) => {
    return request.post(`${baseUrl}/event-coupon/back/m/update`, util.paramsToFormData(params));
};

export const deleted = (params) => {
    return request.post(`${baseUrl}/event-coupon/back/m/deleteOrRestore`, util.paramsToFormData(params));
};

export const userEventCouponList = (params) => {
    return request.get(`${baseUrl}/event-coupon/back/m/userEventCouponList`, {params});
};

export const list = (params) => {
    return request.get(`${baseUrl}/event-coupon/back/m/list`, {params});
};

export default {
    add,
    deleted,
    userEventCouponList,
    list,
    update
}
