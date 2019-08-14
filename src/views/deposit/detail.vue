<template>
    <div class="md-deposit" v-loading="loading">
        <breadcrumb :options="['预存款管理', '预存款明细']"/>
        <div class="main-container">
            <el-form :model="query" inline @submit.native.prevent="getData">
                <el-form-item label="用户昵称">
                    <el-input v-model="query.nickName"/>
                </el-form-item>
                <el-form-item label="用户ID">
                    <el-input v-model="query.userId"/>
                </el-form-item>
                <el-form-item>
                    <lv-selector v-model="query.level" show-all is-advanced @onGetData="onGetLevelData"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">查询</el-button>
                    <el-button type="primary" @click="clearQuery">清空</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="用户昵称" align="center" prop="nickname"></el-table-column>
                <el-table-column label="用户ID" align="center" prop="userid"></el-table-column>
                <el-table-column label="所属店铺" align="center" prop="storename"></el-table-column>
                <el-table-column label="用户角色" align="center" prop="level">
                    <template slot-scope="scope">{{levelFilter(scope.row.level)}}</template>
                </el-table-column>
                <el-table-column label="预存款余额" align="center">
                    <template slot-scope="scope">
                        {{scope.row.prestore | priceFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="明细" align="center">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   @click="$router.push({name: 'DepositDetailInfo', params: {id: scope.row.userid}})">查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background @current-change="getData"
                           :current-page.sync="query.page" :page-size="query.pageSize"
                           layout="total, ->, prev, pager, next, jumper" :total="table.page.total"/>
        </div>
    </div>
</template>

<script>
    import LvSelector from '@/components/selector/LvSelector';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import api from '@/common/apis/deposit';
    import {mapGetters} from 'vuex';

    export default {
        components: {LvSelector},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                query: {
                    nickName: undefined,
                    userId: undefined,
                    level: undefined,
                    pageSize: 20,
                    page: 1
                },
                levels: []
            };
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                api.selectDeposit(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                }).finally(() => this.loading = false);
            },
            clearQuery() {
                this.query = Object.assign({}, this.query, {nickName: undefined, userId: undefined, level: undefined});
            },
            onGetLevelData(lv) {
                console.info(lv);
                this.levels = lv;
            },
            levelFilter(v) {
                let name = '';
                this.levels.forEach((item) => {
                    if (item.value.toString() === v.toString()) {
                        name = item.label;
                    }
                });
                return name;
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

<style scoped>

</style>
