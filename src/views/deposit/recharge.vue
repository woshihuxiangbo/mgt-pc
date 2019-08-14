<template>
    <div class="md-deposit-recharge" v-loading="loading">
        <div class="main-container">
            <el-form @submit.native.prevent="getData()" inline>
                <el-form-item label="店铺名">
                    <el-input v-model="query.storeName"/>
                </el-form-item>
                <el-form-item label="余额范围">
                    <el-input-number v-model="query.minAmount" :min="0" :max="999999999"/>
                    <span> 到 </span>
                    <el-input-number v-model="query.maxAmount" :min="0" :max="999999999"/>
                </el-form-item>
                <el-form-item label="最后充值时间">
                    <el-date-picker
                        @change="changeDateRange"
                        v-model="time"
                        type="daterange"
                        range-separator="至"
                        value-format="timestamp"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">查询</el-button>
                    <el-button type="primary" @click="resetForm()">清空</el-button>
                </el-form-item>
                <el-form-item class="md-block" label="警示值:">
                    <span class="md-red">{{warningValue | priceFormat}}</span>
                    <el-button type="primary" @click="changeWarningValue" :loading="warningValueLoading">修改警示值
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="店铺名" align="center" prop="storeName"/>
                <el-table-column label="店铺ID" align="center" prop="storeId"/>
                <el-table-column label="所在地" align="center" prop="storeAddr"/>
                <el-table-column label="预存款余额" align="center">
                    <template slot-scope="scope">
                        <span :class="scope.row.amount < warningValue ? 'md-red' : ''">{{scope.row.amount | priceFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="最后充值时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.updateTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="管理" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="onRecharge(scope.row)">充值</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background @current-change="getData()" :current-page.sync="query.page"
                           :page-size="query.pageSize" layout="total, ->, prev, pager, next, jumper"
                           :total="table.page.total"/>
        </div>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import {mapGetters} from 'vuex';
    import api from '@/common/apis/orderSetting';
    import apiDeposit from '@/common/apis/deposit';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                warningValueLoading: false,
                warningValue: undefined,
                time: [],
                query: {
                    storeName: undefined,
                    minAmount: undefined,
                    maxAmount: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    page: 1,
                    pageSize: 20
                }
            };
        },
        computed: {
            ...mapGetters(['shop'])
        },
        methods: {
            getData() {
                this.loading = true;
                let params = this.$util.deepClone(this.query);
                if (params.minAmount !== undefined) params.minAmount = parseInt(params.minAmount * 100);
                if (params.maxAmount !== undefined) params.maxAmount = parseInt(params.maxAmount * 100);
                apiDeposit.storeCashAccountList(params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.page.total = data.rowCount;
                        this.table.data = data.rows;
                    });
                }).finally(() => this.loading = false);
            },
            getWarningValue() {
                this.warningValueLoading = true;
                api.getAlarmValue().then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.warningValue = data;
                    });
                }).finally(() => this.warningValueLoading = false);
            },
            changeWarningValue() {
                this.$prompt('警示金额', '当预存款低于警示金额时余额会用红色字体显示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputType: 'number',
                    inputPlaceholder: '正整数',
                    inputValue: this.$util.integerToPrice(this.warningValue) + '',
                    inputPattern: /^(0|\+?[1-9][0-9]*)$/,
                    inputErrorMessage: '请输入正整数'
                }).then(({value}) => {
                    this.warningValueLoading = true;
                    let storeCashMin = parseInt(value * 100);
                    api.setAlarmValue(storeCashMin).then(res => {
                        this.$util.handelHttpResponseResult(res, true).then(() => {
                            this.warningValue = value;
                            this.getWarningValue();
                        });
                    }).finally(() => this.warningValueLoading = false);
                });
            },
            onRecharge(store) {
                this.$prompt('充值金额(人民币)', '经销商充值预存款', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
                    inputErrorMessage: '请输入大于0的数、精确到0.01',
                    inputType: 'number',
                    inputPlaceholder: '大于0的数、精确到0.01'
                }).then(({value}) => {
                    let amount = parseInt(value * 100);
                    this.loading = true;
                    apiDeposit.storeCashDepositAdd({storeId: store.storeId, amount}).then(res => {
                        this.$util.handelHttpResponseResult(res, true).then(() => {
                            this.getData();
                        }).finally(() => this.loading = false);
                    });
                });
            },
            resetForm() {
                this.time = [];
                this.query = {
                    storeName: undefined,
                    minAmount: undefined,
                    maxAmount: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    page: this.query.page,
                    pageSize: 20
                };
            }
        },
        mounted() {
            this.getData();
            this.getWarningValue();
        }
    };
</script>

<style scoped>

</style>
