<template>
    <div class="bank" v-loading="loading">
        <breadcrumb :options="['管理员', '银行列表']"/>
        <div class="main-container">
            <el-button type="primary" @click="dialog = true" class="add-btn"  v-if="$util.checkPermission('systemBank',['c'])">添加银行卡信息</el-button>
            <div class="card-list">
                <bank-card v-for="(bank, i) in banks" :key="i" @delete="onDeleteBank" :bank="bank" is-omit/>
            </div>
        </div>
        <el-dialog title="添加银行卡信息" :visible.sync="dialog">
            <bank-form v-model="form" @submit="onSubmit">
                <el-button type="primary" native-type="submit">添加</el-button>
            </bank-form>
        </el-dialog>
    </div>
</template>
<script>
    import BankCard from "@/components/widget/BankCard";
    import BankForm from "@/components/form/BankForm";
    import api from '@/common/apis/bank';

    export default {
        components: {BankForm, BankCard},
        data() {
            return {
                loading: false,
                banks: [],
                dialog: false,
                form: {
                    bankName: '',
                    bankAccount: '',
                    bankOwner: '',
                    bankBranch: ''
                },
                column: 'id,bankName,bankAccount,bankOwner,bankBranch'
            }
        },
        methods: {
            getData() {
                this.loading = true;
                api.list({column: this.column}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.banks = data.rows;
                    })
                }).finally(() => this.loading = false);
            },
            onSubmit() {
                this.dialog = false;
                this.loading = true;
                api.add(this.form).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.getData();
                    })
                }).finally(() => this.loading = false);
            },
            onDeleteBank(bank) {
                this.$util.actionConfirm(`是否删除账号:${bank.bankAccount}的银行卡?`).then(() => {
                    this.loading = true;
                    api.deleted({bankId: bank.id}).then(res => {
                        this.$util.handelHttpResponseResult(res).then(() => {
                            this.getData();
                        })
                    }).finally(() => this.loading = false);
                })
            }
        },
        mounted() {
            this.getData()
        }
    }
</script>

<style scoped lang="scss">
    .bank {
        .add-btn {
            margin-bottom: 10px;
        }
        .card-list {
            > * {
                margin-left: 10px;
                margin-bottom: 10px;
            }
        }
    }
</style>