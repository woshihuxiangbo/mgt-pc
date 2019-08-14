<template>
  <div class="main">
    <breadcrumb :options="['订单管理', '评价']"/>
    <div class="container">
      <el-tabs type="border-card">
        <el-tab-pane label="评价记录">
          <el-form :inline="true" :model="query" :rules="query_rules" ref="query">
            <el-form-item label="订单编号">
              <el-input v-model="query.orderId" placeholder></el-input>
            </el-form-item>
            <el-form-item label="商品名称">
              <el-input v-model="query.userName" placeholder></el-input>
            </el-form-item>
            <el-form-item label="会员账号">
              <el-input v-model="query.userId" placeholder></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">搜索</el-button>
            </el-form-item>
          </el-form>

          <el-table :data="table.data" stripe style="width: 100%">
            <el-table-column prop="goodsInfo" label="商品信息" width="180"></el-table-column>
            <el-table-column prop="userInfo" label="会员信息" width="180"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column prop="type" label="类型" width="180"></el-table-column>
            <el-table-column prop="status" label="显示状态" width="180"></el-table-column>
            <el-table-column prop="creatTime" label="评价时间"></el-table-column>
          </el-table>
          <el-pagination
            background
            @current-change="pageChange"
            style="margin-top: 10px"
            :current-page.sync="query.page"
            :page-size="query.pageSize"
            layout="total, ->, prev, pager, next, jumper"
            :total="table.page.total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="评价设置">
          <p>
            <span class="setting-title">评价设置</span>
            <el-switch v-model="settings.open"></el-switch>
          </p>
          <div class="setting-content">
            <p class="disc">评价功能需要在后台开启，会员交易完成后才能进行评价。</p>
            <p>
              <span>评价审核设置：</span>
              <el-radio-group v-model="settings.type">
                <el-radio label="1">评价后直接显示评价</el-radio>
                <el-radio label="2">审核后显示评价</el-radio>
              </el-radio-group>
            </p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.setting-title {
    margin-right: 20px;
}
.setting-content {
    font-size: 14px;
    color: #606266;
    p {
        margin: 20px 0;
    }
}
</style>

<script>
import orderApi from '@/common/apis/order';
import tableDataMixins from '@/components/mixins/tableDataMixins';
export default {
    name: 'evaluate',
    mixins: [tableDataMixins],
    data() {
        return {
            // 评价
            settings: {
              open: true,
              type: '1'
            },
            loading: false,
            table: {
              data: [],
              page: {
                total: 0
              }
            },
            query: {
              orderId: '',
              userName: '',
              userId: '',
              page: 1,
              pageSize: 20,
              sortOrder: 'id',
              sortBy: 'asc',
              disabled: 0,
              deleted: 0
            },
            query_rules: {},
            tableData: [
              {
                goodsInfo: '商品信息xx',
                userInfo: '王小虎',
                content: '评价内容xxx',
                type: '类型0',
                status: '显示',
                creatTime: '2018-4-12-21'
              },
              {
                goodsInfo: '商品信息xx',
                userInfo: '王小虎',
                content: '评价内容xxx',
                type: '类型0',
                status: '显示',
                creatTime: '2018-4-12-21'
              }
            ]
        };
    },
    mounted(){
      this.getData()
    },
    methods: {
      // 切换分页
      pageChange() {
        this.getData()
      },
        
      // 搜索按钮
      onSearch() {
        console.log(this['query']);
        this.getData();
      },
      // 获取数据
      getData() {
        // this.loading = true;
        this.table.data = this.tableData
        // api
        //  .list(this.query)
        //  .then((res) => {
        //    this.$util.handelHttpResponseResult(res).then((data) => {
        //      this.table.data = data.data.rows;
        //      this.table.page.total = data.data.rowCount;
        //    });
        //  })
        //  .finally(() => (this.loading = false));
      },
    }
};
</script>
