import MasterApi from '@/common/apis/MasterApi';

let api = new MasterApi('/api/order/m/commission');

/**
 * 查询扣除预存款失败订单
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.selectIncomeDeposit = (params) => {
    return MasterApi.postRequestJSON(`${api.prefix}/selectIncomeDeposit`, params, api.jsonContentType);
};

/**
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.doDeductIncomeDeposit = (params) => {
    return MasterApi.postRequestJSON(`${api.prefix}/doDeductIncomeDeposit`, params, api.jsonContentType);
};

/**
 * 佣金转预存款或提现审批列表
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.selectTransferRecord = (params) => {
    return MasterApi.getRequest(`${api.prefix}/selectTransferRecord`, params);
};

/**
 * 佣金转预存款或提现审批
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.confirmTransferRecord = (params) => {
    return MasterApi.getRequest(`${api.prefix}/confirmTransferRecord`, params);
};

/**
 * 佣金转预存款或提现审批列表(审批完成)
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.selectTransferRecordDetail = (params) => {
    return MasterApi.getRequest(`${api.prefix}/selectTransferRecordDetail`, params);
};

/**
 * 普通商品和团购商品列表(根据distinguish区分普通商品和团购商品)
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.selectNormalOrder = (params) => {
    return MasterApi.postRequestJSON(`${api.prefix}/selectNormalOrder`, params, api.jsonContentType);
};

/**
 * 查看订单明细
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.selectNormalOrderDetail = (params) => {
    return MasterApi.getRequest(`${api.prefix}/selectNormalOrderDetail`, params);
};

export default api;
