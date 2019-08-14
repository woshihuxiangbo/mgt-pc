import MasterApi from './MasterApi';

let api = new MasterApi('/api/1/v1/item/m/item_category');

api.parent = (params) => {
    MasterApi.getRequest(api.prefix + '/parent', {params});
};

api.struct = (params) => {
    return MasterApi.getRequest(`${api.prefix}/struct`, params)
};

api.verify = (params) => {
    return MasterApi.postRequest(`${api.prefix}/verify`, params)
};

export default api;
