<template>
    <div class="md-deposit" v-loading="loading">
        <breadcrumb :options="['预存款管理', '预存款明细']"/>
        <div class="main-container">
            <el-form @submit.native.prevent="getData" inline>
                <el-form-item label="摘要">
                    <el-select v-model="query.type" :value="query.type">
                        <el-option :value="undefined" label="全部"/>
                        <el-option value="4" label="佣金转入"/>
                        <el-option value="2" label="商品销售或退款"/>
                        <el-option value="1" label="存入"/>
                        <el-option value="3" label="发展下级"/>
                    </el-select>
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
                <el-form-item>
                    <el-button type="primary" native-type="submit">查询</el-button>
                    <el-button type="primary" @click="clearQuery">清空</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="进出账金额" align="center">
                    <template slot-scope="scope">
                        {{scope.row.amount | priceFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="摘要" align="center" prop="type">
                    <template slot-scope="scope">
                        {{scope.row.type | typeFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createTime | dateFilter}}
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
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import api from '@/common/apis/deposit';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                queryTime: [],
                query: {
                    type: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    page: 1,
                    pageSize: 20
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;
                api.selectDepositDetail(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                }).finally(() => this.loading = false);
            },
            clearQuery() {
                this.queryTime = [];
                this.query = {
                    type: '1',
                    startTime: undefined,
                    endTime: undefined,
                    page: 1,
                    pageSize: 20
                };
            }
        },
        created() {
            this.query.userId = this.$route.params.id;
            this.getData();
        },
        filters: {
            typeFilter (v) {
                switch (v) {
                    case 1: return '存入';
                    case 2: return '商品销售或退款';
                    case 3: return '发展下级';
                    case 4: return '佣金转入';
                    default: return '-';
                }
            }
        }
    };
</script>

<style scoped>

</style>
