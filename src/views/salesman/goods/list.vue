<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:15:31
 * @LastEditTime: 2019-08-14 14:28:19
 * @LastEditors: Please set LastEditors
 -->
<template>
    <div class="main kd-flex">
        <breadcrumb :options="['商品管理', '商品列表']" />

        <div class="container kd-flex-item kd-flex">
            <div class="action" v-if="$util.checkPermission('item',['c'])">
                <el-button type="primary" @click="onCreate">添加商品</el-button>
            </div>

            <div class="search">
                <el-form
                    :inline="true"
                    :model="query"
                    ref="query"
                    @submit.native.prevent="onSearch"
                >
                    <el-row>
                        <el-col :span="22">
                            <!-- <el-form-item prop="mode" label="商品来源:">
                                <el-select
                                    class="switch-width"
                                    v-model="query.mode"
                                    :value="query.mode"
                                >
                                    <el-option :value="0" label="平台和本店"></el-option>
                                    <el-option :value="1" label="本店"></el-option>
                                    <el-option :value="2" label="平台"></el-option>
                                    <el-option :value="3" label="所有店铺" v-if="role.roleScope !== 2"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="itemName" label="商品名称:">
                                <el-input type="text" v-model="query.itemName"></el-input>
                            </el-form-item>
                            <el-form-item prop="brandName" label="品牌名称:">
                                <brand-selector type="text" v-model="query.brandId" show-all />
                            </el-form-item>
                            <el-form-item prop="categoryId" label="分类">
                                <category-selector v-model="query.categoryId" show-all />
                            </el-form-item>
                            <el-form-item label="状态">
                                <el-select
                                    class="switch-width"
                                    v-model="status"
                                    @change="changeQueryStatus"
                                    :value="status"
                                >
                                    <el-option :value="undefined" label="正常"></el-option>
                                    <el-option :value="1" label="已删除"></el-option>
                                    <el-option :value="2" label="已禁用"></el-option>
                                    <el-option :value="3" label="全部"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item prop="isNew" label="新品:">
                                <el-select
                                    class="switch-width"
                                    v-model="query.isNew"
                                    :value="query.isNew"
                                >
                                    <el-option :value="undefined" label="全部"></el-option>
                                    <el-option value="1" label="是"></el-option>
                                    <el-option value="2" label="否"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="isHot" label="热销:">
                                <el-select
                                    class="switch-width"
                                    v-model="query.isHot"
                                    :value="query.isHot"
                                >
                                    <el-option :value="undefined" label="全部"></el-option>
                                    <el-option value="1" label="是"></el-option>
                                    <el-option value="2" label="否"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="isRecommend" label="推荐:">
                                <el-select
                                    class="switch-width"
                                    v-model="query.isRecommend"
                                    :value="query.isRecommend"
                                >
                                    <el-option :value="undefined" label="全部"></el-option>
                                    <el-option value="1" label="是"></el-option>
                                    <el-option value="2" label="否"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="cartRecommend" label="购物车推荐:">
                                <el-select
                                    class="switch-width"
                                    v-model="query.cartRecommend"
                                    :value="query.cartRecommend"
                                >
                                    <el-option :value="undefined" label="全部"></el-option>
                                    <el-option value="1" label="是"></el-option>
                                    <el-option value="2" label="否"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="cartRecommend" label="审核状态">
                                <el-select
                                    class="switch-width"
                                    v-model="query.verifyStatus"
                                    :value="query.verifyStatus"
                                >
                                    <el-option :value="undefined" label="全部"></el-option>
                                    <el-option value="1" label="审核中"></el-option>
                                    <el-option value="2" label="审核通过"></el-option>
                                    <el-option value="3" label="拒绝"></el-option>
                                </el-select>
                            </el-form-item>-->
                            <!-- ================================================================= -->
                            <el-form-item prop="cartRecommend" label="厂家">
                                <el-input type="text"></el-input>
                            </el-form-item>
                            <el-form-item prop="cartRecommend" label="品牌">
                                <el-input type="text"></el-input>
                            </el-form-item>
                            <el-form-item prop="cartRecommend" label="厂家编码">
                                <el-input type="text"></el-input>
                            </el-form-item>
                            <el-form-item prop="cartRecommend" label="商品编码">
                                <el-input type="text"></el-input>
                            </el-form-item>
                            <el-form-item prop="cartRecommend" label="商品名称">
                                <el-input type="text"></el-input>
                            </el-form-item>
                            <br />
                            <el-form-item prop="mode" label="平台">
                                <el-select style="width:202px">
                                    <el-option :value="0" label="全部"></el-option>
                                    <el-option :value="1" label="saas"></el-option>
                                    <el-option :value="2" label="店铺上架"></el-option>
                                    <el-option :value="3" label="本店"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item prop="categoryId" label="分类">
                                <category-selector show-all style="width:200px" />
                            </el-form-item>
                            <el-form-item prop="categoryId" label="前端推荐">
                                <el-select style="width:202px">
                                    <el-option :value="0" label="全部"></el-option>
                                    <el-option :value="1" label="新品"></el-option>
                                    <el-option :value="2" label="热销"></el-option>
                                    <el-option :value="3" label="购物车"></el-option>
                                    <el-option :value="3" label="首页推荐"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="商品状态">
                                <el-select
                                    style="width:202px"
                                    class="switch-width"
                                    v-model="status"
                                    @change="changeQueryStatus"
                                    :value="status"
                                >
                                    <el-option :value="undefined" label="正常在售"></el-option>
                                    <el-option :value="1" label="已删除"></el-option>
                                    <el-option :value="2" label="已禁用"></el-option>
                                    <el-option :value="3" label="全部"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="下单时间">
                                <el-date-picker
                                    style="width:300px"
                                    @change="changeDateRange"
                                    v-model="time"
                                    type="daterange"
                                    range-separator="至"
                                    value-format="timestamp"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                ></el-date-picker>
                            </el-form-item>
                            <!-- ================================================================= -->
                        </el-col>
                        <el-col :span="2">
                            <el-form-item>
                                <el-button type="primary" native-type="submit">过滤</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="success">导出</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <el-table :data="tableData" border :span-method="objectSpanMethod">
                <el-table-column prop="id" label="排序ID" align="center"></el-table-column>
                <el-table-column prop="val1" label="商品编码" align="center"></el-table-column>
                <el-table-column prop="val2" label="商品图" align="center"></el-table-column>
                <el-table-column prop="name" label="二维码" align="center"></el-table-column>
                <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="name" label="分类" align="center"></el-table-column>
                <el-table-column prop="name" label="品牌" align="center"></el-table-column>
                <el-table-column prop="name" label="厂家" align="center"></el-table-column>
                <el-table-column prop="name" label="厂家编码" align="center"></el-table-column>
                <el-table-column prop="name" label="规格" align="center"></el-table-column>
                <el-table-column prop="name" label="可售库存" align="center"></el-table-column>
                <el-table-column prop="name" label="厂家供货价" align="center"></el-table-column>
                <el-table-column prop="name" label="商城销售价" align="center"></el-table-column>
                <el-table-column prop="name" label="商城进货价" align="center"></el-table-column>
                <el-table-column prop="name" label="本月销售额" align="center"></el-table-column>
                <el-table-column prop="name" label="本月退款额" align="center"></el-table-column>
                <el-table-column prop="name" label="管理" align="center"></el-table-column>
            </el-table>
            <!-- <el-table
                :data="table.data"
                class="kd-flex-item"
                height="100%"
                border
                v-loading="loading">
                <el-table-column prop="thumbnail" label="商品图片" width="80" align="center">
                    <template slot-scope="scope">
                        <img
                            width="60"
                            height="60"
                            :src="scope.row.thumbnail|imgSrc"
                            class="img-table"
                            alt
                        />
                    </template>
                </el-table-column>
                <el-table-column label="商品小程序码" width="120" align="center" v-if="shop.id !== '0'">
                    <template slot-scope="scope">
                        <mini-program-qr-code :item-id="scope.row.id" />
                    </template>
                </el-table-column>
                <el-table-column
                    prop="storeName"
                    label="店铺名称"
                    width="120"
                    align="center"
                    v-if="role.roleScope !== 2"
                />
                <el-table-column prop="categoryName" label="分类名称" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="sortId" label="排序ID" align="center"></el-table-column>
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
                <el-table-column label="审核状态" align="center">
                    <template slot-scope="scope">{{getVerifyStatusText(scope.row)}}</template>
                </el-table-column>
                <el-table-column label="团长名称" align="center" v-if="role.roleID !== '14'">
                    <template slot-scope="scope">{{scope.row.managerName}}</template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="管理"
                    width="150"
                    align="center"
                    v-if="$util.checkPermission('item',['u', 'd'])"
                >
                    <template slot-scope="scope">

                        <el-button
                            type="text"
                            @click="verifyItem(scope.row)"
                            v-if="$util.checkPermission('verify', ['f', 's', 'l']) && scope.row.verifyStatus === 1"
                        >审核</el-button>
                        <el-button
                            type="text"
                            @click="onClickInventory(scope.row)"
                            v-if="$util.checkPermission('item',['u']) && scope.row.verifyStatus === 2"
                        >库存管理</el-button>
                        <el-button
                            type="text"
                            v-if="$util.checkPermission('item', ['u']) && scope.row.verifyStatus === 2 && role.roleID !== '14'"
                            @click="onEdit(scope.row)"
                        >编辑</el-button>
                        <el-button
                            v-if="checkPerms(scope.row, ['d'])"
                            type="text"
                            @click="switchDeleted(scope.row)"
                        >{{scope.row.deleteTime ? '恢复' : '删除'}}</el-button>
                        <el-button
                            v-if="checkPerms(scope.row, ['d'])"
                            type="text"
                            @click="switchDisabled(scope.row)"
                        >{{scope.row.disabled ? '启用' : '禁用'}}</el-button>
                    </template>
                </el-table-column>
            </el-table>-->
            <el-pagination
                background
                @current-change="pageChange"
                style="margin-top: 10px"
                :current-page.sync="query.page"
                :page-size="query.pageSize"
                layout="total, ->, prev, pager, next, jumper"
                :total="table.page.total"
            />
        </div>
    </div>
</template>

<script>
import tableDataMixins from '@/components/mixins/tableDataMixins';
import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';
import api from '@/common/apis/goods';
import {mapGetters} from 'vuex';
import BrandSelector from '@/components/selector/BrandSelector';
import MiniProgramQrCode from '@/components/widget/MiniProgramQrCode';
import CategorySelector from '@/components/selector/CategorySelector';

export default {
    name: 'GoodsList',
    mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
    components: {CategorySelector, MiniProgramQrCode, BrandSelector},
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
            isGetting: false,
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
                page: 1,
                pageSize: 20,
                disabled: 0,
                deleted: 0,
                isHot: undefined,
                cartRecommend: undefined,
                isNew: undefined,
                isRecommend: undefined,
                verifyStatus: undefined,
                groupDeliverType: undefined, // 只有团购 发货方式 0-全部，1-线上发货，2-线下取货,
                ownerId: undefined
            },
            typeName: '商品',
            column:
                'id,isRecommend,isHot,isNew,cartRecommend,headerPic,aptitude,categoryId,categoryName,' +
                'deleteTime,createTime,brandId,brandName,thumbnail,effect,name,disabled,storeName,salesCount,' +
                'salesAmount,groupDeliverType,storeId,verifyStatus,refuseReason,managerName,owner,sortId',
            oldPage: undefined,
            spanArr: [],
            tableData: [
                {id: 123, val1: 'hu', val2: 'hux', name: 'xxxx'},
                {id: 123, val1: 'hu', val2: 'hux', name: 'xxxx'},
                {id: 123, val1: 'hu', val2: 'hux', name: 'xxxx'},
                {id: 1234, val1: 'hu', val2: 'hux', name: 'xxxx'},
                {id: 1234, val1: 'hu', val2: 'hux', name: 'xxxx'},
                {id: 1235, val1: 'hu', val2: 'hux', name: 'xxxx'},
                {id: 1236, val1: 'hu', val2: 'hux', name: 'xxxx'},
                {id: 123, val1: 'hu', val2: 'hux', name: 'xxxx'}
            ]
        };
    },
    computed: {
        ...mapGetters(['shop', 'role'])
    },
    mounted() {
        if (this.role.roleID === '14') {
            this.query.disabled = 2;
            this.query.deleted = 2;
            this.status = 3;
        }
        this.init();
        this.comp();
    },

    methods: {
        comp() {
            let spanArr = [],
                contactDot = 0;
            this.tableData.forEach((item, index) => {
                if (index === 0) {
                    spanArr.push(1);
                } else {
                    if (item.id === this.tableData[index - 1].id) {
                        spanArr[contactDot] += 1;
                        spanArr.push(0);
                    } else {
                        spanArr.push(1);
                        contactDot = index;
                    }
                }
            });
            this.spanArr = spanArr;
            // console.log(this.spanArr);
        },
        objectSpanMethod({row, column, rowIndex, columnIndex}) {
            if (columnIndex < 9) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                };
            }
        },
        init() {
            this.query = Object.assign(
                {},
                this.$util.deepClone(this.query),
                this.$util.conversionRouterParamsToInteger(this.$route.query, ['mode', 'page', 'pageSize'])
            );
            this.oldPage = parseInt(this.query.page);
            this.getData();
        },
        tagType(type) {
            if (type) {
                return 'success';
            } else {
                return 'info';
            }
        },
        onClickInventory(item) {
            this.$router.push({name: 'salesmanInventory', params: {id: item.id}, query: {name: item.name}});
        },
        onSearch() {
            this.query.page = 1;
            this.getData();
        },
        pageChange() {
            this.getData();
        },
        onEdit(item) {
            this.$router.push({name: 'salesmanGoodsEdit', params: {id: item.id}});
        },
        // 添加
        onCreate() {
            this.$router.push({name: 'salesmanGoodsAdd'});
        },
        switchDeleted(item) {
            this.onDeleted(item, api);
        },
        switchDisabled(item) {
            this.onDisabled(item, api);
        },
        // 获取数据
        getData() {
            if (this.isGetting !== false) return;
            this.loading = true;
            this.isGetting = true;
            api.list({...this.query, column: this.column, storeId: this.shop.id}, 'v2')
                .then((res) => {
                    this.$util.handelHttpResponseResult(res).then(({data}) => {
                        this.loadTime = new Date().getTime() + 1000;
                        this.$router.replace({name: 'salesmanGoods', query: this.query});
                        setTimeout(() => {
                            this.$router.replace({name: 'salesmanGoods', query: this.query});
                        }, 50);
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                        if (this.oldPage !== undefined) {
                            this.query.page = 1;
                            this.$nextTick(() => {
                                this.query.page = this.oldPage;
                                this.oldPage = undefined;
                            });
                        }
                    });
                })
                .finally(() => {
                    this.loading = false;
                    this.isGetting = false;
                });
        },
        checkPerms(item, perms) {
            return this.$util.checkPermission('item', perms) && (item.storeId === '0' ? this.role.roleScope !== 2 : true);
        },
        resetForm() {
            this.resetQuery();
            this.$router.replace({name: 'salesmanGoods', query: this.query});
        },
        resetQuery() {
            this.query = Object.assign({}, this.query, {
                mode: 0, //默认0
                itemName: undefined,
                page: 1,
                pageSize: 20,
                sortOrder: 'id',
                sortBy: 'asc',
                disabled: 0,
                deleted: 0,
                categoryId: undefined,
                storeId: undefined,
                isHot: undefined,
                cartRecommend: undefined,
                isNew: undefined,
                isRecommend: undefined,
                brandId: undefined,
                ownerId: undefined
            });
            this.getData();
        },

        getVerifyStatusText(item) {
            switch (item.verifyStatus) {
                case 1:
                    return '审核中';
                case 2:
                    return '审核通过';
                case 3:
                    return `审核拒绝[${item.refuseReason}]`;
            }
        },
        verifyItem(item) {
            this.$router.push({name: 'salesmanGoodsEdit', params: {id: item.id}, query: {verify: true}});
        }
    },
    watch: {
        $route() {
            this.$nextTick(() => {
                if (this.loadTime < new Date().getTime()) {
                    this.resetQuery();
                    this.init();
                }
            });
        }
    }
};
</script>
