<template>
    <div class="main kd-flex">
        <breadcrumb :options="['团购商品', '商品列表']"/>
        <div class="container kd-flex-item kd-flex">
            <div class="action" v-if="$util.checkPermission('item',['c'])">
                <el-button type="primary" @click="onCreate">添加商品</el-button>
            </div>

            <div class="search">
                <el-form :inline="true" :model="query" ref="query">
                    <el-row>
                        <el-col :span="22">

                            <el-form-item label-width="90px" prop="mode" label="商品来源:">
                                <el-select class="switch-width" v-model="query.mode">
                                    <el-option :value="0" label="平台和本店"></el-option>
                                    <el-option :value="1" label="本店"></el-option>
                                    <el-option :value="2" label="平台"></el-option>
                                    <el-option :value="3" label="所有店铺" v-if="role.roleScope !== 2"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label-width="90px" prop="itemName" label="商品名称:">
                                <el-input type="text" v-model="query.itemName"></el-input>
                            </el-form-item>
                            <el-form-item label-width="90px" prop="brandName" label="品牌名称:">
                                <brand-selector v-model="query.brandId" show-all/>
                            </el-form-item>

                            <el-form-item label-width="60px" label="状态">
                                <el-select class="switch-width" v-model="status" @change="changeQueryStatus">
                                    <el-option :value="undefined" label="正常"></el-option>
                                    <el-option :value="1" label="已删除"></el-option>
                                    <el-option :value="2" label="已禁用"></el-option>
                                    <el-option :value="3" label="全部"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-form-item>
                                <el-button type="primary" @click="onSearch">搜索</el-button>
                                <!-- <el-button @click="resetForm('query')">清除搜索</el-button> -->
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>
            </div>
            <el-table :data="table.data" class="kd-flex-item" height="100%" border v-loading="loading">
                <el-table-column prop="thumbnail" label="商品图片" width="80" align="center">
                    <template slot-scope="scope">
                        <img width="60" height="60" :src="scope.row.thumbnail|imgSrc" class="img-table" alt>
                    </template>
                </el-table-column>
                <el-table-column prop="storeName" label="店铺名称" width="120" align="center" v-if="role.roleScope !== 2"/>
                <el-table-column prop="categoryName" label="分类名称" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
                <!--<el-table-column prop="marketPrice" width="120" label="市场价格(元)" align="center">-->
                <!--<template slot-scope="scope">{{scope.row.marketPrice|priceFormat}}</template>-->
                <!--</el-table-column>-->

                <el-table-column prop="salesCount" label="销售次数" width="100" align="center">
                    <template slot-scope="scope">{{scope.row.salesCount||'0'}}</template>
                </el-table-column>
                <el-table-column prop="salesAmount" label="销售金额(元)" width="150" align="center">
                    <template slot-scope="scope">{{scope.row.salesAmount|priceFormat}}</template>
                </el-table-column>

                <el-table-column prop="brandName" label="品牌名称" width="200" align="center"></el-table-column>


                <el-table-column label="商品状态" width="100" align="center">
                    <template slot-scope="scope">{{scope.row | statusFilter}}</template>
                </el-table-column>
                <el-table-column fixed="right" label="管理" width="150" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" @click="onClickSlider(scope.row)">轮播图</el-button> -->
                        <!-- <el-button type="text" @click="onClickSku(scope.row)">规格</el-button> -->
                        <el-button type="text" @click="onClickInventory(scope.row)"
                                   v-if="$util.checkPermission('item',['l'])">库存管理
                        </el-button>
                        <br>
                        <el-button type="text" v-if="checkPerms(scope.row, ['u'])" @click="onEdit(scope.row)">
                            编辑
                        </el-button>
                        <el-button v-if="checkPerms(scope.row, ['d'])" type="text" @click="switchDeleted(scope.row)">
                            {{scope.row.deleteTime ? '恢复' : '删除'}}
                        </el-button>
                        <el-button v-if="checkPerms(scope.row, ['d'])" type="text" @click="switchDisabled(scope.row)">
                            {{scope.row.disabled ? '启用' : '禁用'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    @current-change="pageChange"
                    style="margin-top: 10px"
                    :current-page.sync="query.page"
                    :page-size="query.pageSize"
                    layout="total, ->, prev, pager, next, jumper"
                    :total="table.page.total"
            ></el-pagination>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .main {
        height: 100%;

        .switch-width {
            width: 120px;
        }
    }
</style>
<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';
    import api from '@/common/apis/goods';
    import {mapGetters} from 'vuex';
    import BrandSelector from '@/components/selector/BrandSelector';

    export default {
        name: 'GoodsList',
        mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
        components: {BrandSelector},
        data() {
            return {
                form: {},
                dialog: {
                    show: false,
                    title: '规格列表',
                    skuShow: false
                },
                loading: false,
                status: undefined,
                table: {
                    data: [],
                    page: {
                        total: 0
                    }
                },
                //  权限管理 商品列表接口参数
                // mode:0 自己和平台  //默认
                // mode:1 只有自己
                // mode:2 只有平台
                // mode:3 所有的商品
                query: {
                    mode: 0, //默认0
                    name: undefined,
                    page: 1,
                    pageSize: 20,
                    sortOrder: 'id',
                    sortBy: 'asc',
                    disabled: 0,
                    deleted: 0,
                    storeId: undefined,
                    groupDeliverType: undefined, // 只有团购 发货方式 0-全部，1-线上发货，2-线下取货
                    column:
                        'id,isRecommend,isHot,isNew,cartRecommend,headerPic,aptitude,categoryId,categoryName,deleteTime,createTime,brandId,brandName,thumbnail,effect,name,disabled,storeName,salesCount,salesAmount,groupDeliverType'
                },
                typeName: '商品'
            };
        },
        computed: {
            ...mapGetters(['shop', 'role'])
        },
        created() {
            this.query = Object.assign({}, this.query, this.$route.query);
            this.query.storeId = this.shop.id;
            this.getData();
        },

        methods: {
            tagType(type) {
                if (type) {
                    return 'success';
                } else {
                    return 'info';
                }
            },
            // onClickSku(item) {
            //     this.$router.push({name: 'salesmanGoodsSku', params: {id: item.id}});
            // },
            // 库存
            onClickInventory(item) {
                this.$router.push({name: 'groupGoodsInventory', params: {id: item.id}, query: {name: item.name}});
            },
            onSearch() {
                this.getData();
            },
            pageChange() {
                this.getData();
            },
            onEdit(item) {
                this.$router.push({name: 'groupGoodsEdit', params: {id: item.id}});
            },
            // 添加
            onCreate() {
                this.$router.push({name: 'groupGoodsAdd'});
            },
            switchDeleted(item) {
                this.onDeleted(item, api);
            },
            switchDisabled(item) {
                this.onDisabled(item, api);
            },
            // 获取数据
            getData() {
                this.loading = true;
                api.list(this.query)
                    .then((res) => {
                        this.$util.handelHttpResponseResult(res).then((data) => {
                            this.table.data = data.data.rows;
                            this.table.page.total = data.data.rowCount;
                        });
                    })
                    .finally(() => (this.loading = false));
            },
            checkPerms(item, perms) {
                return this.$util.checkPermission('item', perms) &&
                    (item.storeId === 0 ? ['1', '11'].indexOf(this.role.roleID) !== -1 : true);
            }
        }
    };
</script>
