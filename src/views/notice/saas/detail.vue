<template>
  <div class="main">
    <div class="main-nav">
      <div class="nav-breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>财务管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="container">
      <saas-form v-model="form">
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="onCancal">取消</el-button>
      </saas-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.form {
    width: 500px;
}
</style>
<script>
// import salesmanApi from '@/common/apis/salesman';
import SaasForm from '@/components/form/SaasForm.vue'
import {mapGetters, mapActions} from 'vuex';

export default {
    data() {
        return {
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
    components:{
        SaasForm
    },
    computed: {
        ...mapGetters(['formInfo'])
    },
    beforeDestroy() {
        this.set_form_info(null);
    },
    mounted() {},
    methods: {
        ...mapActions(['set_form_info']),
        handleClick(row) {
            console.log(row);
        },
        onCancal() {
            this.$router.go(-1);
        },
        onSubmit() {
            console.log(this.form)
        },
        _setRoute() {
            const {tab1, tab2} = this.$route.query;
            if (tab1) {
                this.query = {tab1, tab2};
            }
        },
        // 获取数据
        _getData(data) {
            // salesmanApi
            //     .getSalesmanList(data)
            //     .then((resp) => {
            //         if (!resp.data.error) {
            //             this.tableData = resp.data.data;
            //             this.paginations.total = this.tableData.length
            //         }
            //     })
            //     .catch(() => {})
            //     .finally(() => {
            //         this.loading = false;
            //     });
        }
    }
};
</script>
