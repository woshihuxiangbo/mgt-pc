<template>
    <div class="main kd-flex" v-loading="loading">
        <breadcrumb :options="['商品管理', '厂商管理']"/>
        <div class="container kd-flex-item kd-flex">
            <div class="action" v-if="$util.checkPermission('item', ['c'])">
                <el-button type="primary" @click="createFirm">创建厂商</el-button>
            </div>
            <div class="search">
                <el-form :inline="true" label-width="40px" @submit.native.prevent="onSearch">
                    <el-form-item label="名称">
                        <el-input v-model="query.name"/>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="status" @change="changeQueryStatus" :value="status">
                            <el-option :value="undefined" label="正常"></el-option>
                            <el-option :value="2" label="禁用"></el-option>
                            <el-option :value="3" label="全部"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="table.data" class="kd-flex-item" height="100%" border>
                <el-table-column align="center" label="厂家名称" prop="name"/>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">{{scope.row | statusFilter}}</template>
                </el-table-column>
                <el-table-column align="center" label="管理" v-if="$util.checkPermission('item', ['u', 'd'])">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editFirm(scope.row)" v-if="$util.checkPermission('item', ['u'])">
                            编辑
                        </el-button>
                        <el-button
                            v-if="$util.checkPermission('item', ['u'])"
                            type="text"
                            @click="switchFirmDisabled(scope.row)">
                            {{scope.row.disabled ? '启用' : '禁用'}}
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
                :total="table.page.total"/>
        </div>

        <el-dialog title="添加厂商" :visible.sync="dialog" width="80%" :close-on-click-modal="false">
            <bank-form v-model="form" @submit="onSubmit">
                <el-button type="primary" native-type="submit">添加</el-button>
            </bank-form>
        </el-dialog>
        <el-dialog title="修改厂商" :visible.sync="dialogEdit" width="80%" :close-on-click-modal="false">
            <bank-form v-model="editForm" @submit="onSubmitUpdate">
                <el-button type="primary" native-type="submit">保存</el-button>
            </bank-form>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
    .search-button-group {
        min-width: 180px;
        padding-top: 36px;
    }

    .el-col {
        margin: 10px 0;
    }
</style>

<script>
    import tableDataMixins from '../../../components/mixins/tableDataMixins';
    import api from '../../../common/apis/firm';
    import BankForm from '@/components/form/BankForm';

    export default {
        components: {BankForm},
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
                form: {
                    name: undefined,
                    bankDetails: [
                        {
                            bankName: '',
                            bankAccount: '',
                            bankOwner: '',
                            bankBranch: ''
                        }
                    ]
                },
                query: {
                    name: undefined,
                    page: 1,
                    pageSize: 20,
                    sortOrder: 'id',
                    sortBy: 'asc',
                    disabled: 0,
                    deleted: 0,
                    column: 'id,name,disabled,deleteTime,bankDetails'
                },
                editForm: {},
                dialog: false,
                dialogEdit: false
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            createFirm() {
                this.dialog = true;
            },
            onSubmit() {
                if (this.form.id === undefined) {
                    let params = this.$util.deepClone(this.form);
                    params.bankDetails = JSON.stringify(params.bankDetails);
                    api.add(params).then((res) => {
                        this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                            this.dialog = false;
                            this.getData();
                            this.form = {
                                name: undefined,
                                bankDetails: {
                                    bankName: '',
                                    bankAccount: '',
                                    bankOwner: '',
                                    bankBranch: ''
                                }
                            };
                        });
                    }).finally(() => (this.loading = false));
                }
            },
            getData() {
                this.loading = true;
                api.list(this.query)
                    .then((res) => {
                        this.$util.handelHttpResponseResult(res).then((data) => {
                            this.table.data = data.data.rows;
                            this.table.page.total = data.data.rowCount;
                        });
                    })
                    .finally(() => (this.loading = false));
            },
            onSearch() {
                this.getData();
            },
            pageChange() {
                this.getData();
            },
            editFirm(item) {
                if (item.bankDetails === undefined) {
                    item.bankDetails = [{
                        bankName: '',
                        bankAccount: '',
                        bankOwner: '',
                        bankBranch: ''
                    }];
                }
                this.editForm = item;
                this.dialogEdit = true;
            },
            onSubmitUpdate() {
                this.loading = true;
                let params = this.$util.deepClone(this.editForm);
                params.bankDetails = JSON.stringify(params.bankDetails);
                api.edit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(() => {
                        this.getData();
                        this.dialogEdit = false;
                    });
                }).finally(() => this.loading = false);
            },
            switchFirmDisabled(item) {
                this.$util.actionConfirm('是否' + (item.disabled ? '启用' : '禁用') + '此厂商?').then(() => {
                    this.loading = true;
                    api.disabled({id: item.id})
                        .then((res) => {
                            this.$util.handelHttpResponseResult(res).then(() => {
                                this.getData();
                            });
                        })
                        .finally(() => (this.loading = false));
                });
            },
            switchFirmDeleted(item) {
                this.$util.actionConfirm('是否' + (item.deleteTime ? '恢复' : '删除') + '此厂商?').then(() => {
                    this.loading = true;
                    api.deleted({id: item.id})
                        .then((res) => {
                            this.$util.handelHttpResponseResult(res).then(() => {
                                this.getData();
                            });
                        })
                        .finally(() => (this.loading = false));
                });
            }
        },
        filters: {
            bankAccount(bankAccount) {
                return bankAccount.replace(/^(\d{4})\d{4,}(\d{4})$/, '$1***********$2');
            }
        }
    };
</script>
