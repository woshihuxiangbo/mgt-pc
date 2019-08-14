<template>
    <div class="shop-list" v-loading="loading">
        <breadcrumb :options="['店铺管理', '店铺列表']"/>
        <div class="main-container">
            <el-form :inline="true" :model="searchParams" inline @submit.native.prevent="onSearch">
                <el-form-item v-if="$util.checkPermission('store',['c'])">
                    <el-button type="primary" icon="el-icon-plus" @click="addShop">添加</el-button>
                </el-form-item>
                <el-form-item label="店铺名称">
                    <el-input v-model="query.params.name" placeholder="店铺名称"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker @change="changeDateRange"
                                    v-model="searchParams.createdAt"
                                    type="daterange"
                                    range-separator="至"
                                    value-format="timestamp"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="选择状态">
                    <el-select v-model="searchParams.status" @change="changeQueryStatus" :value="searchParams.status">
                        <el-option :value="undefined" label="正常"></el-option>
                        <el-option :value="1" label="删除"></el-option>
                        <el-option :value="2" label="禁用"></el-option>
                        <el-option :value="3" label="全部"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table border :data="tableData" @sort-change="onSortChange">
                <el-table-column label="店铺名称" prop="name" align="center" width="150" fixed="left"/>
                <el-table-column label="店铺ID" prop="id" align="center" width="200"/>
                <el-table-column label="所在的" prop="location" align="center" width="160">
                    <template slot-scope="scope">
                        {{scope.row.location | locationFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="手机号码" prop="mobile" align="center" width="115"/>
                <el-table-column sortable="custom" label="进货订单数" align="center" width="120">
                    <template slot-scope="scope">
                        {{scope.row.buyCount || 0}}
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" label="进货订单总金额" prop="buyAmount" align="center" width="150">
                    <template slot-scope="scope">
                        {{scope.row.buyAmount | priceFormat}}
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" label="销售订单数" align="center" width="120">
                    <template slot-scope="scope">
                        {{scope.row.salesCount || 0}}
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" label="销售订单总金额" align="center" width="150">
                    <template slot-scope="scope">
                        {{scope.row.salesAmount | priceFormat}}
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" label="收益总金额" prop="incomeAmount" align="center" width="120"/>
                <el-table-column sortable="custom" label="访客总数" align="center" width="110">
                    <template slot-scope="scope">
                        {{scope.row.lv9Count || 0}}
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" label="买家总数" align="center" width="110">
                    <template slot-scope="scope">
                        {{scope.row.lv10Count || 0}}
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" label="Lv1代理总数" align="center" width="130">
                    <template slot-scope="scope">
                        {{scope.row.lv1Count || 0}}
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" label="Lv2代理总数" align="center" width="130">
                    <template slot-scope="scope">
                        {{scope.row.lv2Count || 0}}
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" label="Lv3代理总数" align="center" width="130">
                    <template slot-scope="scope">
                        {{scope.row.lv3Count || 0}}
                    </template>
                </el-table-column>
                <el-table-column sortable="custom" label="创建时间" align="center" width="160" prop="createTime">
                    <template slot-scope="scope">
                        {{toDateFormat(scope.row.createTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column v-if="$util.checkPermission('store',['u', 'd'])" label="管理" align="center" width="250"
                                 fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="$util.checkPermission('store',['u'])" @click="editShop(scope.row)">
                            编辑
                        </el-button>
                        <!--<el-button type="text" v-if="$util.checkPermission('wholesale',['w'])" @click="editShopPostage(scope.row)">编辑运费模板</el-button>-->
                        <el-button type="text" v-if="$util.checkPermission('store',['d'])"
                                   @click="switchStoreDeleted(scope.row)">
                            {{scope.row.deleteTime ? '恢复' : '删除'}}
                        </el-button>
                        <el-button type="text" v-if="$util.checkPermission('store',['d'])"
                                   @click="switchStoreDisabled(scope.row)">
                            {{scope.row.disabled ? '启用' : '禁用'}}
                        </el-button>
                        <el-button type="text"
                                   v-if="$util.checkPermission('manager', ['u']) && $util.checkRole(['1', '2', '3'])"
                                   @click="changeStoreManager(scope.row)">
                            更换运营经理
                        </el-button>
                        <!--                        <el-button type="text" v-if="$util.checkPermission('store',['u'])" @click="editShop(scope.row)">-->
                        <!--                            {{scope.row.hiddenAudit ? '隐藏分佣' : '显示分佣'}}-->
                        <!--                        </el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    @current-change="pageChange"
                    :current-page.sync="query.params.page"
                    :page-size="query.params.pageSize"
                    layout="total, ->, prev, pager, next, jumper"
                    :total="page.total">
            </el-pagination>
        </div>
        <el-dialog title="更换运营经理" :visible.sync="dialog">
            <el-form inline :model="form" ref="transfer" @submit.native.prevent="onChangeStoreManagerSubmit">
                <el-form-item prop="managerId"
                              :rules="{required: true, message: '请选择'}">
                    <template slot="label">
                        更换
                        <el-button type="danger">{{storeName}}</el-button>
                        的运营经理
                    </template>
                    <el-select v-model="form.managerId" :value="form.managerId"
                               placeholder="请选择管理员">
                        <el-option v-for="(m, l) in managers" :key="l" :label="m.name" :value="m.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import storeApi from '@/common/apis/store';
    import Breadcrumb from '@/components/widget/breadcrumb';
    import api from '@/common/apis/administrator';

    export default {
        components: {Breadcrumb},
        data() {
            return {
                loading: false,
                searchParams: {
                    shopNumber: undefined,
                    shopName: undefined,
                    createdAt: undefined,
                    status: undefined
                },
                tableData: [],
                page: {
                    total: 0
                },
                query: {
                    params: {
                        name: undefined,
                        startTime: undefined,
                        endTime: undefined,
                        page: 1,
                        pageSize: 20,
                        column: 'id,name,buyCount,buyAmount,salesCount,salesAmount,incomeAmount,createTime,lv1Count,lv2Count,lv3Count,lv9Count,lv10Count,disabled,deleteTime,location', // hiddenAudit
                        sortOrder: 'id',
                        sortBy: 'asc',
                        disabled: 0,
                        deleted: 0
                    }
                },
                managers: [],
                form: {
                    storeId: undefined,
                    managerId: undefined
                },
                dialog: false,
                storeName: undefined
            };
        },
        methods: {
            getData() {
                this.loading = true;
                storeApi.getStoreList(this.query.params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.tableData = data.rows;
                        this.page.total = data.rowCount;
                    });
                }).catch().finally(() => this.loading = false);
            },
            onSearch() {
                this.query.page = 1;
                this.getData();
            },
            addShop() {
                this.$router.push({name: 'ShopAdd'});
            },
            // addShopMain() {
            //     this.$router.push({name: 'ShopAddMain'});
            // },
            editShop(shop) {
                this.$router.push({name: 'ShopEdit', params: {id: shop.id}});
            },
            editShopPostage(shop) {
                this.$router.push({name: 'StorePostage', params: {id: shop.id}});
            },
            switchStoreDeleted(store) {
                let action = store.deleteTime ? '恢复' : '删除';

                this.$confirm('是否' + action + '此店铺?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    storeApi.deleteStore(store.id).then(res => {
                        this.$util.handelHttpResponseResult(res, true, action + '成功').then(() => {
                            this.getData();
                        })
                    }).catch().finally(() => this.loading = false);
                }).catch(() => {
                });
            },
            switchStoreDisabled(store) {
                this.$confirm('是否' + (store.disabled ? '启用' : '禁用') + '此店铺?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    storeApi.disabledStore(store.id).then(res => {
                        if (res.data.code === 200) this.getData();
                    }).catch().finally(() => this.loading = false);
                }).catch(() => {
                });
            },
            toDateFormat(unix) {
                if (!unix) return '';
                unix = unix * 1000;
                return new Date(unix).format('yyyy-MM-dd HH:mm:ss');
            },
            changeDateRange(e) {
                console.info(e);
                try {
                    this.query.params.startTime = new Date(e[0]).getTime() / 1000;
                    this.query.params.endTime = new Date(e[1]).getTime() / 1000;
                } catch (e) {
                }
            },
            changeQueryStatus(e) {
                switch (e) {
                    case undefined: {
                        this.query.params.deleted = 0;
                        this.query.params.disabled = 0;
                        break;
                    }
                    case 1: {
                        this.query.params.deleted = 1;
                        this.query.params.disabled = 2;
                        break;
                    }
                    case 2: {
                        this.query.params.deleted = 2;
                        this.query.params.disabled = 1;
                        break;
                    }
                    case 3: {
                        this.query.params.deleted = 2;
                        this.query.params.disabled = 2;
                        break;
                    }
                }
            },
            pageChange() {
                this.getData();
            },
            onSortChange({prop, order}) {
                if (order === null) {
                    this.query.params.sortOrder = '';
                    this.query.params.sortBy = '';
                } else {
                    this.query.params.sortOrder = prop;
                    this.query.params.sortBy = order.replace('ending', '');
                }
                this.getData();
            },
            getManagers(manager) {
                this.loading = true;
                api.list({roleId: manager.roleId, pageSize: 100}).then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.managers = data.rows;
                        this.dialog = true;
                    })
                }).finally(() => this.loading = false)
            },
            changeStoreManager(store) {
                this.form.storeId = store.id;
                this.storeName = store.name;
                this.loading = true;
                api.getStoreManager({storeId: store.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false, '', true).then(({data}) => {
                        this.form.managerId = data.managerId
                    }).catch(() => {
                        this.form.managerId = undefined
                    }).finally(() => {
                        this.getManagers({roleId: 4});
                    })
                }).finally(() => this.loading = false)
            },
            onChangeStoreManagerSubmit() {
                this.$refs.transfer.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        api.changeStoreManager(this.form).then(res => {
                            this.$util.handelHttpResponseResult(res, true, '转移成功').then(() => {
                                this.dialog = false;
                            });
                        }).finally(() => this.loading = false)
                    } else {
                        this.$message.error('数据填写不完整');
                    }
                });
            }
        },
        filters: {
            statusFilter(val) {
                if (val.disabled) {
                    return '已禁用';
                } else if (val.deleteTime) {
                    return '已删除';
                }
                return '正常';
            },
            locationFilter(l) {
                try {
                    return l.join('-');
                } catch (e) {
                    return '-';
                }
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped lang="scss">
    .shop-list {
        height: 100%;
    }

    .right-btn {
        text-align: right;
        margin-bottom: 20px;
    }

    .el-pagination {
        margin: 10px 0;
    }
</style>
