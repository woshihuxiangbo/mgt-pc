import router from '@/router/router';
import store from '@/store/index';
import util from '@/common/Util';

router.beforeEach((to, form, next) => {


    if (store.getters.menuGenerated !== true) {
        store.dispatch('generateMenus');
    }
    // if (to.meta.hasSelectStore !== undefined)  {
    //     if (store.getters.shop.id === undefined) {
    //         router.app.$message.error('请先选择店铺')
    //         return next({name: 'SelectStore'});
    //     }
    // }
    if (to.name !== 'sign' && !store.getters.loginState) {
        next({name: 'sign'});
        // router.app.$message.error('请登录')
        return;
    }
    const shop = store.getters.shop;
    const role = store.getters.role;
    if (!shop.id && role.roleID != 1 && to.name != 'SelectStore' && to.name != 'sign') {
        router.app.$message.error('请先选择店铺');
        return next({name: 'SelectStore'});
    } else {
        // return next();
        const {key, perms} = to.meta;
        if (util.checkPermission(key, perms)) {
            return next();
        } else {
            return next({name: 'NoPerms'});
        }
    }

});

router.afterEach((to) => {
    window.scrollTo(0, 0);
});
