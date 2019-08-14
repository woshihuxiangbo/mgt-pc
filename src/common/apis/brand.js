import MasterApi from './MasterApi';

let brandApi = new MasterApi('/api/1/v1/item/m/item_brand');

brandApi.verify = (params) => {
    return  MasterApi.postRequest(`${brandApi.prefix}/verify`, params);
};

export default brandApi;
