import request from '@/common/request';

export const expressCompany = () => {
    return request.get('/api/1/v1/item/m/order/express/company');
};

export const expressInfo = (params) => {
    return request.get('/api/1/v1/express/buy_order/get', {params})
};
// 修改快递发货
export const updateExpressId = (params) => {
    return request.get('/api/order/m/updateExpressId', {params})
};
export default {
    expressCompany,
    expressInfo,
    updateExpressId
}
