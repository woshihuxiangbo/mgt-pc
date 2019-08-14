import MasterApi from "@/common/apis/MasterApi";

let eventGroupBuy = new MasterApi('/api/order/m/eventGroup', {
    list: 'list',
    edit: 'update',
    add: 'save',
    get: 'one'
});

eventGroupBuy.get = (params) => {
    return MasterApi.getRequest(eventGroupBuy.getApiUrl(eventGroupBuy.config.get), params);
};

eventGroupBuy.deleted = (params) => {
    return MasterApi.getRequest(eventGroupBuy.getApiUrl(eventGroupBuy.config.delete), params);
};

eventGroupBuy.edit = (params) => {
    return MasterApi.postRequestJSON(eventGroupBuy.getApiUrl(eventGroupBuy.config.edit), params, eventGroupBuy.jsonContentType);
};

eventGroupBuy.add = (params) => {
    return MasterApi.postRequestJSON(eventGroupBuy.getApiUrl(eventGroupBuy.config.add), params, eventGroupBuy.jsonContentType);
};

eventGroupBuy.disabled = eventGroupBuy.edit;


export default eventGroupBuy;