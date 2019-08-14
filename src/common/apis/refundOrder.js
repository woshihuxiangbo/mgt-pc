import MasterApi from '@/common/apis/MasterApi';


// apply agree confirm
export const api = new MasterApi('/api/1/v1/item/m/order/refund');

api.apply = (params) => {
    return MasterApi.postRequest(api.prefix + '/apply', params);
};

api.agree = (params) => {
    return MasterApi.postRequest(api.prefix + '/agree', params);
};

api.confirm = (params) => {
    return MasterApi.postRequest(api.prefix + '/confirm', params);
};

export default api;
