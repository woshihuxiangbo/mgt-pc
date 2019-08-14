import MasterApi from '@/common/apis/MasterApi';

const api = new MasterApi('/api/manager/m/managerRole');

api.getParentManagers = params => {
    return MasterApi.getRequest('/api/manager/m/manager/listParent',
        params
    )
};

api.getParentRoles = params => {
    return MasterApi.getRequest('/api/manager/m/managerRole/listParent',
        params
    )
};

export default api;
