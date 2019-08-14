<template>
  <div class="main kd-flex">
    <breadcrumb :options="['商品管理','商品评价', '编辑评价']" />
    <!-- search -->
    <div class="search">
      <el-form inline :model="query" @submit.native.prevent="onSearch">
        <el-form-item label="状态">
          <el-select v-model="query.commentStatus" :value="query.commentStatus">
            <el-option :value="null" label="全部"></el-option>
            <el-option :value="true" label="启用"></el-option>
            <el-option :value="false" label="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="query.nickName" placeholder="请输入昵称"/>
        </el-form-item>
        <el-form-item label="评价内容包含文字">
          <el-input v-model="query.commentInScript" placeholder="请输入评价内容包含文字"/>
        </el-form-item>
        <el-form-item label="评价类型">
          <el-select v-model="query.commentType" :value="query.commentType" >
            <el-option :value="0" label="全部"></el-option>
            <el-option :value="1" label="1"></el-option>
            <el-option :value="2" label="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit">查询</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary">清除</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <!-- search -->
    <div class="action addbtn">
      <el-button type="primary" @click="createComment">创建评价</el-button>
    </div>

    <!-- b--------------------- -->

    <div v-loading="loading" class="main-container kd-flex kd-flex-item">
      <el-table :data="table.data" border class="kd-flex-item" height="100%">
        <el-table-column align="center" label="头像" prop='headerImg' width="100">
          <template slot-scope="scope">
            <img :src="scope.row.headerImg|imgSrc" height="50px"  />
          </template>
        </el-table-column>
        <el-table-column align="center" label="昵称" prop="nickname" />
        <el-table-column align="center" label="评价文字" prop="body" />
        <el-table-column align="center" label="评论图片" prop='imgs' width="350">
          <template slot-scope="scope">
            <img :src="src|imgSrc" class="pic-layout" v-for='(src,index) in scope.row.imgs' :key='index'/>
          </template>
        </el-table-column>

        <el-table-column align="center" label="评论时间" prop="createTime" >
            <template slot-scope="scope">
                {{scope.row.createTime | dateFilter}}
            </template>
        </el-table-column>
        <el-table-column align="center" label="状态" prop="disabled" width="50" >
            <template slot-scope="scope">
                {{scope.row.disabled == true?'禁用':'启用'}}
            </template>
        </el-table-column>
        <el-table-column align="center" label="评价类型" prop="isAnonymous" >
            <template slot-scope="scope">
                {{scope.row.isAnonymous == true?'1':'2'}}
            </template>
        </el-table-column>
        <el-table-column align="center" label="管理">
          <template slot-scope="scope">
            <el-button type="text" @click='editComment(scope.row)'>编辑</el-button>
            <el-button type="text" @click='switchStatus(scope.row.disabled,scope.row.id)' >{{scope.row.disabled == false?'禁用':'启用'}}</el-button>
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
    <!-- 弹框 -->
    <el-dialog :title="title" :visible.sync="popShow" width="400">
        <el-form :model="form" @submit.native.prevent="onSubmit" label-width="80px">
                <el-form-item label="头像">
                  <upload-avatar v-model="form.headlogo" width='100px' height='100px'/>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="form.nickname" placeholder="请输入昵称" />
                </el-form-item>
                <el-form-item label="评价文字">
                    <el-input v-model="form.body" placeholder="请输入评价文字"/>
                </el-form-item>

                <el-form-item label="评价图片">
                    <div class="pick" >
                        <upload-avatar v-model="form.imgs[0]" width='100px' height='100px'/>
                        <!-- <i class="el-icon-error"></i> -->
                    </div>
                    <div class="pick" >
                        <upload-avatar v-model="form.imgs[1]" width='100px' height='100px'/>
                        <!-- <i class="el-icon-error"></i> -->
                    </div>
                    <div class="pick" >
                        <upload-avatar v-model="form.imgs[2]" width='100px' height='100px'/>
                        <!-- <i class="el-icon-error"></i> -->
                    </div>
                </el-form-item>

                <el-form-item label="评价时间">
                    <el-date-picker
                        value-format='timestamp'
                        v-model='form.createTime'
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button native-type="submit" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
    </el-dialog>
    <!-- 弹框 -->
  </div>
</template>



<script>
import UploadAvatar from '@/components/widget/UploadAvatar';
import commentApi from '@/common/apis/comment';
import tableDataMixins from '../../../components/mixins/tableDataMixins';
export default {
    mixins: [tableDataMixins],
    components: {UploadAvatar},
    data() {
        return {
            loading:false,
            table: {
                data: [

                ],

                page: {
                    total: 0
                }
            },
            query: {
                page: 1,
                pageSize: 10,
                commentStatus:null,
                nickname:'',
                commentInScript:'',
                commentType:0
            },
            form:{
                headlogo:'',
                nickname:'',
                body:'',
                createTime:0,
                imgs:[]
            },
            popShow:false,
            title:'',
            itemId:'',
            id:'',
            popType:'add',
        };
    },
    created() {
       this.itemId= this.$route.params.itemId
       this.getList({itemId:this.$route.params.itemId,page:1,pageSize:10})
    },
    methods: {
        getList(query){
            this.loading = true;
            commentApi.getCommentsList(query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        let tableData = data.rows || []
                        this.table.page.total = data.rowCount;
                        this.table.data = tableData.map((item)=>{
                            return {
                                headerImg:item.headerImg,
                                nickname:item.nickname,
                                body:item.body,
                                createTime:item.createTime,
                                disabled:item.disabled,
                                isAnonymous:item.isAnonymous,
                                id:item.id,
                                imgs:item.imgs&&item.imgs.value&&JSON.parse(item.imgs.value)
                            }
                        })

                    }).finally(() => (this.loading = false));
                });
        },
        addComment(form){
            commentApi.addComment(form).then(res =>{
                this.$util.handelHttpResponseResult(res,true).then((data) =>{
                    this.popShow = false;
                    this.getList({itemId:this.$route.params.itemId})
                })
            })
        },
        edit(form){
            commentApi.editComment(form).then(res =>{
                this.$util.handelHttpResponseResult(res,true).then((data) =>{
                    this.popShow = false;
                    this.getList({itemId:this.$route.params.itemId})
                })
            })
        },
        onSearch() {
            this.query.page = 1;
            this.getList({...this.query,itemId:this.itemId})
        },
        createComment() {
            this.form.headlogo = '',
            this.form.nickname = '',
            this.form.body = '',
            this.form.createTime = 0,
            this.form.imgs = []

            this.popShow = true
            this.title='添加评论'
            this.popType = 'add'
        },
        editComment(row){
            console.log(row)
            this.form.headlogo = row.headerImg
            this.form.nickname = row.nickname
            this.form.body = row.body
            this.form.createTime = row.createTime *1000
            this.form.imgs = row.imgs|| []
            this.id = row.id
            this.popType = 'edit'
            this.popShow = true
            this.title='编辑评论'

        },

        pageChange() {
            this.getList({...this.query,itemId:this.itemId})
        },
        switchStatus(disabled,id){
            this.edit({
                disabled:!disabled,
                id
            })
        },
        onSubmit(e) {
            e.preventDefault();
            this.popType=='edit'?this.edit({...this.form,id:this.id}):this.addComment({...this.form,itemId:this.itemId})

        }
    }
};
</script>
<style lang="scss" scoped>
.search-button-group {
    min-width: 180px;
    padding-top: 36px;
}

.el-col {
    margin: 10px 0;
}
.addbtn {
    margin-bottom: 20px;
}
.pic-layout {
    height: 50px;
    margin-right: 10px;
}
.pick{
    display: inline-block;
    position: relative;
    margin-right: 30px;
}
.el-icon-error{
    position: absolute;
    right:-8px;
    top:-15px;
    font-size: 30px;
    color:#F56C6C;
}
</style>
