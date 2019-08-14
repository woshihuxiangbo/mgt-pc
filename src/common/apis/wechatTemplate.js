import request from '@/common/request';
import util from '@/common/Util';

let baseUrl = '/api/msg/m/';

export default {
    wechatMessageTemplateList(params) {
        return request.get(`${baseUrl}wechatMessageTempleteList`, {params})
    },
    addWechatMessageTemplate(params) {
        return request.post(`${baseUrl}addWechatMessageTemplete`, util.paramsToFormData(params));
    }
}
