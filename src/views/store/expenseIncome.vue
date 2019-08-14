<template>
    <div class="md-expense-income" v-loading="loading">
        <div class="main-container">
            <el-form @submit.native.prevent="getData(true)" inline ref="search" :model="query">
                <el-form-item label="订单ID/充值业务ID" prop="id">
                    <el-input v-model="query.extId"/>
                </el-form-item>
                <el-form-item label="摘要" prop="status">
                    <el-select v-model="query.tradeType" :value="query.tradeType" style="width: 150px;">
                        <el-option :value="undefined" label="全部"/>
                        <el-option value="1" label="购买商品抵扣货款"/>
                        <el-option value="2" label="充值"/>
                        <el-option value="3" label="扣款"/>
                        <el-option value="4" label="退款"/>
                    </el-select>
                </el-form-item>
                <el-form-item prop="startTime" class="hidden"/>
                <el-form-item prop="endTime" class="hidden"/>
                <el-form-item label="余额变化时间" prop="time">
                    <el-date-picker
                        @change="changeDateRange"
                        v-model="query.time"
                        type="daterange"
                        range-separator="至"
                        value-format="timestamp"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">查询</el-button>
                    <el-button type="primary" @click="resetQuery">清空</el-button>
                    <el-button type="primary" @click="exportData" v-loading="exporting">导出</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="店铺名" align="center" prop="storeName" v-if="shop.id === '0'"/>
                <el-table-column label="预存款发生额" align="center">
                    <template slot-scope="scope">
                        {{scope.row.amount | priceFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="预存款余额" align="center">
                    <template slot-scope="scope">
                        {{scope.row.remainAmount | priceFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="摘要" align="center">
                    <template slot-scope="scope">
                        {{scope.row.tradeType | tradeTypeFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="余额变化时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="订单ID/充值业务ID" align="center" prop="extId"/>
            </el-table>
            <el-pagination background @current-change="getData(false)" style="margin-top: 10px"
                           :current-page.sync="query.pageNum" :page-size="query.pageSize"
                           layout="total, ->, prev, pager, next, jumper" :total="table.page.total"/>
        </div>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import {mapGetters} from 'vuex';
    import api from '@/common/apis/order';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                exporting: false,
                query: {
                    storeId: undefined,
                    time: [],
                    extId: undefined,
                    tradeType: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    pageNum: 1,
                    pageSize: 20
                }
            };
        },
        computed: {
            ...mapGetters(['shop'])
        },
        methods: {
            getData(isSearch) {
                if (isSearch) this.query.pageNum = 1;
                this.query.storeId = this.shop.id;
                this.loading = true;
                let params = this.$util.deepClone(this.query);
                delete params.time;
                api.findCashRecordByCondition(params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.page.total = data.total;
                        this.table.data = data.list;
                    });
                }).finally(() => this.loading = false);
            },
            resetQuery() {
                this.query = {
                    storeId: undefined,
                    time: [],
                    extId: undefined,
                    tradeType: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    pageNum: this.query.pageNum,
                    pageSize: 20
                };
            },
            exportData() {
                this.exporting = true;
                api.cashTradRecordExport(this.query, {}).then(res => {
                    let fileName = '预存贷款 ' + new Date().toLocaleString() + '.xlsx';
                    this.$util.xhrDownloadFileHandel(res.data, fileName)
                }).finally(() => this.exporting = false);
            }
        },
        mounted() {
            this.getData();
        },
        filters: {
            tradeTypeFilter(v) {
                switch (v) {
                    case 1:
                        return '购买商品抵扣货款';
                    case 2:
                        return '充值';
                    case 3:
                        return '扣款';
                    case 4:
                        return '退款';
                }
            }
        }
    };
</script>

<style scoped>

</style>
