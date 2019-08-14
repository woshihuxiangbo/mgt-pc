import MasterApi from '@/common/apis/MasterApi';

let baseUrl = '/api/manager/m';

const api = new MasterApi(baseUrl + '/manager');


api.getTotal = (params) => MasterApi.getRequest(`${baseUrl}/getByID`,
    params
);

api.find = (id) => {
    return MasterApi.getRequest(api.prefix + '/find', {managerId: id})
};

api.transfer = (params) => {
    return MasterApi.postRequest(`${baseUrl}/managerStore/transfer`, params)
};

api.changeStoreManager = (params) => {
    return MasterApi.postRequest(`${baseUrl}/managerStore/change/manager`, params)
};

api.getStoreManager = (params) => {
    return MasterApi.getRequest(`${baseUrl}/managerStore/get`, params)
};

export default api;
