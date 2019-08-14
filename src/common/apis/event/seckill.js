import MasterApi from "@/common/apis/MasterApi";

let Api = new MasterApi("/api/order/m/seckill", {
    get: 'one',
    add: 'save',
    edit: 'update'
});

Api.deleted = function (params) {
    return MasterApi.getRequest(this.getApiUrl(this.config.delete), params)
};

Api.add = function (params) {
    return MasterApi.postRequestJSON(this.getApiUrl(this.config.add), params, this.jsonContentType)
};

Api.edit = function (params) {
    return MasterApi.postRequestJSON(this.getApiUrl(this.config.edit), params, this.jsonContentType)
};

Api.updateItem = function (params) {
    return MasterApi.postRequestJSON(this.getApiUrl('itemUpdate'), params, this.jsonContentType)
};

export default Api