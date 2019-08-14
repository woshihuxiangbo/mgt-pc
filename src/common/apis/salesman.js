import request from '../request';
import util from '../Util';

export const getSalesmanList = fields => request.get('/salesman/list', {
    header: {
        fields
    }
})


export const addStore = params => request.post('/m/store/add', util.paramsToFormData(params));
