<template>
    <div class="coupon-list kd-page-master kd-flex" v-loading="loading">
        <breadcrumb :options="['活动管理', '代金券']"/>
        <div class="main-container kd-flex-item kd-flex">
            <el-form v-if="$util.checkPermission('event',['c']) && false">
                <el-form-item>
                    <el-button type="primary" @click="createCoupon" v-if="!loading && table.data.length <= 0">添加代金券</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border class="kd-flex-item" height="100%">
                <el-table-column align="center" label="代金券类型">
                    <template slot-scope="scope">
                        {{scope.row.couponType | couponTypeFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="" label="金额">
                    <template slot-scope="scope">
                        {{$util.priceFormat(scope.row.amount)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="" label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="" label="管理">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="$util.checkPermission('event',['u'])" @click="edit(scope.row)">
                            编辑
                        </el-button>
                        <el-button v-if="$util.checkPermission('event',['d'])" type="text" @click="deleted(scope.row)">
                            {{scope.row.deleteTime ? '启用' : '禁用'}}
                        </el-button>
                        <el-button type="text" v-if="$util.checkPermission('event',['l'])"
                                   @click="$router.push({name: 'CouponReceive', params: {couponId: scope.row.id}})">领取详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import api from '@/common/apis/coupon';
    import {mapGetters} from 'vuex';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                time: undefined,
                loading: false,
                query: {
                    userName: undefined,
                    userId: undefined,
                    startTime: undefined,
                    endTime: undefined
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;
                if (this.shop.id === undefined) return this.$util.toSelectStorePage();
                api.list({storeId: this.shop.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (data === null) return;
                        this.table.data = data;
                    });
                }).finally(() => this.loading = false);
            },
            createCoupon() {
                this.$prompt('输入金额', '添加代金券', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValidator: (val) => {
                        return /^[0-9]+(.[0-9]{2})?$/.test(val);
                    },
                    inputErrorMessage: '只能输入数字'
                }).then(({value}) => {
                    this.loading = true;
                    api.add({
                        couponType: 1,
                        amount: this.$util.formatPrice(value),
                        storeId: this.shop.id
                    }).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => this.getData());
                    }).finally(() => this.loading = false);
                });
            },
            edit(item) {
                item = Object.assign({}, item);
                this.$prompt('输入金额', '修改代金券', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: this.$util.priceFormat(item.amount),
                    inputValidator: (val) => {
                        return !!val;
                    },
                    inputErrorMessage: '不能为空'
                }).then(({value}) => {
                    this.loading = true;
                    item.amount = this.$util.formatPrice(value);
                    api.update(item).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '修改成功').then(() => this.getData());
                    }).finally(() => this.loading = false);
                });
            },
            deleted(item) {
                let action = item.deleteTime ? '启用' : '禁用';
                this.$util.actionConfirm(`是否${action}入店礼包代金券?`).then(() => {
                    this.loading = true;
                    api.deleted({id: item.id, type: item.deleteTime ? 2 : 1}).then(res => {
                        this.$util.handelHttpResponseResult(res).then(() => {
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
            ...mapGetters({shop: 'shop'})
        },
        filters: {
            couponTypeFilter(val) {
                switch (val) {
                    case 1:
                        return '入店礼包代金券';
                }
            }
        }
    };
</script>

<style scoped>

</style>
