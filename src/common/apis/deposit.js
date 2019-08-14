import MasterApi from '@/common/apis/MasterApi';

let api = new MasterApi('/api/order/m/deposit');

/**
 * 获取审批记录
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.selectIncomeDeposit = (params) => {
    return MasterApi.postRequestJSON(`${api.prefix}/selectIncomeDeposit`, params, api.jsonContentType);
};

/**
 * 用户预存款申请-客服申请|审批
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.examineAndApprove = (params) => {
    return MasterApi.postRequestJSON(`${api.prefix}/examineAndApprove`, params, api.jsonContentType);
};

/**
 * 复批
 * @param params
 * @returns {AxiosPromise<any>}
 * @constructor
 */
api.ApplyAgreeByAccount = (params) => {
    return MasterApi.postRequestJSON(`${api.prefix}/ApplyAgreeByAccount`, params, api.jsonContentType);
};

/**
 * 首批
 * @param params
 * @returns {AxiosPromise<any>}
 * @constructor
 */
api.addIncomeDepositApplyByStaff = (params) => {
    return MasterApi.postRequestJSON(`${api.prefix}/addIncomeDepositApplyByStaff`, params, api.jsonContentType);
};

/**
 * 预存款明细
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.selectDeposit = (params) => {
    return MasterApi.postRequestJSON(`${api.prefix}/selectDeposit`, params, api.jsonContentType);
};

/**
 * 预存款明细详情
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.selectDepositDetail = (params) => {
    return MasterApi.postRequestJSON(`${api.prefix}/selectDepositDetail`, params, api.jsonContentType);
};

/**
 * 经销商账户列表
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.storeCashAccountList = (params) => {
    return MasterApi.postRequestJSON(`${api.prefix}/storeCashAccountList`, params, api.jsonContentType);
};

/**
 * 充值预存款
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.storeCashDepositAdd = (params) => {
    return MasterApi.postRequest(`${api.prefix}/storeCashDepositAdd`, params);
};

/**
 * 经销商预存款充值审核列表
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.storeCashDepositList = (params) => {
    return MasterApi.postRequestJSON(`${api.prefix}/storeCashDepositList`, params, api.jsonContentType);
};

/**
 * 经销商充值审核
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
api.storeCashDepositAuditing = (params) => {
    return MasterApi.postRequest(`${api.prefix}/storeCashDepositAuditing`, params);
};

export default api;
