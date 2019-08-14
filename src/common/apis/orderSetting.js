import MasterApi from '@/common/apis/MasterApi';

let api = new MasterApi('/api/order/m/setting');


/**
 *
 * @param storeCashMin
 * @returns {AxiosPromise<any>}
 */
api.setAlarmValue = (storeCashMin) => {
    return MasterApi.getRequest(`${api.prefix}/setAlarmValue`, {storeCashMin})
};

/**
 * 获取预警值
 *
 * @returns {AxiosPromise<any>}
 */
api.getAlarmValue = () => {
    return MasterApi.getRequest(`${api.prefix}/getAlarmValue?storeCashMin`, {})
};

export default api;
