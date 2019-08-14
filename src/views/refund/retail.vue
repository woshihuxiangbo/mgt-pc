<template>
    <div class="order-wholesale kd-page-master kd-flex" v-loading="loading">
        <breadcrumb :options="['售后服务', '零售售后订单']"/>
        <div class="main-container kd-flex kd-flex-item">
            <div class="search">
                <el-form label-width='100px' :model="query" @submit.native.prevent="onSearch" inline>
                    <el-form-item label="订单大ID" >
                        <el-input v-model="query.id"/>
                    </el-form-item>
                    <el-form-item label="用户昵称">
                        <el-input v-model="query.userName"/>
                    </el-form-item>
                    <el-form-item label="经销商店铺">
                        <el-input v-model="query.storeName"/>
                    </el-form-item>
                    <el-form-item label="快递单号">
                        <el-input v-model="query.expressId"/>
                    </el-form-item>
                    <br/>
                    <el-form-item label="订单类型">
                        <!-- 1普通订单，3.社区拼团，4砍价，5.入店礼包 6.免费领礼品
                            7.拼团活动，8秒杀，9砍价
                         -->
                         <el-select v-model="query.eventType" :value="query.eventType" style='width:200px'>
                            <el-option :value="undefined" label="全部"/>
                            <el-option value="1" label="普通订单"/>
                            <!-- <el-option value="3" label="社区拼团"/> -->
                            <el-option value="4" label="砍价"/>
                            <el-option value="5" label="入店礼包"/>
                            <!-- <el-option value="6" label="免费领礼品"/> -->
                            <el-option value="7" label="拼团活动"/>
                            <el-option value="8" label="秒杀"/>
                            <el-option value="9" label="砍价"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="售后类型">
                        <!-- 1:退款 ，2：退货退款 -->
                        <el-select v-model="query.serviceType" :value="query.serviceType" style='width:200px' >
                            <el-option :value="undefined" label="全部"/>
                            <el-option value="1" label="仅退款"/>
                            <el-option value="2" label="退货退款"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="售后状态">
                        <!-- 1申请中，2退款申请等待卖家确认中，3卖家撤销申请，4，卖家不同意退款
                            5退款申请达成，等待买家发货，6'买家已退货，等待卖家确认收货
                            7.待平台处理退款 8.退款中  9.'退款失败  10售后完成
                        -->
                        <el-select v-model="query.refundStatus" :value="query.refundStatus" style='width:200px'>
                            <el-option :value="undefined" label="全部"/>
                            <el-option value="1" label="申请中"/>
                            <el-option value="3" label="撤销申请"/>
                            <el-option value="4" label="拒绝售后"/>
                            <el-option value="2" label="同意售后(退货退款中)"/>

                            <!-- <el-option value="5" label="退款申请达成，等待买家发货"/>
                            <el-option value="6" label="买家已退货，等待卖家确认收货"/>
                            <el-option value="7" label="待平台处理退款"/> -->
                            <!-- <el-option value="8" label="退款中"/> -->
                            <el-option value="9" label="退货退款失败"/>
                            <el-option value="10" label="售后完成"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请售后时间">
                        <el-date-picker @change="changeDateRange"
                            v-model="time"
                            type="daterange"
                            range-separator="至"
                            value-format="timestamp"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" native-type="submit">过滤</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click='onExport'>导出</el-button>
                    </el-form-item>
                    <!-- <el-form-item style="display: block;">
                        <el-radio-group v-model="query.status" @change="getData">
                            <el-radio-button :label="undefined">全部</el-radio-button>
                            <el-radio-button v-for="(s, i) in status" :label="s.label" :key="i">
                                {{s.value}}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item> -->
                </el-form>
            </div>
            <el-table :data="table.data" border height="100%" class="kd-flex-item">
                <!-- <el-table-column align="center" label="订单ID" prop="id" width="160"/>
                <el-table-column align="center" label="用户昵称" prop="nickname"/>
                <el-table-column align="center" label="订单状态" width="80px">
                    <template slot-scope="scope">
                        {{getOrderStatus(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商品总数" prop="goodstotal"/>
                <el-table-column align="center" label="订单总金额" width="100px">
                    <template slot-scope="scope">
                        ￥{{$util.priceFormat(scope.row.amount)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="物流费用" prop="shippingfee">
                    <template slot-scope="scope">
                        ￥{{$util.priceFormat(scope.row.shippingfee)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.createtime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="支付方式">
                    <template slot-scope="scope">{{getPayMethod(scope.row.paymethod)}}</template>
                </el-table-column>
                <el-table-column align="center" label="支付渠道">
                    <template slot-scope="scope">{{getPayChannel(scope.row.paychannel)}}</template>
                </el-table-column>
                <el-table-column align="center" label="支付手续费" width="100px">
                    <template slot-scope="scope">
                        ￥{{$util.priceFormat(scope.row.poundage)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="支付时间" width="100px">
                    <template slot-scope="scope">
                        {{scope.row.paytime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发货时间" width="100px">
                    <template slot-scope="scope">
                        {{scope.row.sendtime | dateFilter}}
                    </template>
                </el-table-column> -->
                <el-table-column width="110"  align="center"  prop="id" label="订单大ID" >

                </el-table-column>
                <el-table-column width="80"  align="center" label="商品图片" >
                                <template slot-scope="scope">
                                    <img :src='scope.row.thumbnail | imgSrc' width="50"/>
                                </template>
                </el-table-column>
                <el-table-column prop='personstorename' align="center" label="用户昵称" >

                </el-table-column>
                <el-table-column width='75' prop='identity' align="center" label="身份" >

                </el-table-column>
                <el-table-column width="75" prop='storename' align="center" label="经销商店铺">

                </el-table-column>
                <el-table-column width="70" prop='personname' align="center" label="负责人"  >

                </el-table-column>
                <el-table-column prop='storename' align="center" label="会员店铺" >

                </el-table-column>
                <el-table-column prop='eventtype' align="center" label="订单类型" >

                </el-table-column>
                <el-table-column prop='servicetype' align="center" label="售后类型" >

                </el-table-column>
                <el-table-column width='108' prop='producername' align="center" label="商品厂家" >

                </el-table-column>
                <el-table-column prop='amount' align="center" label="退款金额" >
                    <template slot-scope="scope">
                        ￥{{$util.priceFormat(scope.row.amount)}}
                    </template>
                </el-table-column>
                <el-table-column width='50' prop='freight' align="center" label="退款运费" >
                    <template slot-scope="scope">
                        ￥{{$util.priceFormat(scope.row.freight)}}
                    </template>
                </el-table-column>
                <el-table-column prop='createtime' align="center" label="申请售后时间" width="108" >
                    <template slot-scope="scope">
                        {{scope.row.createtime | dateFilter}}
                    </template>
                </el-table-column>

                <el-table-column width="85" prop='refundstatus' align="center" label="售后状态" >

                </el-table-column>

                <el-table-column width='80' align="center" prop='expressiame' label="退返快递" >

                </el-table-column>
                <el-table-column align="center" prop='expressid' label="退返快递单号" width="108">

                </el-table-column>
                <el-table-column align="center" label="售后完成时间"  width="108">
                    <template slot-scope="scope">
                        {{scope.row.finishtime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="管理" fixed="right" width="100"
                                 v-if="$util.checkPermission('retailOrder', ['r'])">
                    <template slot-scope="scope">
                        <el-button type="text" @click="gotoDetail(scope.row)">售后详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    @current-change="onSearch"
                    style="margin-top: 10px"
                    :current-page.sync="query.pageNum"
                    :page-size="query.pageSize"
                    layout="total, ->, prev, pager, next, jumper"
                    :total="table.page.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import api from '@/common/apis/orderRefund';
    import Excel from '@/common/apis/restockOrder';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import OrderStatusSelector from '@/components/selector/OrderStatusSelector';
    import {mapGetters} from 'vuex';

    export default {
        components: {OrderStatusSelector},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                time: undefined,
                query: {
                    id:undefined,
                    userName:undefined,
                    storeName: undefined,
                    expressId: undefined,
                    serviceType: undefined,
                    eventType: undefined,
                    refundStatus: undefined,
                    startTime:undefined,
                    endTime:undefined,
                    pageNum: 1,
                    pageSize: 20,
                },
                //  1申请中/2退款申请等待卖家确认中/3买家撤销申请/4卖家不同意退款/5退款申请达成，等待买家发货/6买家已退货，等待卖家确认收货/7待平台处理退款/8退款中/9退款失败/10售后完成
                status: [
                    {
                        value: '申请中',
                        label: 1
                    },
                    {
                        value: '退款申请等待卖家确认中',
                        label: 2
                    },
                    {
                        value: '撤销申请',
                        label: 3
                    },
                    {
                        value: '不同意售后',
                        label: 4
                    },
                    {
                        value: '已同意售后',
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
                ]
            };
        },
        methods: {
            changeDateRange(){
                // console.log(this.time)
                this.query.startTime = this.time[0]
                this.query.endTime = this.time[1]
            },
            onExport() {
                this.loading = true;

                Excel.exportRefundOrderList(this.query, {}).then(res => {
                    let fileName =  '零售售后订单 ' + new Date().toLocaleString() + '.xlsx';
                    this.$util.xhrDownloadFileHandel(res.data, fileName);
                }).finally(() => this.loading = false);
            },
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                let apiFunc = api.refundOrderList1;
                if (this.role.roleID === '14') {
                    apiFunc = api.refundGroupOrderList
                }
                apiFunc(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        console.info(data);
                        this.table.page.total = data.total;
                        this.table.data = data.list;
                    });
                }).finally(() => this.loading = false);
            },
            onSearch() {
                this.getData();
            },
            gotoDetail(item) {
                this.$router.push({name: 'OrderRetailRefundEdit', params: {reid: item.reid}});
            },
            getOrderStatus(v) {
                let status = '-';
                this.status.forEach((s) => {
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
                        return '其他';
                }
            }
        },
        filters: {},
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop', role: 'role'})
        }
    };
</script>

<style scoped lang="scss">

    .order-wholesale {
        .title {
            line-height: 50px;
            font-size: 20px;
            font-weight: 400;
        }

        .order-info {
            text-align: left;

            span {
                display: inline-block;
                padding-right: 10px;

                &:first-child {
                    width: 80px;
                    text-align: right;
                }
            }
        }

        .dialog-goods {
            .goods-list {
                display: flex;
                flex-direction: column;
                max-height: 500px;
                overflow-y: auto;

                .goods-item {
                    display: flex;
                    border-bottom: 1px solid #909399;
                    padding: 0 0 10px 0;

                    &:last-child {
                        padding-bottom: 0;
                        border-bottom: none;
                    }

                    img {
                        flex: 0 0 80px;
                        height: 80px;
                        background-color: #909399;
                        margin-right: 10px;
                    }

                    .goods-name {
                        flex: 1;

                        p {
                            line-height: 20px;

                            &:last-child {
                                padding-top: 20px;
                            }
                        }
                    }

                    .goods-number {
                        flex: 0 0 120px;
                        text-align: right;

                        p {
                            line-height: 40px;
                        }
                    }
                }
            }
        }

        .express-list {
            max-height: 500px;
            overflow-y: auto;

            .express-list-item {
                border-bottom: 1px solid #e3e3e3;
                padding-bottom: 10px;

                &:last-child {
                    padding-bottom: 0;
                    border-bottom: none;
                }

                .info-list {
                    line-height: 25px;
                    display: flex;

                    span:first-child {
                        display: inline-block;
                        padding-right: 10px;
                    }
                }
            }
        }
    }
</style>
