<template>
    <el-form ref="form" :model="form" inline @submit.native.prevent="onSubmit" :rules="rules">
        <el-form-item label="厂商名称" prop="name" style="flex: 0 0 100%;">
            <el-input v-model="form.name" style="width: 100%"/>
        </el-form-item>
        <legend class="md-legend">银行卡设置</legend>
        <div class="md-bank-list" v-for="(d, i) in form.bankDetails" :key="i">
            <el-form-item label="银行名称" :prop="'bankDetails.' + i + '.bankName'" :rules="rules.bankName">
                <el-input v-model="d.bankName" class="md-input"></el-input>
            </el-form-item>
            <el-form-item label="银行卡号" :prop="'bankDetails.' + i + '.bankAccount'" :rules="rules.bankAccount">
                <el-input v-model="d.bankAccount" class="md-input"></el-input>
            </el-form-item>
            <el-form-item label="开户人" :prop="'bankDetails.' + i + '.bankOwner'" :rules="rules.bankOwner">
                <el-input v-model="d.bankOwner" class="md-input"></el-input>
            </el-form-item>
            <el-form-item label="开户行" :prop="'bankDetails.' + i + '.bankBranch'" :rules="rules.bankBranch">
                <el-input v-model="d.bankBranch" class="md-input"></el-input>
            </el-form-item>
            <el-form-item label="-">
                <el-button :disabled="i === 0" @click="deleteBank(i)">删除</el-button>
            </el-form-item>
        </div>
        <el-form-item>
            <slot/>
            <el-button type="success" @click="addBank">添加银行卡</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    import validator from 'el-form-validator';

    export default {
        name: 'BankForm',
        mixins: [vModelMixins],
        data() {
            return {
                rules: {
                    name: {
                        rules: 'required|string|min:2',
                        validator: validator.verification,
                        trigger: 'blur'
                    },
                    bankName: {
                        rules: 'required|string|min:2',
                        validator: validator.verification,
                        trigger: 'blur'
                    },
                    bankAccount: {
                        rules: ['required', 'string', 'max:25', 'min:10', 'regex:/^([1-9]{1})(\\d{9,24})$/'],
                        validator: validator.verification,
                        trigger: 'blur'
                    },
                    bankOwner: {
                        rules: 'required|string|min:2',
                        validator: validator.verification,
                        trigger: 'blur'
                    },
                    bankBranch: {
                        rules: 'required|string|min:2',
                        validator: validator.verification,
                        trigger: 'blur'
                    }
                }
            };
        },
        methods: {
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$emit('submit', e);
                    } else {
                        this.$message.error('数据填写不完整');
                    }
                });
            },
            addBank() {
                let tempForm = this.$util.deepClone(this.form);

                tempForm.bankDetails.push({
                    bankName: '',
                    bankAccount: '',
                    bankOwner: '',
                    bankBranch: ''
                });
                this.form = tempForm;
            },
            deleteBank(i) {
                this.form.bankDetails.splice(i, 1);
            }
        },
        mounted() {
        }
    };
</script>

<style scoped lang="scss">
    .md-legend {
        font-weight: 800;
    }

    .md-bank-list {
        display: flex;

        .md-input {
            width: 100%;
        }
    }
</style>
