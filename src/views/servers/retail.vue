<template>
    <div class="order-wholesale kd-flex" v-loading="loading">
        <breadcrumb :options="['订单管理', '零售订单']"/>
        <div class="main-container kd-flex-item kd-flex">
            <div class="search">
                <el-form :model="query" :inline="true" @submit.native.prevent="onSearch">
                    <el-form-item label="订单ID">
                        <el-input v-model="query.orderId"/>
                    </el-form-item>
                    <el-form-item label="支付单号">
                        <el-input v-model="query.paysn"/>
                    </el-form-item>
                    <el-form-item label="店铺名称" v-if="role.roleScope !== 2">
                        <el-input v-model="query.storeName"/>
                    </el-form-item>
                    <el-form-item label="用户店铺名称">
                        <el-input v-model="query.userStoreName"/>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="query.orderStatus" :value="query.orderStatus">
                            <el-option :value="undefined" label="全部"/>
                            <el-option value="0" label="待付款"/>
                            <el-option value="1" label="待确认"/>
                            <el-option value="2" label="待发货"/>
                            <el-option value="3" label="待收货"/>
                            <el-option value="4" label="待取货"/>
                            <el-option value="6" label="已关闭"/>
                            <el-option value="9" label="已完成"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="有效时间">
                        <el-date-picker @change="changeDateRange"
                                        v-model="time"
                                        type="daterange"
                                        range-separator="至"
                                        value-format="timestamp"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="是否导出">
                        <el-select v-model="query.exported" :value="query.exported">
                            <el-option :value="undefined" label="全部"/>
                            <el-option :value="true" label="已导出"/>
                            <el-option :value="false" label="未导出"/>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" native-type="submit">过滤</el-button>
                    <el-button type="success" @click="onExport" :disabled="query.orderStatus !== '2'">导出</el-button>
                </el-form>
            </div>
            <span>共 ￥{{$util.priceFormat(totalAmount)}} 交易额 共 {{table.page.total}} 条数据源</span>
            <br>
            <el-table :data="table.data" border class="kd-flex-item scrollbar" height="100%">
                <el-table-column align="center" label="订单ID" prop="id" width="200"/>
                <el-table-column align="center" label="用户昵称" prop="nickname"/>
                <el-table-column align="center" label="订单状态" width="80px">
                    <template slot-scope="scope">{{getOrderStatus(scope.row.status)}}</template>
                </el-table-column>
                <el-table-column align="center" prop="goodsTotal" label="商品总数"/>
                <el-table-column align="center" label="订单总金额" width="100px">
                    <template slot-scope="scope">
                        {{$util.priceFormat(scope.row.amount)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="物流费用" width="100px">
                    <template slot-scope="scope">
                        {{$util.priceFormat(scope.row.shippingFee)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="下单时间" width="200">
                    <template slot-scope="scope">{{scope.row.createTime| dateFilter}}</template>
                </el-table-column>
                <el-table-column align="center" label="支付方式" width="80px">
                    <template slot-scope="scope">{{getPayMethod(scope.row.payMethod)}}</template>
                </el-table-column>
                <el-table-column align="center" label="支付渠道">
                    <template slot-scope="scope">{{getPayChannel(scope.row.payChannel)}}</template>
                </el-table-column>
                <el-table-column align="center" label="支付手续费" width="100px">
                    <template slot-scope="scope">
                        {{$util.priceFormat(scope.row.poundage)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="支付时间" width="200">
                    <template slot-scope="scope">{{scope.row.payTime| dateFilter}}</template>
                </el-table-column>
                <el-table-column align="center" label="发货时间" width="200">
                    <template slot-scope="scope">{{scope.row.sendTime| dateFilter}}</template>
                </el-table-column>
                <el-table-column align="center" label="完成时间" width="200">
                    <template slot-scope="scope">{{scope.row.finishTime| dateFilter}}</template>
                </el-table-column>
                <el-table-column align="center" label="管理" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showGoods(scope.row)">商品</el-button>
                        <el-button type="text" @click="showExpress(scope.row)">物流</el-button>
                        <!--    <el-button v-if="scope.row.status== 3" type="text" @click="confirmPay(scope.row)">确认收货</el-button> -->
                        <!-- <el-button type="text" @click="closeOrder(scope.row)">关闭</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background @current-change="onSearch" style="margin-top: 10px"
                           :current-page.sync="query.page" :page-size="query.pageSize"
                           layout="total, ->, prev, pager, next, jumper" :total="table.page.total"></el-pagination>
        </div>
        <el-dialog title="订单商品信息" :visible.sync="dialog.status.goods" width="50%">
            <div class="dialog-goods">
                <div class="order-info">
                    <span>订单ID</span>
                    <span>{{dialog.data.goods.id}}</span>
                </div>
                <div class="order-info">
                    <span>店铺名称</span>
                    <span>{{dialog.data.goods.storeName}}</span>
                </div>
                <div class="order-info">
                    <span>订单状态</span>
                    <span>{{getOrderStatus(dialog.data.goods.status)}}</span>
                </div>
                <h5 class="title">商品列表</h5>
                <div class="goods-list scrollbar">
                    <div class="goods-item" v-for="(goods,idx) in dialog.data.goods.list" :key="idx">
                        <img :src="goods.thumbnail|imgSrc" width="80" height="80">
                        <div class="goods-name">
                            <p>{{goods.itemName}}</p>
                            <p>{{goods.specName}}</p>
                            <p>单件成本价￥{{$util.priceFormat(goods.costPrice)}} / 单件售价
                                ￥{{$util.priceFormat(goods.price)}}</p>
                        </div>
                        <div class="goods-number">
                            <p>购买数量 x{{goods.count}}</p>
                            <p>总售价 ￥{{$util.priceFormat(goods.totalPrice)}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.status.goods = false">取 消</el-button>
                <el-button type="primary" @click="dialog.status.goods = false">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="物流详情" :visible.sync="dialog.status.express" width="50%">
            <div>
                <div class="order-info">
                    <span>订单ID </span>
                    <span>{{dialog.data.express.id}}</span>
                </div>
                <div class="order-info">
                    <span>店铺名称 </span>
                    <span>{{dialog.data.express.storeName}}</span>
                </div>
                <div class="order-info">
                    <span>订单状态 </span>
                    <span>{{getOrderStatus(dialog.data.express.status)}}</span>
                </div>
            </div>
            <div class="add-express-info">
                <h2 class="title">物流信息</h2>
                <el-button type="primary" v-if="$util.checkPermission('retailOrder',['w'])" @click="showAddExpress">
                    添加物流信息
                </el-button>
            </div>
            <div class="express-list">
                <div class="express-list-item" v-for="(l, i) in dialog.data.expressList" :key="i">
                    <div class="info-list"><span>物流公司:</span><span>{{l.expressCode}}</span></div>
                    <div class="info-list"><span>物流单号:</span><span>{{l.expressId}}</span></div>
                    <div class="info-list"><span>发货时间:</span><span>{{l.sendTime | dateFilter}}</span></div>
                    <!-- <div class="info-list"><span>收件人手机号:</span><span>{{l.mobile}}</span></div> -->
                    <div class="info-list"><span>快递成本:</span><span>{{$util.priceFormat(l.amount)}}元</span></div>
                    <div class="info-list" style="display: none">
                        <span>物流状态</span>
                        <div>
                            <p>年-月-日 时:分:秒 上海分拨中心/装件入车扫描</p>
                            <p>年-月-日 时:分:秒 上海分拨中心/下车扫描</p>
                        </div>
                    </div>
                    <el-button v-if="$util.checkPermission('retailOrder',['w'])" type="text" @click="deleteExpress(l)"
                               class="del-btn">删除
                    </el-button>
                </div>
            </div>
            <el-dialog width="40%" title="添加快递" :visible.sync="dialog.status.expressForm" append-to-body>
                <el-form label-width="100px" @submit.native.prevent="addExpress">
                    <el-form-item label="物流公司">
                        <el-input v-model="dialog.data.expressForm.expressCode"/>
                    </el-form-item>
                    <el-form-item label="快递单号">
                        <el-input v-model="dialog.data.expressForm.expressId"/>
                    </el-form-item>
                    <el-form-item label="快递价格">
                        <el-input v-model="dialog.data.expressForm.amount"/>
                    </el-form-item>
                    <el-form-item label="收件人手机号">
                        <el-input v-model="dialog.data.expressForm.mobile"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-dialog>
    </div>
</template>
<script>
    import retail from '@/common/apis/order';
    import orderApi from '@/common/apis/restockOrder';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import OrderStatusSelector from '@/components/selector/OrderStatusSelector';
    import {mapGetters} from 'vuex';

    export default {
        components: {
            OrderStatusSelector
        },
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                time: undefined,
                query: {
                    orderId: undefined, //订单ID
                    orderStatus: undefined, //订单状态
                    page: 1,
                    pageSize: 20,
                    paySn: undefined, //支付单号
                    storeName: undefined, //店铺名称
                    userId: undefined, //用户id
                    userStoreName: undefined, //用户店铺名称,
                    exported: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    eventType: undefined,
                    storeId: undefined
                },
                dialog: {
                    status: {
                        goods: false,
                        express: false,
                        expressForm: false
                    },
                    data: {
                        goods: {},
                        express: {},
                        expressForm: {
                            orderId: undefined,
                            expressCode: undefined,
                            expressId: undefined,
                            amount: 0,
                            method: 0
                        }
                    }
                },
                goodsList: [],
                exportQuery: {},
                exportData: [],
                totalAmount: 0
            };
        },
        created() {
            this.query.userId = this.$route.query.userId;
            this.query.orderId = this.$route.query.orderId;
            this.query.storeId = this.shop.id
        },
        methods: {
            getData() {
                this.loading = true;
                retail.orderList(this.query).then((res) => {
                    this.$util.handelHttpResponseResult(res).then((data) => {
                        this.table.data = data.data.rows;
                        this.table.page.total = data.data.rowCount;
                    });
                })
                    .finally(() => (this.loading = false));
            },
            onSearch() {
                this.getData();
            },
            confirmExpress(order) {
                const params = {
                    userId: order.userId,
                    orderId: order.id
                };
                this.$util.actionConfirm(`是否确认收货?`).then(() => {
                    this.loading = true;
                    retail.confirmReceiveOrder(params).then(res => {
                        this.$util.handelHttpResponseResult(res).then(() => {
                            this.$message.success('操作成功');
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            },
            confirmPay(order) {
                const params = {
                    userId: order.userId,
                    orderId: order.id
                };
                this.$util.actionConfirm(`是否确认支付?`).then(() => {
                    this.loading = true;
                    retail.confirmPaySuccess(params).then(res => {
                        this.$util.handelHttpResponseResult(res).then(() => {
                            this.$message.success('操作成功');
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            },
            showGoods(order) {
                const params = {
                    orderId: order.id
                };
                this.loading = true;
                retail
                    .goodsList(params)
                    .then((res) =>
                        this.$util.handelHttpResponseResult(res).then((data) => {
                            this.goodsList = data.data;
                            this.dialog.status.goods = true;
                            this.dialog.data.goods = {
                                ...order,
                                list: data.data
                            };
                        })
                    )
                    .finally(() => (this.loading = false));
            },
            //显示物流
            showExpress(order) {
                const params = {
                    orderId: order.id,
                    column: 'id,orderId,expressCode,expressId,amount,sendTime'
                };
                this.loading = true;
                orderApi
                    .expressListRetail(params)
                    .then((res) => {
                        this.$util.handelHttpResponseResult(res, false).then(({
                                                                                  data
                                                                              }) => {
                            this.dialog.status.express = true;
                            this.dialog.data.express = order;
                            this.dialog.data.expressForm.orderId = order.id;
                            if (data !== null) {
                                this.$set(this.dialog.data, 'expressList', data);
                            } else {
                                this.dialog.data.expressList = [];
                            }
                        });
                    })
                    .finally(() => (this.loading = false));
            },
            showAddExpress() {
                this.dialog.status.expressForm = true;
            },
            //添加物流
            addExpress() {
                this.loading = true;
                orderApi
                    .expressAddRetail(this.dialog.data.expressForm)
                    .then((res) => {
                        this.$util.handelHttpResponseResult(res, true, '添加成功').then(() => {
                            this.dialog.status.expressForm = false;
                            this.showExpress(this.dialog.data.express);
                            this.getData();
                        });
                    })
                    .finally(() => (this.loading = false));
            },
            //删除物流
            deleteExpress(express) {
                this.loading = true;
                orderApi.expressDeleteRetail({
                    expressId: express.id
                }).then((res) => {
                    this.$util.handelHttpResponseResult(res).then(() => {
                        this.showExpress(this.dialog.data.express);
                    });
                });
            },
            getOrderStatus(v) {
                switch (v) {
                    case 0:
                        return '待付款';
                    case 1:
                        return '待确认';
                    case 2:
                        return '待发货';
                    case 3:
                        return '待收货';
                    case 4:
                        return '待取货';
                    case 6:
                        return '已关闭';
                    case 9:
                        return '已完成';
                    default:
                        return '其他';
                }
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
            },
            onExport() {
                if (['2'].indexOf(this.query.orderStatus) === -1) {
                    return this.$message.error('请更换状态后导出');
                }
                this.exportData = [];
                this.exportQuery = Object.assign({}, this.query);
                this.getExportData();
            },
            getExportData() {
                this.loading = true;
                retail.exported(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (!data || data.length <= 0) {
                            return this.$message.warning('没有数据可以被导出');
                        }
                        this.$util.exportCsv({
                            title: ['订单id', '店铺昵称', '订单状态', '商品总数', '订单总金额', '商品名称', '商品规格', '购买数量'],
                            titleForKey: ['id', 'storeName', 'status', 'goodsTotal', 'goodsAmount', 'itemName', 'specName', 'count'],
                            data: this.formatCsvData(data)
                        }, 'order-' + new Date().format('yyyy-MM-dd HH:mm:ss') + '.csv');
                        this.getData();
                    });
                }).finally(() => this.loading = false);
            },
            formatCsvData(data) {
                let list = [];
                data.forEach((order) => {
                    let items = order.items;
                    let index = 0;
                    items.forEach((item) => {
                        if (index === 0) {
                            list.push({
                                id: order.id + '\t',
                                storeName: order.storeName,
                                status: this.getOrderStatus(order.status),
                                goodsTotal: order.goodsTotal,
                                goodsAmount: this.$util.priceFormat(order.goodsAmount),
                                itemName: item.itemName,
                                specName: item.specName,
                                count: item.count
                            });
                        } else {
                            list.push({
                                id: order.id + '\t',
                                storeName: '',
                                status: '',
                                goodsTotal: '',
                                goodsAmount: '',
                                itemName: item.itemName,
                                specName: item.specName,
                                count: item.count
                            });
                        }
                        index++;
                    });
                });
                return list;
            }
        },
        mounted() {
            let query = this.$route.query;
            this.query = Object.assign({}, this.query, query);
            console.info(this.query);
            if (query.startTime && query.endTime) {
                this.time = [query.startTime * 1000, query.endTime * 1000];
            }
            this.getData();
        },
        computed: {
            ...mapGetters({role: 'role',shop:'shop'})
        }
    };
</script>
<style scoped lang="scss">
    .order-wholesale {
        height: 100%;

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
                    flex-shrink: 0;
                    border-bottom: 1px solid #909399;
                    padding: 10px 0;

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
                        flex-shrink: 0;
                    }

                    .time {
                        font-size: 12px;
                        columns: #ccc;
                    }

                    .context {
                        color: #409eff;
                    }
                }
            }
        }
    }
</style>
