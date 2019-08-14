<template>
    <!--:style="{backgroundImage: 'url(' + backgroundImage +')'}"-->
    <div class="bank-card">
        <div class="name">
            <i class="iconfont iconiconfontzhongguoyinhangbank1193437easyiconnet"></i>
            <span>{{bank.bankName}}</span>
        </div>
        <div class="number">
            <span>{{bankAccount}}</span>
        </div>
        <div class="info">
            <span>{{bank.bankOwner}}</span>
            <span>{{bank.bankBranch}}</span>
        </div>
        <el-button size="mini" type="warning" icon="el-icon-delete" circle @click="onDelete"
                   v-if="$util.checkPermission('systemBank',['d'])"></el-button>
    </div>
</template>

<script>
    export default {
        name: "BankCard",
        props: {
            bank: {
                type: Object,
                default: () => {
                    return {
                        bankName: '',
                        bankAccount: '',
                        bankOwner: '',
                        bankBranch: ''
                    }
                }
            },
            isOmit: Boolean
        },
        data() {
            return {
                backgroundImage: require('@/assets/img/bank-bg.jpg')
            }
        },
        methods: {
            onDelete() {
                this.$emit('delete', this.bank);
            }
        },
        computed: {
            bankAccount () {
                let bankAccount = this.bank.bankAccount;
                if (this.isOmit === true) {
                    return bankAccount.replace(/^(\d{4})\d{4,}(\d{4})$/,'$1***********$2');
                }
                return bankAccount;
            }
        }
    }
</script>

<style scoped lang="scss">
    .bank-card {
        width: 320px;
        flex: 0 0 300px;
        display: inline-block;
        height: 201px;
        background-size: contain;
        overflow: hidden;
        border-radius: 8px;
        position: relative;
        color: #2e2e2e;
        box-shadow: 0 2px 8px rgba(14, 21, 47, 0.25);

        .name {
            line-height: 30px;
            padding: 20px;

            i {
                padding-right: 10px;
                font-size: 20px;
                vertical-align: middle;
            }

            span {
                vertical-align: middle;
            }
        }

        .number {
            text-indent: 2px;
            letter-spacing: 3px;
            font-size: 20px;
            padding: 10px 20px;
        }

        .info {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 25px 20px;
            display: flex;

            > span {
                &:first-child {
                    flex: 1;
                }
            }
        }

        .el-button {
            position: absolute;
            right: 15px;
            top: 15px;
        }
    }
</style>