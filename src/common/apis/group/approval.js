import request from '@/common/request';
import util from '@/common/Util';

let baseUrl = '/api';

export const leaderList = (params) => {
    return request.get(`${baseUrl}/user/back/m/leaderList`, {params});
};

export const getLeaderList = (params) => {
    return request.get(`${baseUrl}/user/back/m/leader/list`, {params});
};

export const leaderAudit = (params) => {
    return request.post(`${baseUrl}/user/back/m/leader/audit`, util.paramsToFormData(params));
};

export const leaderUpdateState = (params) => {
    return request.post(`${baseUrl}/user/back/m/leader/updateState`, util.paramsToFormData(params));
};

export default {
    leaderList,
    leaderAudit,
    getLeaderList,
    leaderUpdateState
};
