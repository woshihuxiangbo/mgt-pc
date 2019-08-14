import MasterApi from '@/common/apis/MasterApi';

const api = new MasterApi('/api/1/v1/item/m/restock');

api.check = (id) => {
    return MasterApi.getRequest('/api/1/v1/item/m/restock/check', {orderId: id})
};

export default api;
