import Vue from 'vue'
import Vuex from 'vuex'
import { vuexToSessionStorage } from './plugins'
Vue.use(Vuex);

import adv from './adv/adv';
import menu from './menu/menu';
import shop from './store/store';
import shoppingCar from './store/shoppingCar';
import auth from '@/store/auth/auth';


export default new Vuex.Store({
    modules: {
        shoppingCar,
        shop,
        menu,
        adv,
        auth
    },
    plugins: [ vuexToSessionStorage ]
});

