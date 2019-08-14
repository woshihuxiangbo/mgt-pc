<template>
    <div class="goods" v-loading="loading" v-if="this.id">
        <breadcrumb :options="['商品管理', '商品编辑']"/>
        <div class="main-container" v-if="hasData">
            <my-form :default-select-class="selectClass" v-model="form" @submit="onSubmit" ref="form">
                <el-button type="primary" native-type="submit">保存</el-button>
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
                selectClass: [],
                form: {
                    isGroupStoreItem: true,
                    groupDeliverType: 1,
                    thumbnail: undefined,
                    headerPic: undefined,
                    aptitude: undefined,
                    name: undefined,
                    effect: undefined,
                    categoryId: undefined,
                    brandId: undefined,
                    expressType: undefined,
                    disabled: undefined, //false 正常 //true 禁用
                    isNew: undefined,
                    isHot: undefined,
                    isRecommend: undefined,
                    cartRecommend: undefined,
                    storeId: undefined, //从店铺里面拿到
                    body: undefined,
                    slide: [],
                    postage: [],
                    spec: []
                },
                hasData: false
            };
        },
        methods: {
            onSubmit(e) {
                e.preventDefault();
                let params = this.$util.deepClone(this.form);
                delete params.categoryPath;
                params.slide = params.slide.map(item => {
                    return {picUrl: item.url.replace(process.env.VUE_APP_IMAGE_BASE_URL, '')};
                });
                params.slide = JSON.stringify(params.slide);
                params.spec = params.spec.map(item => {
                    item.marketPrice = this.$util.formatPrice(item.marketPrice);
                    item.singleCost = this.$util.formatPrice(item.singleCost);
                    try {
                        item.sku = item.sku.map(sk => {
                            sk.price = this.$util.formatPrice(sk.price);
                            sk.wholesalePrice = this.$util.formatPrice(sk.wholesalePrice);
                            return sk;
                        });
                    } catch (e) {
                        item.sku = [];
                    }
                    return item;

                });
                params.spec = params.spec.filter(item => {
                    if (!item.id) {
                        if (!item.deleted) {
                            return item;
                        }
                    } else {
                        return item;
                    }
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
                api.edit(params, 'v2').then((res) => {
                    this.$util.handelHttpResponseResult(res, true, '更新成功').then(() => {
                        this.$router.back();
                    });
                }).finally(() => (this.loading = false));
            },
            getData() {
                this.loading = true;
                api.get({
                    id: this.id,
                    storeId: this.shop.id,
                    column:
                        'id,isGift,cartRecommend,isRecommend,isHot,isNew,headerPic,aptitude,categoryId,categoryName,storeId,' +
                        'deleteTime,createTime,brandId,brandName,thumbnail,effect,name,body,groupDeliverType,expressType,' +
                        'isGroupStoreItem,slide,allowEvent,videoUrl,postage,isFreeExpress,allowEvent,groupDeliverType,fictitiousSalesCount'
                }, 'v2')
                    .then((res) => {
                        this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                            // console.info(data);
                            this.setSelectClass([data.categoryPath]);
                            data.slide = JSON.parse(data.slide);
                            data.slide = data.slide.map(item => {
                                item.url = process.env.VUE_APP_IMAGE_BASE_URL + item.picUrl;
                                return item;
                            });
                            let arr = this.$util.deepClone(data.spec);
                            data.spec = arr.map(spu => {
                                if (spu.allocConfig === undefined) {
                                    spu.allocConfig = {};
                                }
                                spu.marketPrice = this.$util.priceFormat(spu.marketPrice);
                                spu.singleCost = this.$util.priceFormat(spu.singleCost);
                                if (spu.supplyPrice !== undefined) spu.supplyPrice = this.$util.priceFormat(spu.supplyPrice);
                                try {
                                    spu.sku = spu.sku.map(item => {
                                        item.wholesalePrice = this.$util.priceFormat(item.wholesalePrice);
                                        item.price = this.$util.priceFormat(item.price);
                                        return item;
                                    });
                                } catch (e) {
                                }
                                return spu;
                            });

                            try {
                                if (data.postage.length) {
                                    if (data.expressType === 2) {
                                        data.postage = data.postage.map(item => {
                                            return {
                                                method: item.method,
                                                area: item.area,
                                                first: this.$util.priceFormat(item.first),
                                                extend: this.$util.priceFormat(item.extend),
                                                batch: this.$util.priceFormat(item.batch)
                                            };
                                        });
                                    }
                                    if (data.expressType === 3) {
                                        data.postage = data.postage.map(item => {
                                            if (!item.first) item.first = {count: 0, price: 0};
                                            if (!item.extend) item.extend = {count: 0, price: 0};
                                            return {
                                                area: item.area,
                                                first: {
                                                    count: item.first.count,
                                                    price: this.$util.priceFormat(item.first.price)
                                                },
                                                extend: {
                                                    count: item.extend.count,
                                                    price: this.$util.priceFormat(item.extend.price)
                                                },
                                                isDefault: item.isDefault
                                            };
                                        });
                                    }
                                }
                            } catch (e) {
                                console.log(e);
                                data.postage = []
                            }
                            if (!data.sortId) {
                                data.sortId = 0;
                            }
                            if (!data.isTopping) {
                                data.isTopping = false;
                            }
                            data.id = this.id;
                            if (data.fictitiousSalesCount === undefined) data.fictitiousSalesCount = 0;
                            this.form = data;
                            this.hasData = true;
                        });
                    })
                    .finally(() => (this.loading = false));
            },
            _setStore() {
                try {
                    this.form.storeId = this.shop.id;
                } catch (err) {
                    // this.$message.error('请先选择店铺')
                    // this.$router.replace('/')
                }
            },
            setSelectClass(data) {
                try {
                    data.forEach((item) => {
                        if (item.category.id === undefined) return;
                        this.selectClass.push(item.category.id);
                        if (item.subCategory !== null && item.subCategory !== undefined) {
                            this.setSelectClass(item.subCategory);
                        }
                    });
                } catch (e) {
                    this.$message.warning('解析类别失败');
                }
            }
        },
        computed: {
            ...mapGetters(['shop'])
        },
        created() {
            this.id = this.$route.params.id;
        },
        mounted() {
            this._setStore();
            this.getData();
        }
    };
</script>

<style lang="scss">
</style>
