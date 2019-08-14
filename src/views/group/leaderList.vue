<template>
    <div class="kd-page-master kd-flex" v-loading="loading">
        <breadcrumb :options="['活动管理', '社区团购', '团长列表']"/>
        <div class="main-container kd-flex kd-flex-item">
            <el-form :model="query" inline>
                <el-form-item label="团长名">
                    <el-input v-model="query.leaderName"/>
                </el-form-item>
                <!--<el-form-item label="状态">-->
                <!--<el-select v-model="query.status">-->

                <!--</el-select>-->
                <!--</el-form-item>-->

                <el-form-item label="申请时间">
                    <el-date-picker v-model="time"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions" @change="changeDateRange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getData">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border height="100%" class="kd-flex-item">
                <el-table-column align="center" label="团长名称" prop="name"/>
                <el-table-column align="center" label="订单总数" prop="ordertotal"/>
                <el-table-column align="center" label="订单总金额">
                    <template slot-scope="scope">
                        {{$util.priceFormat(scope.row.ordermoney)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="审批时间">
                    <template slot-scope="scope">
                        {{scope.row.verifytime | dateFilter}}
                    </template>
                </el-table-column>
                <!--                <el-table-column align="center" label="状态" prop=""/>-->
                <el-table-column v-if="$util.checkPermission('groupLeader',['d'])" align="center" label="管理">
                    <template slot-scope="scope">
                        <!--<el-button type="text">商品</el-button>-->
                        <el-button type="text" @click="disabledLeader(scope.row)">
                            {{scope.row.disabled ? '启用' : '禁用'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                background
                @current-change="getData"
                :current-page.sync="query.pageNum"
                :page-size="query.pageSize"
                layout="total, ->, prev, pager, next, jumper"
                :total="table.page.total"/>
        </div>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import api from '@/common/apis/group/approval';
    import {mapGetters} from 'vuex';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                time: [],
                query: {
                    createTimeStart: undefined,
                    createTimeEnd: undefined,
                    leaderName: undefined,
                    status: undefined,
                    pageNum: 1,
                    pageSize: 20
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                api.getLeaderList(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        console.info(data);
                        this.table.data = data.list;
                        this.table.page.total = data.total;
                    });
                }).finally(() => this.loading = false);
            },
            disabledLeader(leader) {
                this.loading = true;
                console.info(leader);
                api.leaderUpdateState({userId: leader.userid, storeId: this.shop.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '操作成功').then(() => {
                        this.getData();
                    });
                }).finally(() => this.loading = false);
            },
            changeDateRange(e) {
                try {
                    this.query.createTimeStart = new Date(e[0]).getTime() / 1000;
                    this.query.createTimeEnd = new Date(e[1]).getTime() / 1000;
                } catch (e) {
                }
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    };
</script>

<style scoped>

</style>
