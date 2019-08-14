
import MasterApi from '@/common/apis/MasterApi';

export const api = new MasterApi('/api/order/m');

api.getGoodsList = (params) => {
    return MasterApi.postRequestJSON(api.prefix + '/itemCommentList', params,api.jsonContentType);
};

api.getCommentsList = (params) => {
    return MasterApi.postRequestJSON(api.prefix + '/itemCommentInfo', params,api.jsonContentType);
};

api.editComment = (params) => {
    return MasterApi.postRequestJSON(api.prefix + '/updateCommentInfo', params,api.jsonContentType);
};

api.addComment = (params) => {
    return MasterApi.postRequestJSON(api.prefix + '/addVirtualComment', params,api.jsonContentType);
};

export default api;
