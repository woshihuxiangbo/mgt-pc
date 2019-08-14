<template>
    <div class="store" v-loading="loading">
        <breadcrumb :options="['店铺管理', '编辑店铺']"/>
        <div class="main-container">
            <store-form v-model="store" @submit="onSubmit" v-if="store">
                <el-button type="primary" native-type="submit">更新</el-button>
            </store-form>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from '../../components/widget/breadcrumb';
    import StoreForm from '../../components/form/StoreForm';
    import storeApi from '../../common/apis/store';

    export default {
        name: 'edit',
        components: {StoreForm, Breadcrumb},
        data() {
            return {
                loading: false,
                store: undefined
            };
        },
        methods: {
            getData() {
                this.loading = true;
                storeApi.getStore(this.$route.params.id).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (data.lvConfig === undefined) {
                            data.lvConfig = {};
                        } else {
                            data.lvConfig = JSON.parse(data.lvConfig);
                        }
                        data.shareGroup = JSON.parse(data.shareGroup);
                        if (data.shareGroup instanceof Array || data.shareGroup.store === undefined) {
                            data.shareGroup = {
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
                            };
                        }
                        data.lvConfig.lv1 = this.formatLvConfig(data.lvConfig, 'lv1');
                        data.lvConfig.lv2 = this.formatLvConfig(data.lvConfig, 'lv2');
                        data.lvConfig.lv3 = this.formatLvConfig(data.lvConfig, 'lv3');
                        data.lvConfig.lv9 = this.formatLvConfig(data.lvConfig, 'lv9');
                        data.lvConfig.lv10 = this.formatLvConfig(data.lvConfig, 'lv10');
                        // console.info(data.lvConfig);
                        try {
                            data.lvConfig.lv1.price = this.$util.priceFormat(data.lvConfig.lv1.price);
                            data.lvConfig.lv2.price = this.$util.priceFormat(data.lvConfig.lv2.price);
                            data.lvConfig.lv3.price = this.$util.priceFormat(data.lvConfig.lv3.price);
                            if (data.freeExpress) data.freeExpress = this.$util.priceFormat(data.freeExpress);
                            else data.freeExpress = 0;
                        } catch (e) {
                        }
                        data.wechatGroup = JSON.parse(data.wechatGroup);
                        if (data.tppConfig === undefined) {
                            data.tppConfig = {};
                        } else {
                            data.tppConfig = JSON.parse(data.tppConfig);
                        }
                        if (data.disabled === undefined) data.disabled = false;
                        console.info('storeData:', data);
                        this.store = data;
                    });
                }).catch().finally(() => this.loading = false);
            },
            onSubmit() {
                let certificate = this.store.certificate;
                let params = JSON.parse(JSON.stringify(this.store));
                console.info(certificate, params);
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
                else params.freeExpress = 0;
                this.loading = true;
                storeApi.updateStore(params).then((res) => {
                    this.$util.handelHttpResponseResult(res, true, '修改成功').then(() => {
                        this.$store.dispatch('refreshToken');
                        this.$router.push({name: 'ShopList'});
                    });
                }).catch().finally(() => {
                    this.loading = false;
                });
            },
            formatLvConfig(data, key) {
                if (data[key] === undefined) {
                    return {
                        name: undefined,
                        price: undefined,
                        discount: 0
                    };
                } else {
                    return data[key];
                }
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped>

</style>
