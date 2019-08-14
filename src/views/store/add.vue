<template>
    <div class="shop kd-page-master kd-flex" v-loading="loading">
        <breadcrumb :options="['店铺管理', '添加店铺']"/>
        <div class="main-container kd-flex kd-flex-item">
            <store-form v-model="form" @submit="onSubmit" class="kd-flex-item">
                <el-button type="primary" native-type="submit">保存</el-button>
            </store-form>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from '../../components/widget/breadcrumb';
    import StoreForm from '../../components/form/StoreForm';
    import storeApi from '../../common/apis/store';

    export default {
        components: {StoreForm, Breadcrumb},
        data() {
            return {
                loading: false,
                form: {
                    storeLogo: '',
                    storeName: undefined,
                    location: [],
                    addr: undefined,
                    freeExpress: 0,
                    shareTitle: undefined,
                    sharePic: undefined,
                    lvConfig: {
                        lv1: {
                            name: undefined,
                            price: undefined,
                            discount: 0,
                            rebate: 0
                        },
                        lv2: {
                            name: undefined,
                            price: undefined,
                            discount: 0,
                            rebate: 0
                        },
                        lv3: {
                            name: undefined,
                            price: undefined,
                            discount: 0,
                            rebate: 0,
                            saleAmount: 0,
                            saleRate: 0
                        },
                        lv9: {
                            name: undefined
                        },
                        lv10: {
                            name: undefined
                        }
                    },
                    wechatGroup: {
                        lv1Qrcode: undefined,
                        lv2Qrcode: undefined,
                        lv3Qrcode: undefined,
                        lv9Qrcode: undefined,
                        lv10Qrcode: undefined
                    },
                    tppName: 'wechat',
                    tppConfig: {
                        appID: undefined,
                        appSecret: undefined,
                        merchantId: undefined,
                        apiKey: undefined,
                        qrcodeUrl: undefined
                    },
                    disabled: false,
                    certificate: undefined,
                    shareGroup: {
                        store: {
                            poster: [],
                            indexPoster: undefined,
                            posterTitle: undefined
                        },
                        group: {
                            poster: [],
                            indexPoster: undefined,
                            posterTitle: undefined
                        },
                        invite: {
                            poster: [],
                            indexPoster: undefined,
                            posterTitle: undefined
                        }
                    }
                }
            };
        },
        methods: {
            onSubmit() {
                this.loading = true;
                let certificate = this.form.certificate;
                let params = JSON.parse(JSON.stringify(this.form));
                params.certificate = certificate;
                params.location = params.location.join(',');
                params.lvConfig.lv1.price = this.$util.formatPrice(params.lvConfig.lv1.price);
                params.lvConfig.lv2.price = this.$util.formatPrice(params.lvConfig.lv2.price);
                params.lvConfig.lv3.price = this.$util.formatPrice(params.lvConfig.lv3.price);
                params.lvConfig = JSON.stringify(params.lvConfig);
                params.tppConfig = JSON.stringify(params.tppConfig);
                params.wechatGroup = JSON.stringify(params.wechatGroup);
                params.shareGroup = JSON.stringify(params.shareGroup);
                if (params.freeExpress) params.freeExpress = this.$util.formatPrice(params.freeExpress);
                let add = (this.$route.name === 'ShopAddMain') ? storeApi.addMainStore : storeApi.addStore;
                add(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.$store.dispatch('refreshToken');
                        this.$router.push({name: 'ShopList'});
                    }).catch().finally();
                }).catch().finally(() => this.loading = false);
            }
        }
    };
</script>

<style scoped lang="scss">

</style>
