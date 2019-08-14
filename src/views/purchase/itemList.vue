<template>
    <div class="item-list kd-flex" v-loading="loading">
        <breadcrumb :options="['商品进货', '商品列表']"/>
        <div class="main-container kd-flex-item kd-flex">
            <div class="search">
                <el-form :model="query" inline label-width="70px" @submit.native.prevent.stop="getData">
                    <el-form-item label="品牌名称">
                        <el-input v-model="query.brandName"/>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <category-selector v-model="query.categoryId" show-all/>
                    </el-form-item>
                    <el-form-item label="商品名称">
                        <el-input v-model="query.itemName"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="table.data" border class="kd-flex-item" height="100%" fit>
                <el-table-column align="center" label="商品缩略图" width="100px" fixed="left">
                    <template slot-scope="scope">
                        <img :src="scope.row.thumbnail|imgSrc" alt="" class="item-thumbnail">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="分类名称" prop="categoryName" width="120"/>
                <el-table-column align="center" label="商品名称" prop="name"/>
                <el-table-column align="center" label="品牌名称" prop="brandName"/>
                <el-table-column align="center" label="状态" width="60px">
                    <template slot-scope="scope">
                        {{scope.row | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="当前库存">
                    <template slot-scope="scope" v-if="scope.row.itemStock.currentInventory">
                        <p v-for="(s, i) in scope.row.itemStock.currentInventory" :key="i">
                            {{s.spuName}} : {{s.stock ? s.stock : 0}}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="进货库存">
                    <template slot-scope="scope" v-if="scope.row.itemStock.inStock">
                        <p v-for="(s, i) in scope.row.itemStock.inStock" :key="i">
                            {{s.spuName}} : {{s.count}}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column v-if="$util.checkPermission('wholesale',['w'])" align="center" label="管理"
                                 fixed="right" width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showItemDialog(scope.row)">下单进货</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                style="margin-top: 10px"
                @current-change="getData"
                :current-page.sync="query.page"
                :page-size="query.pageSize"
                layout="total, ->, prev, pager, next, jumper"
                :total="table.page.total">
            </el-pagination>
        </div>
        <el-dialog title="下单" :visible.sync="dialog.status" :close-on-click-modal="false" v-loading="loading">
            <div class="item-info">
                <img :src="dialog.data.thumbnail|imgSrc" alt="">
                <div>{{dialog.data.name}}</div>
            </div>
            <el-form label-width="80px" :rules="rules" :model="form" ref="form"
                     @submit.native.prevent="addItemShoppingCart">
                <el-form-item label="商品规格" prop="skuId">
                    <item-sku-list :options="sku" @change="onSkuChange" is-wholesale-mark/>
                </el-form-item>
                <el-form-item label="进货价">
                    ￥{{$util.priceFormat(selectItem.price)}} / 平台库存:{{selectItem.stock}}
                </el-form-item>
                <el-form-item label="购买数量" prop="buyNumber">
                    <el-input-number v-model="form.buyNumber" :min="1" :max="selectItem.stock / selectItem.unit"/>
                    {{selectItem.spuName}}
                </el-form-item>
                <el-form-item label="总价">
                    ￥{{$util.priceFormat(selectItem.price * form.buyNumber * selectItem.unit)}}
                </el-form-item>
                <el-form-item align="end">
                    <el-button @click="dialog.status = false">取 消</el-button>
                    <el-button type="primary" native-type="submit">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import CategorySelector from '@/components/selector/CategorySelector';
    import api from '@/common/apis/goods';
    import itemSku from '@/common/apis/itemSku';
    import ItemSkuList from '@/components/list/ItemSkuList';
    import validator from 'el-form-validator';

    export default {
        components: {ItemSkuList, CategorySelector},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                query: {
                    itemId: undefined,
                    categoryId: undefined,
                    itemName: undefined,
                    brandName: undefined,
                    targetStoreId: undefined,
                    isPurchase: true,
                    buyList: true,
                    isGift: 2,
                    isNew: 0,
                    isHot: 0,
                    isRecommend: 0,
                    page: 1,
                    pageSize: 20,
                    sortOrder: '',
                    sortBy: 'asc',
                    disabled: 0,
                    deleted: 0,
                    column: 'id,thumbnail,categoryName,name,isNew,isHot,isRecommend,deleteTime,brandName,disabled,' +
                        'storeId,producerId,producerName'
                },
                dialog: {
                    status: false,
                    data: {}
                },
                sku: [],
                isSelected: false,
                selectItem: {
                    stock: 0
                },
                rules: {
                    skuId: {
                        required: true,
                        message: '必须选择商品规格'
                    },
                    buyNumber: [
                        {
                            required: true,
                            message: '必须输入数量'
                        },
                        {
                            rules: ['required', 'integer', 'min:1', 'max:999999'],
                            validator: validator.verification
                        }
                    ]
                },
                form: {
                    skuId: undefined,
                    buyNumber: 1
                }
            };
        },
        methods: {
            tagType(type) {
                if (type) {
                    return 'success';
                } else {
                    return 'info';
                }
            },
            getData() {
                this.loading = true;
                let params = Object.assign({}, this.query);
                params.storeId = 0;
                api.list(params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                }).finally(() => this.loading = false);
            },
            showItemDialog(item) {
                this.dialog.data = item;
                this.sku = [];
                this.selectItem = {};
                this.form = {
                    skuId: undefined,
                    buyNumber: 1
                };
                this.getItemSku();
            },
            getItemSku() {
                this.loading = true;
                api.get({id: this.dialog.data.id, column: 'id,name,thumbnail', storeId: 0}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.sku = data.spec;
                        this.dialog.status = true;
                        this.isSelected = false;
                    });
                }).finally(() => this.loading = false);
            },
            onSkuChange({sku, skuName}) {
                this.loading = true;
                itemSku.get({skuId: sku.id, storeId: this.shop.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.isSelected = true;
                        let list = [skuName];
                        let price = data.wholesalePrice ? data.wholesalePrice : 0;
                        this.form.skuId = data.id;
                        this.$refs['form'].validate();
                        this.selectItem = {
                            skuId: data.id,
                            price,
                            skuName: list,
                            spuName: data.spuName,
                            stock: data.stock ? data.stock : 0,
                            unit: data.unit
                        };
                    });
                }).finally(() => this.loading = false);
            },
            addItemShoppingCart() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if (this.form.buyNumber * this.selectItem.unit > this.selectItem.stock) {
                            return this.$message.error('库存不足');
                        }
                        this.isSelected = false;
                        this.dialog.status = false;
                        let item = {
                            name: this.dialog.data.name,
                            thumbnail: this.dialog.data.thumbnail,
                            skuName: this.selectItem.skuName,
                            price: this.selectItem.price,
                            skuId: this.form.skuId,
                            buyCount: this.form.buyNumber,
                            unit: this.selectItem.unit,
                            stock: this.selectItem.stock,
                            producerId: this.dialog.data.producerId,
                            producerName: this.dialog.data.producerName
                        };
                        this.$store.dispatch('addShoppingCarItem', item);
                        this.$message.success('添加购物车成功');
                    }
                });
            }
        },
        mounted() {
            this.query = Object.assign({}, this.query, this.$route.query);
            this.query.targetStoreId = this.shop.id;
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop', shoppingCarItems: 'shoppingCarItems'})
        }
    };
</script>

<style scoped lang="scss">
    .item-list {
        height: 100%;

        .item-thumbnail {
            height: 50px;
            min-height: 50px;
        }

        .item-info {
            display: flex;

            > img {
                flex: 0 0 100px;
                height: 100px;
                margin-right: 10px;
            }

        }
    }
</style>
