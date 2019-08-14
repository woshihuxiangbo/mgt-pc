import request from '../request';
import util from '../Util';

export const column = 'id,storeLogo,storeName,location,addr,lvConfig,disabled,deleteTime,createTime,wechatGroup,' +
    'configId,tppName,tppConfig,shareTitle,sharePic,freeExpress,shortName,shareGroup,groupImg';

export const updateStore = (params) => {
    return request.post('/api/1/v1/item/m/store/edit', util.paramsToFormData(params), {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const addStore = (params) => {
    return request.post('/api/1/v1/item/m/store/add', util.paramsToFormData(params), {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const addMainStore = (params) => {
    return request.post('/api/1/v1/item/m/store/addMainStore', util.paramsToFormData(params), {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getStoreList = (params) => {
    return request.get('/api/1/v1/item/m/store/list', {params});
};

export const getStore = (id) => {
    return request.get('/api/1/v1/item/m/store/get', {params: {id, column}});
};

export const deleteStore = (id) => {
    return request.post('/api/1/v1/item/m/store/delete', util.paramsToFormData({id}));
};

export const disabledStore = (id) => {
    return request.post('/api/1/v1/item/m/store/disable', util.paramsToFormData({id}));
};

export default {
    updateStore,
    addStore,
    getStoreList,
    getStore,
    deleteStore,
    disabledStore,
    addMainStore
};
