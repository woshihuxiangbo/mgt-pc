<template>
    <div class="order-wholesale" v-loading="loading">
        <breadcrumb :options="['订单管理', '零售订单']"/>
        <div class="main-container">
            <div class="search" v-if="hideSearch === false">
                <el-form :model="query" :inline="true" @submit.native.prevent="onSearch">
                    <el-form-item label="订单ID">
                        <el-input v-model="query.orderId" />
                    </el-form-item>
                    <el-form-item label="商户单号">
                        <el-input v-model="query.paySn"/>
                    </el-form-item>
                    <el-form-item label="经销商名称" v-if="role.roleScope !== 2">
                        <el-input v-model="query.storeName"/>
                    </el-form-item>
                    <el-form-item label="用户店铺名称">
                        <el-input v-model="query.userStoreName"/>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="query.orderStatus" :value="query.orderStatus" style="width: 120px;">
                            <el-option :value="undefined" label="全部"/>
                            <el-option value="0" label="待付款"/>
                            <!-- <el-option value="1" label="待确认"/>-->
                            <el-option value="2" label="待发货"/>
                            <el-option value="3" label="待收货"/>
                            <el-option value="4" label="待取货"/>
                            <el-option value="6" label="已关闭"/>
                            <el-option value="9" label="已完成"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付方式">
                        <el-select v-model="query.payMethod" :value="query.payMethod" style="width: 120px">
                            <el-option :value="undefined" label="全部"/>
                            <el-option value="1" label="线上支付"/>
                            <el-option value="2" label="到店自提"/>
                            <el-option value="3" label="线下支付"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否导出">
                        <el-select v-model="query.exported" :value="query.exported" style="width: 120px;">
                            <el-option :value="undefined" label="全部"/>
                            <el-option :value="true" label="已导出"/>
                            <el-option :value="false" label="未导出"/>
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
                    <el-button type="primary" native-type="submit">过滤</el-button>
                    <el-button type="success" @click="onExport">导出</el-button>
                    <el-form-item style="width: 100%">
                        <span>共 ￥{{$util.priceFormat(totalAmount)}} 交易额 共 {{table.page.total}} 条数据源</span>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="table.data" border>
                <!--                <el-table-column align="center" label="订单ID" prop="id" width="200"/>-->
                <el-table-column align="center" label="用户昵称" prop="nickname"/>
                <el-table-column align="center" label="经销商" prop="storeName"/>
                <el-table-column align="center" label="用户店铺名称" prop="storeUserName" min-width="120px"/>
                <el-table-column align="center" label="订单状态" width="80px">
                    <template slot-scope="scope">
                        {{getOrderStatus(scope.row.status)}} {{scope.row.refundStatus !== 0 ? '/ 有售后' : ''}}
                    </template>
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
                <el-table-column align="center" label="收件人姓名" width="160">
                    <template slot-scope="scope">
                        {{getReceiver(scope.row.receiver, 'name')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="收件人手机号" width="160">
                    <template slot-scope="scope">
                        {{getReceiver(scope.row.receiver, 'mobile')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="下单和支付时间" width="180">
                    <template slot-scope="scope">
                        <p>{{scope.row.createTime| dateFilter}}</p>
                        <p>{{scope.row.payTime| dateFilter}}</p>
                    </template>

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
                <el-table-column align="center" label="发货时间" width="200">
                    <template slot-scope="scope">{{scope.row.sendTime | dateFilter}}</template>
                </el-table-column>
                <el-table-column align="center" label="完成时间" width="200">
                    <template slot-scope="scope">{{scope.row.finishTime | dateFilter}}</template>
                </el-table-column>
                <el-table-column align="center" label="管理" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="$util.checkPermission('retailOrder', ['l'])"
                                   @click="showGoods(scope.row, true)">商品
                        </el-button>
                        <el-button type="text"
                                   v-if="
                                   $util.checkPermission('retailOrder', ['u']) &&
                                   scope.row.refundStatus === 0 &&
                                    [2,3].indexOf(scope.row.status) !== -1"
                                   @click="showExpress(scope.row)">物流
                        </el-button>
                        <!-- <el-button type="text"
                                v-if="
                                   $util.checkPermission('retailOrder', ['u']) &&
                                   scope.row.refundStatus === 0 &&
                                    [3, 4].indexOf(scope.row.status) !== -1"
                                @click="confirmExpress(scope.row)">确认收货</el-button> -->
                         <el-button type="text" @click="confirmExpress(scope.row)">确认收货</el-button>
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
                        <img :src="goods.thumbnail|imgSrc" width="80" height="80" alt="">
                        <div class="goods-name">
                            <p>{{goods.itemName}}</p>
                            <p>{{goods.specName}} {{goods.skuName}}</p>
                            <p>单件成本价￥{{$util.priceFormat(goods.costPrice)}} / 单件售价
                                ￥{{$util.priceFormat(goods.price)}}</p>
                        </div>
                        <div class="goods-number">
                            <p>购买数量 x{{goods.count}}</p>
                            <p>总售价 ￥{{$util.priceFormat(goods.totalPrice)}}</p>
                        </div>
                        <purchase-item :sku-id="goods.skuId"/>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.status.goods = false">取 消</el-button>
                <el-button type="primary" @click="dialog.status.goods = false">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="物流详情" :visible.sync="dialog.status.express" width="50%" v-loading="loading">
            <div class="md-exp">
                <div class="md-order-info">
                    <div class="md-order">
                        <h3>订单基本信息</h3>
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
                    <div class="md-receiver">
                        <h3>收件人信息</h3>
                        <div class="order-info">
                            <span>收件人 </span>
                            <span>{{selectReceiver.name}}</span>
                        </div>
                        <div class="order-info">
                            <span>联系电话 </span>
                            <span>{{selectReceiver.mobile}}</span>
                        </div>
                        <div class="order-info">
                            <span>邮编 </span>
                            <span>{{selectReceiver.postcode}}</span>
                        </div>
                        <div class="order-info">
                            <span>详细地址 </span>
                            <span v-if="selectReceiver.province !== undefined">
                            {{regionCodeToText()[selectReceiver.province]}}
                            {{regionCodeToText()[selectReceiver.city]}}
                            {{regionCodeToText()[selectReceiver.county]}}
                            {{selectReceiver.details}}
                        </span>
                        </div>
                    </div>
                </div>
                <div class="md-goods-info dialog-goods">
                    <h5 class="title">商品列表</h5>
                    <div class="goods-list scrollbar">
                        <div class="goods-item" v-for="(goods,idx) in dialog.data.goods.list" :key="idx">
                            <img :src="goods.thumbnail|imgSrc" width="80" height="80" alt="">
                            <div class="goods-name">
                                <p>{{goods.itemName}}</p>
                                <p>{{goods.specName}} {{goods.skuName}}</p>
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
                <div class="express-list" v-if="dialog.data.expressList && dialog.data.expressList.length > 0">
                    <h2 class="title">物流信息</h2>
                    <div class="express-list-item" v-for="(l, i) in dialog.data.expressList" :key="i">
                        <div class="info-list"><span>物流公司:</span><span>{{l.expressCompany}}</span></div>
                        <div class="info-list"><span>物流单号:</span><span>{{l.expressId}}</span></div>
                        <div class="info-list"><span>发货时间:</span><span>{{l.sendTime | dateFilter}}</span></div>
                        <!-- <div class="info-list"><span>收件人手机号:</span><span>{{l.mobile}}</span></div> -->
                        <div class="info-list"><span>快递成本:</span><span>{{$util.priceFormat(l.amount)}}元</span></div>
                        <el-button v-if="$util.checkPermission('retailOrder',['d'])" type="text"
                                   @click="deleteExpress(l)"
                                   class="del-btn">删除
                        </el-button>
                        <el-button @click="getExpressData(l)" type="text">查看物流详情</el-button>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <el-button type="primary"
                           v-if="$util.checkPermission('retailOrder',['u']) && dialog.data.expressList.length < 1"
                           @click="showAddExpress">
                    添加物流信息
                </el-button>
            </div>
            <el-dialog v-loading="loading" width="40%" title="添加快递" :visible.sync="dialog.status.expressForm"
                       append-to-body>
                <el-form label-width="120px" @submit.native.prevent="addExpress" ref="expressForm"
                         :model="dialog.data.expressForm" :rules="expressFormRules">
                    <el-form-item label="物流公司" prop="expressCode">
                        <el-select v-model="dialog.data.expressForm.expressCode"
                                   filterable
                                   :value="dialog.data.expressForm.expressCode">
                            <el-option v-for="(item ,i) in company" :key="i" :value="item.code" :label="item.name"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="快递单号" prop="expressId">
                        <el-input v-model="dialog.data.expressForm.expressId"/>
                    </el-form-item>
                    <el-form-item label="快递价格" prop="amount">
                        <el-input v-model="dialog.data.expressForm.amount"/>
                    </el-form-item>
                    <el-form-item label="收件人手机号" prop="mobile">
                        <el-input v-model="dialog.data.expressForm.mobile"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog v-loading="loading" width="40%" title="物流详情" :visible.sync="dialog.status.expressData"
                       append-to-body>
                <div>
                    <el-timeline :reverse="true">
                        <el-timeline-item
                            v-for="(activity, index) in expressData"
                            :key="index"
                            :timestamp="activity.time">
                            {{activity.context}}
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </el-dialog>
        </el-dialog>
    </div>
</template>
<script>
    import retail from '@/common/apis/order';
    import orderApi from '@/common/apis/restockOrder';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import OrderStatusSelector from '@/components/selector/OrderStatusSelector';
    import expressApi from '@/common/apis/express';
    import {mapGetters} from 'vuex';
    import {CodeToText} from 'element-china-area-data';
    import validator from 'el-form-validator';
    import PurchaseItem from '@/components/widget/PurchaseItem';

    export default {
        components: {
            PurchaseItem,
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
                    payMethod: undefined,
                    orderBy: 'create_time',
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
                        expressForm: false,
                        expressData: false
                    },
                    data: {
                        goods: {},
                        express: {},
                        expressList: [],
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
                company: [],
                selectReceiver: {},
                expressFormRules: {
                    expressCode: {
                        required: true,
                        message: '请选择物流公司',
                        trigger: 'blur'
                    },
                    expressId: {
                        required: true,
                        message: '请输入快递单号',
                        trigger: 'blur'
                    },
                    amount: [
                        {
                            rules: 'numeric|min:0',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    mobile: [
                        {
                            required: true,
                            message: '请输入手机号码',
                            trigger: 'blur'
                        },
                        {
                            rules: ['string', 'min:11', 'max:11', 'regex:/^1[3|4|5|7|8][0-9]{9}$/'],
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ]
                },
                rules: [],
                expressData: [],
                totalAmount: 0,
                hideSearch: false
            };
        },
        created() {
            if (this.$route.query.hideSearch === true || this.$route.query.hideSearch === 'true') {
                this.hideSearch = true;
            }
            this.init();
        },
        methods: {
            init() {
                this.query = Object.assign({},
                    this.$util.deepClone(this.query),
                    this.$util.conversionRouterParamsToInteger(this.$route.query, [
                        'mode',
                        'page',
                        'pageSize'
                    ])
                );
                this.query.exported = this.$util.valueToBoolean(this.query.exported);
                this.getData();
            },
            getData() {
                this.loading = true;
                let apiFunc = retail.orderList;
                if (this.role.roleID === '14') {
                    apiFunc = retail.commanderOrderList;
                }
                apiFunc({...this.query, storeId: this.shop.id}).then((res) => {
                    this.$util.handelHttpResponseResult(res).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                        this.totalAmount = data.totalAmount;
                        this.$router.replace({name: 'OrderRetail', query: this.query});
                    });
                }).finally(() => (this.loading = false));
            },
            onSearch() {
                this.getData();
            },
            confirmExpress(order) {
                const params = {
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
            showGoods(order, status) {
                const params = {
                    orderId: order.id
                };
                this.goodsList = [];
                this.loading = true;
                retail.goodsList(params).then((res) =>
                    this.$util.handelHttpResponseResult(res).then((data) => {
                        this.goodsList = data.data;
                        this.dialog.status.goods = status;
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
                this.selectReceiver = {};
                const params = {
                    orderId: order.id,
                    column: 'id,orderId,expressCode,expressId,amount,sendTime,expressCompany,status'
                };
                this.loading = true;
                this.goodsList = [];
                orderApi.expressListRetail(params).then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.selectReceiver = JSON.parse(order.receiver.value);
                        this.dialog.status.express = true;
                        this.dialog.data.express = order;
                        this.dialog.data.expressForm.orderId = order.id;
                        this.showGoods(order, false);
                        if (data !== null) {
                            this.$set(this.dialog.data, 'expressList', data);
                        } else {
                            this.dialog.data.expressList = [];
                        }
                    });
                }).finally(() => (this.loading = false));
            },
            getExpressData(express) {
                this.loading = true;
                this.expressData = [];
                expressApi.expressInfo({id: express.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '查询成功').then(({data}) => {
                        try {
                            this.expressData = data.status.data;
                            this.dialog.status.expressData = true;
                            console.info(this.expressData);
                        } catch (e) {
                            this.$message.error('数据处理失败');
                        }
                    });
                }).finally(() => this.loading = false);
            },
            showAddExpress() {
                this.dialog.status.expressForm = true;
            },
            //添加物流
            addExpress() {
                this.$refs.expressForm.validate((valid) => {
                    if (valid) {
                        let params = this.$util.deepClone(this.dialog.data.expressForm);
                        params.amount = parseInt(params.amount * 100);
                        this.loading = true;
                        orderApi.expressAddRetail(params).then((res) => {
                            this.$util.handelHttpResponseResult(res, true, '添加成功').then(() => {
                                this.dialog.status.expressForm = false;
                                this.showExpress(this.dialog.data.express);
                                this.getData();
                            });
                        })
                            .finally(() => (this.loading = false));
                    } else {
                        this.$message.error('数据填写不完整');
                    }
                });
            },
            //删除物流
            deleteExpress(express) {
                this.loading = true;
                orderApi.expressDeleteRetail({expressId: express.id}).then((res) => {
                    this.$util.handelHttpResponseResult(res).then(() => {
                        this.showExpress(this.dialog.data.express);
                    });
                }).finally(() => this.loading = false);
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
                this.loading = true;
                this.query.storeId = this.shop.id;
                orderApi.exportOrderList(this.query, {}).then(res => {
                    let fileName =  '零售订单 ' + new Date().toLocaleString() + '.xlsx';
                    this.$util.xhrDownloadFileHandel(res.data, fileName);
                }).finally(() => this.loading = false);
            },
            getExpressCompany() {
                expressApi.expressCompany().then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.company = data;
                    });
                });
            },
            regionCodeToText() {
                return CodeToText;
            },
            getReceiver(receiver, key) {
                try {
                    let data = JSON.parse(receiver.value);
                    return data[key];
                } catch (e) {
                    return '';
                }
            }
        },
        mounted() {
            let query = this.$route.query;
            if (query.startTime && query.endTime) {
                this.time = [query.startTime * 1000, query.endTime * 1000];
            }
            this.getExpressCompany();
        },
        computed: {
            ...mapGetters({role: 'role', shop: 'shop'})
        },
        watch: {
            $route() {
                this.$nextTick(() => {
                    this.init();
                });
            }
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
                    margin-bottom: 5px;

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
                border-bottom: 1px solid #E3E3E3;
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
                    }

                    .context {
                        color: #409EFF;
                    }
                }
            }
        }
    }

    .md-order-info {
        display: flex;

        .md-order {
            flex: 1;
        }

        .md-receiver {
            flex: 1;
        }
    }

    .md-exp {
        max-height: 800px;
        overflow-y: auto;
    }
</style>
