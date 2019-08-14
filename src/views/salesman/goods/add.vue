<template>
    <div class="shop" v-loading="loading">
        <breadcrumb :options="['商品管理', '添加商品']"/>
        <div class="main-container">
            <my-form v-model="form" :canEdit="true" @submit="onSubmit" ref="form">
                <el-button type="primary" native-type="submit">保存</el-button>
                <el-button type="primary" native-type="submit" class="md-fixed" plain>保存</el-button>
                <el-button @click="$router.back()">返回</el-button>
            </my-form>
        </div>
    </div>
</template>

<script>
    import MyForm from '@/components/form/GoodsForm';
    import api from '@/common/apis/goods';
    import {mapGetters} from 'vuex';

    export default {
        components: {MyForm},
        data() {
            return {
                loading: false,
                form: {
                    thumbnail: undefined,
                    headerPic: undefined,
                    aptitude: undefined,
                    name: undefined,
                    effect: undefined,
                    categoryId: undefined,
                    brandId: undefined,
                    producerId: undefined,
                    disabled: undefined,
                    payMethod: undefined,
                    allowEvent: 2,
                    videoUrl: undefined,
                    isNew: undefined,
                    isHot: undefined,
                    isRecommend: undefined,
                    cartRecommend: undefined,
                    isFreeExpress: true,
                    storeId: undefined,
                    body: undefined,
                    expressType: 1,
                    slide: [],
                    spec: [],
                    postage: [],
                    sortId: 0,
                    isTopping: false,
                    fictitiousSalesCount: 0,
                    service: ['库存', '销量', '闪电发货', '假一赔十']
                }
            };
        },
        computed: {
            ...mapGetters(['shop', 'role'])
        },
        mounted() {
            this._setStore();
        },
        methods: {
            _setStore() {
                try {
                    this.form.storeId = this.shop.id;
                    if (this.role.roleID === '14') {
                        this.form.disabled = true;
                    }
                } catch (err) {
                }
            },
            onSubmit() {
                let params = this.$util.deepClone(this.form);
                params.slide = params.slide.map((item) => ({picUrl: item.url.replace(process.env.VUE_APP_IMAGE_BASE_URL, '')}));
                params.slide = JSON.stringify(params.slide);
                params.service = JSON.stringify(params.service);
                params.spec = params.spec.map((item) => {
                    item.marketPrice = this.$util.formatPrice(item.marketPrice);
                    item.singleCost = this.$util.formatPrice(item.singleCost);
                    if (item.supplyPrice !== undefined) item.supplyPrice = this.$util.formatPrice(item.supplyPrice);
                    try {
                        console.log(item);
                        item.sku = item.sku.map((sk) => {
                            sk.price = this.$util.formatPrice(sk.price);
                            sk.wholesalePrice = this.$util.formatPrice(sk.wholesalePrice);
                            return sk;
                        });
                    } catch (e) {
                    }
                    return item;
                });
                params.spec = params.spec.filter((item) => {
                    return !item.id || !item.deleted;
                });
                params.spec = JSON.stringify(params.spec);
                let postage = Object.assign([], params.postage);
                if (params.expressType === 2) {
                    params.postage = postage.map(item => {
                        return {
                            method: item.method,
                            area: item.area,
                            first: this.$util.formatPrice(item.first),
                            extend: this.$util.formatPrice(item.extend),
                            batch: this.$util.formatPrice(item.batch)
                        };
                    });
                }
                if (params.expressType === 3) {
                    params.postage = postage.map(item => {
                        return {
                            area: item.area,
                            first: {
                                count: item.first.count,
                                price: this.$util.formatPrice(item.first.price)
                            },
                            extend: {
                                count: item.extend.count,
                                price: this.$util.formatPrice(item.extend.price)
                            },
                            isDefault: item.isDefault
                        };
                    });
                }
                params.postage = JSON.stringify(params.postage);
                this.loading = true;
                api.add(params, 'v2').then((res) => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.$router.back();
                    });
                }).finally(() => (this.loading = false));
            }
        }
    };
</script>

<style scoped lang="scss">
    .md-fixed {
        position: fixed;
        right: 50px;
        bottom: 100px;
        z-index: 1010;
    }
</style>
