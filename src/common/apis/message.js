import request from '../request';
import util from '../Util';

// const baseUrl = '/api/message/m'
const baseUrl = '/api/msg/m';

export default {
    list(params) {
        // return request.get(`http://contact.demo.koudejun.com/api/1/v1/msg/incomeMsgList`, {
        return request.get(`${baseUrl}/incomeMsgList`, {
            params
        });
    },

    // get(params) {
    //     return request.get(`${baseUrl}/get`, {
    //         params
    //     });
    // },

    // edit(params) {
    //     return request.post(`${baseUrl}/edit`, util.paramsToFormData(params));
    // },

    add(params) {
        return request.post(`${baseUrl}/sendMessage`, params, {
            headers: {
                'Content-Type': 'application/json'
            },
            transformRequest: [function(data) {
                data = JSON.stringify(data);
                console.info(data);
                return data
            }]
        });
    },

    // disabled(params) {
    //     return request.post(`${baseUrl}/disable`, util.paramsToFormData(
    //         params
    //     ));
    // },

    deleted(params) {
        return request.post(`${baseUrl}/delMsg`, util.paramsToFormData(
            params
        ));
    }
}
