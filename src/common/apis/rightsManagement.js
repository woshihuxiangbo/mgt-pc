import request from '../request';
import util from '../Util';
export const column = 'id,storeId,level,content';
export const getList = (storeId) => {
    return request.get('/api/1/v1/content/m/rights/list',{params: {storeId,column}})
};
export const create = (params) => {
    return request.post('/api/1/v1/content/m/rights/add', util.paramsToFormData(params));
};
export const edit = (params) => {
    return request.post('/api/1/v1/content/m/rights/edit', util.paramsToFormData(params));
};
export const del = (id) => {
    return request.post('/api/1/v1/content/m/rights/delete', util.paramsToFormData({id}));
};

export default {
    getList,
    create,
    edit,
    del,
}
