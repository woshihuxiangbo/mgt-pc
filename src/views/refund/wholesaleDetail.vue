<template>
    <div class="retail-refund" v-loading="loading">
        <!--<el-row :gutter="20">-->
        <!--<el-col :span="8">-->
        <!--<div class="md-card">-->
        <!--<h3>29</h3>-->
        <!--<p>待发货订单</p>-->
        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="8">-->
        <!--<div class="md-card">-->
        <!--<h3>1</h3>-->
        <!--<p>待回复</p>-->
        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="8">-->
        <!--<div class="md-card">-->
        <!--<h3>16</h3>-->
        <!--<p>售后订单</p>-->
        <!--</div>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <breadcrumb :options="['订单管理', '零售订单', '售后']"/>
        <div class="main-container">
            <div class="md-step">
                <el-steps :active="active" :finish-status="finishStatus" align-center process-status="process">
                    <el-step title="申请退款" :description="order.createTime | dateFilter"></el-step>
                    <el-step title="商家处理退款申请" :description="order.processTime | dateFilter"></el-step>
                    <el-step title="退款完成" :description="order.finishTime | dateFilter"></el-step>
                </el-steps>
            </div>
            <el-row class="detail">
                <el-col :span="10" :xs="24">
                    <h6>售后信息</h6>
                    <div class="items">
                        <div class="item" v-for="(item, i) in items" :key="i">
                            <img :src="item.thumbnail | imgSrc" alt="">
                            <div class="name">
                                {{item.itemName}}
                            </div>
                            <div class="price">
                                <p>￥{{$util.priceFormat(item.singlePrice)}}</p>
                                <span>x{{item.count}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="service">
                        <list-item label="服务类型">退款</list-item>
                        <list-item label="售后原因">{{order.reason}}</list-item>
                        <list-item label="售后件数">{{order.goodsTotal}}件</list-item>
                        <list-item label="退款金额">￥{{$util.priceFormat(order.amount)}}</list-item>
                    </div>
                    <div class="order">
                        <h3>订单信息</h3>
                        <list-item label="订单编号">{{order.orderId}}</list-item>
                        <list-item label="交易编号">{{order.id}}</list-item>
                        <list-item label="创建时间">{{order.orderCreateTime | dateFilter}}</list-item>
                        <list-item label="支付时间">2019-02-03 11:16:24</list-item>
                        <!--<list-item label="快递单号">空</list-item>-->
                        <list-item label="支付方式">
                            {{order.payMethod === 2 ? '银行卡付款' : '线上支付'}}
                        </list-item>
                        <list-item label=" 转账流水单号" v-if="order.payMethod === 2">
                            {{order.payOrderId}}
                        </list-item>
                        <list-item label="转账流水单号" v-if="order.payMethod === 1">
                            {{order.payChannel === 1 ? '微信' : '支付宝'}}
                        </list-item>
                        <list-item label="实付款(含运费)">￥{{$util.priceFormat(order.goodsAmount)}}</list-item>
                    </div>
                </el-col>
                <el-col :span="10" :xs="24"
                        v-if="$util.checkPermission('wholesaleOrder', ['u']) && role.roleScope !== 2">
                    <p class="action-title" v-if="order.status !== 9"><i class="el-icon-warning"></i>等待商家处理退款申请</p>
                    <div class="action" v-if="order.status === 1">
                        <p>收到买家退款申请，请尽快处理</p>
                        <el-button type="primary" @click="confirmRefund">同意退款</el-button>
                        <el-button type="warning" @click="rejectRefund">拒绝退款</el-button>
                    </div>
                    <div class="action" v-else-if="order.status === 4 || order.status === 2">
                        <p>已通过退款申请，请尽快处理</p>
                        <el-button type="primary" @click="confirmReceipt">请确认是否收到货物</el-button>
                    </div>
                    <p class="title">协商记录</p>
                    <div class="record">
                        <list-item label="买家">
                            {{order.storeName}} {{order.createTime | dateFilter}}
                            <p>发起了退款申请，等待商家处理</p>
                            <div v-if="order.processTime">
                                {{order.createTime | dateFilter}} {{order.status | statusFilter}}退款申请
                            </div>
                            <div v-if="order.finishTime">
                                {{order.finishTime | dateFilter}} {{order.status | statusFilter}}退款申请
                            </div>
                        </list-item>
                        <list-item label="售后原因">{{order.reason}}</list-item>
                        <list-item label="服务类型">退款</list-item>
                        <list-item label="退款金额">￥{{$util.priceFormat(order.amount)}}</list-item>
                        <!--<list-item label="退款说明"></list-item>-->
                        <!--<list-item label="退款图片"></list-item>-->
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import ListItem from '@/components/widget/ListItem';
    import refundOrderApi from '@/common/apis/refundOrder';
    import {mapGetters} from 'vuex';

    export default {
        components: {ListItem},
        data() {
            return {
                loading: false,
                orderId: undefined,
                order: {},
                items: []
            };
        },
        methods: {
            getData() {
                this.loading = true;
                refundOrderApi.get({id: this.orderId}).then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.items = data.RefundItems;
                        this.order = data.RefundDetail;
                    });
                }).finally(() => this.loading = false);
            },
            confirmRefund() {
                this.$confirm('确认通过退款申请', '警告').then(() => {
                    this.loading = true;
                    refundOrderApi.agree({id: this.order.id, agree: true}).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '已同意退款申请').then(() => {
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            },
            rejectRefund() {
                this.$confirm('确认拒绝退款申请', '警告').then(() => {
                    this.loading = true;
                    refundOrderApi.agree({id: this.order.id, agree: true}).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '已拒绝退款申请').then(() => {
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            },
            // 确认 收货
            confirmReceipt() {
                this.$confirm('确认收到货物并退款？', '是否完成退款', {}).then(() => {
                    this.loading = true;
                    refundOrderApi.confirm({id: this.order.id}).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '操作成功 等待后台处理').then(() => {
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            }
        },
        mounted() {
            this.orderId = this.$route.params.id;
            this.getData();
        },
        filters: {
            dateFilter(val) {
                if (val === undefined || val === 0) return '-';
                let unix = parseInt(val * 1000);
                return new Date(unix).format('yyyy-MM-dd HH:mm:ss');
            },
            statusFilter(v) {
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
            }
        },
        computed: {
            ...mapGetters(['role']),
            finishStatus() {
                if (this.order.status === 3) return 'error';
                return 'success';
            },
            active() {
                switch (this.order.status) {
                    case 1:
                        return 1;
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        return 2;
                    case 9:
                        return 3;
                    default:
                        return 1;

                }
            }
        }
    };
</script>

<style scoped lang="scss">

    .md-step {
        border: 1px solid #e3e3e3;
        padding: 10px;
        margin-bottom: 10px;
    }

    .detail {
        margin-top: 10px;
        border: 1px solid #e3e3e3;

        .el-col {
            padding: 10px;

            &:first-child {
                border-right: 1px solid #e3e3e3;
            }
        }
    }

    .items {
        .item {
            display: flex;
            padding: 10px 0;
            border-bottom: 1px dotted #e3e3e3;

            img {
                height: 85px;
                display: block;
                flex: 0 0 85px;
                border-radius: 5px;
                overflow: hidden;
                margin-right: 10px;
            }

            .name {
                flex: 1;
            }

            .price {
                position: relative;
                text-align: right;

                span {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                }
            }
        }
    }

    .service {
        border-bottom: 1px dotted #e3e3e3;
        padding: 10px 0;
    }

    .order {
        padding: 10px 0;

        h3 {
            line-height: 40px;
            font-size: 15px;
        }
    }

    .action-title {
        line-height: 35px;

        i {
            padding-right: 10px;
        }
    }

    .action {
        padding-left: 30px;

        p {
            color: #777;
            margin-bottom: 20px;
        }

        margin-bottom: 10px;
    }
</style>