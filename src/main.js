import 'babel-polyfill';
import Vue from 'vue';
import App from './app.vue';
import router from './router/router';
import store from './store/';
import VueQuillEditor from 'vue-quill-editor';
import VueCropper from 'vue-cropper';
import Breadcrumb from '@/components/widget/breadcrumb';
import ElementUi from 'element-ui';
import Util from './common/Util';
import '@/common/Date';
import '@/common/RouterHook';

import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/global.scss';

Vue.use(ElementUi);
Vue.component('Breadcrumb', Breadcrumb);
Vue.use(VueCropper);
Vue.use(VueQuillEditor);

Vue.prototype.$util = Util;
Vue.config.productionTip = false;

Vue.mixin({
    data() {
        return {
            $imageStaticBaseUrl: process.env.VUE_APP_IMAGE_BASE_URL
        };
    },
    filters: {
        imgSrc(val) {
            if (!val) {
                return '';
            } else {
                if (/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(val)) {
                    return val;
                }
                return process.env.VUE_APP_IMAGE_BASE_URL + val;
            }
        },
        priceFormat(val) {
            return Util.priceFormat(val);
        }
    }
});

window.__ = new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app');
