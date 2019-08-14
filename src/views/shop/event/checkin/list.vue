<template>
    <div class="md-event-checkin" v-loading="loading">
        <breadcrumb :options="['活动管理', '签到']"/>
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
                    <el-button type="primary" @click="dialog = true">新增</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="活动名称" align="center" prop="couponName"/>
                <el-table-column label="金额" align="center">
                    <template slot-scope="scope">
                        {{toString(scope.row.reelYjkList)}}
                    </template>
                </el-table-column>
                <el-table-column label="每周至少几次签到" align="center" prop="day"/>
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
                        <el-button type="text" @click="editCheckin(scope.row)">编辑</el-button>
                        <el-button type="text" @click="disableCheckin(scope.row)">
                            {{scope.row.forbidden ? '启用' : '禁用'}}
                        </el-button>
                        <el-button type="text"
                                   @click="$router.push({name: 'EventCouponReceivingRecords', params: {type: 'checkin'},query: {id: scope.row.id}})">
                            领取详情
                        </el-button>
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

        <el-dialog :visible.sync="dialog">
            <checkin-form v-model="form" @submit="onAddSubmit">
                <el-button @click="dialog = false">取消</el-button>
                <el-button type="primary" native-type="submit">提交</el-button>
            </checkin-form>
        </el-dialog>

        <el-dialog :visible.sync="editDialog">
            <checkin-form v-model="editForm" @submit="onEditSubmit">
                <el-button @click="editDialog = false">取消</el-button>
                <el-button type="primary" native-type="submit">提交</el-button>
            </checkin-form>
        </el-dialog>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import CheckinForm from '@/components/form/CheckinForm';
    import api from '@/common/apis/event/coupon';
    import {mapGetters} from 'vuex';

    export default {
        components: {CheckinForm},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                dialog: false,
                queryTime: [],
                query: {
                    couponName: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    forbidden: undefined,
                    type: 2,
                    pageNum: 1,
                    pageSize: 20
                },
                form: {
                    selectTime: [],
                    couponName: undefined,
                    validStartTime: undefined,
                    validEndTime: undefined,
                    day: undefined,
                    scope: undefined,
                    circulation: undefined,
                    everydayCirculation: undefined,
                    limitToReceive: undefined,
                    forbidden: false,
                    type: 2,
                    level: [],
                    reelYjkList: [{}, {}, {}, {}, {}, {}, {}],
                    reelItemYjkList: []
                },
                editDialog: false,
                editForm: {}
            };
        },
        computed: {
            ...mapGetters(['shop'])
        },
        methods: {
            getData(b) {
                if (b === true) this.query.pageNum = 1;
                this.loading = true;
                this.query.storeId = this.shop.id;
                api.eventsList(this.query).then(res => {
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
            toString(data) {
                let a = [];
                a = data.map((item) => {
                    return this.$util.priceFormat(item.money);
                });
                return a.join('/');
            },

            onAddSubmit() {
                if (this.form.reelYjkList.length <= 0) return this.$message.error('请填写面额');
                let params = this.$util.deepClone(this.form);
                delete params.selectTime;
                params.level = params.level.join(',');
                this.loading = true;
                params.storeId = this.shop.id;
                params.validStartTime = parseInt(params.validStartTime / 1000);
                params.validEndTime = parseInt(params.validEndTime / 1000);
                params.reelYjkList = params.reelYjkList.map((item) => {
                    item.money = this.$util.formatPrice(item.money);
                    item.status = 1;
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
                    limitToReceive: undefined,
                    forbidden: false,
                    type: 2,
                    level: [],
                    reelYjkList: [{}, {}, {}, {}, {}, {}, {}],
                    reelItemYjkList: []
                };
            },
            editCheckin(item) {
                let data = this.$util.deepClone(item);
                data.level = data.level.split(',');
                data.reelYjkList = data.reelYjkList.map(l => {
                    l.money = this.$util.priceFormat(l.money);
                    return l;
                });

                data.validStartTime *= 1000;
                data.validEndTime *= 1000;
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
                params.validStartTime = parseInt(params.validStartTime / 1000);
                params.validEndTime = parseInt(params.validEndTime / 1000);
                params.reelYjkList = params.reelYjkList.map((item) => {
                    item.money = this.$util.formatPrice(item.money);
                    item.status = 1;
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
            disableCheckin(item) {
                let action = item.forbidden ? '启用' : '禁用';
                this.$util.actionConfirm(`是否${action}[${item.couponName}]`).then(() => {
                    this.loading = true;
                    api.eventDel({
                        type: 2,
                        storeId: item.storeId,
                        id: item.id,
                        forbidden: !item.forbidden
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
        }
    };
</script>

<style scoped>

</style>
