<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-07 09:32:48
 * @LastEditTime: 2019-08-13 15:44:13
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="order-wholesale" v-loading="loading">
    <breadcrumb :options="['订单管理', '零售订单']" />
    <div class="main-container">
      <!-- search -->
      <div class="search">
        <el-form label-width="85px" :model="query" :inline="true" @submit.native.prevent="onSearch">
          <el-form-item label="收件人姓名">
            <el-input v-model="query.receivename" />
          </el-form-item>
          <el-form-item label="收件人电话">
            <el-input v-model="query.mobile" />
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="query.goodsname" />
          </el-form-item>
          <el-form-item label="商品厂商">
            <el-input v-model="query.companyName" />
          </el-form-item>
          <el-form-item label="买家身份">
            <el-select v-model="query.buyerId">
              <el-option :value="undefined" label="全部" />
              <el-option :value="1" label="副会长" />
              <el-option :value="2" label="会长" />
              <el-option :value="3" label="主席" />
              <el-option :value="10" label="普通会员" />
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="订单大ID">
            <el-input v-model="query.id" />
          </el-form-item>
          <el-form-item label="订单小ID">
            <el-input v-model="query.goodsId" />
          </el-form-item>
          <el-form-item label="支付流水">
            <el-input v-model="query.paySn" />
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="query.orderStatus" style="width:200px">
              <el-option :value="undefined" label="全部" />
              <el-option :value="0" label="待付款" />
              <el-option :value="1" label="已付款" />
              <el-option :value="2" label="待发货" />
              <el-option :value="3" label="待收货" />
              <el-option :value="4" label="已完成" />
              <el-option :value="5" label="已关闭" />
            </el-select>
          </el-form-item>

          <el-form-item label="订单类型">
            <el-select v-model="query.orderType" :disabled="ORDERTYPE">
              <el-option :value="undefined" label="全部" />
              <el-option :value="1" label="普通" />
              <el-option :value="5" label="入店礼包" />
              <!-- <el-option :value="6" label="免费领礼品" /> -->
              <el-option :value="7" label="拼团" />
              <el-option :value="8" label="秒杀" />
              <el-option :value="9" label="砍价" />
              <el-option :value="10" label="优惠券" />
            </el-select>
          </el-form-item>

          <el-form-item label="配送方式">
            <el-select v-model="query.expressMethod" style="width:200px">
              <el-option :value="undefined" label="全部" />
              <el-option :value="0" label="快递到家" />
              <el-option :value="1" label="到店自提" />
              <el-option :value="2" label="快递到店" />
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker
              style="width:340px"
              @change="changeDateRange"
              v-model="time"
              type="daterange"
              range-separator="至"
              value-format="timestamp"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-button type="primary" native-type="submit">过滤</el-button>
          <el-button type="success" @click="onExport">导出</el-button>
        </el-form>
      </div>
      <!-- search -->
      <!-- table -->
      <!-- <el-table :data="table.data" border>
        <el-table-column align="center" label="商品名称" prop="goodsname" />
        <el-table-column align="center" label="厂商" prop="name" />
        <el-table-column align="center" label="昵称" prop="nickname" />
        <el-table-column align="center" label="身份" prop="identity" />
        <el-table-column align="center" label="经销商店铺" prop="storename" />
        <el-table-column align="center" label="店铺负责人" prop="personname" />
        <el-table-column align="center" label="类型" prop="ordertype" />
        <el-table-column align="center" label="状态" prop="orderstatus" />
        <el-table-column align="center" label="数量" prop="goodstotal" />
        <el-table-column align="center" label="总金额" prop="goodsamount" />
        <el-table-column align="center" label="下单时间" prop="createtime" />
        <el-table-column align="center" label="发货时间" prop="sendtime" />
        <el-table-column align="center" label="支付时间" prop="paytime" />
        <el-table-column align="center" label="完成时间" prop="finishtime" />
        <el-table-column align="center" label="配送方式" prop="method" />
        <el-table-column align="center" label="支付流水号" prop="paysn" />
        <el-table-column align="center" label="订单商品小ID" prop="itemid" />
        <el-table-column align="center" label="订单商品大ID" prop="id" />
        <el-table-column align="center" label="管理" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="confirmExpress(scope.row)">确认收货</el-button>
            <el-button type="text" @click="getOrderDetail(scope.row)">订单详情</el-button>
            <el-button type="text" @click="getOrderExpress(scope.row)">物流详情</el-button>
          </template>
        </el-table-column>
      </el-table>-->
      <!-- ====================自定义的table===================== -->
      <table class="ztable" v-loading="loading">
        <thead>
          <tr class="tr1">
            <td colspan="2">商品</td>
            <td colspan="2">用户</td>
            <td colspan="2">店铺</td>
            <td colspan="4">订单</td>
            <td colspan="2">下单和支付时间</td>
            <td colspan="2">发货和完成时间</td>
            <td colspan="2">管理</td>
          </tr>
        </thead>
        <tbody v-for="(item,index) in table.data" :key="index">
          <tr class="tr2">
            <td colspan="14">
              <div class="ite">
                <span class="k">订单大ID:</span>
                <span class="v">{{item.id}}</span>
              </div>
              <div class="ite">
                <span class="k">订单商品小ID:</span>
                <span class="v">{{item.itemid}}</span>
              </div>
              <div class="ite">
                <span class="k">支付流水号:</span>
                <span class="v">{{item.paysn}}</span>
              </div>
              <div class="ite">
                <span class="k">配送方式:</span>
                <span class="v">{{item.method}}</span>
              </div>
            </td>
            <td class="td2">
              <el-button type="danger" size="mini" @click="confirmExpress(item)">确认收货</el-button>
            </td>
          </tr>
          <tr class="tr3">
            <td>名称</td>
            <td>厂商</td>
            <td>昵称</td>
            <td>身份</td>
            <td>经销商店铺</td>
            <td>店铺负责人</td>
            <td>类型</td>
            <td>状态</td>
            <td>数量</td>
            <td>总金额</td>
            <td>下单时间</td>
            <td>支付时间</td>
            <td>发货时间</td>
            <td>完成时间</td>
            <td>
              <el-button type="primary" size="mini" @click="getOrderDetail(item)">订单详情</el-button>
            </td>
          </tr>
          <tr class="tr4">
            <td>{{item.goodsname}}</td>
            <td>{{item.name}}</td>
            <td>{{item.nickname}}</td>
            <td>{{item.identity}}</td>
            <td>{{item.storename}}</td>
            <td>{{item.personname}}</td>
            <td>{{item.ordertype}}</td>
            <td>{{item.orderstatus}}</td>
            <td>{{item.goodstotal}}</td>
            <td>{{$util.priceFormat(item.goodsamount)}}</td>
            <td>{{item.createtime | dateFilter}}</td>
            <td>{{item.paytime | dateFilter}}</td>
            <td>{{item.sendtime | dateFilter}}</td>
            <td>{{item.finishtime | dateFilter}}</td>
            <td>
              <el-button type="success" size="mini" @click="getOrderExpress(item)">物流详情</el-button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- ====================自定义的table===================== -->
      <el-pagination
        background
        @current-change="onSearchPage"
        style="margin-top: 10px"
        :current-page.sync="query.page"
        :page-size="query.pageSize"
        layout="total, ->, prev, pager, next, jumper"
        :total="table.page.total"
      ></el-pagination>
      <!-- table -->
      <!-- pop -->
      <el-dialog :visible.sync="dialogVisible" width="80%">
        <div slot="title">
          <breadcrumb :options="['订单', '订单详情']" />
        </div>

        <table class="table table1">
          <tr>
            <td>订单商品小ID</td>
            <td>{{currentData.id}}</td>
          </tr>
          <tr>
            <td>经销商店铺</td>
            <td>{{currentData.storename}}</td>
          </tr>
          <tr>
            <td>店铺负责人</td>
            <td>{{currentData.personname}}</td>
          </tr>
          <tr>
            <td>运营经理</td>
            <td>{{currentOrderData.bussinessman}}</td>
          </tr>
          <tr>
            <td>订单状态</td>
            <td>{{currentData.orderstatus}}</td>
          </tr>
          <tr>
            <td>收件人姓名</td>
            <td>{{currentOrderData.receivename}}</td>
          </tr>
          <tr>
            <td>收件人电话</td>
            <td>{{currentOrderData.mobile}}</td>
          </tr>
          <tr>
            <td>收件人地址</td>
            <td>{{currentOrderData.address}}</td>
          </tr>
        </table>

        <h4 class="h4">订单商品列表</h4>
        <table class="table">
          <tr>
            <td>商品缩略图</td>
            <td>商品名称</td>
            <td>商品规格</td>
            <td>商品厂商</td>

            <td>进货成本价</td>
            <td>经销商进价</td>
            <td>商城零售价</td>
            <td>活动价</td>

            <td>商品数量</td>
            <td>商品金额</td>
            <td>经销商应付货款</td>
          </tr>
          <tr>
            <td>
              <el-image
                :src="currentOrderData.thumbnail | imgSrc"
                style="width: 50px; height: 50px"
              ></el-image>
            </td>
            <td>{{currentOrderData.itemname}}</td>
            <td>{{currentOrderData.specname}}</td>
            <td>{{currentOrderData.producename}}</td>

            <td>{{$util.priceFormat(currentOrderData.supplyprice)}}</td>
            <td>{{$util.priceFormat(currentOrderData.wholesaleprice)}}</td>
            <td>{{$util.priceFormat(currentOrderData.flatprice)}}</td>
            <td>{{$util.priceFormat(currentOrderData.price)}}</td>

            <td>{{currentOrderData.count}}</td>
            <td>{{$util.priceFormat(currentOrderData.totalmoney)}}</td>
            <td>{{$util.priceFormat(currentOrderData.trademoney)}}</td>
          </tr>
        </table>
      </el-dialog>
      <!-- pop -->
      <!-- pop1 -->
      <el-dialog :visible.sync="dialogVisible1" width="80%">
        <div slot="title">
          <breadcrumb :options="['物流', '物流快递']" />
        </div>
        <el-button
          size="small"
          v-if='currentOrderstatus=="待收货"'
          type="primary"
          @click="innerVisible2 = true;"
        >修改快递</el-button>
        <el-button
          size="small"
          v-if='currentOrderstatus=="待发货"'
          type="primary"
          @click="innerVisible = true;"
        >添加快递</el-button>
        <el-dialog width="40%" title="添加快递" :visible.sync="innerVisible" append-to-body>
          <el-form label-width="120px" @submit.native.prevent="addExpress" :model="expressForm">
            <el-form-item label="物流公司" prop="expressCode">
              <el-select
                v-model="expressForm.expressCode"
                filterable
                :value="expressForm.expressCode"
              >
                <el-option
                  v-for="(item ,i) in company"
                  :key="i"
                  :value="item.code"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="快递单号" prop="expressId">
              <el-input v-model="expressForm.expressId" />
            </el-form-item>
            <el-form-item label="快递价格" prop="amount">
              <el-input v-model="expressForm.amount" />
            </el-form-item>
            <el-form-item label="收件人手机号" prop="mobile">
              <el-input v-model="expressForm.mobile" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit">发货</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 修改快递 -->
        <el-dialog width="40%" title="修改快递" :visible.sync="innerVisible2" append-to-body>
          <el-form label-width="120px" @submit.native.prevent="editExpress" :model="expressForm2">
            <el-form-item label="物流公司" prop="expressCode">
              <el-select
                v-model="expressForm2.expressCode"
                filterable
                :value="expressForm2.expressCode"
              >
                <el-option
                  v-for="(item ,i) in company"
                  :key="i"
                  :value="item.code"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="快递单号" prop="expressId">
              <el-input v-model="expressForm2.expressId" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" native-type="submit">发货</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 修改快递 -->
        <el-row :gutter="20">
          <el-col :span="14">
            <h4 class="h4">物流包裹详情</h4>
            <table class="table table2">
              <tr>
                <td>收件人姓名</td>
                <td>{{currentExpressData.receivename}}</td>
              </tr>
              <tr>
                <td>收件人电话</td>
                <td>{{currentExpressData.mobile}}</td>
              </tr>
              <tr>
                <td>收件人地址</td>
                <td>{{currentExpressData.address}}</td>
              </tr>
            </table>

            <table class="table table2">
              <tr>
                <td>商品缩略图</td>
                <td>商品名称</td>
                <td>商品规格</td>
                <td>商品数量</td>
              </tr>
              <tr>
                <td>
                  <el-image
                    :src="currentExpressData.thumbnail | imgSrc"
                    style="width: 50px; height: 50px"
                  ></el-image>
                </td>
                <td>{{currentExpressData.itemname}}</td>
                <td>{{currentExpressData.specname}}</td>
                <td>{{currentExpressData.count}}</td>
              </tr>
            </table>
            <h4 class="h4">物流快递详情</h4>
            <table class="table table2">
              <tr>
                <td>快递公司</td>
                <td>{{currentExpressData.companyname}}</td>
              </tr>
              <tr>
                <td>快递单号</td>
                <td>{{currentExpressData.expressid}}</td>
              </tr>
              <tr>
                <td>发货时间</td>
                <td>{{currentExpressData.sendtime | dateFilter}}</td>
              </tr>
            </table>
          </el-col>

          <el-col :span="10">
            <h4 class="h4">物流进程</h4>
            <div v-if="kuaidi.length == 0">无快递进程</div>
            <div v-else>
              <el-timeline reverse>
                <el-timeline-item
                  v-for="(item, index) in kuaidi"
                  :key="index"
                  :timestamp="item.time"
                >{{item.context}}</el-timeline-item>
              </el-timeline>
            </div>
          </el-col>
        </el-row>
      </el-dialog>
      <!-- pop1 -->
    </div>
  </div>
</template>
<script>
import expressApi from '@/common/apis/express';
import orderApi from '@/common/apis/restockOrder';
import retail from '@/common/apis/order';
import API from '@/common/apis/restockOrder'; // 快递
import tableDataMixins from '@/components/mixins/tableDataMixins';
import {mapGetters} from 'vuex';
export default {
    mixins: [tableDataMixins],
    data() {
        return {
            expressForm: {
                amount: 0
            },
            expressForm2: {},
            company: [],
            innerVisible: false,
            innerVisible2: false,
            ORDERTYPE: false, // 禁用
            loading: false,
            kuaidi: [
                {time: '2018-06-15 24:54:55', context: 'xxx'},
                {time: '2018-06-15 24:54:55', context: 'xxx'},
                {time: '2018-06-15 24:54:55', context: 'xxx'},
                {time: '2018-06-15 24:54:55', context: 'xxx'}
            ],
            loading: false,
            time: undefined,
            dialogVisible: false,
            dialogVisible1: false,
            query: {
                page: 1,
                pageSize: 10,
                id: undefined,
                goodsId: undefined,
                paySn: undefined,
                companyName: undefined,
                createTime: undefined,
                endTime: undefined,
                orderType: undefined,
                orderStatus: undefined,
                buyerId: undefined,
                expressMethod: undefined
            },
            currentData: {}, // 表格的数据
            currentOrderData: {}, //  接口
            currentExpressData: {}, // 接口
            currentId: undefined,
            currentOrderstatus: ''
        };
    },
    created() {
        console.log(this.$route.query.id)
        if(this.$route.query.id){
            this.query.id = this.$route.query.id
        }
        this.getList();
    },

    methods: {
        onSearchPage() {
            this.getList();
        },
        onSearch() {
            this.query.page = 1;
            this.getList();
        },
        changeDateRange(data) {
            this.query.createTime = data[0]/1000;
            this.query.endTime = data[1]/1000;
        },
        getList() {
            this.loading = true;
            retail
                .orderList1({...this.query, storeId: this.shop.id})
                .then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                })
                .finally(() => (this.loading = false));
        },
        // 确认收货
        confirmExpress(order) {
            const params = {
                orderId: order.id
            };
            this.$util.actionConfirm(`是否确认收货?`).then(() => {
                this.loading = true;
                retail
                    // .confirmReceiveOrder(params)
                    .confirmReceiveOrder2(params)
                    .then((res) => {
                        this.$util.handelHttpResponseResult(res).then(() => {
                            this.$message.success('操作成功');
                            this.getList();
                        });
                    })
                    .finally(() => (this.loading = false));
            });
        },
        // 订单详情
        getOrderDetail(row) {
            this.currentData = row;
            retail.getOrderDetail({id: row.id}).then((res) => {
                this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                    this.dialogVisible = true;
                    this.currentOrderData = data;
                });
            });
        },
        // 物流详情
        getOrderExpress(row) {
            this.currentId = row.id;
            this.currentOrderstatus = row.orderstatus;

            console.log('当前条：', row);
            this.getExpressCompany();
            retail.getOrderExpress({id: row.id}).then((res) => {
                this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                    this.dialogVisible1 = true;
                    this.currentExpressData = data;
                    this.expressForm.mobile = data.mobile;
                });
            });
            this.getExpress(row.id);
        },
        // 快递进程
        getExpress(id) {
            API.getExpress1({id: id}).then((res) => {
                this.$util.handelHttpResponseResult(res, false).then((data) => {
                    console.log('快递：', data.data.kuaidi);
                    this.kuaidi = data.data.kuaidi || [];
                });
            });
        },
        onExport() {
            this.loading = true;
            this.query.storeId = this.shop.id;
            orderApi
                .exportOrderList(this.query, {})
                .then((res) => {
                    let fileName = '零售订单 ' + new Date().toLocaleString() + '.xlsx';
                    this.$util.xhrDownloadFileHandel(res.data, fileName);
                })
                .finally(() => (this.loading = false));
        },
        // 显示物流
        // showExpress(orderId) {
        //     const params = {
        //         orderId: orderId,
        //         column: 'id,orderId,expressCode,expressId,amount,sendTime,expressCompany,status'
        //     };
        //     orderApi.expressListRetail(params).then((res) => {
        //         this.$util.handelHttpResponseResult(res, false).then(({data}) => {});
        //     });
        // },
        // 添加物流
        addExpress() {
            this.getExpressCompany();
            orderApi
                .expressAddRetail({...this.expressForm, orderId: this.currentId})
                .then((res) => {
                    this.$util.handelHttpResponseResult(res, true, '添加成功').then(() => {});
                })
                .finally(() => {
                    this.innerVisible = false;
                    retail.getOrderExpress({id: this.currentId}).then((res) => {
                        this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                            this.currentExpressData = data;
                            this.dialogVisible1 = false
                        });
                    });
                });
        },
        //  修改快递 再次发货
        editExpress() {
            expressApi
                .updateExpressId({...this.expressForm2, orderId: this.currentId})
                .then((res) => {
                    this.$util.handelHttpResponseResult(res, true, '修改成功').then(() => {});
                })
                .finally(() => {
                    this.innerVisible2 = false;
                    retail.getOrderExpress({id: this.currentId}).then((res) => {
                        this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                            this.currentExpressData = data;
                        });
                    });
                });
        },
        // 获取快递公司
        getExpressCompany() {
            expressApi.expressCompany().then((res) => {
                this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                    this.company = data;
                });
            });
        }
    },
    computed: {
        ...mapGetters({role: 'role', shop: 'shop'})
    },
    watch: {
        $route: function(r, r1) {

            switch (r.name) {
                case 'OrderRetail1':
                    this.ORDERTYPE = false;
                    this.getList();
                    break;
                case 'tuan':
                    this.ORDERTYPE = true;
                    this.query.orderType = 7;
                    this.getList();
                    break;
                case 'kill':
                    this.ORDERTYPE = true;
                    this.query.orderType = 8;
                    this.getList();
                    break;
                case 'kan':
                    this.ORDERTYPE = true;
                    this.query.orderType = 9;
                    this.getList();
                    break;
            }
        }
    }
};
</script>
<style scoped lang='scss'>
// --------------------
.ztable {
    width: 100%;
    border-collapse: collapse;

    td {
        border: 1px solid #dcdfe6;
        height: 40px;
        padding: 0 10px;
        font-size: 14px;
        text-align: center;
    }
    .tr1 {
        background-color: #409eff;
        color: #fff;
    }
    .tr2 {
        td {
            text-align: left;

            padding-top: 10px;
            .ite {
                display: inline-block;
                margin-right: 30px;
                .k {
                    font-weight: bold;
                }
                .v {
                    color: #666;

                    margin-left: 20px;
                }
            }
        }
        .td2 {
            text-align: center;
        }
    }
    .tr3 td {
        font-weight: bold;
    }
    .tr4 {
        td {
            border-bottom: 3px solid rgb(233, 233, 235);
        }
    }
}
// --------------------

.table1 {
    width: 60%;
    td:first-child {
        width: 115px;
    }
}
.table2 {
    width: 100%;
    td:first-child {
        width: 115px;
    }
}
.table {
    border-collapse: collapse;
    td {
        border: 1px solid #dcdfe6;
        height: 40px;
        padding: 0 20px;
        font-size: 14px;
        vertical-align: middle;
    }
}
.h4 {
    padding: 20px 0;
}
.el-image {
    font-size: 0;
}
</style>

