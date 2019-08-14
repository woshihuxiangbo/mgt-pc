<template>
    <div class="order-wholesale" v-loading="loading">
        <breadcrumb :options="['订单管理', '零售订单']"/>
        <div class="main-container">
            <div class="search">
                <el-form :model="query" @submit.native.prevent="onSearch" label-width="80px">
                    <el-row>
                        <el-col :span="8" :xs="24" :sm="8">
                            <el-form-item label="订单ID">
                                <el-input v-model="query.orderId"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :xs="24" :sm="8">
                            <el-form-item label="用户昵称">
                                <el-input v-model="query.userName"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" :xs="24" :sm="8">
                            <el-form-item label="状态">
                                <order-status-selector v-model="query.status" show-all style="width: 100%"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24" align="right">
                            <el-button type="primary" native-type="submit">过滤</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <br>
            <el-table :data="table.data" border height="550px">
                <el-table-column align="center" label="订单ID" prop="orderId" width="160"/>
                <el-table-column align="center" label="用户昵称" prop="userName"/>
                <el-table-column align="center" label="订单状态" width="80px">
                    <template slot-scope="scope">
                        {{getOrderStatus(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="商品总数"/>
                <el-table-column align="center" label="订单总金额" width="100px"/>
                <el-table-column align="center" label="物流费用"/>
                <el-table-column align="center" label="下单时间">
                    <template slot-scope="scope"></template>
                </el-table-column>
                <el-table-column align="center" label="支付方式"/>
                <el-table-column align="center" label="支付渠道"/>
                <el-table-column align="center" label="支付手续费" width="100px"/>
                <el-table-column align="center" label="支付时间" width="100px"/>
                <el-table-column align="center" label="发货时间" width="100px"/>
                <el-table-column align="center" label="完成时间" width="100px"/>
                <el-table-column align="center" label="管理" fixed="right" width="150px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showGoods(scope.row)">商品</el-button>
                        <el-button type="text" @click="showExpress(scope.row)">物流</el-button>
                        <el-button type="text" @click="closeOrder(scope.row)">关闭</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    @current-change="onSearch"
                    style="margin-top: 10px"
                    :current-page.sync="query.page"
                    :page-size="query.pageSize"
                    layout="total, ->, prev, pager, next, jumper"
                    :total="table.page.total">
            </el-pagination>
        </div>
        <el-dialog
                title="订单商品信息"
                :visible.sync="dialog.status.goods"
                width="50%">
            <div class="dialog-goods">
                <div class="order-info">
                    <span>订单ID </span>
                    <span>{{dialog.data.goods.orderId}}</span>
                </div>
                <div class="order-info">
                    <span>订单状态 </span>
                    <span>{{getOrderStatus(dialog.data.goods.status)}}</span>
                </div>
                <h5 class="title">商品列表</h5>
                <div class="goods-list">
                    <div class="goods-item">
                        <img src=""/>
                        <div class="goods-name">
                            <p>商品名称</p>
                            <p>商品规格</p>
                            <p>单件成本价￥1 / 单件售价 ￥10</p>
                        </div>
                        <div class="goods-number">
                            <p>购买数量 x10</p>
                            <p>总售价 ￥100</p>
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
                    <span>{{dialog.data.express.orderId}}</span>
                </div>
                <div class="order-info">
                    <span>订单状态 </span>
                    <span>{{getOrderStatus(dialog.data.express.status)}}</span>
                </div>
            </div>
            <div class="add-express-info">
                <h2 class="title">物流信息</h2>
                <el-button type="primary" @click="showAddExpress">添加物流信息</el-button>
            </div>
            <div class="express-list">
                <div class="express-list-item">
                    <div class="info-list"><span>物流公司</span><span>xxx快递</span></div>
                    <div class="info-list"><span>物流单号</span><span>xxxxxxxxxxxxxxxxxxx</span></div>
                    <div class="info-list"><span>发货时间</span><span>time</span></div>
                    <div class="info-list"><span>快递成本</span><span>10元</span></div>
                    <div class="info-list">
                        <span>物流状态</span>
                        <div>
                            <p>年-月-日 时:分:秒 上海分拨中心/装件入车扫描</p>
                            <p>年-月-日 时:分:秒 上海分拨中心/下车扫描</p>
                        </div>
                    </div>
                </div>
            </div>
            <el-dialog
                    width="40%"
                    title="添加快递"
                    :visible.sync="dialog.status.expressForm"
                    append-to-body>
                <el-form label-width="80px" @submit.native.prevent="addExpress">
                    <el-form-item label="物流公司">
                        <el-input v-model="dialog.data.expressForm.aa"/>
                    </el-form-item>
                    <el-form-item label="快递单号">
                        <el-input v-model="dialog.data.expressForm.bb"/>
                    </el-form-item>
                    <el-form-item label="快递价格">
                        <el-input v-model="dialog.data.expressForm.cc"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../../common/apis/order';
    import tableDataMixins from '../../../components/mixins/tableDataMixins';
    import OrderStatusSelector from "../../../components/selector/OrderStatusSelector";

    export default {
        components: {OrderStatusSelector},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                query: {
                    orderId: undefined,
                    storeName: undefined,
                    status: undefined,
                    userName: undefined,
                    page: 1,
                    pageSize: 20,
                    column: ''
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

                        }
                    }
                }
            }
        },
        methods: {
            getData() {
                this.table.data = [
                    {
                        orderId: 'OS85965868696666',
                        status: 1,
                    }
                ];
            },
            onSearch() {
                this.getData();
            },
            closeOrder(item) {
                this.$prompt('', '基本信息', {
                    confirmButtonText: '确认关闭订单',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    inputValidator: (val) => {
                        return !!val;
                    },
                    inputErrorMessage: '不能为空',
                    message: '<p>订单ID ' + item.orderId + '</p>' +
                        '<p>订单ID ' + this.getOrderStatus(item.status) + '</p>' +
                        '<h3>关闭原因</h3>'
                }).then(({value}) => {
                    // TODO
                })
            },
            showGoods(order) {
                // TODO 获取订单的产品数据
                this.dialog.status.goods = true;
                this.dialog.data.goods = order;
            },
            showExpress(order) {
                this.dialog.status.express = true;
                this.dialog.data.express = order;
            },
            showAddExpress () {
                this.dialog.status.expressForm = true;
            },
            addExpress () {
                this.dialog.status.expressForm = false;
            },
            getOrderStatus(v) {
                switch (v) {
                    case 0:
                        return '待付款';
                    case 1:
                        return '待发货';
                    case 2:
                        return '待签收';
                    case 3:
                        return '待确认';
                    case 4:
                        return '售后中';
                    case 5:
                        return '已关闭(支付已超时)';
                    case 6:
                        return '已完成';
                }
            }
        },
        filters: {},
        mounted() {
            this.getData();
        }
    }
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