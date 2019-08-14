<template>
    <el-menu :default-active="defaultActive"
             unique-opened
             router
             :collapse-transition="false"
             class="el-menu-vertical scrollbar aside-menu"
             :collapse="collapse">

        <el-menu-item :index="homeIndex" :route="{name:'BaseHome'}" @click.native.stop="gotoHomePage">
            <!--<i class="el-icon-menu"></i>-->
            <span slot="title">首页</span>
        </el-menu-item>

        <template v-for="(menu) in menus">
            <el-menu-item
                v-if="menu.children === undefined"
                :index="menu.name"
                :route="{name: menu.name}">
                {{menu.menuName}}
            </el-menu-item>
            <el-submenu v-else :index="menu.name">
                <template slot="title">
                    <i v-if="menu.icon" class="iconfont" :class="menu.icon"></i>
                    <span>{{menu.menuName}}</span>
                </template>

                <el-menu-item v-for="(child, i) in menu.children" :key="i"
                              :index="child.name"
                              :route="{name: child.name, query: child.query}">
                    {{child.menuName}}
                </el-menu-item>
            </el-submenu>
        </template>
    </el-menu>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: 'AsideMenu',
        data() {
            return {
                defaultActive: undefined,
                homeIndex: '',
                collapse: false
            };
        },
        methods: {
            gotoHomePage() {
                if (process.env.VUE_APP_IS_SAAS === 'false') {
                    this.$router.replace({name: 'Home', query: {id: this.shop.id}});
                    return;
                }
                switch (this.role.roleID) {
                    case '1':
                        this.homeIndex = 'AdminHome';
                        this.$router.replace({name: 'AdminHome'});
                        break;
                    case '2':
                        this.homeIndex = 'Inspector';
                        this.$router.replace({name: 'Inspector'});
                        break;
                    case '3':
                        this.homeIndex = 'Director';
                        this.$router.replace({name: 'Director'});
                        break;
                    case '4':
                    case '13':
                    case '12':
                        this.homeIndex = 'Manager';
                        this.$router.replace({name: 'Manager'});
                        break;
                    case '8':
                    case '5':
                        this.homeIndex = 'Home';
                        this.$router.replace({name: 'Home'});
                        break;
                    default:
                        this.homeIndex = 'Welcome';
                        this.$router.replace({name: 'Welcome'});
                        break;
                }
            },
            onChangeMenu() {
                this.collapse = !this.collapse;
            },
            setDefaultActive() {
                let route = this.$route;
                this.defaultActive = route.name;
                if (route.meta.title) {
                    document.title = route.meta.title + ' - 后台管理';
                }
            }
        },
        mounted() {
            this.setDefaultActive();
            this.defaultActive = this.$route.name;
            this.$root.$on('change-menu', this.onChangeMenu);
        },
        watch: {
            async $route() {
                await this.$nextTick();
                this.setDefaultActive();
            }
        },
        computed: {
            ...mapGetters({user: 'user', role: 'role', menus: 'menus', shop: 'shop'})
        },
        destroy() {
            this.$root.$off('change-menu', this.onChangeMenu);
        }
    };
</script>

<style scoped lang="scss">
    .el-menu-vertical {
        height: calc(100% - 60px);
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 1;
        overflow-x: hidden;
        overflow-y: scroll;

        &:not(.el-menu--collapse) {
            width: 200px;
            flex: 0 0 200px;
        }

        &:has(.el-menu--collapse) {
            flex: 0 0 60px;
            width: 60px;
        }
    }


    .aside-menu {
        overflow-y: auto;

        .iconfont {
            vertical-align: middle;
            margin-right: 5px;
            width: 24px;
            text-align: center;
            font-size: 18px;
            display: inline-block;
        }
    }
</style>
