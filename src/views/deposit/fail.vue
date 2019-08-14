<template>
    <div class="kd-page-master" v-loading="loading">
        <breadcrumb :options="['预存款管理', '返佣失败记录']"/>
        <div class="main-container">
            <el-form inline @submit.native.prevent="getData">
                <el-form-item label="订单ID">
                    <el-input v-model="query.orderId"/>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input v-model="query.nickname"/>
                </el-form-item>
                <el-form-item label="用户ID">
                    <el-input v-model="query.userId"/>
                </el-form-item>
                <el-form-item label="有效时间">
                    <el-date-picker @change="changeDateRange"
                                    v-model="daterange"
                                    type="daterange"
                                    range-separator="至"
                                    value-format="timestamp"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="用户身份">
                    <lv-selector v-model="query.level"/>
                </el-form-item>
                <div class="text-right">
                    <el-form-item>
                        <el-button type="primary" native-type="submit">搜索</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="订单ID" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="$router.push({name: 'OrderRetail', query: {orderId: scope.row.order_id}})">
                            {{scope.row.order_id}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="用户昵称" align="center" prop="nickname"></el-table-column>
                <el-table-column label="用户ID" align="center" prop="user_id"></el-table-column>
                <el-table-column label="扣款失败时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="用户身份" align="center">
                    <template slot-scope="scope">
                        {{list[scope.row.user_level]}}
                    </template>
                </el-table-column>
                <el-table-column label="购买者身份" align="center">
                    <template slot-scope="scope">
                        {{list[scope.row.buy_user_level]}}
                    </template>
                </el-table-column>
                <el-table-column label="预存款需扣款金额" align="center">
                    <template slot-scope="scope">
                        {{scope.row.amount | priceFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="当前预存款余额" align="center">
                    <template slot-scope="scope">
                        {{scope.row.prestore | priceFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="管理" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="deduction(scope.row)">扣除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @current-change="getData"
                :current-page.sync="query.page"
                :page-size="query.pageSize"
                layout="total, ->, prev, pager, next, jumper"
                :total="table.page.total"/>
        </div>
    </div>
</template>

<script>
    import tableDataMixins from "@/components/mixins/tableDataMixins";
    import deleteOrDisableConfirmMixins from "@/components/mixins/deleteOrDisableConfirmMixins";
    import LvSelector from "@/components/selector/LvSelector";
    import commissionApi from '@/common/apis/commission';
    import userApi from '@/common/apis/user';
    import {mapGetters} from 'vuex'

    export default {
        components: {LvSelector},
        mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
        data() {
            return {
                loading: false,
                daterange: [],
                list: {},
                query: {
                    orderId: undefined,
                    nickname: undefined,
                    userId: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    level: undefined,
                    page: 1,
                    pageSize: 20
                }
            }
        },
        methods: {
            getData() {
                this.loading = true;
                commissionApi.selectIncomeDeposit(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount || 0;
                    })
                }).finally(() => this.loading = false)
            },
            getUserLevel () {
                userApi.getUserLevel(this.shop.id).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        let list = {};
                        for (let key in data) {
                            switch (key) {
                                case 'lv1':
                                    list['1'] = data[key].name;
                                    break;
                                case 'lv2':
                                    list['2'] = data[key].name;
                                    break;
                                case 'lv3':
                                    list['3'] = data[key].name;
                                    break;
                                case 'lv9':
                                    list['9'] = data[key].name;
                                    break;
                                case 'lv10':
                                    list['10'] = data[key].name;
                                    break;
                            }
                        }
                        this.list = list;
                    });
                });
            },
            deduction (item) {
                let name = item.nickname || '';
                this.$util.actionConfirm(`是否扣除${name}的${this.$util.priceFormat(item.amount)}的预存款`).then(() => {
                    this.loading = true;
                    commissionApi.doDeductIncomeDeposit(item.alloc_id).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '处理成功').then(() => {
                            this.getData()
                        })
                    }).finally(() => this.loading = false)
                })
            }
        },
        mounted() {
            this.query.storeId = this.shop.id;
            this.getData();
            this.getUserLevel();
        },
        computed: {
            ...mapGetters(['shop'])
        }
    }
</script>

<style scoped>

</style>
