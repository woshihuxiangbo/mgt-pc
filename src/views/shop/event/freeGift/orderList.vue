<template>
    <div class="order-list" v-loading="loading">
        <breadcrumb :options="['活动管理', '免费领礼品', '领取记录']"/>
        <div class="main-container">
            <el-table :data="table.data" border>
                <el-table-column label="领取用户" prop="nickname"/>
                <el-table-column label="用户身份">
                    <template slot-scope="scope">
                        {{getUserLevelName(scope.row.userLevel)}}
                    </template>
                </el-table-column>
                <el-table-column label="领取物品" prop="itemName"/>
                <el-table-column label="规格" prop="specName"/>
                <el-table-column label="领取时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime | dateFilter}}
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
                    :total="table.page.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import retail from '@/common/apis/order';
    import userApi from '@/common/apis/user';
    import {mapGetters} from 'vuex';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                lvConfig: {},
                query: {
                    eventType: 6,
                    pageSize: 20,
                    page: 1
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;
                retail.orderList(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        console.info(data);
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                }).finally(() => this.loading = false);
            },

            getStoreLevel() {
                userApi.getUserLevel(this.shop.id).then(res => {
                    this.$util.handelHttpResponseResult(res, false, '').then(({data}) => {
                        this.lvConfig = data;
                    });
                });
            },
            getUserLevelName(id) {
                try {
                    return this.lvConfig['lv' + id].name;
                } catch (e) {
                    return '-';
                }
            }
        },
        mounted() {
            this.query.storeId = this.shop.id;
            this.query = Object.assign({}, this.query, this.$router.query);
            this.getData();
            this.getStoreLevel();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    };
</script>

<style scoped>

</style>
