import MasterApi from '@/common/apis/MasterApi';

const api = new MasterApi('/api/1/v1/content/m/article/class');

api.struct = (params) => {
    return MasterApi.getRequest(`${api.prefix}/struct`, params)
};

export default api;
