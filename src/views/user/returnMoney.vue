<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-12 11:07:37
 * @LastEditTime: 2019-08-13 09:27:56
 * @LastEditors: Please set LastEditors
 -->

<template>
  <div class="user-list kd-flex" v-loading="loading">
    <breadcrumb :options="['返佣金额','返佣明细']" />
    <el-container class="kd-flex-item kd-flex">
      <el-row>
        <el-col :span="5">
          <list-item label="累计消费金额">{{$util.priceFormat($route.query.buyAmount)}}</list-item>
        </el-col>
        <el-col :span="5">
          <list-item label="累计返佣金额">{{$util.priceFormat($route.query.incomeTotal)}}</list-item>
        </el-col>
      </el-row>
      <!-- search -->
      <el-form :model="query" :inline="true" @submit.native.prevent="onSearch">
        <el-form-item label="订单大ID">
          <el-input v-model="query.id" />
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            @change="changeDateRange"
            v-model="time"
            type="daterange"
            range-separator="至"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-button type="primary" native-type="submit">筛选</el-button>
      </el-form>
      <!-- search -->
      <!-- table -->
      <el-table :data="tableData" border :header-cell-style="headStyle">
        <el-table-column prop="id" label="订单大ID">
          <template slot-scope="scope">
            <router-link :to="{ name: 'OrderRetail1', query: { id: scope.row.id }}">{{scope.row.id}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="订单金额">
          <template slot-scope="scope">￥{{$util.priceFormat(scope.row.amount)}}</template>
        </el-table-column>
        <el-table-column prop="refoundmoney" label="返佣金额">
          <template slot-scope="scope">￥{{$util.priceFormat(scope.row.refoundmoney)}}</template>
        </el-table-column>
        <el-table-column prop="paytime" label="支付时间">
          <template slot-scope="scope">{{scope.row.paytime | dateFilter}}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="onSearch"
        style="margin-top: 10px"
        :current-page.sync="query.pageNum"
        :page-size="query.pageSize"
        layout="total, ->, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- table -->
    </el-container>
  </div>
</template>
<script>
import ListItem from '@/components/widget/ListItem';
import retail from '@/common/apis/order';
import {mapGetters} from 'vuex';
import tableDataMixins from '@/components/mixins/tableDataMixins';
export default {
    components: {ListItem},
    mixins: [tableDataMixins],
    data() {
        return {
            loading: false,
            time: undefined,
            query: {
                pageNum: 1,
                pageSize: 10,
                userId: undefined,
                storeId: undefined,
                orderId: undefined,
                createTimeStart: undefined,
                createTimeEnd: undefined
            },
            total: 0,
            tableData: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        onSearch() {
            this.query.pageNum = 1;
            this.getList();
        },
        changeDateRange(data) {
            this.query.createTimeStart = data[0];
            this.query.createTimeEnd = data[1];
            console.log(this.query.createTime, this.query.endTime);
        },
        getList() {
            this.loading = true;
            retail
                .returnMoneyList({...this.query, storeId: this.shop.id, userId: this.$route.query.userId})
                .then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.tableData = data.rows;
                        this.total = data.rowCount;
                    });
                })
                .finally(() => (this.loading = false));
        },
        headStyle() {
            return 'background-color:#DCDFE6';
        }
    },
    computed: {
        ...mapGetters({shop: 'shop'})
    }
};
</script>

<style scoped lang="scss">
.mp-page {
    display: flex;

    .total {
        flex: 1;
        line-height: 42px;
        font-size: 14px;
    }
}

.user-list {
    height: 100%;

    .el-container {
        background-color: white;
        padding: 20px;
        flex-direction: column;

        .search-action {
            text-align: right;
            padding: 0 0 25px;
        }

        .table-avatar {
            width: 50px;
            height: 50px;
        }

        .block {
            display: flex;

            .table-select-action {
                flex: 1;
                padding: 10px;
            }

            .el-pagination {
                padding-top: 15px;
            }
        }
    }
}
</style>

