<template>
    <div class="md-deposit" v-loading="loading">
        <breadcrumb :options="['佣金管理', '佣金转账审核']"/>
        <div class="main-container">
            <el-form :model="query" inline @submit.native.prevent="getData(true)">
                <el-form-item label="转账类型">
                    <el-select v-model="query.type" :value="query.type">
                        <el-option :value="undefined" label="全部"></el-option>
                        <el-option value="1" label="体现"></el-option>
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
<!--                <el-form-item label="状态">-->
<!--                    <el-select v-model="query.status" :value="query.status">-->
<!--                        <el-option :value="undefined" label="全部"></el-option>-->
<!--                        <el-option value="1" label="成功"></el-option>-->
<!--                        <el-option value="2" label="失败"></el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
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
                <el-table-column label="可提现金额" align="center">
                    <template slot-scope="scope">
                        {{scope.row.totalAmount | priceFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="申请转账金额" align="center">
                    <template slot-scope="scope">
                        {{scope.row.amount | priceFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="转账类型" align="center">
                    <template slot-scope="scope">
                        {{scope.row.type === 1 ? '提现' : '转预存款'}}
                    </template>
                </el-table-column>
                <el-table-column label="申请时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createtime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="管理" align="center" width="180px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="confirm(scope.row)">允许</el-button>
                        <el-button type="text" @click="reject(scope.row)">拒绝</el-button>
                        <el-button type="text" @click="offlineTransfer(scope.row)">线下转账</el-button>
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
    import {mapGetters} from 'vuex';
    import api from '@/common/apis/commission';

    export default {
        components: {LvSelector},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                queryTime: [],
                query: {
                    type: undefined,
                    nickName: undefined,
                    userId: undefined,
                    level: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    state: undefined,
                    pageSize: 20,
                    page: 1
                },
                levels: []
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData(isSearch = false) {
                if (isSearch) this.query.page = 1;
                this.query.storeId = this.shop.id;
                this.loading = true;
                api.selectTransferRecord(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                }).finally(() => this.loading = false);
            },
            clearQuery() {
                this.queryTime = [];
                this.query = Object.assign({}, this.query, {
                    type: undefined,
                    nickName: undefined,
                    userId: undefined,
                    level: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    state: undefined
                });
            },
            onGetLevelData(lv) {
                console.info(lv);
                this.levels = lv;
            },
            levelFilter(v) {
                let name = '';
                this.levels.forEach((item) => {
                    if (item.value + '' === v + '') {
                        name = item.label;
                    }
                });
                return name;
            },
            confirm(item) {
                this.confirmAction('是否允许', item.id, 1);
            },
            reject(item) {
                this.confirmAction('是否拒绝', item.id, 0);
            },
            confirmAction(message, id, status) {
                this.$util.actionConfirm(message).then(() => {
                    this.loading = true;
                    api.confirmTransferRecord({id, status, transferType: 1}).then(res => {
                        this.$util.handelHttpResponseResult(res, true).then(() => {
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            },
            offlineTransfer(item) {
                this.$util.actionConfirm('确定要线下转账吗？如果是请及时线下转账。').then(() => {
                    this.loading = true;
                    api.confirmTransferRecord({id: item.id, status: 1, transferType: 2}).then(res => {
                        this.$util.handelHttpResponseResult(res, true).then(() => {
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            }
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    };
</script>

<style scoped>

</style>
