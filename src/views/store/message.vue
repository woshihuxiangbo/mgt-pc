<template>
    <div class="kd-flex kd-page-master" v-loading="loading">
        <breadcrumb :options="['店铺管理', '消息模板']"/>
        <div class="main-container kd-flex kd-flex-item">
            <el-form inline v-for="(t, i) in templateType" :key="i" :model="form[i]"
                     @submit.native.prevent="saveStoreTemplate(i)"
                     :ref="'form' + i">
                <el-form-item :label="t" label-width="150px" :rules="{required: true, message: '必须输入'}"
                              prop="msgWechatTempleteId">
                    <el-input v-model="form[i].msgWechatTempleteId" style="min-width: 500px"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import api from '@/common/apis/wechatTemplate';

    export default {
        name: 'message',
        data() {
            return {
                loading: false,
                form: {
                    1: {},
                    2: {},
                    3: {},
                    4: {},
                    5: {},
                    6: {}
                },
                templateType: {
                    1: '订单支付成功通知',
                    2: '取货通知',
                    3: '订单发货',
                    4: '充值成功通知',
                    5: '退款通知',
                    6: '审核通知'
                }
            };
        },
        methods: {
            saveStoreTemplate(index) {
                let formId = 'form' + index;
                this.$refs[formId][0].validate((valid) => {
                    if (valid) {
                        this.$confirm('是否操作', '警告').then(() => {
                            this.updateOrAddWechatTemplate(index);
                        }).catch(() => {
                            console.info('no');
                        })
                    } else {
                        this.$message.warning('无法提交');
                    }
                });
            },
            updateOrAddWechatTemplate(index) {
                let params = {
                    storeId: this.shop.id,
                    msgWechatTempleteId: this.form[index].msgWechatTempleteId,
                    msgSubType: index
                };
                this.loading = true;
                api.addWechatMessageTemplate(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '修改成功').then(() => {
                        this.getData();
                    })
                }).finally(() => this.loading = false);
            },
            getData() {
                this.loading = true;
                api.wechatMessageTemplateList({storeId: this.shop.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        data.forEach((item) => {
                            this.$set(this.form, item.msgSubType, item);
                        });
                    });
                }).finally(() => this.loading = false)
            }
        },
        mounted() {
            this.getData()
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    };
</script>

<style scoped>

</style>
