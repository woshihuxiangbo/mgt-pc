/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:15:31
 * @LastEditTime: 2019-08-12 14:15:42
 * @LastEditors: Please set LastEditors
 */
import request from '../request';
import util from '../Util';
import MasterApi from "@/common/apis/MasterApi";
let api = new MasterApi();
const retailUrl = '/api/order/m';


export const retail = {
    orderList: (params) => {
        return request.post(`${retailUrl}/orderList`, util.paramsToFormData(params));
    },

    commanderOrderList: (params) => {
        return request.post(`${retailUrl}/commanderOrderList`, util.paramsToFormData(params));
    },
    goodsList: (params) => {
        return request.post(`${retailUrl}/findOrderItemByOrderId`, util.paramsToFormData(params));
    },
    goodsDetail: (params) => {
        return request.post(`${retailUrl}/findById`, util.paramsToFormData(params));
    },
    confirmPaySuccess: (params) => {
        return request.post(`${retailUrl}/confirmPaySuccess`, util.paramsToFormData(params));
    },
    confirmReceiveOrder: (params) => {
        return request.post(`/api/1/v1/item/m/order/retail/express/confirm`, util.paramsToFormData(params));
    },
    // 确认收货
    confirmReceiveOrder2: (params) => {
        return request.post(`/api/order/m/confirm`, util.paramsToFormData(params));
    },
    exported (params) {
        return request.post(`${retailUrl}/orderListExport`, util.paramsToFormData(params));
    },
    commanderOrderListExport (params) {
        return request.post(`${retailUrl}/commanderOrderListExport`, util.paramsToFormData(params));
    },
    findCashRecordByCondition (params) {
      return request.get(`${retailUrl}/query/findCashRecordByCondition`, {params})
    },
    cashTradRecordExport (params, config) {
        let tempConfig = {
            responseType: 'blob',
            headers: {
                'content-type': 'application/octet-stream;charset=utf-8',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
            }
        };
        return MasterApi.postRequest(`${retailUrl}/query/cashTradRecordExport`, params, Object.assign({}, config, tempConfig));
    },
    // 零售订单1
    orderList1: (params) => {
        return MasterApi.postRequestJSON(`${retailUrl}/orderList1`,params,api.jsonContentType);
    },
    // 订单详情
    getOrderDetail: (params) => {
        return MasterApi.getRequest(`${retailUrl}/orderDetail`,params);
    },
    // 物流详情
    getOrderExpress: (params) => {
        return MasterApi.getRequest(`${retailUrl}/orderExpress`,params);
    },
    // 返佣明细
    returnMoneyList:(params) => {
        return MasterApi.getRequest(`/api/user/back/m/incomeDetail`,params);
    }
};

export default retail
