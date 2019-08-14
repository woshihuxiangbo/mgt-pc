<template>
    <div class="main kd-flex" v-loading="loading">
        <breadcrumb :options="['管理员', '管理员列表']"/>
        <div class="container kd-flex-item kd-flex">
            <div class="action" v-if="$util.checkPermission('manager',['l'])">
                <el-button type="primary" @click="createAdmin">创建管理员</el-button>
            </div>
            <div class="search">
                <el-form :inline="true" @submit.native.prevent="onSearch">
                    <el-form-item label="名称">
                        <el-input v-model="query.name"/>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="query.mobile"/>
                    </el-form-item>
                    <el-form-item label="职务">
                        <el-select v-model="query.roleId" :value="query.roleId">
                            <el-option :value="undefined" label="全部"></el-option>
                            <el-option v-for="role in roles" :key="role.id" :value="role.id" :label="role.name"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="管理范围">
                        <el-select v-model="query.scope" :value="query.scope">
                            <el-option :value="undefined" label="全部"></el-option>
                            <el-option :value="1" label="仅平台"></el-option>
                            <el-option :value="2" label="仅店铺"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="query.status" :value="query.status">
                            <el-option :value="undefined" label="全部"></el-option>
                            <el-option :value="1" label="正常"></el-option>
                            <el-option :value="2" label="禁用"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="table.data" border class="kd-flex-item" height="100%">
                <el-table-column align="center" label="名称" prop="name"/>
                <el-table-column align="center" label="手机号" prop="mobile"/>
                <el-table-column align="center" label="职务" prop="roleName"/>
                <!-- <el-table-column align="center" label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime | dateFilter}}
                    </template>
                </el-table-column> -->
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column v-if="$util.checkPermission('manager',['u', 'd'])" align="center" label="管理">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editAdmin(scope.row)"
                                   v-if="$util.checkPermission('manager',[ 'u'])">编辑
                        </el-button>
                        <el-button type="text" @click="transferManagerStore(scope.row)"
                                   v-if="$util.checkPermission('manager',[ 'u']) && scope.row.roleId === '4'">转移店铺
                        </el-button>
                        <el-button type="text" @click="switchAdminDeleted(scope.row)"
                                   v-if="$util.checkPermission('manager',['d'])">
                            {{scope.row.deleteTime ? '恢复' : '删除'}}
                        </el-button>
                        <el-button type="text" @click="switchAdminDisabled(scope.row)"
                                   v-if="$util.checkPermission('manager',['d']) && $util.checkRole(['1', '2', '3'])">
                            {{scope.row.disabled ? '启用' : '禁用'}}
                        </el-button>
                        <el-button type="text" @click="showChildrenAdmin(scope.row)"
                                   v-if="
                                   $util.checkPermission('manager',['d']) &&
                                   (shop.id === '0' || !isSaas) &&
                                   $util.checkRole(['1', '2', '3'])">
                            下级
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @current-change="pageChange"
                style="margin-top: 10px"
                :current-page.sync="query.page"
                :page-size="query.pageSize"
                layout="total, ->, prev, pager, next, jumper"
                :total="table.page.total">
            </el-pagination>
        </div>
        <el-dialog title="转移店铺" :visible.sync="dialog" v-loading="loading">
            <el-form inline :model="transfer" ref="transfer" @submit.native.prevent="onTransferSubmit">
                <el-form-item :label="`转移${origin.name}店铺给`" prop="targetManagerId"
                              :rules="{required: true, message: '请选择'}">
                    <template slot="label">
                        转移
                        <el-button type="danger">{{origin.name}}</el-button>
                        店铺给
                    </template>
                    <el-select v-model="transfer.targetManagerId" :value="transfer.targetManagerId"
                               placeholder="请选择管理员">
                        <el-option v-for="(m, l) in managers" :key="l" :label="m.name" :value="m.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="下级管理员" :visible.sync="childrenDialog" v-loading="loading">

            <el-table :data="children" border height="500px">
                <el-table-column align="center" label="名称" prop="name"/>
                <el-table-column align="center" label="手机号" prop="mobile"/>
                <el-table-column align="center" label="职务" prop="roleName"/>
                <!-- <el-table-column align="center" label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime | dateFilter}}
                    </template>
                </el-table-column> -->
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column v-if="$util.checkPermission('manager',['u', 'd'])" align="center" label="管理"
                                 width="240px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editAdmin(scope.row)"
                                   v-if="$util.checkPermission('manager',[ 'u'])">编辑
                        </el-button>
                        <el-button type="text" @click="transferManagerStore(scope.row)"
                                   v-if="$util.checkPermission('manager',[ 'u']) && scope.row.roleId === '4'">转移店铺
                        </el-button>
                        <el-button type="text" @click="switchAdminDeleted(scope.row, 1)"
                                   v-if="$util.checkPermission('manager',['d'])">
                            {{scope.row.deleteTime ? '恢复' : '删除'}}
                        </el-button>
                        <el-button type="text" @click="switchAdminDisabled(scope.row, 1)"
                                   v-if="$util.checkPermission('manager',['d']) && $util.checkRole(['1', '2', '3'])">
                            {{scope.row.disabled ? '启用' : '禁用'}}
                        </el-button>
                        <el-button type="text" @click="showChildrenAdmin(scope.row, 1)"
                                   v-if="
                                   $util.checkPermission('manager',['d']) &&
                                   (shop.id === '0' || !isSaas) &&
                                   $util.checkRole(['1', '2', '3'])">
                            下级
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import api from '@/common/apis/administrator';
    import roleApi from '@/common/apis/role';
    import {mapGetters} from 'vuex'

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                status: undefined,
                table: {
                    data: [],
                    page: {
                        total: 0
                    }
                },
                query: {
                    name: undefined,
                    mobile: undefined,
                    roleId: undefined,
                    page: 1,
                    pageSize: 20,
                    sortOrder: 'id',
                    sortBy: 'asc',
                    status: undefined,
                    column: 'id',
                    storeId: undefined
                },
                roles: [],
                dialog: false,
                origin: {},
                managers: [],
                transfer: {
                    originManagerId: undefined,
                    targetManagerId: undefined
                },
                selectManager: {},
                children: [],
                childrenDialog: false
            };
        },
        created() {
            if (!this.isSaas) {
                this.query.storeId = '0'
            } else {
                this.query.storeId = this.shop.id
            }
        },
        computed: {
            ...mapGetters(['role', 'shop']),
            isSaas() {
                return process.env.VUE_APP_IS_SAAS !== 'false'
            }
        },
        mounted() {
            let query = this.$route.query;
            if (!!query) {
                if (query.pageSize) {
                    query.pageSize = parseInt(query.pageSize);
                } else {
                    query.pageSize = 20;
                }
                if (query.page) {
                    query.page = parseInt(query.page);
                } else {
                    query.page = 1;
                }
            }
            this.query = Object.assign(this.query, query);
            this.getData();
            this.getAdminRole();
        },
        methods: {
            createAdmin() {
                this.$router.push({name: 'AdministratorAdd'});
            },
            getData() {
                this.loading = true;
                this.$router.push({name: 'AdministratorList', query: this.query});
                if (process.env.VUE_APP_IS_SAAS !== 'false') {
                    this.query.storeId = this.shop.id;
                }
                api.list(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    })
                }).finally(() => this.loading = false);
            },
            onSearch() {
                this.query.page = 1;
                this.getData();
            },
            pageChange() {
                this.getData();
            },
            editAdmin(item) {
                let managerId = item.id ? item.id : item.managerId;
                this.$router.push({name: 'AdministratorEdit', params: {id: managerId}});
            },
            switchAdminDeleted(item, status) {
                this.$util.actionConfirm('是否' + (item.deleteTime ? '恢复' : '删除') + '此管理员?').then(() => {
                    this.loading = true;
                    let managerId = item.id ? item.id : item.managerId;
                    api.deleted({id: managerId, status: !item.deleteTime}).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '删除成功').then(() => {
                            if (status === 1) {
                                this.showChildrenAdmin()
                            } else {
                                this.getData();
                            }
                        })
                    }).finally(() => this.loading = false);
                })
            },
            switchAdminDisabled(item, status) {
                this.$util.actionConfirm('是否' + (item.disabled ? '启用' : '禁用') + '此管理员?').then(() => {
                    this.loading = true;
                    let managerId = item.id ? item.id : item.managerId;
                    api.disabled({id: managerId, status: !item.disabled}).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '禁用成功').then(() => {
                            if (status === 1) {
                                this.showChildrenAdmin()
                            } else {
                                this.getData();
                            }
                        })
                    }).finally(() => this.loading = false);
                })
            },
            getAdminRole() {
                roleApi.list({}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.roles = data;
                    })
                })
            },
            transferManagerStore(manager) {
                this.origin = manager;
                this.transfer.originManagerId = manager.id;
                this.loading = true;
                api.list({roleId: manager.roleId, pageSize: 100}).then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.managers = data.rows;
                        this.dialog = true;
                    })
                }).finally(() => this.loading = false)
            },
            onTransferSubmit() {
                this.$refs.transfer.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        api.transfer(this.transfer).then(res => {
                            this.$util.handelHttpResponseResult(res, true, '转移成功').then(() => {
                                this.dialog = false;
                            });
                        }).finally(() => this.loading = false)
                    } else {
                        this.$message.error('数据填写不完整');
                    }
                });
            },
            showChildrenAdmin(manager) {
                if (manager !== undefined) {
                    this.selectManager = manager;
                }
                // this.children = [];
                this.loading = true;
                let params = {parentManagerId: this.selectManager.id, disabled: 2};
                if (process.env.VUE_APP_IS_SAAS !== 'false') {
                    params.storeId = this.shop.id;
                }
                api.list(params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (data.rowCount > 0) {
                            this.childrenDialog = true;
                            this.children = data.rows
                        } else {
                            this.$message.warning("此用户没有下级")
                        }
                    })
                }).finally(() => this.loading = false)
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
