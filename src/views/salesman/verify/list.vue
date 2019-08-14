<template>
    <div class="kd-page-master kd-main" v-loading="load">
        <breadcrumb :options="['商品管理', '商品审核列表']"/>
        <div class="main-container">
            <div class="search">
                <el-form inline :model="query" @submit.native.prevent="getData">
                    <el-form-item label="店铺名称">
                        <el-input v-model="query.storeName"/>
                    </el-form-item>
                    <el-form-item label="实体店类型">
                        <el-input v-model="query.storeType"/>
                    </el-form-item>
                    <el-form-item label="含有待审核的商品">
                        <el-select v-model="query.hasVerifyItem" :value="query.hasVerifyItem" style="width: 120px">
                            <el-option :value="undefined" label="全部"/>
                            <el-option :value="true" label="是"/>
                            <el-option :value="false" label="否"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="含有待上架商品">
                        <el-select v-model="query.hasDisableItem" :value="query.hasDisableItem" style="width: 120px">
                            <el-option :value="undefined" label="全部"/>
                            <el-option :value="true" label="是"/>
                            <el-option :value="false" label="否"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getData">搜索</el-button>
                        <el-button type="text" @click="clearQuery">清除搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="table.data" border>
                <el-table-column prop="storeName" label="店铺名称" align="center"/>
                <el-table-column prop="storeType" label="实体店类型" align="center"/>
                <el-table-column prop="mobile" label="电话号码" align="center"/>
                <el-table-column prop="itemCount" label="商品数量" align="center"/>
                <el-table-column prop="itemVerifyCount" label="待审核商品数量" align="center"/>
                <el-table-column prop="itemCountDisable" label="待上架商品数量" align="center"/>
                <el-table-column label="管理" align="center" width="100px">
                    <template slot-scope="scope">
<!--                        <el-button type="text"-->
<!--                                   @click="$router.push({name: 'salesmanBrand', query: {ownerId: scope.row.userId}})">-->
<!--                            品牌列表-->
<!--                        </el-button>-->
<!--                        <el-button type="text"-->
<!--                                   @click="$router.push({name: 'salesmanCategory', query: {ownerId: scope.row.userId}})">-->
<!--                            分类列表-->
<!--                        </el-button>-->
                        <el-button type="text"
                                   @click="$router.push({name: 'salesmanGoods', query: {ownerId: scope.row.userId, disabled: 2, deleted: 2}})">
                            商品列表
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                background
                @current-change="getData"
                style="margin-top: 10px"
                :current-page.sync="query.page"
                :page-size="query.pageSize"
                layout="total, ->, prev, pager, next, jumper"
                :total="table.page.total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
    import groupApi from '@/common/apis/groupEvent';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import {mapGetters} from 'vuex';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                load: false,
                query: {
                    storeName: undefined,
                    storeType: undefined,
                    hasVerifyItem: undefined,
                    hasDisableItem: undefined,
                    sortOrder: 'store_id',
                    sortBy: 'desc',
                    page: 1,
                    pageSize: 20
                }
            };
        },
        methods: {
            getData() {
                this.load = true;
                this.query.storeId = this.shop.id;
                groupApi.verifyList(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                }).finally(() => this.load = false);
            },
            clearQuery() {
                this.query = {
                    storeName: undefined,
                    storeType: undefined,
                    hasVerifyItem: undefined,
                    hasDisableItem: undefined,
                    sortOrder: 'store_id',
                    sortBy: 'desc',
                    page: 1,
                    pageSize: 20
                };
                this.getData();
            }
        },
        computed: {
            ...mapGetters(['role', 'shop'])
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped>

</style>
