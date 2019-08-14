<template>
    <div class="group-approval kd-flex kd-page-master" v-loading="loading">
        <breadcrumb :options="['活动管理', '社区团购', '团长审批']"/>
        <div class="main-container kd-flex-item kd-flex">
            <el-form inline :model="query" @submit.native.prevent="getData">
                <el-form-item label="申请人名称">
                    <el-input v-model="query.name"/>
                </el-form-item>
                <el-form-item label="店铺名称">
                    <el-input v-model="query.storeName"/>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="query.state" :value="query.state">
                        <el-option :value="undefined" label="全部"/>
                        <el-option :value="1" label="待审批"/>
                        <el-option :value="2" label="已允许"/>
                        <el-option :value="3" label="已拒绝"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请时间">
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
                <el-form-item>
                    <el-button type="primary" native-type="submit">过滤</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border height="100%">
                <el-table-column align="center" label="申请人" prop="name"/>
                <el-table-column align="center" label="店铺名称" prop="storeName"/>
                <el-table-column align="center" label="申请时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号" prop="mobile"/>
                <el-table-column align="center" label="地址" prop="address"/>
                <el-table-column align="center" label="职业">
                    <template slot-scope="scope">
                        {{scope.row.occupation | occupationFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="实体店类型" prop="storeType">
                    <template slot-scope="scope">
                        {{scope.row.storeState ? scope.row.storeType : '没有实体店'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        {{scope.row.state | stateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="营业执照" align="center" width="80px">
                    <template slot-scope="scope">
                        <a :href="scope.row.businessLicense | imgSrc" target="_blank">查看</a>
                    </template>
                </el-table-column>
                <el-table-column v-if="$util.checkPermission('groupLeader',['u'])" align="center" label="管理">
                    <template slot-scope="scope">
                        <div v-if="scope.row.state === 1">
                            <el-button type="text" @click="openApprovalDialog(scope.row, 2)">允许</el-button>
                            <el-button type="text" @click="openApprovalDialog(scope.row, 3)">拒绝</el-button>
                        </div>
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
        <el-dialog :visible.sync="dialog" title="提示" width="300px">
            <el-form :model="form" @submit.native.prevent="onSubmit" ref="form" :rules="rules">
                <el-form-item v-if="form.state === 3" label="原因" prop="verifyRemark">
                    <el-input type="textarea" placeholder="请输入拒绝原因" v-model="form.verifyRemark"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">
                        {{form.state === 3 ? '拒绝申请' : '同意申请'}}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import api from '@/common/apis/group/approval';
    import {mapGetters} from 'vuex';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                time: [],
                query: {
                    storeId: undefined,
                    state: undefined,
                    createTimeStart: undefined,
                    createTimeEnd: undefined,
                    storeName: undefined,
                    name: undefined,
                    pageNum: 1,
                    pageSize: 20
                },
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
                },
                dialog: false,
                form: {
                    id: undefined,
                    state: undefined,
                    verifyRemark: undefined
                },
                rules: {
                    verifyRemark: {
                        required: true,
                        message: '请输入原因'
                    }
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                api.leaderList(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        console.info(data);
                        this.table.data = data.list;
                        this.table.page.total = data.total;
                    });
                }).finally(() => this.loading = false);
            },
            changeDateRange(e) {
                try {
                    this.query.createTimeStart = new Date(e[0]).getTime() / 1000;
                    this.query.createTimeEnd = new Date(e[1]).getTime() / 1000;
                } catch (e) {
                }
            },
            openApprovalDialog(item, state) {
                this.form = {
                    id: item.id,
                    state: state,
                    verifyRemark: undefined,
                    firstState: state === 2
                };
                this.dialog = true;
            },
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.dialog = false;
                        this.loading = true;
                        api.leaderAudit(this.form).then(res => {
                            this.$util.handelHttpResponseResult(res, true, res.data.msg).then(() => this.getData());
                        }).finally(() => this.loading = false);
                    }
                });
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        },
        filters: {
            stateFilter(s) {
                switch (s) {
                    case 1:
                        return '待审批';
                    case 2:
                        return '已允许';
                    case 3:
                        return '已拒绝';
                }
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
    .group-approval {

    }
</style>
