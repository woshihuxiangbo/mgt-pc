<template>
    <div class="md-group-list" v-loading="loading">
        <breadcrumb :options="options"/>
        <div class="main-container">
            <el-form ref="search" :model="query" @submit.native.prevent="getData(true)" inline>
                <el-form-item label="活动名称">
                    <el-input v-model="query.groupName"/>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="query.disabled" :value="query.disabled">
                        <el-option :value="undefined" label="全部"/>
                        <el-option :value="true" label="禁用"/>
                        <el-option :value="false" label="启用"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="有效时间">
                    <el-date-picker v-model="time"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions" @change="changeDateRange"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">搜索</el-button>
                    <el-button type="primary" @click="clearQuery()">清除</el-button>
                    <el-button type="primary" v-if="$util.checkPermission('event', ['c'])" @click="add">添加</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="活动名称" align="center" prop="groupName"/>
                <el-table-column label="开始时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.startTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.endTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.disabled | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="管理" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="$util.checkPermission('event', ['u'])" @click="editGroup(scope.row)">
                            编辑
                        </el-button>
                        <el-button type="text" v-if="$util.checkPermission('event', ['d'])" @click="deleted(scope.row)">
                            删除
                        </el-button>
                        <el-button type="text" v-if="$util.checkPermission('event', ['u'])" @click="disabled(scope.row)">
                            {{scope.row.disabled ? '启用' : "禁用"}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    @current-change="getData()"
                    style="margin-top: 10px"
                    :current-page.sync="query.pageNum"
                    :page-size="query.pageSize"
                    layout="total, ->, prev, pager, next, jumper"
                    :total="table.page.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import tableDataMixins from "@/components/mixins/tableDataMixins";
    import {mapGetters} from 'vuex';
    import eventGroupBuy from "@/common/apis/eventGroupBuy";

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                options: ['活动管理', '拼团活动'],
                loading: false,
                time: [],
                query: {
                    groupName: undefined,
                    status: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    pageNum: 1,
                    pageSize: 20
                }
            }
        },
        computed: {
            ...mapGetters(['shop'])
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData(b) {
                if (b === true) this.query.page = 1;
                this.query.storeId = this.shop.id;
                this.loading = true;
                eventGroupBuy.list(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.list;
                        this.table.page.total = data.total;
                    });
                }).finally(() => this.loading = false)
            },
            clearQuery() {
                this.time = [];
                this.query = {
                    groupName: undefined,
                    status: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    pageNum: this.query.pageNum,
                    pageSize: 20
                }
            },
            add() {
                this.$router.push({name: 'EventGroupAdd'})
            },
            editGroup(item) {
                this.$router.push({name: 'EventGroupEdit', params: {id: item.id}})
            },
            disabled (item) {
                let action = item.disabled ? '启用' : '禁用';
                this.$util.actionConfirm(`是否${action}[${item.groupName}]`).then(() => {
                    this.loading = true;
                    let params = {
                        id: item.id,
                        status: item.disabled ? 3 : 2
                    };
                    eventGroupBuy.deleted(params).then(res => {
                        this.$util.handelHttpResponseResult(res, true).then(() => {
                            this.getData()
                        })
                    }).finally(() => this.loading = false);
                })
            },
            deleted (item) {
                this.$util.actionConfirm(`是否删除[${item.groupName}]`).then(() => {
                    this.loading = true;
                    eventGroupBuy.deleted({id: item.id, status: 1}).then(res => {
                        this.$util.handelHttpResponseResult(res, true).then(() => {
                            this.getData()
                        })
                    }).finally(() => this.loading = false);
                })
            }
        },
        filters: {
            statusFilter (v) {
                return v ? '禁用' : '启用'
            }
        }
    }
</script>

<style scoped>

</style>