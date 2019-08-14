<template>
    <div class="md-records" v-loading="loading">
        <breadcrumb :options="options"/>
        <div class="main-container">
            <el-form @submit.native.prevent="getData(true)" inline>
                <el-form-item label="卡券名称">
                    <el-input v-model="query.couponName"/>
                </el-form-item>
                <el-form-item label="否满足签到天数" v-if="type=== 'checkin'">
                    <el-select v-model="query.signStatus" :value="query.signStatus" style="width: 150px">
                        <el-option :value="undefined" label="全部"/>
                        <el-option :value="true" label="是"/>
                        <el-option :value="false" label="否"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效时间">
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
                    <el-button type="primary" native-type="submit">搜索</el-button>
                    <el-button type="primary" @click="resetQuery">清除</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="用户名" align="center" prop="username"/>
                <el-table-column label="金额" align="center">
                    <template slot-scope="scope">
                        {{toString(scope.row.reelYjkList)}}
                    </template>
                </el-table-column>
                <el-table-column label="是否满足签到天数" align="center" v-if="type=== 'checkin'">
                    <template slot-scope="scope">
                        {{scope.row.status ? '是' : '否'}}
                    </template>
                </el-table-column>
                <el-table-column label="生效时间" align="center">
                    <template slot-scope="scope">
                        <span v-if="type=== 'checkin'">
                            {{scope.row.starttime | dateFilter}}
                        </span>
                        <span v-else>
                            {{scope.row.createtime | dateFilter}}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @current-change="getData()"
                :current-page.sync="query.pageNum"
                :page-size="query.pageSize"
                layout="total, ->, prev, pager, next, jumper"
                :total="table.page.total"/>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import api from '@/common/apis/event/coupon';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                type: this.$route.params.type,
                queryTime: [],
                query: {
                    id: undefined,
                    couponName: undefined,
                    signStatus: undefined,
                    storeId: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    pageNum: 1,
                    pageSize: 20
                }
            };
        },
        computed: {
            ...mapGetters(['shop']),
            options() {
                return this.type === 'coupon' ? ['活动管理', '代金券', '领取详情'] : ['活动管理', '签到', '领取详情'];
            },
            typeData() {
                return this.type === 'coupon' ? 1 : 2;
            }
        },
        methods: {
            getData(isSearch) {
                this.query.id = this.$route.query.id;
                if (isSearch === true) this.query.pageNum = 1;

                let params = this.$util.deepClone(this.query);
                params.validStartTime = params.startTime;
                delete params.startTime;
                params.validEndTime = params.endTime;
                delete params.endTime;
                params.type = this.typeData;
                this.loading = true;
                api.receiveRecord(params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.page.total = data.total;
                        this.table.data = data.list;
                    });
                }).finally(() => this.loading = false);
            },
            resetQuery() {
                this.query = {
                    couponName: undefined,
                    storeId: undefined,
                    signStatus: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    page: this.query.page,
                    pageSize: 20
                };
            },

            toString(data) {
                let a = [];
                a = data.map((item) => {
                    return this.$util.priceFormat(item.money);
                });
                return a.join('/');
            }
        },
        mounted() {
            if (this.$route.query.id === undefined) return this.$message.error('请求参数不正确');
            this.getData();
        }
    };
</script>

<style scoped>

</style>
