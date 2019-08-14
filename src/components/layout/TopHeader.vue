<template>
    <el-header class="top-header" v-loading="loading">
        <div class="headImg"><img :src="headImg" alt=""></div>
        <div class="logo"><span>运营后台管理</span></div>
        <!--<div class="logo menu-btn" @click="onMenuClick">-->
        <!--<i class="el-icon-menu"></i>-->
        <!--</div>-->
        <div class="store" v-if="shop && isSaas && role.roleID !== '14'">
            <span class="md-store-name">{{ shop.name }}</span>
            <router-link :to="{name: 'SelectStore'}">切换店铺</router-link>
        </div>
        <ul class="right">
            <li class="shoppingCar" v-if="showShoppingCar()">
                <el-badge :value="count" :max="100" @click.native="toShoppingCarPage">
                    <i class="icon30 iconfont"></i>
                </el-badge>
            </li>
            <li>
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">{{user.name}} [{{role.roleName}}]<i
                        class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="fullScreen">{{fullScreenText}}</el-dropdown-item>
                        <el-dropdown-item v-if="$util.checkRole(['1', '2'])"
                                          @click.native="gotoSetting">
                            小程序基本设置
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="onClickChangeInfo">修改资料</el-dropdown-item>
                        <el-dropdown-item @click.native="refreshToken()">刷新</el-dropdown-item>
                        <el-dropdown-item @click.native="toSign">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </li>
        </ul>
        <el-dialog append-to-body title="修改资料" :visible.sync="dialog.show">
            <input type="password" style="width: 0;height: 0;border: 0"/>
            <el-form :model="userForm" ref="userForm" :rules="userFormRules">
                <el-form-item label="姓名" prop="name" label-width="100px">
                    <el-input v-model="userForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile" label-width="100px">
                    <el-input v-model="userForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password" label-width="100px">
                    <el-input show-password v-model="userForm.password" autocomplete="new-password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.show = false">取 消</el-button>
                <el-button type="primary" @click="updateMe">确 定</el-button>
            </div>
        </el-dialog>
    </el-header>
</template>
<script>
    import {mapGetters} from 'vuex';
    import authApi from '@/common/apis/auth';
    import userApi from '@/common/apis/administrator';
    import validator from 'el-form-validator';

    export default {
        name: 'TopHeader',
        data() {
            return {
                loading: false,
                headImg: require('@/assets/img/headImg.png'),
                fullScreenText: '全屏显示',
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
                    mobile: [{
                        required: true,
                        message: '请输入手机号码'
                    },
                        {
                            rules: 'required|min:11|max:11',
                            validator: validator.verification
                        }
                    ],
                    password: [{
                        type: 'string',
                        min: 6,
                        max: 32,
                        message: '管理密码无效'
                    }]
                }

            };
        },
        watch: {
            $route(to) {
                this.defaultActive = this.$route.meta.index;
                if (to.meta.title) {
                    document.title = to.meta.title + ' - 后台管理';
                }
            }
        },
        methods: {
            fullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else {
                        if (document.webkitCancelFullScreen) {
                            document.webkitCancelFullScreen();
                        } else {
                            if (document.mozCancelFullScreen) {
                                document.mozCancelFullScreen();
                            } else {
                                if (document.msExitFullscreen) {
                                    document.msExitFullscreen();
                                }
                            }
                        }
                    }
                    this.fullScreenText = '全屏显示';
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else {
                        if (element.webkitRequestFullScreen) {
                            element.webkitRequestFullScreen();
                        } else {
                            if (element.mozRequestFullScreen) {
                                element.mozRequestFullScreen();
                            } else {
                                if (element.msRequestFullscreen) {
                                    // IE11
                                    element.msRequestFullscreen();
                                }
                            }
                        }
                    }
                    this.fullScreenText = '退出全屏';
                }
                this.fullscreen = !this.fullscreen;
            },
            toSign() {
                authApi.logout().then().finally(() => {
                    this.$store.dispatch('logout');
                    this.$router.replace('/sign');
                });
            },
            toShoppingCarPage() {
                this.$router.push({
                    name: 'ShoppingCar'
                });
            },
            showShoppingCar() {
                return ['5', '8'].indexOf(this.role.roleID) !== -1 && this.$util.checkPermission('wholesaleOrder', ['c']);
            },
            onClickChangeInfo() {
                this.loading = true;
                userApi.get({
                    id: this.user.managerId
                }).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        const {name, mobile} = data.manager;
                        this.$nextTick().then(() => {
                            this.userForm = {
                                ...this.userForm,
                                name,
                                mobile,
                                password: ''
                            };
                            this.dialog.show = true;

                        });
                    });
                }).finally(() => this.loading = false);
            },
            updateMe() {
                this.$refs['userForm'].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        authApi.updateMe(this.userForm).then(res => {
                            this.$util.handelHttpResponseResult(res).then(data => {
                                this.$message.success('修改成功');
                                this.dialog.show = false;
                            });
                        }).finally(() => this.loading = false);
                    }
                });
            },
            onMenuClick() {
                this.$root.$emit('change-menu');
            },
            gotoSetting () {
                this.$router.push({name: 'AdministratorSetting'})
            },
            refreshToken () {
                authApi.refreshToken().then(res => {
                    this.$util.handelHttpResponseResult(res, false, '', false).then(({data}) => {
                        try {
                            this.$store.dispatch('loginThenSetToken', data.managerToken).then(data => {
                                console.info(data);
                                data.details.access = JSON.parse(data.details.access);
                                this.$store.dispatch('setUserDataInfo', data).then();
                            }).catch((e) => {
                                console.info(e);
                            });
                        } catch (e) {
                            console.info(e);
                        }
                    });
                });
            }
        },
        mounted() {
        },
        computed: {
            ...mapGetters({
                shop: 'shop',
                count: 'shoppingCarItemCount',
                user: 'user',
                role: 'role'
            }),
            isSaas() {
                return process.env.VUE_APP_IS_SAAS !== 'false'
            }
        }
    };
</script>
<style lang="scss" scoped>
    .top-header {
        top: 0;
        left: 0;
        right: 0;
        z-index: 4;
        position: fixed;
        background-color: white;

        .headImg {
            float: left;
            height: 60px;
            margin-left: 20px;

            > img {
                width: 54px;
                border-radius: 50%;
                margin-top: 3px;

            }
        }

        .menu-btn {
            height: 100%;
            line-height: 60px;
            display: inline-block;
            cursor: pointer;
            padding: 0 20px;
        }
    }

    .store {
        display: flex;
        align-items: center;
    }
    .shoppingCar {
        line-height: 30px;
        padding-right: 20px;
    }
    .md-store-name {
        max-width: 200px;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 16px;
        line-height: 16px;
        font-size: 13px;
    }
</style>
