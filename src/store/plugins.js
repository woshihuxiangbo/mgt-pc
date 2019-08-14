/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:15:31
 * @LastEditTime: 2019-08-14 11:32:07
 * @LastEditors: Please set LastEditors
 */
const sStorage = {
    setItem: (key, value) => {
        sessionStorage.setItem(key, encodeURIComponent(JSON.stringify(value)));
    },
    getItem: (key) => {
        return JSON.parse(decodeURIComponent(sessionStorage.getItem(key)));
    },
    removeItem: (key) => {
        sessionStorage.removeItem(key);
    }
};

function merge(into, from) {
    return Object.assign({}, into, from);
}

function deepClone(obj) {
    let result = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepClone(obj[key]);
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}

export function vuexToSessionStorage(store) {
    let savedState = sStorage.getItem('vuex');
    if (savedState) {
        let newState = merge(store.state, savedState);
        try {
            store.commit('SET_TOKEN', newState.auth.token);
        } catch (e) {}
        store.replaceState(newState);
    }
    store.subscribe((mutation, state) => {
        let storeClone = deepClone(state);
        sStorage.setItem('vuex', storeClone);
    })
}
