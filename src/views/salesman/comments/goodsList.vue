<template>
  <div class="main kd-flex">
    <breadcrumb :options="['商品管理', '评论管理']" />
    <!-- search -->
    <div class="search">
      <el-form inline :model="query" @submit.native.prevent="onSearch">
        <el-form-item label="商品来源">
          <el-select v-model="query.sourceType" @change="changeQueryStatus" :value="query.sourceType">
            <el-option :value="1" label="平台和本店"></el-option>
            <el-option :value="2" label="本店"></el-option>
            <el-option :value="3" label="平台"></el-option>
            <el-option :value="0" label="所有店铺"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="query.itemName" placeholder="请输入商品名称"/>
        </el-form-item>
        <el-form-item label="评价数量大于等于">
          <el-input type='number' v-model="query.commentCount" placeholder="请输入评价数量"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit">搜索</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary">清除</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <!-- search -->
    <!-- b--------------------- -->
    <div  v-loading="loading" class="main-container kd-flex kd-flex-item">
      <el-table :data="table.data" border class="kd-flex-item" height="100%">
        <el-table-column align="center" label="商品名称" prop="itemName" />
        <el-table-column align="center" label="店铺名称" prop="storeName" />
        <el-table-column align="center" label="评价数量" prop="commentCount" />
        <el-table-column align="center" label="管理" prop="itemId">
          <template slot-scope="scope">
            <el-button type="text" @click="goCommentList(scope.row.itemId)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
        <el-pagination
        background
        @current-change="pageChange"
        style="margin-top: 10px"
        :current-page.sync="query.page"
        :page-size="query.pageSize"
        layout="total, ->, prev, pager, next, jumper"
        :total="table.page.total"
        ></el-pagination>
        <!-- 分页 -->
    </div>
    <!-- e--------------------- -->

  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
import commentApi from '@/common/apis/comment';
export default {
    data() {
        return {
            loading:false,
            table: {
                data: [],
                page: {
                    total: 0
                }
            },
            query: {
                page: 1,
                pageSize: 10,
                sourceType:0,
                itemName:'',
                commentCount:'',
            }
        };
    },
    created() {
        this.getList({
            page: 1,
            pageSize: 10,
        })
    },
    methods: {
        getList(query){
            this.loading = true;
            commentApi.getGoodsList(query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                }).finally(() => (this.loading = false));
        },
        onSearch() {
           this.query.page = 1;
           this.getList(this.query)
        },
        goCommentList(itemId) {
            console.log(itemId)
            this.$router.push({name: 'commentList' ,params:{itemId}});
        },
        pageChange() {
           this.getList(this.query)
        },
        changeQueryStatus(sourceType){
            console.log(sourceType)
        },

    }
};
</script>
