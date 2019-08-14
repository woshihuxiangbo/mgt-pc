import MasterApi from './MasterApi';

let goodsApi = new MasterApi('/api/1/v1/item/m/item');

goodsApi.listSku = params => {
    return MasterApi.getRequest('/api/1/v1/item/m/item_sku/list',
        params
    );
};
goodsApi.editSku = (params) => {
    return MasterApi.postRequest('/api/1/v1/item/m/item_sku/edit', params);
};

goodsApi.verify = (params) => {
    return MasterApi.postRequest(`${goodsApi.prefix}/verify`, params);
};

/**
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
goodsApi.originalItemBySkuID = (params) => {
    return MasterApi.getRequest(`${goodsApi.prefix}/originalItemBySkuID`, params);
};

export default goodsApi;
