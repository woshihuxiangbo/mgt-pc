import request from '@/common/request';
import util from '@/common/Util';

/**
 * 获取小程序基本设置
 * @returns {AxiosPromise<any>}
 */
export const get = () => {
    return request.get("/api/1/v1/item/m/setting/get");
};

/**
 * 修改小程序设置
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const update = (params) => {
    return request.post("/api/1/v1/item/m/setting/update", util.paramsToFormData(params))
};

export default {
    get,
    update
}
