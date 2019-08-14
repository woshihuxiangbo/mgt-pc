<template>
    <div class="retail-refund" v-loading="loading">
        <breadcrumb :options="['售后详情', serviceType==1?'退款':'退货退款']"/>
        <div class="main-container">
            <el-row class="detail" type="flex" align="content">
                <el-col :span="4">
                    <h1 class="h1">售后订单进程</h1>
                    <el-timeline reverse>
                        <el-timeline-item
                            v-for="(log, index) in logList"
                            :key="index"
                            :timestamp="log.createTime | dateFilter">
                            {{getStatusToString(log.status)}}
                        </el-timeline-item>
                    </el-timeline>
                </el-col>
                <el-col :span="10" :xs="24">
                    <h1 class="h1">售后信息</h1>
                    <div class="items">

                        <el-table border :data='order.refundOrderList'>
                            <el-table-column prop="thumbnail" label="商品图片" >
                                <template slot-scope="scope">
                                    <img :src='scope.row.thumbnail | imgSrc' @error='picLoadError' width="50" height="50"/>
                                </template>
                            </el-table-column>
                            <el-table-column prop="itemname" label="商品名称" ></el-table-column>
                            <el-table-column prop="specname" label="规格" ></el-table-column>
                            <el-table-column prop="totalprice" label="销售单价(元)" >
                                <template slot-scope="scope">
                                   <p>￥{{$util.priceFormat(scope.row.totalprice/scope.row.count)}}</p>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                    <div class="order">
                        <h3>订单基本信息</h3>
                        <!-- <list-item label="订单编号">{{order.orderid}}</list-item>
                        <list-item label="交易编号">{{order.paysn}}</list-item>
                        <list-item label="创建时间">{{order.createTime | dateFilter}}</list-item>
                        <list-item label="支付时间">{{order.paytime | dateFilter}}</list-item>
                        <list-item label="快递单号">{{order.expressid}}</list-item>
                        <list-item label="支付方式">
                            {{getPayMethod(order.paymethod)}}
                            {{getPayChannel(order.paychannel)}}
                        </list-item>
                        <list-item label="实付款(含运费)">￥{{$util.priceFormat(order.amount)}}</list-item> -->
                        <!-- <el-table border>
                            <el-table-column prop="thumbnail" label="订单ID" ></el-table-column>
                            <el-table-column prop="itemname" label="订单支付时间" ></el-table-column>
                            <el-table-column prop="specname" label="订单类型" ></el-table-column>
                            <el-table-column prop="totalprice" label="订单件数" ></el-table-column>
                            <el-table-column prop="totalprice" label="配送方式" ></el-table-column>
                            <el-table-column prop="totalprice" label="实付金额(含运费)" ></el-table-column>
                            <el-table-column prop="totalprice" label="发货快递" ></el-table-column>
                            <el-table-column prop="totalprice" label="发货快递单号" ></el-table-column>
                        </el-table> -->
                        <table class="table">
                            <tr><td>订单ID</td><td>{{order.orderid}}</td></tr>
                            <tr><td>订单支付时间</td><td>{{order.createTime | dateFilter}}</td></tr>
                            <tr><td>订单类型</td><td>{{order.eventtype}}</td></tr>
                            <tr><td>订单件数</td><td>{{order.goodstotal}}</td></tr>
                            <tr><td>配送方式</td><td>{{order.method || '-'}}</td></tr>
                            <tr><td>实付金额(含运费)</td><td>￥{{$util.priceFormat(order.totalmoney)}}</td></tr>
                            <tr><td>发货快递</td><td>{{order.expressname || '-'}}</td></tr>
                            <tr><td>发货快递单号</td><td>{{order.buyexpressid || '-'}}</td></tr>
                        </table>
                    </div>
                </el-col>
                <el-col :span="10" :xs="24" v-if="$util.checkPermission('retailOrder', ['u'])">
                    <h1 class="h1">售后审核</h1>
                    <!-- <p class="action-title" v-if="[6,1,7,5,9].indexOf(status) !== -1">
                        <i class="el-icon-warning"></i>等待商家处理退款申请
                    </p> -->
                    <!-- ------------按钮状态---------------------- -->
                    <!-- <div class="action" v-if="status === 1">
                        <p>收到买家仅退款申请，请尽快处理</p>
                        <el-button size="medium" type="primary" @click="dialog = true">同意退款</el-button>
                        <el-button size="medium" type="warning" @click="rejectRefund">拒绝退款</el-button>
                    </div>
                    <div class="action" v-else-if="status === 6 && serviceType === 2">
                        <p>买家已退货，请尽快处理</p>
                        <el-button size="medium" type="warning" @click="confirmReceipt">确认收货</el-button>
                    </div>
                    <div class="action" v-else-if="status === 7 || (serviceType === 1 && status === 5) || status === 9">
                        <p>已收到货物，请尽快处理</p>
                        <el-button size="medium" type="warning" @click="confirmRefundPay('是否确认打款')" :loading="isConfirmRefundPay">确认退款
                        </el-button>
                    </div>
                    <div class="action" v-else-if="status === 8">
                        <el-button size="medium" type="warning" @click="confirmRefundPay('是否查询退款结果')" :loading="isConfirmRefundPay">查询结果</el-button>
                    </div> -->
                    <div class="action"  >
                        <p class='tips' >{{getStatusToString(logList[0]&&logList[0].status)}}</p>
                        <div  v-if='status==1'>
                            <!-- <el-button type="primary" size="medium" @click='confirmRefund' >同意售后</el-button> -->
                            <el-button type="primary" size="medium" @click="dialog = true" >同意售后</el-button>
                            <el-button type="warning" size="medium" @click='rejectRefund'>拒绝售后</el-button>
                        </div>
                        <div v-else-if='status==7||status==5 || status==6'>
                            <el-button type="primary" size="medium" :disabled='serviceType==1||status==7' @click='confirmReceipt' >确认收货</el-button>
                            <el-button type="warning" size="medium" :disabled='status!=7' @click='confirmRefundPay2'>确认退款</el-button>
                        </div>


                    </div>

                    <!-- ------------按钮状态---------------------- -->
                    <div class="order">

                        <h3>售后基本信息</h3>
                        <table class="table">
                            <tr><td>售后原因</td><td>{{logData.reason}}</td></tr>
                            <tr><td>退款金额</td><td>￥{{$util.priceFormat(logData.refundmoney)}}</td></tr>
                            <tr><td>售后说明</td><td>{{logData.remark || '-'}}</td></tr>
                            <tr><td>售后图片</td>
                                <td>
                                    <div v-if='logPicArr.length==0'>-</div>
                                    <div v-else>
                                        <img :src="src | imgSrc"  v-for="(src, i) in logPicArr" :key="i" width="50" height="50"/>
                                    </div>


                                </td>
                            </tr>
                            <tr><td>退返快递</td><td>{{logData.expresscompany || '-'}}</td></tr>
                            <tr><td>退返快递单号</td><td>{{logData.expressid || '-'}}</td></tr>
                        </table>
                        <h3>退返快递进程</h3>
                        <div v-if='kuaidi.length == 0'>无快递进程</div>
                        <div v-else>
                            <el-timeline reverse>
                                <el-timeline-item
                                    v-for="(item, index) in kuaidi"
                                    :key="index"
                                    :timestamp="item.time">
                                    {{item.context}}
                                </el-timeline-item>
                            </el-timeline>
                        </div>

                    </div>
                </el-col>
            </el-row>
        </div>
        <el-dialog title="是否确认通过退款申请" :visible.sync="dialog" width="500px">
            <div v-if="serviceType === 2">
                <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent="confirmRefund">
                    <el-form-item label="收件人姓名" prop="name">
                        <el-input v-model="form.name"/>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="mobile">
                        <el-input v-model="form.mobile"/>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address">
                        <el-input v-model="form.address"/>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button @click="dialog = false">取消</el-button>
                <el-button type="success" @click="confirmRefund">通过申请</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ListItem from '@/components/widget/ListItem';
    import refundApi from '@/common/apis/orderRefund';
    import API from '@/common/apis/restockOrder';  // 快递
    // status 字段
    // 1申请中/     =
    // 2退款申请等待卖家确认中
    // 3买家撤销申请
    // 4卖家不同意退款
    // 5退款申请达成，等待买家发货  =
    // 6买家已退货，等待卖家确认收货 =
    // 7待平台处理退款 =
    // 8退款中/
    // 9退款失败 =
    // 10售后完成'
    export default {
        components: {ListItem},
        data() {
            return {
                kuaidi:[
                    // {time: 1565069569,context:'xxx'},
                    // {time: 1565069569,context:'xxx'},
                    // {time: 1565069569,context:'xxx'},
                    // {time: 1565069569,context:'xxx'},
                ],
                defaultImg:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1565077079890&di=6a84d742213f2b2c8d8929a3a9fad63f&imgtype=0&src=http%3A%2F%2Ffs.zhenjiang365.cn%2Fbbsimg%2Ffcmb%2Fimage%2Fnopic590.jpg',
                loading: false,
                isConfirmRefundPay: false,
                active: 1,
                orderId: undefined,
                logList: [],
                order: {
                    refundDetail: []
                },
                serviceType: undefined,
                status: undefined,
                dialog: false,
                form: {
                    name: undefined,
                    mobile: undefined,
                    address: undefined
                },
                rules: {
                    name: {
                        required: true,
                        message: '填写收件人'
                    },
                    mobile: {
                        required: true,
                        message: '请输入联系电话'
                    },
                    address: {
                        required: true,
                        message: '请输入详细地址'
                    }
                },
                statusList: [
                    {
                        value: '申请中',
                        label: 1
                    },
                    {
                        value: '退款申请等待卖家确认中',
                        label: 2
                    },
                    {
                        value: '买家撤销申请',
                        label: 3
                    },
                    {
                        value: '卖家不同意退款',
                        label: 4
                    },
                    {
                        value: '退款申请达成',
                        label: 5
                    },
                    {
                        value: '买家已退货',
                        label: 6
                    },
                    {
                        value: '待平台处理退款',
                        label: 7
                    },
                    {
                        value: '退款中',
                        label: 8
                    },
                    {
                        value: '退款失败',
                        label: 9
                    },
                    {
                        value: '售后完成',
                        label: 10
                    }
                ],
                logData:{},
                logPicArr:[],
            };
        },
        methods: {
            getData() {
                this.loading = true;
                console.log('reid:',this.orderId)
                refundApi.refundDetails({id: this.orderId}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        // data.logList.reverse();
                        this.logList = data.logList;
                        this.order = data.refundDetail;
                        this.status = data.status;
                        this.serviceType = data.serviceType;
                    });
                }).finally(() => this.loading = false);
            },
            // -------------------------
            picLoadError(e){
                e.target.src = this.defaultImg
            },
            getRefundrefundDetailsLog(){
                refundApi.refundrefundDetailsLog({id: this.orderId}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.logData = data[0];
                        this.logPicArr = data[0]&&data[0].proof&&data[0].proof.split(',') || [];

                    });
                })
            },
            getOrderExpress(){

            },
            // 同意售后
            confirmRefund2(){
                    this.loading = true
                    refundApi.consent({refundId: this.order.refundId}).then(res => {
                                this.$util.handelHttpResponseResult(res, true, '已同意售后').then(() => {
                                    this.getData();
                                });
                            }).finally(() => this.loading = false);
            },
            // 同意退款
            confirmRefundPay2(){
                    this.loading = true;
                    refundApi.refund({id: this.order.refundId}).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '操作成功').then(() => {
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
            },
            // 快递进程
            getExpress(id){

                API.getExpress({id:id}).then(res=>{
                    this.$util.handelHttpResponseResult(res, false).then((data) => {
                            console.log('快递：',data.data.kuaidi)
                           this.kuaidi = data.data.kuaidi || []
                        });
                })
            },
            // -------------------------
            confirmRefund() {
                if (this.serviceType === 2){
                    // this.$refs['form'].validate((valid) => {
                    //     if (valid) {
                            this.loading = true;
                            let params = {
                                refundId: this.order.refundId
                            };
                            if (this.serviceType === 2) {
                                params.receiverStr = JSON.stringify(this.form);
                            }
                            refundApi.consent(params).then(res => {
                                this.$util.handelHttpResponseResult(res, true, '已同意退款申请').then(() => {
                                    this.getData();
                                    this.dialog = false;
                                });
                            }).finally(() => this.loading = false);
                        }
                    // });
                else {
                    this.loading = true;
                    let params = {
                        refundId: this.order.refundId
                    };
                    refundApi.consent(params).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '已同意退款申请').then(() => {
                            this.getData();
                            this.dialog = false;
                        });
                    }).finally(() => this.loading = false);
                }
            },
            rejectRefund() {
                this.$prompt('请输入原因', '确认拒绝退款申请', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({value}) => {
                    this.loading = true;
                    refundApi.refuse({id: this.order.refundId, content: value}).then(res => {
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
                    refundApi.verify({id: this.order.refundId}).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '操作成功 等待后台处理').then(() => {
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            },
            confirmRefundPay(title) {
                this.$confirm(title, '警告', {}).then(() => {
                    this.loading = true;
                    refundApi.refund({id: this.order.refundId}).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '操作成功').then(() => {
                            this.isConfirmRefundPay = true;
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            },

            getStatusToString(v) {
                let status = '-';
                this.statusList.forEach((s) => {
                    if (s.label === v) {
                        status = s.value;
                        return status;
                    }
                });
                return status;
            },
            getPayMethod(v) {
                switch (v) {
                    case 1:
                        return '线上支付';
                    case 2:
                        return '到店自提';
                    case 3:
                        return '线下支付';
                    default:
                        return '其他';
                }
            },
            getPayChannel(v) {
                switch (v) {
                    case 1:
                        return '微信';
                    case 2:
                        return '支付宝';
                    default:
                        return '';
                }
            }
        },
        mounted() {
            this.orderId = this.$route.params.reid;
            this.getData();
            this.getRefundrefundDetailsLog();
            this.getOrderExpress();
            this.getExpress(this.$route.params.reid)
        },
        filters: {
            dateFilter(val) {
                if (val === undefined || val === 0) return '-';
                let unix = parseInt(val * 1000);
                return new Date(unix).format('yyyy-MM-dd HH:mm:ss');
            }
        },
        computed: {
            serviceTypeFormat() {
                switch (this.serviceType) {
                    case 1 :
                        return '退款';
                    case 2:
                        return '退款退货';
                    default:
                        return '';
                }
            },
            proofImages() {
                if (this.order.proof !== undefined) {
                    return this.order.proof.split(',');
                } else {
                    return [];
                }
            },
            // ...mapGetters({shop: 'shop'})
        }
    };
</script>

<style scoped lang="scss">
    .h1{
        margin-bottom: 20px;
    }
    .table{
        border-collapse: collapse;
        width: 100%;
        td{
            border:1px solid #EBEEF5;
            height: 40px;
            padding: 0 20px;
            font-size: 14px;
        }
        td:first-child{
            width: 115px;
        }
    }
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

            &:nth-child(2),
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

    .md-img {
        width: 100px;
        height: 100px;
        margin-right: 10px;
    }
</style>
