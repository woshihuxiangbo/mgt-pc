import {routes} from '@/router/router';
import util from '@/common/Util';

export default {
    state: {
        menus: [],
        menuGenerated: false
    },
    getters: {
        menus: s => s.menus,
        menuGenerated: s => s.menuGenerated
    },
    mutations: {
        SET_MENUS(state, newMenus) {
            state.menus = newMenus;
        },
        SET_MENU_GENERATED(state, status) {
            state.menuGenerated = status;
        }
    },
    actions: {
        generateMenus({commit}) {
            let newMenu = gotoGenerateMenu(routes);
            commit('SET_MENUS', newMenu);
            // commit('SET_MENU_GENERATED', true);
        }
    }
};

const gotoGenerateMenu = (routes) => {
    let sideMenu = [];
    routes.forEach((route) => {
        if (route.meta === undefined) return;
        if (route.meta.isMenu !== true) return;
        if (route.meta.isSaas === false) return;
        if (route.meta.notGroup && util.checkRole('14')) return;
        if (!util.checkRole(route.meta.roleId)) return;
        if (!util.checkPermission(route.meta.key, route.meta.perms)) return;
        if (route.meta.scope !== undefined) {
            if (!util.checkRoleScope(route.meta.scope)) return;
        }
        let menu = {
            name: route.name,
            path: route.path,
            menuName: route.meta.name || route.meta.title,
            base: route.meta.isBase,
            icon: route.meta.icon,
            query: route.meta.query || {}
        };
        if (route.children !== undefined) {
            menu.children = gotoGenerateMenu(route.children);
        }
        sideMenu.push(menu);
    });
    return sideMenu;
};
