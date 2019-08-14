<template>
    <div v-loading="loading">
        <breadcrumb :options="['社区团购', '团购管理']"/>
        <div class="main-container">
            <div>
                <el-button type="primary" @click="addGroup" v-if="$util.checkPermission('event',['c'])">添加团购</el-button>
            </div>
            <el-form :inline="true" :model="query" inline>
                <el-form-item label="标题">
                    <el-input v-model="query.title"></el-input>
                </el-form-item>
                <el-form-item label="起止时间">
                    <el-date-picker v-model="time"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions" @change="changeDateRange">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="选择状态">
                    <el-select v-model="searchParamsStatus" @change="changeQueryStatus" :value="searchParamsStatus">
                        <el-option :value="undefined" label="正常"></el-option>
                        <el-option :value="2" label="禁用"></el-option>
                        <el-option :value="3" label="全部"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getData">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="table.data" border height="500px">
            <el-table-column align="center" label="ID" prop="id"/>
            <el-table-column align="center" label="标题" prop="title"/>
            <el-table-column align="center" label="开始时间">
                <template slot-scope="scope">
                    {{scope.row.startTime | dateFilter}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="结束时间">
                <template slot-scope="scope">
                    {{scope.row.endTime | dateFilter}}
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    {{scope.row | statusFilter}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="管理">
                <template slot-scope="scope">
                    <el-button type="text" v-if="$util.checkPermission('event',['u'])" @click="edit(scope.row)">编辑
                    </el-button>
                    <el-button type="text" v-if="$util.checkPermission('event',['d'])"
                               @click="switchItemDelete(scope.row)">删除
                    </el-button>
                    <el-button type="text" v-if="$util.checkPermission('event',['d'])"
                               @click="switchItemDisabled(scope.row)">
                        {{scope.row.disabled ? '启用' : '禁用'}}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            @current-change="getData"
            :current-page.sync="query.page"
            :page-size="query.pageSize"
            layout="total, ->, prev, pager, next, jumper"
            :total="table.page.total">
        </el-pagination>
        <el-dialog title="添加团购" :visible.sync="dialog.status.add" v-loading="loading" :close-on-click-modal="false">
            <group-event-form v-model="dialog.data.add" @submit="onSubmit">
                <el-button type="success" native-type="submit">提交</el-button>
            </group-event-form>
        </el-dialog>
        <el-dialog title="编辑团购" :visible.sync="dialog.status.edit" v-loading="loading" :close-on-click-modal="false">
            <group-event-form v-model="dialog.data.edit" @submit="onSubmitEdit">
                <el-button type="success" native-type="submit">修改</el-button>
            </group-event-form>
        </el-dialog>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import GroupEventForm from "@/components/form/GroupEventForm";
    import api from '@/common/apis/groupEvent';
    import {mapGetters} from 'vuex';
    import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins'

    export default {
        components: {GroupEventForm},
        mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
        data() {
            return {
                loading: false,
                searchParamsStatus: undefined,
                dialog: {
                    status: {
                        add: false,
                        edit: false
                    },
                    data: {
                        add: {
                            storeId: undefined,
                            title: undefined,
                            startTime: undefined,
                            endTime: undefined,
                            disabled: false,
                            items: []
                        },
                        edit: {}
                    }
                },
                query: {
                    page: 1,
                    pageSize: 20,
                    storeId: undefined,
                    column: 'id,title,startTime,endTime,itemIds,disabled,storeId',
                    sortOrder: 'id',
                    sortBy: 'asc',
                    disabled: 0,
                    deleted: 0
                },
                defaultTime: [],
                typeName: '团购活动',
                time: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            }
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                api.list(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    })
                }).finally(() => this.loading = false);
            },
            addGroup() {
                this.dialog.status.add = true;
            },
            onSubmit() {
                this.loading = true;
                let params = this.$util.deepClone(this.dialog.data.add);
                params.startTime = parseInt(params.startTime / 1000);
                params.endTime = parseInt(params.endTime / 1000);
                api.add(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.dialog.status.add = false;
                        this.getData();
                    })
                }).finally(() => this.loading = false);
            },
            edit(item) {
                this.dialog.data.edit = {
                    id: item.id,
                    storeId: item.storeId,
                    title: item.title,
                    startTime: (item.startTime * 1000),
                    endTime: (item.endTime * 1000),
                    disabled: item.disabled ? item.disabled : false,
                    items: item.itemIds.split(',')
                };
                this.dialog.status.edit = true;
            },
            onSubmitEdit() {
                this.loading = true;
                let params = this.$util.deepClone(this.dialog.data.edit);
                params.startTime = parseInt(params.startTime / 1000);
                params.endTime = parseInt(params.endTime / 1000);
                api.edit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '修改成功').then(() => {
                        this.dialog.status.edit = false;
                        this.getData();
                    })
                }).finally(() => this.loading = false)
            },
            switchItemDisabled(item) {
                this.onDisabled(item, api)
            },
            switchItemDelete(item) {
                this.onDeleted(item, api)
            },
            changeDateRange(e) {
                try {
                    this.query.startTime = parseInt(new Date(e[0]).getTime() / 1000);
                    this.query.endTime = parseInt(new Date(e[1]).getTime() / 1000);
                } catch (e) {
                }
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    }
</script>

<style scoped>

</style>
