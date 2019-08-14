import request from '../request';
import util from '../Util';

const column = 'id,className,storeName,picture,title,viewCount,createTime,sourceName,sourceUrl,sortId,disabled,deleteTime,showTime,body';

export const getList = (params) => {
    return request.get('/api/1/v1/content/m/article/list', {params: Object.assign({}, params, {column})})
};

export const get = (id, col) => {
    return request.get('/api/1/v1/content/m/article/get', {params: {id, column: col}});
};

export const update = (params) => {
    return request.post('/api/1/v1/content/m/article/edit', util.paramsToFormData(params));
};

export const create = (params) => {
    return request.post('/api/1/v1/content/m/article/add', util.paramsToFormData(params));
};

export const disabled = (id) => {
    return request.post('/api/1/v1/content/m/article/disable', util.paramsToFormData({id}))
};

export const deleted = (id) => {
    return request.post('/api/1/v1/content/m/article/delete', util.paramsToFormData({id}))
};

export default {
    getList,
    get,
    update,
    create,
    disabled,
    deleted,
    column
}