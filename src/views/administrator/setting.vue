<template>
    <div class="kd-page-master" v-loading="loading">
        <breadcrumb :options="['设置', '小程序基本设置']"/>
        <div class="main-container">
            <el-form :model="form" :rules="rules" @submit.native.prevent="onSubmit" ref="form">
                <el-form-item label="api版本" prop="apiVersion">
                    <el-input v-model="form.apiVersion" placeholder="如：v1"/>
                </el-form-item>
                <el-form-item label="OSS静态资源域名" prop="ossStaticDomain">
                    <el-input v-model="form.ossStaticDomain" placeholder="如: http://domain.com"/>
                </el-form-item>
                <el-form-item label="手机管理页面域名" prop="mobileDomain">
                    <el-input v-model="form.mobileDomain" placeholder="如: http://domain.com"/>
                </el-form-item>
                <el-form-item>
                    <el-button native-type="submit" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import settingApi from '@/common/apis/setting';
    import validator from 'el-form-validator'

    export default {
        data() {
            return {
                loading: false,
                form: {
                    apiVersion: undefined,
                    ossStaticDomain: undefined,
                    mobileDomain: undefined
                },
                rules: {
                    apiVersion: {
                        required: true,
                        message: '必须输入'
                    },
                    ossStaticDomain: [
                        {
                            required: true,
                            message: '必须输入'
                        },
                        {
                            rules: ['required', 'string', 'max:255', 'url'],
                            validator: validator.verification
                        }
                    ],
                    mobileDomain: [
                        {
                            required: true,
                            message: '必须输入'
                        },
                        {
                            rules: ['required', 'string', 'max:255', 'url'],
                            validator: validator.verification
                        }
                    ]
                }
            }
        },
        methods: {
            getData() {
                this.loading = true;
                settingApi.get().then(res => {
                    this.$util.handelHttpResponseResult(res, false, '', false).then(({data}) => {
                        this.form = data
                    })
                }).finally(() => this.loading = false)
            },
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.updateSetting()
                    } else {
                        this.$message.warning('请填写完整');
                    }
                });
            },
            updateSetting() {
                this.loading = true;
                settingApi.update(this.form).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '修改成功').then()
                }).finally(() => this.loading = false)
            }
        },
        created() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>
