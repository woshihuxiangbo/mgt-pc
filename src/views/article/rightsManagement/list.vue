<template>
  <div class="create" v-loading="loading">
    <breadcrumb :options="['内容管理', '权益管理']"/>
    <div class="main-container">
      <div class="operation">
        <el-card>
          <div slot="header" >
            <span>超出金额设置</span>
          </div>
          <!-- <el-input type="number" placeholder="请输入最大金额" v-model="overData.maxMoney">
            <template slot="prepend">充值最大金额(元)</template>
          </el-input>
          <div style="margin:10px 0;">弹框内容</div>
          <el-input type="textarea" placeholder="请输入超出充值金额的弹框内容" v-model="overData.overMoneyTips">
          </el-input> -->

          <el-form :model="overData" ref="form1">
              <el-form-item label="最大金额">
                  <el-input type="number" placeholder="请输入最大金额" v-model="overData.content.maxMoney">
                    <template slot="prepend">充值最大金额(元)</template>
                </el-input>
            </el-form-item>
            <el-form-item label="超出部分文字">
                <el-input type="textarea" placeholder="请输入超出充值金额的弹框内容" v-model="overData.content.overMoneyTips"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" v-if="overData.id === undefined">立即创建</el-button>
                <el-button type="primary" @click="onEdit" v-if="overData.id !== undefined">立即修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="margin-top:10px;">
            <!-- <el-radio-group  @change="changeLevel">
                <el-radio-button label="1">店主</el-radio-button>
                <el-radio-button label="2">总监</el-radio-button>
                <el-radio-button label="3">合伙人</el-radio-button>
                <el-radio-button label="32">合伙人/总监</el-radio-button>
                <el-radio-button label="111">团长</el-radio-button>
            </el-radio-group> -->
            <el-radio-group  v-model="level" @change="changeLevel">
                <el-radio-button :label='item.key' v-for="item in lvList" :key='item.index'>{{item.val}}</el-radio-button>
            </el-radio-group>

            <el-button type="primary" class="addbtn" @click="createRights" v-if="$util.checkPermission('content',[ 'c'])">添加权益</el-button>
        </el-card>
      </div>

      <el-card>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="level" label="等级">
            <template slot-scope="scope">
              <el-tag>{{comp(scope.row.level)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="storeId" label="店铺ID"></el-table-column>
          <el-table-column prop="operation" label="操作">
            <template slot-scope="scope">
              <el-button @click="deleteLevel(scope.row)" type="danger" round size="small" v-if="$util.checkPermission('content',[ 'd'])">删除</el-button>
              <el-button @click="editLevel(scope.row)" type="text" size="small" v-if="$util.checkPermission('content',[ 'u'])">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog title="删除" width="30%" :visible.sync="dialogShow">
      <span>确定删除此条吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="delCurrentItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '../../../components/widget/breadcrumb';
import {mapGetters} from 'vuex';
import rightsManagement from '@/common/apis/rightsManagement';
import userApi from '@/common/apis/user';
export default {
    components: {Breadcrumb},
    data() {
        return {
            loading: false,
            storeId: 1,
            tableData: [],
            level: 1,
            dialogShow: false,
            currentId: '',
            overData: {
                id: undefined,
                content: {
                    maxMoney: '',
                    overMoneyTips: ''
                }
            },
            id:'',
            lvList:[],

        };
    },
    created(){
        this.getLvName()
    },
    methods: {
        getLvName() {
                userApi.getUserLevel(this.shop.id).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {

                        let lvList = [
                           { key:'1',val:data.lv1.name}, // '1':data.lv1.name,
                           { key:'2',val:data.lv2.name},// '2':data.lv2.name,
                           { key:'3',val:data.lv3.name},// '3':data.lv3.name,
                           { key:'32',val:data.lv2.name+'/'+data.lv3.name},//'32':data.lv2.name+'/'+data.lv3.name,
                           { key:'111',val:'团长'} // '111':'团长'
                        ]
                        console.log('等级列表：',lvList)
                        this.lvList = lvList
                    });
                });
            },
        getData() {
            this.loading = true;
            this.storeId = this.shop.id;
            rightsManagement
                .getList(this.storeId)
                .then((res) => {
                    this.tableData = res.data.data;
                    // this.overData.maxMoney = res.data.data&&res.data.data[0].content.maxMoney/100
                    // this.overData.overMoneyTips = res.data.data&&res.data.data[0].content.overMoneyTips
                    res.data.data.filter(element => {
                        console.log(element)
                        if(element.level===110){
                            element.content.maxMoney = this.$util.priceFormat(element.content.maxMoney)
                            this.overData = element
                            return false
                        }
                        return true
                    });
                })
                .catch()
                .finally(() => (this.loading = false));
        },

        changeLevel(e) {
            console.log(this.level);
        },
        createRights() {
            let overPopData = JSON.parse(JSON.stringify(this.overData))
            this.$router.push({name: 'rightsManagementCreate', params: {level: this.level, overData: overPopData}});
        },
        comp(level) {
            switch (level * 1) {
                case 1:
                    return '店主';
                    break;
                case 2:
                    return '总监';
                    break;
                case 3:
                    return '合伙人';
                    break;
                case 32:
                    return '合伙人/总监';
                    break;
                case 111:
                    return '团长';
                    break;
                default:
                    return '其他等级';
            }
        },
        delCurrentItem() {
            rightsManagement
                .del(this.currentId)
                .then((res) => {
                    if (res.data.code == 200) {
                        this.$notify({
                            title: '删除成功',
                            message: '此条权益被删除',
                            type: 'success'
                        });
                        this.dialogShow = false;
                        this.getData();
                    }
                })
                .catch()
                .finally(() => (this.loading = false));
        },
        deleteLevel(row) {
            this.dialogShow = true;
            this.currentId = row.id;
        },
        editLevel(row) {
            this.$router.push({
                name: 'rightsManagementEdit',
                params: {
                    content: JSON.stringify(row.content),
                    id: row.id,
                    level: row.level
                }
            });
        },
        onSubmit(e) {
            console.log(this.overData)
            e.preventDefault();
            let content = this.$util.deepClone(this.overData.content)
            content.maxMoney = this.$util.formatPrice(content.maxMoney)
            let data = {
                storeId: this.shop.id,
                level: 110,
                content: JSON.stringify(content)
            };
            rightsManagement
                .create(data)
                .then((res) => {
                    // this.$util.handelHttpResponseResult(res).then(({data}) => {
                    //    this.$router.go(-1)
                    // });
                    this.getData();
                })
                .catch()
                .finally(() => (this.loading = false));
        },
        onEdit(e){
            e.preventDefault();
            let content = this.$util.deepClone(this.overData.content)
            content.maxMoney = this.$util.formatPrice(content.maxMoney)
            let data = {
                id:this.overData.id,
                content: JSON.stringify(content)
            };
            rightsManagement
                .edit(data)
                .then((res) => {
                    // this.$util.handelHttpResponseResult(res).then(({data}) => {
                    //    this.$router.go(-1)
                    // });
                     this.getData();
                })
                .catch()
                .finally(() => (this.loading = false));
        },
    },
    mounted() {
        this.getData();
    },
    computed: {
        ...mapGetters({shop: 'shop'})
    }
};
</script>
<style scoped>
.operation {
    margin-bottom: 20px;
}
.addbtn {
    margin-left: 20px;
}
</style>
