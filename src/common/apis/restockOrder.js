import MasterApi from '@/common/apis/MasterApi';

let api = new MasterApi('/api/1/v1/item/m/order');


api.itemList = (params) => {
    return MasterApi.getRequest(api.prefix + '/item/list', params);
};

api.expressList = (params) => {
    return MasterApi.getRequest(api.prefix + '/express/list', params);
};

api.expressAdd = (params) => {
    return MasterApi.postRequest(api.prefix + '/express/add', params);
};

api.expressDelete = (params) => {
    return MasterApi.postRequest(api.prefix + '/express/delete', params);
};

api.expressConfirm = (params) => {
    return MasterApi.postRequest(api.prefix + '/express/confirm', params);
};

api.payConfirm = (params) => {
    return MasterApi.postRequest(api.prefix + '/pay/confirm', params);
};

api.expressListRetail = (params) => {
    return MasterApi.getRequest(api.prefix + '/retail/express/list', params);
};

api.exported = (params) => {
    return MasterApi.getRequest(api.prefix + '/export', params);
};

api.expressAddRetail = (params) => {
    return MasterApi.postRequest(api.prefix + '/retail/express/add', params);
};

api.expressDeleteRetail = (params) => {
    return MasterApi.postRequest(api.prefix + '/retail/express/delete', params);
};

api.expressConfirmRetail = (params) => {
    return MasterApi.postRequest(api.prefix + '/retail/express/confirm', params);
};

api.expressData = (params) => {
    return MasterApi.getRequest('/api/1/v1/express/franch_buy_order/get', params);
};

/**
 * 导出订单
 *
 * @param params
 * @param config
 * @returns {AxiosPromise<any>}
 */
api.exportOrderList = (params, config) => {
    let tempConfig = {
        responseType: 'blob',
        headers: {
            'content-type': 'application/octet-stream;charset=utf-8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
        }
    };
    return MasterApi.postRequest('/api/order/m/exportOrderList', params, Object.assign({}, config, tempConfig));
};

/**
 * 批发导出订单
 *
 * @param params
 * @param config
 * @returns {AxiosPromise<any>}
 */
api.exportBatchOrderList = (params, config) => {
    let tempConfig = {
        responseType: 'blob',
        headers: {
            'content-type': 'application/octet-stream;charset=utf-8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
        }
    };
    return MasterApi.postRequest('/api/order/m/exportBatchOrderList', params, Object.assign({}, config, tempConfig));
};

// 导出零售售后订单

api.exportRefundOrderList = (params, config) => {
    let tempConfig = {
        responseType: 'blob',
        headers: {
            'content-type': 'application/octet-stream;charset=utf-8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
        }
    };
    return MasterApi.postRequest('/api/order/m/exportRefundOrderList', params, Object.assign({}, config, tempConfig));
};
// 同小程序获取快递进程
// 获取物流（可能多家）
api.getExpress = (params) => {
    return MasterApi.getRequest('/api/order/m/getOrderExpress',params);
};
api.getExpress1 = (params) => {
    return MasterApi.getRequest('/api/order/m/getOrderExpress1',params);
};
export default api;
