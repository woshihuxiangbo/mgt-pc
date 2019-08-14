<template>
    <div class="main-container">
        <el-row>
            <el-col :span="16" :xs="0">
                <div class="background">
                    <img :src="background" alt>
                </div>
            </el-col>
            <el-col :span="8" :xs="24">
                <div class="login-panel">
                    <div class="login-box">
                        <div class="logo">
                            <img src="@/assets/img/headImg.png" alt>
                        </div>
                        <h4 class="title">欢迎使用{{getWebsiteTitle()}}运营后台系统</h4>
                        <el-form @submit.native.prevent="formSubmit" ref="form" :rules="rules" :model="form"
                                 v-loading="loading" class="el-form">
                            <el-form-item prop="mobile">
                                <el-input clearable auto-complete placeholder="输入手机号码" v-model="form.mobile">
                                    <i slot="prefix" class="el-input__icon el-icon-mobile-phone"></i>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input type="password" clearable auto-complete placeholder="输入密码"
                                          v-model="form.password">
                                    <i slot="prefix" class="el-input__icon el-icon-edit-outline"></i>
                                </el-input>
                            </el-form-item>
                            <el-form-item prop="loginType">
                                <el-radio v-model="form.loginType" :label="undefined">运营者登录</el-radio>
                                <el-radio v-model="form.loginType" label="group">团长登录</el-radio>
                            </el-form-item>
                            <div class="submit-btn">
                                <el-button type="primary" native-type="submit">登录</el-button>
                            </div>
                        </el-form>
                    </div>
                    <!-- <a :href="downloadUrl()" target="_blank" class="md-down-pdf">下载操作手册</a> -->
                </div>
            </el-col>
        </el-row>
        <el-dialog title="你的账户没激活，请修改密码后再登录" :visible.sync="dialog.show" width="400px" :close-on-press-escape="false"
                   :close-on-click-modal="false" :show-close="false" v-loading="loading">
            <input type="password" style="width: 0;height: 0;border: 0"/>
            <el-form :model="userForm" ref="userForm" :rules="userFormRules">
                <el-form-item label="姓名" prop="name" label-width="100px">
                    <el-input v-model="userForm.name" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile" label-width="100px">
                    <el-input v-model="userForm.mobile" autocomplete="off" disabled/>
                </el-form-item>
                <el-form-item label="登录密码" prop="password" label-width="100px">
                    <el-input show-password v-model="userForm.password" autocomplete="new-password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateMe">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
    .md-down-pdf {
        padding-top: 30px;
        display: block;
    }

    .main-container {
        height: 100%;

        .el-row {
            height: 100%;
        }

        .el-col {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }
    }

    .background {
        height: 680px;
        width: 540px;
    }

    .login-panel {
        text-align: center;
        background-color: #F4F4F4;
        padding: 10px 10px 50px 10px;
        border-radius: 5px;
        width: 100%;
        max-width: 400px;

        .logo {
            margin-top: 20px;
        }

        .title {
            display: block;
            margin: 20px 0;
        }

        .el-form {
            display: block;
            margin-top: 20px;

            .el-form-item {
                margin-bottom: 30px;
            }

            .submit-btn {
                margin-top: 50px;

                .el-button {
                    width: 100%;
                }
            }
        }
    }
</style>

<script>
    import validator from 'el-form-validator';
    import api from '@/common/apis/store';
    import {mapGetters} from 'vuex';
    import {updateMe} from '@/common/apis/auth';

    export default {
        data() {
            return {
                loading: false,
                form: {
                    mobile: undefined,
                    password: undefined,
                    useSession: true,
                    loginType: undefined
                },
                rules: {
                    mobile: [
                        {
                            required: true,
                            message: '请输入手机号码',
                            trigger: 'blur'
                        },
                        {
                            rules: 'required|min:11|max:11',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            type: 'string',
                            min: 6,
                            max: 32,
                            message: '管理密码无效',
                            trigger: 'blur'
                        }
                    ]
                },
                background: require('@/assets/img/detail.png'),
                dialog: {
                    show: false
                },
                userForm: {
                    name: undefined,
                    mobile: undefined,
                    password: undefined
                },
                userFormRules: {
                    name: [{
                        required: true,
                        message: '用户名',
                        trigger: 'blur'
                    },
                        {
                            rules: 'required|min:2|max:15',
                            validator: validator.verification
                        }
                    ],
                    mobile: [
                        {
                            required: true,
                            message: '请输入手机号码'
                        },
                        {
                            rules: 'required|min:11|max:11',
                            validator: validator.verification
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请输入手机号码'
                        },
                        {
                            type: 'string',
                            min: 6,
                            max: 32,
                            message: '管理密码无效'
                        }]
                }
            };
        },
        mounted() {
            this.$store.dispatch('logout');
            this.$store.dispatch('updateShop', {name: '未选择店铺'});
            this.$store.commit('SET_MENU_GENERATED', false);
        },
        methods: {
            formSubmit(event) {
                event.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.$store.dispatch('login', this.form).then(res => {
                            this.$store.dispatch('loginThenSetToken', res.managerToken).then((data) => {
                                console.info(data);
                                if (res.isActive === false) {
                                    this.userForm.name = data.name;
                                    this.userForm.mobile = data.sub;
                                    this.dialog.show = true;
                                } else {
                                    this.setUserLoginData(data);
                                }
                            }).catch(() => {
                                this.$message.error('你无权访问');
                            });
                        }).finally(() => {
                            this.loading = false;
                        });
                    }
                });
            },
            setUserLoginData(data) {
                data.details.access = JSON.parse(data.details.access);
                this.$store.dispatch('setUserDataInfo', data).then(() => {
                    this.getUserStore();
                });
            },
            downloadUrl() {
                return process.env.VUE_APP_DOWNLOAD_MANUAL;
            },
            getWebsiteTitle() {
                return process.env.VUE_APP_WEBSITE_TITLE;
            },
            async getUserStore() {
                this.loading = true;
                api.getStoreList({column: 'id,name', sortOrder: 'id', sortBy: 'asc'}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (data.rowCount < 1) {
                            this.gotoHomePage();
                        } else {
                            this.$store.commit('SET_SHOP', data.rows[0]);
                        }
                        this.gotoHomePage();
                    });
                }).catch(() => {
                    this.gotoHomePage();
                }).finally(() => this.loading = false);
            },
            gotoHomePage() {
                if (process.env.VUE_APP_IS_SAAS === 'false') {
                    if (this.role.roleID === '14') {
                        this.$router.replace({name: 'Welcome'});
                        return;
                    }
                    this.$router.replace({name: 'Home', query: {id: this.shop.id}});
                } else {
                    switch (this.role.roleID) {
                        case '1':
                            this.$store.commit('SET_SHOP', {id: '0', name: 'SaaS平台'});
                            this.$router.replace({name: 'AdminHome'});
                            break;
                        case '11':
                            this.$router.replace({name: 'Inspector'});
                            break;
                        case '2':
                            this.$router.replace({name: 'Inspector'});
                            break;
                        case '3':
                            this.$router.replace({name: 'Director'});
                            break;
                        case '4':
                        case '13':
                        case '12':
                            this.$router.replace({name: 'Manager'});
                            break;
                        case '8':
                        case '5':
                            this.$router.replace({name: 'Home'});
                            break;
                        default:
                            this.$router.replace({name: 'Welcome'});
                            break;
                    }
                }
            },
            updateMe() {
                this.$refs['userForm'].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        updateMe(this.userForm).then(res => {
                            this.$util.handelHttpResponseResult(res).then(() => {
                                this.$message.success('修改成功');
                                this.dialog.show = false;
                                this.$store.dispatch('logout');
                                this.$store.dispatch('updateShop', {name: '未选择店铺'});
                                this.$store.commit('SET_MENU_GENERATED', false);
                            });
                        }).finally(() => this.loading = false);
                    }
                });
            }
        },
        computed: {
            ...mapGetters({role: 'role', shop: 'shop'})
        }
    };
</script>
