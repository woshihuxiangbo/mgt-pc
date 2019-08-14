<template>
    <div class="kd-page-master kd-flex" v-loading="loading">
        <breadcrumb :options="['售后服务', '批发售后订单']"/>
        <div class="main-container kd-flex kd-flex-item">
            <div class="search">
                <el-form :model="query" @submit.native.prevent="getData" inline>
                    <el-form-item label="订单ID">
                        <el-input v-model="query.orderId"/>
                    </el-form-item>
                    <el-form-item label="店铺名称">
                        <el-input v-model="query.storeName"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit">过滤</el-button>
                    </el-form-item>
                    <el-form-item style="display: block;">
                        <el-radio-group v-model="query.status" @change="getData">
                            <el-radio-button :label="undefined">全部</el-radio-button>
                            <el-radio-button :label="1">申请退款</el-radio-button>
                            <el-radio-button :label="2">同意退款</el-radio-button>
                            <el-radio-button :label="3">拒绝退款</el-radio-button>
                            <el-radio-button :label="6">退款中</el-radio-button>
                            <el-radio-button :label="9">退款完成</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="table.data" border height="100%" class="kd-flex-item" fit ref="table" id="table">
                <el-table-column align="center" label="订单ID" prop="id" width="180px" fixed="left"/>
                <el-table-column align="center" label="店铺名称" prop="storeName" v-if="role.roleScope !== 2"/>
                <el-table-column align="center" label="订单状态" width="80px">
                    <template slot-scope="scope">
                        {{getOrderStatus(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否导出">
                    <template slot-scope="scope">
                        {{scope.row.exported ? '已导出' : '未导出'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商品总数" prop="goodsTotal"/>
                <el-table-column align="center" label="订单总金额" width="100px">
                    <template slot-scope="scope">
                        ￥ {{$util.priceFormat(scope.row.goodsAmount)}}
                    </template>
                </el-table-column>
                <el-table-column label="收件信息" width="180" align="center">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top" v-if="scope.row.receiver">
                            <p>收件人: {{ scope.row.receiver.name }}</p>
                            <p>收件地址:
                                {{ scope.row.receiver.province }}
                                {{ scope.row.receiver.city }}
                                {{ scope.row.receiver.county }}
                                {{ scope.row.receiver.details }}
                            </p>
                            <p>联系电话: {{ scope.row.receiver.mobile }} | {{ scope.row.receiver.tel }}</p>
                            <p>邮政编码: {{scope.row.receiver.postcode}}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">
                                    {{ scope.row.receiver.province }}
                                    {{ scope.row.receiver.city }}
                                    {{ scope.row.receiver.county }}
                                </el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="物流费用">
                    <template slot-scope="scope">
                        {{scope.row.shippingFee ? scope.row.shippingFee : '包邮'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="申请时间" width="180px">
                    <template slot-scope="scope">
                        {{scope.row.createTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="支付方式" width="100px">
                    <template slot-scope="scope">
                        {{scope.row.payMethod === 1 ? '线上支付' : '银行卡支付'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="支付渠道 / 转账流水单号" width="200px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.payMethod === 1">
                            {{scope.row.payChannel === 1 ? '微信' : '支付宝'}}
                        </span>
                        <span v-if="scope.row.payMethod === 2">
                            {{scope.row.payOrderId}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="支付手续费" width="100px">
                    <template slot-scope="scope">
                        ￥{{$util.priceFormat(scope.row.poundage)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="支付时间" width="180px">
                    <template slot-scope="scope">
                        {{scope.row.payTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="完成时间" width="180px">
                    <template slot-scope="scope">
                        {{scope.row.finishTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="管理" fixed="right" width="100px"
                                 v-if="$util.checkPermission('wholesaleOrder', ['r'])">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="gotoDetail(scope.row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    @current-change="getData"
                    style="margin-top: 10px"
                    :current-page.sync="query.page"
                    :page-size="query.pageSize"
                    layout="total, ->, prev, pager, next, jumper"
                    :total="table.page.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import refundOrderApi from '@/common/apis/refundOrder';
    import {mapGetters} from 'vuex';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                query: {
                    orderId: undefined,
                    storeName: undefined,
                    status: undefined,
                    userName: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    exported: undefined,
                    page: 1,
                    pageSize: 20,
                    column: 'id,status,goodsAmount,goodsTotal,shippingFee,createTime,payMethod,payChannel,payTime,finishTime,storeName,receiver,payOrderId,poundage'
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                refundOrderApi.list(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                        this.totalAmount = data.totalAmount;
                    });
                }).finally(() => this.loading = false);
            },
            getOrderStatus(v) {
                switch (v) {
                    case 1:
                        return '提交申请';
                    case 2:
                        return '同意';
                    case 3:
                        return '不同意';
                    case 4:
                        return '已发货';
                    case 5:
                        return '已收货';
                    case 6:
                        return '退款中';
                    case 9:
                        return '退款成功';
                    default:
                        return '提交申请';
                }
            },
            gotoDetail(order) {
                this.$router.push({name: 'OrderWholesaleRefundDetail', params: {id: order.id}});
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop', role: 'role'})
        }
    };
</script>

<style scoped>

</style>