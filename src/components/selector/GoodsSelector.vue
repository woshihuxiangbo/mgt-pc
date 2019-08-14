<template>
    <div class="store-selector">
        <el-button type="text" @click="openDialog()" :disabled="disabled">选择商品</el-button>
        <el-dialog title="选择商品" :visible.sync="dialog" v-loading="loading" :modal-append-to-body='false' width="80%"
                   :modal="modal">
            <el-dialog title="选择规格" :visible.sync="skuDialog" append-to-body :modal="true" v-loading="loading">
                <item-sku-list :options="sku" @change="onSelectChange" v-loading="loading"/>
                <p style="line-height: 30px">单价: {{$util.priceFormat(select.item.price * select.item.unit)}}</p>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="onEnterSelectSku">确认选择</el-button>
                </div>
            </el-dialog>
            <div class="goods-list">
                <div class="search">
                    <el-form :model="query" inline label-width="80px" @submit.native.prevent="getData">
                        <el-form-item label="商品名称">
                            <el-input v-model="query.itemName"/>
                        </el-form-item>
                        <el-form-item label="商品分类" v-if="isGift === false">
                            <category-selector v-model="query.categoryId" show-all/>
                        </el-form-item>
                        <el-form-item label="商品品牌">
                            <brand-selector v-model="query.brandId" show-all/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" native-type="submit">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="goods scrollbar">
                    <div class="goods-list-item" v-for="(o, index) in list" :key="index">
                        <el-card>
                            <img :src="o.thumbnail|imgSrc" class="image" alt="">
                            <div>
                                <span class="item-name">{{o.name}}</span>
                                <div class="item-b-p">
                                    <el-button type="text" class="button" @click="onSelectSku(o)">
                                        {{isGroupStoreItem ? '选择' : btnText}}
                                    </el-button>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
                <el-pagination
                    background
                    @current-change="getData"
                    style="margin-top: 10px"
                    :current-page.sync="query.page"
                    :page-size="query.pageSize"
                    layout="total, ->, prev, pager, next, jumper"
                    :total="pageTotal"
                ></el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    import api from '../../common/apis/goods';
    import CategorySelector from '@/components/selector/CategorySelector';
    import BrandSelector from '@/components/selector/BrandSelector';
    import skuApi from '@/common/apis/itemSku';
    import ItemSkuList from '@/components/list/ItemSkuList';
    import {mapGetters} from 'vuex';

    export default {
        name: 'GoodsSelector',
        components: {ItemSkuList, BrandSelector, CategorySelector},
        mixins: [vModelMixins],
        props: {
            value: {},
            showAll: {type: Boolean, default: false},
            modal: {type: Boolean, default: true},
            isGift: {type: Number, default: 2},
            isGroupStoreItem: Boolean,
            ownerId: {type: Number | String, default: 0},
            selectSku: {type: Boolean, default: true},
            btnText: {type: String, default: '选择规格'},
            disabled: {type: Boolean},
            isList: {type: Boolean}
        },
        data() {
            return {
                loading: false,
                list: [],
                dialog: false,
                skuDialog: false,
                pageTotal: 0,
                query: {
                    itemName: undefined,
                    categoryId: undefined,
                    brandId: undefined,
                    page: 1,
                    pageSize: 20,
                    column: 'id,name,thumbnail'
                },
                sku: [],
                select: {
                    item: {},
                    sku: {},
                    skuName: {},
                    status: false
                }
            };
        },
        methods: {
            async getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                this.query.isGroupStoreItem = this.isGroupStoreItem;
                this.query.ownerId = this.ownerId;
                this.query.isList = this.isList;
                return await api.list(this.query, 'v2').then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.list = data.rows;
                        this.pageTotal = data.rowCount;
                    });
                }).finally(() => this.loading = false);
            },
            openDialog() {
                this.dialog = true;
            },
            onSelectSku(item) {
                if (this.isGroupStoreItem === true || !this.selectSku) {
                    this.$emit('select', item);
                    this.dialog = false;
                    this.skuDialog = false;
                    return;
                }
                this.loading = true;
                api.get({id: item.id, column: 'id,name,thumbnail,categoryId', storeId: this.shop.id}, 'v2').then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        console.info(data);
                        if (!data) return this.showError('此商品没有规格可以选择');
                        this.select.item = item;
                        this.select.sku = {};
                        this.select.skuName = {};
                        this.sku = data.spec;
                        this.skuDialog = true;
                    });
                }).finally(() => this.loading = false);
            },
            onSelectChange({sku, skuName}) {
                this.loading = true;
                skuApi.get({skuId: sku.id, storeId: this.shop.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.select.status = true;
                        this.$set(this.select.item, 'spuName', data.spuName);
                        this.$set(this.select.item, 'spuId', data.spuId);
                        this.$set(this.select.item, 'skuId', data.id);
                        this.$set(this.select.item, 'unit', data.unit);
                        this.$set(this.select.item, 'price', data.price | 0);
                        let list = [skuName];
                        this.$set(this.select.item, 'skuName', list);
                        this.$emit('input', data.id);
                    });
                }).finally(() => this.loading = false);
            },
            onEnterSelectSku() {
                if (!this.select.status) return this.showError('未选择规格');
                this.dialog = false;
                this.skuDialog = false;
                this.$emit('change', this.select.item);
            },
            showError(message) {
                this.$message({
                    type: 'error',
                    message: message,
                    customClass: 'el-message-custom',
                    showClose: true
                });
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    };
</script>

<style scoped lang="scss">
    .store-selector {
        .search {
            margin-bottom: 10px;
        }

        .goods-list {
            .goods {
                max-height: 450px;
                overflow-y: auto;
                overflow-x: hidden;
                display: flex;
                flex-wrap: wrap;

                .goods-list-item {
                    flex: 0 0 250px;
                    margin: 0 10px 10px 0;

                    .item-name {
                        display: block;
                        overflow: hidden;
                        width: 100%;
                        height: 30px;
                        line-height: 30px;
                        text-overflow: ellipsis;
                        text-wrap: normal;
                    }

                    .item-b-p {
                        display: flex;

                        > span {
                            text-align: right;
                        }
                    }
                }
            }

            .image {
                width: 100%;
                height: 180px;
                display: block;
            }
        }
    }
</style>

<style lang="scss">
    .store-selector {
        .el-dialog__body {
            padding-top: 0;
        }
    }
</style>
