import MasterApi from '@/common/apis/MasterApi';

let baseUrl = '/api/1/v1/item/m/group';

let api = new MasterApi(baseUrl);

api.verifyList = (params) => {
    return MasterApi.getRequest(`${api.prefix}/verify_list`, params);
};

export default api;
