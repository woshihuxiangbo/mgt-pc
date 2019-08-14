import MasterApi from './MasterApi';

let api = new MasterApi('/api/1/v1/item/m/item_sku');

api.getBySpec = (params) => {
    return MasterApi.getRequest(api.prefix + '/get_by_spec', params);
};

export default api;
