const types = {
    SET_SHOP: 'SET_SHOP'
};

const state = {
    shop: {}
};

const getters = {
    shop: state => state.shop,
};

const mutations = {
    [types.SET_SHOP](state, info) {
        state.shop = info
    },
};

const actions = {
    updateShop: ({commit}, info) => {
        commit(types.SET_SHOP, info)
    },
};

export default {
    state,
    getters,
    mutations,
    actions
}