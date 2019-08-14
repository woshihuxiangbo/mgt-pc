<template>
    <div class="md-bargain-list" v-loading="loading">
        <breadcrumb :options="['活动管理', '砍价']"/>
        <div class="main-container">
            <el-form @submit.native.prevent="getData(true)" inline>
                <el-form-item label="活动名称">
                    <el-input v-model="query.eventName"/>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker v-model="time"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    value-format="timestamp"
                                    range-separator="到"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions" @change="changeDateRange"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">搜索</el-button>
                    <el-button type="primary" @click="clearQuery">清除</el-button>
                    <el-button type="primary" v-if="$util.checkPermission('event', ['c'])"
                               @click="$router.push({name: 'EventBargainAdd'})">创建活动
                    </el-button>
                </el-form-item>
            </el-form>

            <el-table :data="table.data" border>
                <el-table-column label="活动名称" align="center" prop="eventName"/>
                <el-table-column label="开始时间" align="center" prop="startTime" :formatter="datetimeFormatter"/>
                <el-table-column label="结束时间" align="center" prop="endTime" :formatter="datetimeFormatter"/>
                <el-table-column label="商品总数" align="center" prop="itemCount"/>
                <el-table-column label="禁用商品数量" align="center" prop="dcount"/>
                <el-table-column label="管理" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="edit(scope.row)"
                                   v-if="$util.checkPermission('event', ['u'])"
                                   :disabled="scope.row.startTime < unix">
                            编辑
                        </el-button>
                        <el-button type="text" @click="getItems(scope.row)"
                                   v-if="$util.checkPermission('event', ['u'])">禁用或启用商品
                        </el-button>
                        <el-button type="text" @click="deleteItem(scope.row)"
                                   v-if="$util.checkPermission('event', ['d'])">删除
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
        <event-item-dialog :md-active.sync="dialog" v-model="event.item" @submit="updateEvent" v-loading="loading"/>
    </div>
</template>

<script>
    import tableDataMixins from "@/components/mixins/tableDataMixins";
    import api from '@/common/apis/event/bargain';
    import {mapGetters} from 'vuex';
    import EventItemDialog from "@/components/dialog/EventItemDialog";

    export default {
        components: {EventItemDialog},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                time: [],
                event: {
                    item: []
                },
                dialog: false,
                query: {
                    eventName: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    pageNum: 1,
                    pageSize: 20
                }
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData(b) {
                if (b === true) this.query.pageNum = 1;
                this.query.storeId = this.shop.id;
                this.loading = true;
                api.list(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.list;
                        this.table.page.total = data.total;
                    })
                }).finally(() => this.loading = false)
            },
            clearQuery() {
                this.time = [];
                this.query = {
                    eventName: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    pageNum: this.query.pageNum,
                    pageSize: 20
                }
            },
            edit(item) {
                this.$router.push({name: 'EventBargainEdit', params: {id: item.id}})
            },
            getItems(row) {
                this.loading = true;
                api.get({id: row.id}).then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (!data) return this.$message.warning("商品不存在");
                        this.event = data;
                        this.dialog = true;
                    })
                }).finally(() => this.loading = false)
            },
            deleteItem(row) {
                this.$util.actionConfirm(`是否删除【${row.eventName}】?`).then(() => {
                    this.loading = true;
                    api.deleted({id: row.id}).then(res => {
                        this.$util.handelHttpResponseResult(res, true).then(() => {
                            this.getData()
                        })
                    }).finally(() => this.loading = false)
                })
            },
            updateEvent() {
                this.loading = true;
                api.updateItem({item: this.event.item}).then(res => {
                    this.$util.handelHttpResponseResult(res, true).then(() => {
                        this.dialog = false;
                        this.getData();
                    })
                }).finally(() => this.loading = false)
            }
        },
        computed: {
            ...mapGetters(['shop']),
            unix() {
                return this.$util.timestampToUnix(new Date().getTime())
            }
        }
    }
</script>

<style scoped>

</style>