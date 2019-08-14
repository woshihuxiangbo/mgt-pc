<template>
    <div class="md-event-coupon" v-loading="loading">
        <breadcrumb :options="['活动管理', '代金券']"/>
        <div class="main-container">
            <el-form ref="search" :model="query" @submit.native.prevent="getData(true)" inline>
                <el-form-item label="卡券名称">
                    <el-input v-model="query.couponName"/>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="query.forbidden" :value="query.forbidden" class="md-select-status">
                        <el-option :value="undefined" label="全部"/>
                        <el-option :value="true" label="禁用"/>
                        <el-option :value="false" label="启用"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="有效时间">
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
                    <el-button type="primary" @click="clearQuery">清除</el-button>
                </el-form-item>
                <el-form-item class="md-block">
                    <el-button type="primary" @click="dialog = true">添加</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="卡券名称" align="center" prop="couponName"/>
                <el-table-column label="金额" align="center">
                    <template slot-scope="scope">
                        {{toString(scope.row.reelYjkList)}}
                    </template>
                </el-table-column>
                <el-table-column label="有效期开始时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.validStartTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="有效期结束时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.validEndTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="管理" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editCoupon(scope.row)">编辑</el-button>
                        <el-button type="text" @click="disableCoupon(scope.row)">
                            {{scope.row.forbidden ? '启用' : '禁用'}}
                        </el-button>
                        <el-button type="text"
                                   @click="$router.push({name: 'EventCouponReceivingRecords', params: {type: 'coupon'}, query: {id: scope.row.id}})">
                            领取详情
                        </el-button>
                        <el-button type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                background
                @current-change="getData()"
                style="margin-top: 10px"
                :current-page.sync="query.pageNum"
                :page-size="query.pageSize"
                layout="total, ->, prev, pager, next, jumper"
                :total="table.page.total">
            </el-pagination>
        </div>
        <el-dialog :visible.sync="dialog" v-loading="loading">
            <event-coupon-form v-model="form" @submit="onAddSubmit">
                <el-button @click="dialog = false">取消</el-button>
                <el-button type="primary" native-type="submit">提交</el-button>
            </event-coupon-form>
        </el-dialog>
        <el-dialog :visible.sync="editDialog" v-loading="loading">
            <event-coupon-form v-model="editForm" @submit="onEditSubmit">
                <el-button @click="editDialog = false">取消</el-button>
                <el-button type="primary" native-type="submit">提交</el-button>
            </event-coupon-form>
        </el-dialog>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import EventCouponForm from '@/components/form/EventCouponForm';
    import api from '@/common/apis/event/coupon';
    import {mapGetters} from 'vuex';

    export default {
        components: {EventCouponForm},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                queryTime: [],
                query: {
                    couponName: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    forbidden: undefined,
                    type: 1,
                    pageNum: 1,
                    pageSize: 20
                },
                dialog: false,
                form: {
                    selectTime: [],
                    couponName: undefined,
                    validStartTime: undefined,
                    validEndTime: undefined,
                    day: undefined,
                    scope: undefined,
                    circulation: undefined,
                    everydayCirculation: undefined,
                    limitToReceive: 1,
                    forbidden: false,
                    type: 1,
                    level: [],
                    reelYjkList: [],
                    reelItemYjkList: []
                },
                editDialog: false,
                editForm: {}
            };
        },
        methods: {
            getData(b) {
                if (b) this.query.pageNum = 1;
                let params = this.$util.deepClone(this.query);
                params.storeId = this.shop.id;
                params.validStartTime = params.startTime;
                delete params.startTime;
                params.validEndTime = params.endTime;
                delete params.endTime;
                this.loading = true;
                api.eventsList(params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.page.total = data.total;
                        this.table.data = data.list;
                    });
                }).finally(() => this.loading = false);
            },
            clearQuery() {
                this.queryTime = [];
                this.query = {
                    couponName: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    forbidden: undefined,
                    page: this.query.page,
                    pageSize: 20
                };
            },
            onAddSubmit() {
                if (this.form.reelYjkList.length <= 0) return this.$message.error('请填写面额');
                let params = this.$util.deepClone(this.form);
                delete params.selectTime;
                params.level = params.level.join(',');
                this.loading = true;
                params.storeId = this.shop.id;
                params.reelYjkList = params.reelYjkList.map((item) => {
                    item.money = this.$util.formatPrice(item.money);
                    if (item.status === 2) {
                        item.amount = this.$util.formatPrice(item.amount);
                    }
                    return item;
                });
                params.reelItemYjkList = params.reelItemYjkList.map((item) => {
                    return {itemId: item};
                });
                api.addEvents(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.dialog = false;
                        this.getData();
                        this.clearForm();
                    });
                }).finally(() => this.loading = false);
            },
            clearForm() {
                this.form = {
                    selectTime: [],
                    couponName: undefined,
                    validStartTime: undefined,
                    validEndTime: undefined,
                    day: undefined,
                    scope: undefined,
                    circulation: undefined,
                    everydayCirculation: undefined,
                    limitToReceive: 1,
                    forbidden: false,
                    type: 1,
                    level: [],
                    reelYjkList: [],
                    reelItemYjkList: []
                };
            },
            toString(data) {
                let a = [];
                a = data.map((item) => {
                    return this.$util.priceFormat(item.money);
                });
                return a.join('/');
            },
            editCoupon(item) {
                let data = this.$util.deepClone(item);
                data.level = data.level.split(',');
                data.selectTime = [
                    item.validStartTime * 1000,
                    item.validEndTime * 1000
                ];
                data.reelYjkList = data.reelYjkList.map(l => {
                    l.money = this.$util.priceFormat(l.money);
                    if (l.status === 2) {
                        l.amount = this.$util.integerToPrice(l.damount);
                    }
                    return l;
                });

                data.reelItemYjkList = data.reelItemYjkList.map((item) => {
                    return item.itemId;
                });
                this.editForm = data;
                this.editDialog = true;
            },
            onEditSubmit() {
                if (this.editForm.reelYjkList.length <= 0) return this.$message.error('请填写面额');
                let params = this.$util.deepClone(this.editForm);
                delete params.selectTime;
                params.level = params.level.join(',');
                this.loading = true;
                params.storeId = this.shop.id;
                params.reelYjkList = params.reelYjkList.map((item) => {
                    item.money = this.$util.formatPrice(item.money);
                    if (item.status === 2) {
                        item.amount = this.$util.formatPrice(item.amount);
                    }
                    return item;
                });
                params.reelItemYjkList = params.reelItemYjkList.map((item) => {
                    return {itemId: item};
                });
                api.eventsEdit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.editDialog = false;
                        this.getData();
                    });
                }).finally(() => this.loading = false);
            },
            disableCoupon(coupon) {
                let action = coupon.forbidden ? '启用' : '禁用';
                this.$util.actionConfirm(`是否${action}[${coupon.couponName}]`).then(() => {
                    this.loading = true;
                    api.eventDel({
                        type: 1,
                        storeId: coupon.storeId,
                        id: coupon.id,
                        forbidden: !coupon.forbidden
                    }).then(res => {
                        this.$util.handelHttpResponseResult(res, true).then(() => {
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters(['shop'])
        }
    };
</script>

<style scoped>

</style>
