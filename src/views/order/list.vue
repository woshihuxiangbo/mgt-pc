<template>
    <div class="order-list" v-loading="loading">
        <breadcrumb :options="['订单管理', '全部订单']"/>
        <div class="main-container">
            <el-form :inline="true" :model="searchParams">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品名称">
                            <el-input v-model="searchParams.goodsName"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="订单号">
                            <el-input v-model="searchParams.orderId"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="买家手机号">
                            <el-input v-model="searchParams.sellPhone"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="支付方式">
                            <el-select v-model="searchParams.payment">
                                <el-option label="全部" :value="undefined"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="下单时间">
                            <el-date-picker type="date" v-model="searchParams.createdAt" value-format="yyyy-MM-dd"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="选择状态">
                            <el-select v-model="searchParams.status">
                                <el-option :value="undefined" label="全部"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="售后状态">
                            <el-select v-model="searchParams.afterStatus">
                                <el-option :value="undefined" label="全部"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="订单类型">
                            <el-select v-model="searchParams.orderType">
                                <el-option :value="undefined" label="全部"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="right-btn">
                    <el-button type="primary" @click="onSearch">搜索</el-button>
                    <el-button>导出报表</el-button>
                    <el-button>查看报表</el-button>
                </div>
            </el-form>
        </div>
        <el-tabs v-model="tableActive" @tab-click="tabsChange" type="border-card" stretch>
            <el-tab-pane v-for="(tab, i) in tabs" :key="i" :label="tab.label" :name="tab.name"/>

            <el-table :data="table.data" border>
                <el-table-column align="center" label="商品">
                    <template slot-scope="scope">
                        <div class="goods-info">
                            <img :src="scope.row.goods.image|imgSrc" alt="">
                            <span>{{scope.row.goods.name}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单号" prop="orderId" width="150px"/>
                <el-table-column align="center" label="单价/数量" width="90px">
                    <template slot-scope="scope">
                        {{scope.row.price}}
                        <p>x{{scope.row.buyCount}}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="支付方式" width="90px">
                    <template slot-scope="scope">
                        {{scope.row.payment | paymentFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="售后状态" width="90px">
                    <template slot-scope="scope">
                        <el-button type="text">{{scope.row.afterStatus | afterStatusFilter}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="买家">
                    <template slot-scope="scope">
                        {{scope.row.buyer.name}}
                        {{scope.row.buyer.phone}}
                        <p>{{scope.row.buyer.address}}</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="下单时间" width="100px">
                    <template slot-scope="scope">
                        {{new Date(scope.row.createdAt).format('yyyy-MM-dd HH:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单类型" width="90px">
                    <template slot-scope="scope">
                        {{scope.row.orderType | orderTypeFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单状态" width="90px">
                    <template slot-scope="scope">
                        {{scope.row.status | orderStatusFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="实付金额" width="120px">
                    <template slot-scope="scope">
                        <span>{{scope.row.paymentAmount}}</span>
                        <p class="comment">({{scope.row.paymentAmountComment}})</p>
                    </template>
                </el-table-column>
            </el-table>

            <div class="block">
                <el-pagination
                        background
                        :current-page.sync="table.page.current"
                        :page-size="table.page.size"
                        layout="total, ->, prev, pager, next, jumper"
                        :total="table.page.total">
                </el-pagination>
            </div>
        </el-tabs>
    </div>
</template>

<script>
    import Breadcrumb from "../../components/widget/breadcrumb";
    import orderApi from '../../common/apis/order';

    export default {
        name: "list",
        components: {Breadcrumb},
        data() {
            return {
                loading: false,
                searchParams: {
                    goodsName: undefined,
                    orderId: undefined,
                    sellPhone: undefined,
                    payment: undefined,
                    createAt: undefined,
                    orderStatus: undefined,
                    afterStatus: undefined,
                    orderType: undefined
                },
                tabs: [
                    {
                        name: 'all',
                        label: '全部'
                    },
                    {
                        name: '1',
                        label: '待付款'
                    },
                    {
                        name: '2',
                        label: '待发货'
                    },
                    {
                        name: '3',
                        label: '已发货'
                    },
                    {
                        name: '4',
                        label: '待收货'
                    },
                    {
                        name: '5',
                        label: '待取货'
                    },
                    {
                        name: '6',
                        label: '待评价'
                    },
                    {
                        name: '7',
                        label: '已完成'
                    },
                    {
                        name: '8',
                        label: '已关闭'
                    },
                    {
                        name: '9',
                        label: '退款中'
                    },
                    {
                        name: '10',
                        label: '进行中'
                    }
                ],
                tableActive: 'all',
                table: {
                    data: [
                        {
                            id: 1,
                            orderId: 'OR8298564265566',
                            goods: {
                                image: 'https://fhimg.52xie.com/uploadfile/2016/0824/20160824040024947.jpg',
                                name: '商品名称'
                            },
                            price: '99.99',
                            buyCount: 1,
                            payment: 1,
                            afterStatus: 0,
                            buyer: {
                                name: '买家名称',
                                address: '地址地址地址地址地址地址地址',
                                phone: '18999999999'
                            },
                            createdAt: new Date().getTime(),
                            orderType: 1,
                            status: 1,
                            paymentAmount: 99.01,
                            paymentAmountComment: '含运费0.00元'
                        }
                    ],
                    page: {
                        size: 20,
                        current: 1,
                        total: 154
                    }
                }
            }
        },
        methods: {
            getData() {
                this.loading = true;
                orderApi.getOrderList().then(res => {
                    if (res.data.success === true) {
                        this.$set('table.data', res.data.data);
                    }
                }).catch().finally(() => {
                    this.loading = false
                })
            },
            onSearch() {

            },
            tabsChange(e) {

            }
        },
        filters: {
            paymentFilter(val) {
                switch (val) {
                    case 1:
                        return '线上支付';
                }
            },
            afterStatusFilter(v) {
                switch (v) {
                    default:
                        return '';
                }
            },
            orderTypeFilter(v) {
                switch (v) {
                    default:
                        return '常规订单';
                }
            },
            orderStatusFilter(v) {
                switch (v) {
                    default:
                        return '订单状态';
                }
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style scoped lang="scss">
    .order-list {
        .right-btn {
            text-align: right;
        }

        .block {
            margin-top: 10px;
        }

        .el-table {
            .goods-info {
                display: flex;

                img {
                    height: 50px;
                }

                span {
                    padding-left: 10px;
                }
            }

            .comment {
                color: #909399;
            }
        }
    }
</style>