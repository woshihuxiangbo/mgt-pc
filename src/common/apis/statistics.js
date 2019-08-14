import request from '@/common/request';

export const adminStatistics = (params) => {
    return request.get('/api/statistic/m/s/admin', {params});
};

export const mainStatistics = (params) => {
    return request.get('/api/statistic/m/s/main', {params});
};

export const inspectorStatistics = (id) => {
    return request.get('/api/statistic/m/s/inspector', {params: {inspectorId: id}});
};

export const directorStatistics = (id) => {
    return request.get('/api/statistic/m/s/director', {params: {directorId: id}});
};

export const managerStatistics = (params) => {
    return request.get('/api/statistic/m/s/manager', {params});
};

export const saas = (params) => {
    return request.get('/api/statistic/m/s/financial/saas', {params});
};

export const store = (params) => {
    return request.get('/api/statistic/m/s/financial/store', {
        params
    });
};

/**
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const exportIndex = (params) => {
    let reqConfig = {
        responseType: 'blob',
        headers: {
            'content-type': 'application/octet-stream;charset=utf-8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
        },
        params
    };
    return request.get(`/api/goods/m/exportIndex`, reqConfig);
};

export default {
    adminStatistics,
    inspectorStatistics,
    directorStatistics,
    managerStatistics,
    saas,
    mainStatistics,
    store,
    exportIndex
};
