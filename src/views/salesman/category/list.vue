<template>
    <div class="main kd-flex" v-loading="loading">
        <breadcrumb :options="['商品管理', '分类管理']"/>
        <div class="container kd-flex-item kd-flex">
            <div class="action" v-if="$util.checkPermission('item',['c'])">
                <el-button type="primary" @click="createCategory">创建分类</el-button>
            </div>
            <div class="search">
                <el-form :inline="true" @submit.native.prevent="onSearch" inline>
                    <el-form-item label="名称">
                        <el-input v-model="query.name"/>
                    </el-form-item>
                    <el-form-item label="上级分类">
                        <el-select v-model="query.parentId" :value="query.parentId">
                            <el-option :value="undefined" label="全部"/>
                            <el-option :value="0" label="一级分类"/>
                            <el-option v-for="(item, i) in parents" :key="i" :value="item.id" :label="item.name"/>
                        </el-select>
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
                        <el-select v-model="query.status" @change="changeQueryStatus" :value="query.status">
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
                <el-table-column align="center" label="分类图标" prop="icon">
                    <template slot-scope="scope">
                        <img :src="scope.row.icon|imgSrc" height="50px" alt>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="分类名称" prop="name"/>
                <el-table-column align="center" label="分类名称(英文)" prop="nameEn"/>
                <el-table-column align="center" label="商品数量" prop="itemCount"/>
                <el-table-column align="center" label="排序ID" prop="sortId"/>
                <el-table-column align="center" label="创建人" prop="managerName" v-if="role.roleID !== '14'"/>
                <el-table-column align="center" label="审核状态">
                    <template slot-scope="scope">
                        {{getVerifyStatusText(scope.row)}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">{{scope.row | statusFilter}}</template>
                </el-table-column>
                <el-table-column v-if="$util.checkPermission('item',['u', 'd'])" align="center" label="管理">
                    <template slot-scope="scope">
                        <el-button
                            v-if="$util.checkPermission('verify',['f', 's', 't']) && scope.row.verifyStatus === 1"
                            type="text"
                            @click="verifyCategory(scope.row)">审核
                        </el-button>
                        <el-button
                            v-if="checkPerms(scope.row, ['u']) && checkEditPerms(scope.row)"
                            type="text"
                            @click="editCategory(scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                            v-if="checkPerms(scope.row, ['d']) "
                            type="text"
                            @click="switchCategoryDeleted(scope.row)"
                        >{{scope.row.deleteTime ? '恢复' : '删除'}}
                        </el-button>
                        <el-button
                            v-if="checkPerms(scope.row, ['d'])"
                            type="text"
                            @click="switchCategoryDisabled(scope.row)"
                        >{{scope.row.disabled ? '启用' : '禁用'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
<!--            <el-pagination-->
<!--                background-->
<!--                @current-change="pageChange"-->
<!--                style="margin-top: 10px"-->
<!--                :current-page.sync="query.page"-->
<!--                :page-size="query.pageSize"-->
<!--                layout="total, ->, prev, pager, next, jumper"-->
<!--                :total="table.page.total"></el-pagination>-->
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
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import api from '@/common/apis/category';
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
                    parentId: undefined,
                    verifyStatus: undefined,
                    sortOrder: 'sortId',
                    sortBy: 'desc',
                    disabled: 0,
                    deleted: 0,
                    isGroup: false,
                    ownerId: undefined,
                    column: 'id,name,icon,itemCount,sortId,disabled,deleteTime,nameEn,isGift,storeId,owner,managerName,verifyStatus,refuseReason'
                },
                parents: [],

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
            this.getParentData();
        },
        methods: {
            getParentData() {
                api.list({
                    parentId: '0',
                    column: 'id,name',
                    pageSize: 100,
                    storeId: this.shop.id,
                    isGroup: false
                }).then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.parents = data.rows;
                    });
                });
            },
            createCategory() {
                this.$router.push({name: 'salesmanCategoryAdd'});
            },
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                if (this.role.roleID === '14') {
                    this.query.isList = true;
                }
                api.list(this.query).then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
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
            editCategory(item) {
                this.$router.push({name: 'salesmanCategoryEdit', params: {id: item.id}});
            },
            switchCategoryDeleted(item) {
                this.$util.actionConfirm('是否' + (item.deleteTime ? '恢复' : '删除') + '此分类?').then(() => {
                    this.loading = true;
                    api.deleted({id: item.id})
                        .then((res) => {
                            this.$util.handelHttpResponseResult(res).then(() => {
                                this.getData();
                            });
                        })
                        .finally(() => (this.loading = false));
                });
            },
            switchCategoryDisabled(item) {
                this.$util.actionConfirm('是否' + (item.disabled ? '启用' : '禁用') + '此分类?').then(() => {
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
            checkPerms(item, perms) {
                //判断 所有者
                if (item.owner === this.user.managerId) {
                    return this.$util.checkPermission('item', perms);
                } else {
                    if (this.role.roleID === '14') {
                        if (perms.indexOf('u') !== -1) {
                            return this.$util.checkPermission('item', perms);
                        }
                        return false;
                    }
                }
                if (!item.storeId) return false;
                if (item.storeId === '0') {
                    return ['1', '11'].indexOf(this.role.roleID) !== -1;
                }
                return this.$util.checkPermission('item', perms);
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
            verifyCategory(item) {
                this.verifyDialogFrom = {
                    id: item.id,
                    verifyStatus: undefined,
                    refuseReason: undefined
                };
                this.verifyDialog = true;
            },
            onVerifySubmit() {
                this.loading = true;
                api.verify(this.verifyDialogFrom).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '审核成功').then(() => {
                        this.getData();
                        this.verifyDialog = false;
                    });
                }).finally(() => this.loading = false);
            },
            checkEditPerms(item) {
                if (this.role.roleID === '14') {
                    return item.owner !== '0';
                }
                return true;
            }
        },
        computed: {
            ...mapGetters({shop: 'shop', role: 'role', user: 'user'})
        },
        watch: {
            $route() {
                this.$nextTick(() => {
                    this.query.ownerId = this.$route.query.ownerId;
                    this.getData();
                });
            }
        }
    };
</script>
