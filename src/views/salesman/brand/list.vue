<template>
    <div class="main kd-flex" v-loading="loading">
        <breadcrumb :options="['商品管理', '品牌管理']"/>
        <div class="main-container kd-flex kd-flex-item">
            <div v-if="$util.checkPermission('brand',['c'])" class="action">
                <el-button type="primary" @click="createBrand">创建品牌</el-button>
            </div>
            <div class="search">
                <el-form inline @submit.native.prevent="onSearch">
                    <el-form-item label="名称">
                        <el-input v-model="query.name"/>
                    </el-form-item>
                    <el-form-item label="审核状态">
                        <el-select v-model="query.verifyStatus" :value="query.verifyStatus">
                            <el-option :value="undefined" label="全部"></el-option>
                            <el-option :value="1" label="审核中"></el-option>
                            <el-option :value="2" label="审核通过"></el-option>
                            <el-option :value="3" label="拒绝"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="status" @change="changeQueryStatus" :value="status">
                            <el-option :value="undefined" label="正常"></el-option>
                            <el-option :value="1" label="删除"></el-option>
                            <el-option :value="2" label="禁用"></el-option>
                            <el-option :value="3" label="全部"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="table.data" border class="kd-flex-item" height="100%">
                <el-table-column align="center" label="品牌LOGO">
                    <template slot-scope="scope">
                        <img :src="scope.row.logo|imgSrc" height="50px" alt="">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="品牌名称" prop="name"/>
                <el-table-column align="center" label="商品数量" prop="itemCount"/>
                <el-table-column align="center" label="审核状态">
                    <template slot-scope="scope">
                        {{getVerifyStatusText(scope.row)}}
                    </template>
                </el-table-column>
                <el-table-column label="团长" align="center" prop="managerName" v-if="role.roleID !== '14'"/>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">{{scope.row | statusFilter}}</template>
                </el-table-column>
                <el-table-column v-if="$util.checkPermission('brand',['u', 'd'])" align="center" label="管理">
                    <template slot-scope="scope">
                        <el-button v-if="checkPerms(scope.row, ['u']) && scope.row.verifyStatus === 2 && role.roleID !== '14'" type="text"
                                   @click="editBrand(scope.row)">
                            编辑
                        </el-button>
                        <el-button v-if="checkPerms(scope.row,['d'])"
                                   type="text"
                                   @click="switchBrandDeleted(scope.row)"
                        >{{scope.row.deleteTime ? '恢复' : '删除'}}
                        </el-button>
                        <el-button v-if="checkPerms(scope.row, ['d'])"
                                   type="text"
                                   @click="switchBrandDisabled(scope.row)"
                        >{{scope.row.disabled ? '启用' : '禁用'}}
                        </el-button>
                        <el-button
                            v-if="$util.checkPermission('verify',['f', 's', 't']) && scope.row.verifyStatus === 1"
                            type="text"
                            @click="verifyBrand(scope.row)">审核
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
                :total="table.page.total"
            ></el-pagination>
        </div>
        <el-dialog :visible.sync="verifyDialog" :title="'审核'" width="400px" v-loading="loading">
            <el-form :model="verifyDialogFrom" @submit.native.prevent="onVerifySubmit">
                <el-form-item label="状态">
                    <el-select v-model="verifyDialogFrom.verifyStatus" :value="verifyDialogFrom.verifyStatus"
                               style="width: 100%;">
                        <el-option :value="2" label="审核通过"/>
                        <el-option :value="3" label="审核拒绝"/>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="verifyDialogFrom.verifyStatus === 3" label="拒绝原因">
                    <el-input v-model="verifyDialogFrom.refuseReason"/>
                </el-form-item>
                <el-form-item>
                    <el-button native-type="submit" type="success">提交</el-button>
                </el-form-item>
            </el-form>
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
    import brandApi from '../../../common/apis/brand';
    import {mapGetters} from 'vuex';

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
                    verifyStatus: undefined,
                    owner: undefined,
                    page: 1,
                    pageSize: 20,
                    sortOrder: 'id',
                    sortBy: 'asc',
                    disabled: 0,
                    deleted: 0,
                    column: 'id,name,logo,sortId,disabled,deleteTime,itemCount,storeId,managerName,verifyStatus,refuseReason'
                },
                verifyDialog: false,
                verifyDialogFrom: {
                    id: undefined,
                    verifyStatus: undefined,
                    refuseReason: undefined
                }
            };
        },
        mounted() {
            this.query.ownerId = this.$route.query.ownerId;
            this.getData();
        },
        methods: {
            createBrand() {
                this.$router.push({name: 'salesmanBrandAdd'});
            },
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                if (this.role.roleID === '14') {
                    console.info(this.user);
                    this.query.owner = this.user.managerId;
                }
                brandApi.list(this.query).then((res) => {
                    this.$util.handelHttpResponseResult(res).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                }).finally(() => (this.loading = false));
            },
            onSearch() {
                this.getData();
            },
            pageChange() {
                this.getData();
            },
            editBrand(item) {
                this.$router.push({name: 'salesmanBrandEdit', params: {id: item.id}});
            },
            switchBrandDeleted(item) {
                this.$util.actionConfirm('是否' + (item.deleteTime ? '恢复' : '删除') + '此品牌?').then(() => {
                    this.loading = true;
                    brandApi
                        .deleted({id: item.id})
                        .then((res) => {
                            this.$util.handelHttpResponseResult(res).then(() => {
                                this.getData();
                            });
                        }).finally(() => (this.loading = false));
                });
            },
            switchBrandDisabled(item) {
                this.$util.actionConfirm('是否' + (item.disabled ? '启用' : '禁用') + '此品牌?').then(() => {
                    this.loading = true;
                    brandApi
                        .disabled({id: item.id})
                        .then((res) => {
                            this.$util.handelHttpResponseResult(res).then(() => {
                                this.getData();
                            });
                        })
                        .finally(() => (this.loading = false));
                });
            },
            checkPerms(item, perms) {
                return this.$util.checkPermission('brand', perms) &&
                    (item.storeId === '0' ? ['11', '4', '1'].indexOf(this.role.roleID) !== -1 : true);
            },
            getVerifyStatusText(item) {
                switch (item.verifyStatus) {
                    case 1:
                        return '审核中';
                    case 2:
                        return '审核通过';
                    case 3:
                        return `审核拒绝[${item.refuseReason}]`;
                }
            },
            verifyBrand(item) {
                this.verifyDialogFrom = {
                    id: item.id,
                    verifyStatus: undefined,
                    refuseReason: undefined
                };
                this.verifyDialog = true;
            },
            onVerifySubmit() {
                this.loading = true;
                brandApi.verify(this.verifyDialogFrom).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '审核成功').then(() => {
                        this.getData();
                        this.verifyDialog = false;
                    });
                }).finally(() => this.loading = false);
            }
        },
        computed: {
            ...mapGetters(['shop', 'role', 'user'])
        },
        watch: {
            $route () {
                this.$nextTick(() => {
                    this.query.ownerId = this.$route.query.ownerId;
                    this.getData();
                })
            }
        }
    };
</script>
