<template>
    <div class="md-shop-street" v-loading="loading">
        <breadcrumb :options="['社区团购', '店铺街管理']"/>
        <div class="main-container">
            <el-form ref="search" @submit.native.prevent="getData(true)" inline>
                <el-form-item label="团长名称">
                    <el-input v-model="query.name"/>
                </el-form-item>
                <el-form-item label="店铺名称">
                    <el-input v-model="query.storeName" placeholder="模糊搜索"/>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="query.mobile" placeholder="模糊搜索"/>
                </el-form-item>
                <el-form-item label="店铺状态">
                    <el-select v-model="query.status" :value="query.status">
                        <el-option :value="undefined" label="全部"/>
                        <el-option :value="1" label="上架"/>
                        <el-option :value="0" label="下架"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">搜索</el-button>
                    <el-button type="primary" @click="clearQuery">清空</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="团长名称" align="center" prop="name"/>
                <el-table-column label="店铺名称" align="center" prop="storeName"/>
                <el-table-column label="手机号" align="center" prop="mobile" width="150px"/>
                <el-table-column label="地址" align="center" prop="address" width="320px"/>
                <el-table-column label="职业" align="center">
                    <template slot-scope="scope">
                        {{scope.row.occupation | occupationFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="实体店类型" align="center" prop="storeType"/>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.status | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="管理" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="updateStatus(scope.row)">{{scope.row.status === 0 ? '上架' :
                            '下架'}}
                        </el-button>
<!--                        <el-button type="text" @click="transfer(scope.row)">转移店铺街</el-button>-->
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                background
                @current-change="getData"
                :current-page.sync="query.pageNum"
                :page-size="query.pageSize"
                layout="total, ->, prev, pager, next, jumper"
                :total="table.page.total"/>
        </div>
        <transfer-shop-street-dialog :md-active.sync="dialog" :group-store-id="store.userId" @success="onSuccess"/>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import TransferShopStreetDialog from '@/components/dialog/TransferShopStreetDialog';
    import api from '@/common/apis/group/leader';
    import {mapGetters} from 'vuex';

    export default {
        components: {TransferShopStreetDialog},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                query: {
                    name: undefined,
                    storeName: undefined,
                    mobile: undefined,
                    status: undefined,
                    pageNum: 1,
                    pageSize: 20
                },
                dialog: false,
                store: {
                    userId: undefined
                },
                groupStoreId: ''
            };
        },
        computed: {
            ...mapGetters(['shop'])
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData(s) {
                if (s === true) this.query.pageNum = 1;
                this.query.storeId = this.shop.id;
                this.loading = true;
                api.getLeaderList(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.list;
                        this.table.page.total = data.total;
                        this.query.pageNum = data.pageNum;
                    });
                }).finally(() => this.loading = false);
            },
            clearQuery() {
                this.query = {
                    name: undefined,
                    storeName: undefined,
                    mobile: undefined,
                    status: undefined,
                    pageNum: this.query.pageNum,
                    pageSize: 20
                };
            },
            updateStatus(item) {
                let action = item.status === 0 ? '上架' : '下架';
                this.$util.actionConfirm(`是否${action}${item.name}的小店`).then(() => {
                    this.loading = true;
                    api.changeLeaderRelation({userId: item.userId, status: item.status === 0 ? 1 : 0}).then(res => {
                        this.$util.handelHttpResponseResult(res, true).then(() => {
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            },
            transfer(item) {
                this.store = item;
                this.dialog = true;
            },
            onSuccess() {
                this.dialog = false;
                this.getData();
            }
        },
        filters: {
            statusFilter(v) {
                return v === 0 ? '下架' : '上架';
            },
            occupationFilter(v) {
                switch (v) {
                    case '1':
                        return '自由职业';
                    case '2':
                        return '全职太太';
                    case '3':
                        return '普通学生';
                    case '4':
                        return '上班白领';
                    case '5':
                        return '其他';
                    default:
                        return v;
                }
            }
        }
    };
</script>

<style scoped>

</style>
