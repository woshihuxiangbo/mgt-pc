<template>
    <div class="md-deposit" v-loading="loading">
        <breadcrumb :options="['佣金管理', '团购商品盈利']"/>
        <div class="main-container">
            <el-form :model="query" inline @submit.native.prevent="getData">
                <el-form-item label="订单ID">
                    <el-input v-model="query.id"/>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input v-model="query.nickName"/>
                </el-form-item>
                <el-form-item label="用户ID">
                    <el-input v-model="query.userId"/>
                </el-form-item>
                <el-form-item label="用户角色">
                    <lv-selector v-model="query.level" show-all is-advanced @onGetData="onGetLevelData"/>
                </el-form-item>
                <el-form-item label="时间">
                    <el-date-picker v-model="queryTime"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions" @change="changeDateRange"/>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select :value="query.state" v-model="query.state">
                        <el-option :value="undefined" label="全部"/>
                        <el-option value="1" label="已结算"/>
                        <el-option value="2" label="未结算"/>
                        <el-option value="3" label="已失效"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">查询</el-button>
                    <el-button type="primary" @click="clearQuery">清空</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="订单ID" align="center" prop="orderid"></el-table-column>
                <el-table-column label="用户昵称" align="center" prop="nickname"></el-table-column>
                <el-table-column label="用户ID" align="center" prop="userid"></el-table-column>
                <el-table-column label="用户角色" align="center">
                    <template slot-scope="scope">{{levelFilter(scope.row.level)}}</template>
                </el-table-column>
                <el-table-column label="商品消费金额" align="center">
                    <template slot-scope="scope">
                        {{scope.row.orderamount | priceFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="收入金额" align="center">
                    <template slot-scope="scope">
                        {{scope.row.amount | priceFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{scope.row.status | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="收入时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createtime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="管理" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toOrderPage(scope.row)">查看订单详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background @current-change="getData"
                           :current-page.sync="query.page" :page-size="query.pageSize"
                           layout="total, ->, prev, pager, next, jumper" :total="table.page.total"/>
        </div>
    </div>
</template>

<script>
    import LvSelector from '@/components/selector/LvSelector';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import api from '@/common/apis/commission';
    import {mapGetters} from 'vuex';

    export default {
        components: {LvSelector},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                queryTime: [],
                query: {
                    orderType: undefined,
                    id: undefined,
                    nickName: undefined,
                    userId: undefined,
                    level: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    state: undefined,
                    distinguish: 2,
                    pageSize: 20,
                    page: 1
                },
                levels: []
            };
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                api.selectNormalOrder(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                }).finally(() => this.loading = false);
            },
            clearQuery() {
                this.queryTime = [];
                this.query = Object.assign({}, this.query, {
                    orderType: undefined,
                    id: undefined,
                    nickName: undefined,
                    userId: undefined,
                    level: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    state: undefined,
                });
            },
            onGetLevelData(lv) {
                console.info(lv);
                this.levels = lv;
            },
            levelFilter(v) {
                let name = '';
                this.levels.forEach((item) => {
                    if (item.value === v + '') {
                        name = item.label;
                    }
                });
                return name;
            },
            toOrderPage(item) {
                this.$router.push({name: 'OrderRetail', query: {orderId: item.orderid, hideSearch: true}});
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        },
        filters: {
            statusFilter(n) {
                switch (n) {
                    case 1:
                        return '未结算';
                    case 2:
                        return '已结算';
                    case 3:
                        return '已失效';
                    default:
                        return '-';
                }
            }
        }
    };
</script>

<style scoped>

</style>
