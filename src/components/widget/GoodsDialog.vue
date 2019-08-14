<template>
    <el-dialog :visible.sync="show" width="90%" top :modal-append-to-body='false' :modal="modal">
        <div slot="title" class="md-title">
            <h4>{{title}}</h4>
            <div class="search">
                <el-form :model="query" inline label-width="80px" @submit.native.prevent="getData(true)">
                    <el-form-item label="商品名称">
                        <el-input v-model="query.itemName"/>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <category-selector v-model="query.categoryId" show-all/>
                    </el-form-item>
                    <el-form-item label="商品品牌">
                        <brand-selector v-model="query.brandId" show-all class="md-select-status"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="goods-list scrollbar">
            <goods-item-card :item="item" v-for="(item, index) in table.data" :key="index">
                <el-button type="text" class="button" @click="onSelectSku(item)">
                    {{isGroupStoreItem ? '选择' : btnText}}
                </el-button>
            </goods-item-card>
        </div>
        <div slot="footer">
            <el-pagination
                    background
                    @current-change="getData"
                    :current-page.sync="query.page"
                    :page-size="query.pageSize"
                    layout="total, ->, prev, pager, next, jumper"
                    :total="table.page.total"/>
        </div>
        <item-sku-dialog :md-active.sync="skuDialog" :title="'选择商品【' + selectItem.name + '】的规格'"
                         :item-id="selectItem.id" @select="onSkuSelect"/>
    </el-dialog>
</template>

<script>
    import MdActiveMixin from "@/components/mixins/MdActiveMixin";
    import tableDataMixins from "@/components/mixins/tableDataMixins";
    import {mapGetters} from 'vuex';
    import api from '@/common/apis/goods';
    import CategorySelector from "@/components/selector/CategorySelector";
    import BrandSelector from "@/components/selector/BrandSelector";
    import GoodsItemCard from "@/components/widget/GoodsItemCard";
    import ItemSkuDialog from "@/components/widget/ItemSkuDialog";

    export default {
        name: "GoodsDialog",
        components: {ItemSkuDialog, GoodsItemCard, BrandSelector, CategorySelector},
        props: {
            title: {type: String | Number, default: '选择商品'},
            isGroupStoreItem: Boolean,
            ownerId: {type: Number | String, default: 0},
            isList: {type: Boolean},
            btnText: {type: String, default: '选择规格'},
            modal: {type: Boolean, default: true},
        },
        mixins: [MdActiveMixin, tableDataMixins],
        computed: {...mapGetters(['shop'])},
        data() {
            return {
                loading: false,
                skuDialog: false,
                selectItem: {},
                query: {
                    itemName: undefined,
                    categoryId: undefined,
                    brandId: undefined,
                    page: 1,
                    pageSize: 20,
                    column: 'id,name,thumbnail'
                }
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData: function (b) {
                if (b === true) this.query.page = 1;
                this.query.storeId = this.shop.id;
                this.query.storeId = this.shop.id;
                this.query.isGroupStoreItem = this.isGroupStoreItem;
                this.query.ownerId = this.ownerId;
                this.query.isList = this.isList;
                this.loading = true;
                api.list(this.query, 'v2').then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.page.total = data.rowCount;
                        this.table.data = data.rows;
                    });
                }).finally(() => this.loading = false)
            },
            onSelectSku(item) {
                this.selectItem = item;
                this.skuDialog = true;
            },
            onSkuSelect (sku) {
                console.info(sku);

                let newSku = {
                    ...this.selectItem,
                    skuName: sku.skuName,
                    skuId: sku.sku.id,
                    spuId: sku.sku.spuId,
                    price: sku.sku.price,
                };
                delete newSku.itemStock;
                this.show = false;
                this.$emit('onSelectSku', newSku)
            }
        }
    }
</script>

<style scoped lang="scss">
    .md-title {
        display: flex;
        align-content: center;

        > h4 {
            flex: 1;
        }

        .search {
            margin-right: 50px;
            margin-top: -20px;
        }
    }
</style>