import request from '../request';
import {paramsToFormData} from '../Util';

export default class MasterApi {
    constructor(prefix, config) {
        this.prefix = prefix;
        this.jsonContentType = {
            headers: {
                'Content-Type': 'application/json'
            },
            transformRequest: [function (data) {
                data = JSON.stringify(data);
                return data;
            }]
        };
        this.config = Object.assign({
            list: 'list',
            get: 'get',
            edit: 'edit',
            add: 'add',
            disable: 'disable',
            delete: 'delete'
        }, config);
    }

    /**
     *
     * @param params
     * @param version
     * @returns {AxiosPromise<any>}
     */
    list(params, version) {
        return request.get(this.getApiUrl(this.config.list, version), {params});
    }

    /**
     *
     * @param params
     * @param version
     * @returns {AxiosPromise<any>}
     */
    get(params, version) {
        return request.get(this.getApiUrl(this.config.get, version), {params});
    }

    /**
     *
     * @param params
     * @param version
     * @returns {AxiosPromise<any>}
     */
    edit(params, version) {
        return request.post(this.getApiUrl(this.config.edit, version), paramsToFormData(params));
    }

    /**
     *
     * @param params
     * @param version
     * @returns {AxiosPromise<any>}
     */
    add(params, version) {
        return request.post(this.getApiUrl(this.config.add, version), paramsToFormData(params));
    }

    /**
     *
     * @param params
     * @param version
     * @returns {AxiosPromise<any>}
     */
    disabled(params, version) {
        return request.post(this.getApiUrl(this.config.disable, version), paramsToFormData(params));
    }

    /**
     *
     * @param params
     * @param version
     * @returns {AxiosPromise<any>}
     */
    deleted(params, version) {
        return request.post(this.getApiUrl(this.config.delete, version), paramsToFormData(params));
    }

    /**
     *
     * @param url
     * @param params
     * @param config
     * @returns {AxiosPromise<any>}
     */
    static postRequest(url, params, config) {
        return request.post(`${url}`, paramsToFormData(params), config);
    }

    /**
     *
     * @param url
     * @param params
     * @param config
     * @returns {AxiosPromise<any>}
     */
    static postRequestJSON(url, params, config) {
        return request.post(`${url}`, params, config);
    }

    /**
     *
     * @param url
     * @param params
     * @returns {AxiosPromise<any>}
     */
    static getRequest(url, params) {
        return request.get(`${url}`, {params});
    }

    /**
     * 获取api地址
     *
     * @param path
     * @param version
     * @returns {string}
     */
    getApiUrl(path, version) {
        if (version) {
            return `${this.prefix}/${path}/${version}`;
        }
        return `${this.prefix}/${path}`;
    }
}
