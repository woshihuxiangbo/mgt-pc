import Util from '@/common/Util';

export default {
    state: {
        items: {},
        itemCount: 0
    },
    actions: {
        setShoppingCarItems: ({commit, state}, items) => {
            commit('SET_ITEMS', items);
        },
        addShoppingCarItem: ({commit, state}, item) => {
            let items = JSON.parse(JSON.stringify(state.items));
            if (items[item.producerId] === undefined) {
                items[item.producerId] = {
                    title: item.producerName,
                    children: {}
                };
            }
            items[item.producerId].children[item.skuId] = item;
            console.info(items);
            commit('SET_ITEMS', items);
        },
        rmShoppingCarItem({commit, state}, item) {
            return new Promise((resolve, reject) => {
                let items = JSON.parse(JSON.stringify(state.items));
                try {
                    let c = JSON.parse(JSON.stringify(items[item.producerId].children));
                    if (c[item.skuId] !== undefined) delete c[item.skuId];
                    items[item.producerId].children = c;
                    if (Util.objectLength(c) === 0) {
                        delete items[item.producerId];
                    }
                } catch (e) {
                    reject(e);
                }
                commit('SET_ITEMS', items);
                resolve(items);
            });
        },
        editShoppingCarItem: ({commit, state}, item) => {
            state.items[item.producerId].children[item.skuId] = item;
            commit('SET_ITEMS', state.items);
        },
        rmParent: ({commit, state}, producerId) => {
            return new Promise((resolve, reject) => {
                let items = Object.assign(state.items);
                if (items[producerId] !== undefined) {
                    delete items[producerId];
                }
                commit('SET_ITEMS', items);
                resolve(items);
            });
        }
    },
    mutations: {
        SET_ITEMS: (state, items) => {
            state.items = items;
            let count = 0;
            for (let key in items) {
                let children = items[key].children;
                if (children) {
                    console.info(children);
                    for (let i in children) {
                        count++;
                    }
                }
            }
            state.itemCount = count;
        }
    },
    getters: {
        shoppingCarItems: state => state.items,
        shoppingCarItemCount: state => state.itemCount
    }
};
