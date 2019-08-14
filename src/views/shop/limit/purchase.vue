<template>
    <div class="md-purchase" v-loading="loading">
        <breadcrumb :options="['活动管理', '限购管理']"/>
        <div class="main-container">
            <el-form @submit.native.prevent="getData(true)" inline>
                <el-form-item label="商品名称">
                    <el-input v-model="query.itemName"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">查询</el-button>
                    <el-button type="primary" @click="createDialog = true">添加商品</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="商品名称" align="center" prop="itemName"/>
                <el-table-column label="限购件数" align="center" prop="count"/>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createdTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editItemLimit(scope.row)">编辑</el-button>
                        <el-button type="text" @click="deleteItem(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                :current-page.sync="table.page.current"
                :page-size="table.page.size"
                @change="getData"
                layout="total, ->, prev, pager, next, jumper"
                :total="table.page.total">
            </el-pagination>
        </div>
        <el-dialog :visible.sync="createDialog" title="选择限购商品" v-loading="loading">
            <item-limit-purchase-form v-model="form" @submit="onCreate"/>
        </el-dialog>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import {mapGetters} from 'vuex';
    import ItemLimitPurchaseForm from '@/components/form/ItemLimitPurchaseForm';
    import api from '@/common/apis/itemLimit';
    import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';

    export default {
        components: {ItemLimitPurchaseForm},
        mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
        data() {
            return {
                loading: false,
                createDialog: false,
                query: {
                    itemName: undefined,
                    page: 1,
                    pageSize: 20,
                    column: 'id,itemName,count,createdTime'
                },
                form: {
                    itemId: undefined,
                    count: 1
                }
            };
        },
        methods: {
            getData(b) {
                if (b) this.query.page = 1;
                this.query.storeId = this.shop.id;
                this.loading = true;
                api.list(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                }).finally(() => this.loading = false);
            },
            onCreate() {
                let params = this.$util.deepClone(this.form);
                params.storeId = this.shop.id;
                this.loading = true;
                api.add(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.getData();
                        this.createDialog = false;
                        this.form = {
                            itemId: undefined,
                            count: 1
                        }
                    });
                }).finally(() => this.loading = false);
            },
            deleteItem(item) {
                this.typeName = item.itemName + '的限购';
                this.onDeleted(item, api);
            },
            editItemLimit(item) {
                this.$prompt('请输入限购数量', `修改${item.itemName}`, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue: item.count,
                    inputPattern: /^[1-9]\d*$/,
                    inputErrorMessage: '请输入大于0的整数'
                }).then(({value}) => {
                    this.loading = true;
                    let params = {
                        id: item.id,
                        count: value
                    };
                    api.edit(params).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '修改成功').then(() => {
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    };
</script>

<style scoped lang="scss">
    .md-purchase {

    }
</style>
