<template>
  <div class="main">
    <breadcrumb :options="['财务管理', 'SAAS财务','详情']"/>
    <div class="container">
      <my-form v-model="form">
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="onCancal">取消</el-button>
      </my-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import myForm from '@/components/form/SaasForm.vue'
import api from '@/common/apis/notice';
export default {
    components:{
        myForm
    },
    data() {
        return {
            loading: false,
            form: {
                id: '2016-05-01',
                orderNumber: '4584651123232132',
                payType: '微信支付',
                userName: '王小虎',
                money: '8888.50',
                rechargeTime: '2019-2-22',
                payStatus: '待付款',
                time: new Date(545136543123)
            },
        };
    },
   
    
    mounted() {
        this.getData()
    },
    methods: {
        
        onCancal() {
            this.$router.go(-1);
        },
        onSubmit() {
            this.loading = true;
            api
                .edit(this.form)
                .then((res) => {
                    this.$util.handelHttpResponseResult(res, true, '更新成功');
                })
                .finally(() => (this.loading = false));
        },
        getData() {
            this.loading = true;
            api
                .get({id: this.id})
                .then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.form = data;
                        this.form.id = this.id;
                    });
                })
                .finally(() => (this.loading = false));
        },
        
    }
};
</script>
