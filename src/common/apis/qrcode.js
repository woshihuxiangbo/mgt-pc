import request from '@/common/request';
import util from '@/common/Util';

const baseUrl = process.env.VUE_APP_QRCODE_API_BASE_URL + '/api/1/v1/qrcode/m';

/**
 * 运行
 *
 * @returns {AxiosPromise<any>}
 */
export const running = () => {
    return request.get(`${baseUrl}/running`);
};

/**
 * 生成
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const gen = (params) => {
    return request.post(`${baseUrl}/gen`, util.paramsToFormData(params));
};

/**
 * 查看生成的防伪码
 *
 * @param params
 * @returns {AxiosPromise<any>}
 */
export const batch = (params) => {
    return request.get(`${baseUrl}/batch`, {params});
};

/**
 * 导出下载
 *
 * @param config
 * @returns {AxiosPromise<any>}
 */
export const exportFile = (config) => {
    return request.get(`${baseUrl}/export`, config)
};

export default {
    running,
    gen,
    batch,
    exportFile
};
