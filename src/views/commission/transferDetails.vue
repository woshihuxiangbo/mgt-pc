<template>
    <div class="md-deposit" v-loading="loading">
        <breadcrumb :options="['佣金管理', '佣金转账明细']"/>
        <div class="main-container">
            <el-form :model="query" inline @submit.native.prevent="getData">
                <el-form-item label="转账类型">
                    <el-select v-model="query.type" :value="query.type">
                        <el-option :value="undefined" label="全部"></el-option>
                        <el-option value="1" label="提现"></el-option>
                        <el-option value="2" label="转预存款"></el-option>
                    </el-select>
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
                <el-form-item label="申请时间">
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
                    <el-select v-model="query.state" :value="query.state">
                        <el-option :value="undefined" label="全部"></el-option>
                        <el-option value="2" label="成功"></el-option>
                        <el-option value="3" label="失败"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转账方式">
                    <el-select :value="query.transferType" v-model="query.transferType">
                        <el-option :value="undefined" label="全部"></el-option>
                        <el-option value="1" label="线上"></el-option>
                        <el-option value="2" label="线下"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">查询</el-button>
                    <el-button type="primary" @click="clearQuery">清空</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="用户昵称" align="center" prop="nickname"></el-table-column>
                <el-table-column label="用户ID" align="center" prop="userid"></el-table-column>
                <el-table-column label="用户角色" align="center">
                    <template slot-scope="scope">{{levelFilter(scope.row.level)}}</template>
                </el-table-column>
                <el-table-column label="申请转账金额" align="center">
                    <template slot-scope="scope">
                        {{scope.row.amount | priceFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="转账类型" align="center">
                    <template slot-scope="scope">
                        {{scope.row.type === 2 ? '转预存款' : '提现'}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">{{scope.row.state | stateFilter}}</template>
                </el-table-column>
                <el-table-column label="转账方式" align="center">
                    <template slot-scope="scope">{{scope.row.transfertype === 1 ? '线上' : '线下'}}</template>
                </el-table-column>
                <el-table-column label="申请时间" align="center">
                    <template slot-scope="scope">{{scope.row.createtime | dateFilter}}</template>
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
                    type: undefined,
                    userId: undefined,
                    nickName: undefined,
                    level: undefined,
                    endTime: undefined,
                    startTime: undefined,
                    state: undefined,
                    transferType: undefined,
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
                api.selectTransferRecordDetail(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                }).finally(() => this.loading = false)
            },
            clearQuery() {
                // TODO 其他查询参数
                this.queryTime = [];
                this.query = Object.assign({}, this.query, {
                    type: undefined,
                    userId: undefined,
                    nickName: undefined,
                    level: undefined,
                    endTime: undefined,
                    startTime: undefined,
                    state: undefined,
                    transferType: undefined,
                });
            },
            onGetLevelData(lv) {
                console.info(lv);
                this.levels = lv;
            },
            levelFilter(v) {
                let name = '-';
                this.levels.forEach((item) => {
                    if (item.value === v + '') {
                        name = item.label;
                    }
                });
                return name;
            }
        },
        mounted () {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        },
        filters: {
            stateFilter (v) {
                switch (v) {
                    case 1:
                        return '-';
                    case 2:
                        return '成功';
                    case 3:
                        return '失败';
                }
            }
        }
    };
</script>

<style scoped>

</style>
