<template>
    <div class="kd-page-master kd-flex " v-loading="loading">
        <breadcrumb :options="['活动管理', '代金券', '领取列表']"/>
        <div class="kd-flex kd-flex-item main-container">
            <el-form :model="query" inline @submit.native.prevent="getData">
                <el-form-item label="用户ID">
                    <el-input v-model="query.userId"/>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input v-model="query.userName"/>
                </el-form-item>
                <!--<el-form-item label="代金券类型">-->
                    <!--<el-select v-model="query.type" :value="query.type"></el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="领取时间">
                    <el-date-picker v-model="time"
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
                    <el-button type="primary" native-type="submit">过滤</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border class="kd-flex-item" height="100%">
                <el-table-column align="center" label="用户名称" prop="nickname"/>
                <el-table-column align="center" label="代金券类型">
                    <template slot-scope="scope">
                        {{scope.row.coupontype | couponTypeFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="代金券金额">
                    <template slot-scope="scope">
                        {{$util.priceFormat(scope.row.couponamount)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="领取时间">
                    <template slot-scope="scope">
                        {{scope.row.createtime | dateFilter}}
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
    import api from '@/common/apis/coupon';
    import {mapGetters} from 'vuex';

    export default {
        mixins: [tableDataMixins],
        data () {
            return {
                time: undefined,
                loading: false,
                query: {
                    storeId: undefined,
                    couponId: undefined,
                    userName: undefined,
                    userId: undefined,
                    createTimeStart: undefined,
                    createTimeEnd: undefined,
                    type: undefined,
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
            }
        },
        methods: {
            getData () {
                this.loading = false;
                this.query.storeId = this.shop.id;
                api.userEventCouponList(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.list;
                        this.table.page.total = data.total;
                    })
                })
            },
            changeDateRange(e) {
                try {
                    this.query.createTimeStart = parseInt(new Date(e[0]).getTime() / 1000);
                    this.query.createTimeEnd = parseInt(new Date(e[1]).getTime() / 1000);
                } catch (e) {
                }
            },
        },
        mounted () {
            this.query.couponId = this.$route.params.couponId;
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        },
        filters: {
            couponTypeFilter (val) {
                switch (val) {
                    case 1: return '入店礼包代金券';
                }
            }
        }
    }
</script>

<style scoped>

</style>