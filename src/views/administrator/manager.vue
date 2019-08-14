<template>
    <div class="main" v-loading="loading">
        <breadcrumb :options="['管理员', '角色管理']"/>
        <!-- <div class="action">
            <el-button type="primary" @click="createAdmin">创建角色</el-button>
        </div> -->
        <div class="container">
            <el-table :data="table.data" border :default-sort = "{prop: 'id', order: 'descending'}">
                 <el-table-column align="center" width="100" label="ID" prop="id" sortable/>
                <el-table-column align="center" label="等级" width="100">
                    <template slot-scope="scope">
                        {{scope.row.level?scope.row.level+'级':''}}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="名称" prop="name"/>

                <el-table-column align="center" label="管理范围" width="100">
                    <template slot-scope="scope">
                        {{scope.row.scope ===2?'仅店铺':scope.row.scope ===1?'仅平台':'全部'}}
                    </template>
                </el-table-column>

                <el-table-column align="center" width="100" label="管理员数量" prop="managerCount"/>

                <el-table-column v-if="$util.checkPermission('manager',['u']) && $util.checkRole(['1', '2', '3'])"
                                 align="center" label="管理" prop="">
                    <template slot-scope="scope">
                        <el-button type="text" :disabled="scope.row.level>=role.roleLevel"
                                   @click="editAdmin(scope.row)">权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog :title="dialog.isCreate?'添加角色':'编辑角色'" v-if="dialog.show" :visible.sync="dialog.show"
                       width="1040px">
                <role-form v-model="form" @submit="onSubmit">
                    <el-button type="success" native-type="submit">提交</el-button>
                </role-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import roleApi from '@/common/apis/role';
    import RoleForm from '@/components/form/RoleForm';
    import {mapGetters} from 'vuex';

    export default {
        components: {RoleForm},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                arr: [],
                tableData: [],
                query: {
                    name: undefined,
                    mobile: undefined,
                    roleId: undefined,
                    page: 1,
                    pageSize: 20,
                    sortOrder: 'id',
                    sortBy: 'asc',
                    status: undefined,
                    column: 'id,scope'
                },
                dialog: {
                    show: false,
                    isCreate: true
                },
                form: {
                    name: undefined,
                    // sortId:0,
                    level: 0,
                    access: {
                        all: [],
                        manager: [],
                        systemBank: [],
                        store: [],
                        user: [],
                        item: [],
                        brand: [],
                        wholesaleOrder: [],
                        retailOrder: [],
                        event: [],
                        groupItem: [],
                        groupLeader: [],
                        contentClass: [],
                        content: [],
                        adv: [],
                        msg: [],
                        wholesale: [],
                        securityCode: [],
                        income: [],
                        deposit: [],
                        verify: []
                    }
                }
            };
        },
        computed: {
            ...mapGetters(['role'])
        },
        mounted() {
            this.getData();
        },
        methods: {
            onSave() {
                console.log(this.form);
                this.$store.commit('SET_PERMISSION', this.form);
            },
            createAdmin() {
                this.dialog.show = true;
                this.dialog.isCreate = true;
            },
            editAdmin(role) {
                const oRole = {
                    id: role.id,
                    level: role.level,
                    managerCount: role.managerCount,
                    name: role.name,
                    parentRoleId: role.parentRoleId,
                    sortId: role.sortId,
                    scope: role.scope
                };
                try {
                    oRole.access = JSON.parse(role.access);
                } catch (e) {
                    oRole.access = {};
                }
                oRole.access = Object.assign({}, {
                    all: [],
                    manager: [],
                    systemBank: [],
                    store: [],
                    user: [],
                    item: [],
                    brand: [],
                    wholesaleOrder: [],
                    retailOrder: [],
                    event: [],
                    groupItem: [],
                    groupLeader: [],
                    contentClass: [],
                    content: [],
                    adv: [],
                    msg: [],
                    wholesale: [],
                    securityCode: [],
                    income: [],
                    deposit: [],
                    verify: []
                }, oRole.access);
                console.info(oRole);
                this.form = oRole;
                this.dialog.show = true;
                this.dialog.isCreate = false;
            },
            getData() {
                this.loading = true;
                roleApi.list(this.query)
                    .then((res) => {
                        this.$util.handelHttpResponseResult(res).then(({data}) => {
                            let list = data.map(item => {
                                item.level = item.level || 0;
                                return item;
                            });
                            this.table.data = list.sort((a, b) => {
                                return b.level - a.level;
                            });
                        });
                    })
                    .finally(() => (this.loading = false));
            },
            onSubmit() {
                if (!this.form.id) {
                    this.add();
                } else {
                    this.update();
                }
            },
            add() {
                this.loading = true;
                this.dialog.show = false;
                let params = Object.assign({}, this.form);
                params.access = JSON.stringify(params.access);
                roleApi.add(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.getData();
                    });
                }).finally(() => this.loading = false);
            },
            update() {
                this.loading = true;
                this.dialog.show = false;
                let params = Object.assign({}, this.form);
                params.access = JSON.stringify(params.access);
                roleApi.edit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '更新成功').then(() => {
                        this.getData();
                    });
                }).finally(() => this.loading = false);
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
