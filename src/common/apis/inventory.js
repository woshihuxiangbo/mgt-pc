import MasterApi from './MasterApi';


let inventoryApi = new MasterApi('/api/1/v1/item/m/store_item_stock');


inventoryApi.getSku = params => {
  return MasterApi.getRequest('/api/1/v1/item/m/item_sku/list', 
      params
  )
};
inventoryApi.getStockList = params => {
  return MasterApi.getRequest('/api/1/v1/item/m/store_item_stock/list', 
      params
  )
};

inventoryApi.getSpu = params => {
    return MasterApi.getRequest('/api/1/v1/item/m/item_spu/list',
        params
    )
};

export default inventoryApi;
