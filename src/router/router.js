import Vue from 'vue';

import Router from 'vue-router';

import Home from '@/router/module/_home';
import Administrator from '@/router/module/_administrator';
import Store from '@/router/module/_store';
import User from '@/router/module/_user';
import Item from '@/router/module/_item';
import Order from '@/router/module/_order';
import Event from '@/router/module/_event';
import Group from '@/router/module/_group';
import Content from '@/router/module/_content';
import Adv from '@/router/module/_adv';
import Message from '@/router/module/_message';
import Notice from '@/router/module/_notice';
import Servers from '@/router/module/_servers';
import Base from '@/router/module/_base';
import Refund from '@/router/module/_refund';
import Qrcode from '@/router/module/_qrcode';
import Commission from '@/router/module/_commission';
import Deposit from '@/router/module/_deposit';

Vue.use(Router);

/**
 *
 * @type {*[]}
 */
export const routes = [
    ...Home,
    ...Administrator,
    ...Qrcode,
    ...Store,
    ...User,
    ...Item,
    ...Order,
    ...Refund,
    ...Event,
    ...Group,
    ...Content,
    ...Adv,
    ...Message,
    ...Notice,
    ...Servers,
    ...Base,
    ...Commission,
    ...Deposit
];

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routes
});
