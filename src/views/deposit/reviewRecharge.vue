<template>
    <div class="md-deposit-review-recharge main-container" v-loading="loading">
        <el-form @submit.native.prevent="getData(true)" inline>
            <el-form-item label="充值业务ID">
                <el-input v-model="query.id"/>
            </el-form-item>
            <el-form-item label="店铺名">
                <el-input v-model="query.storeName"/>
            </el-form-item>
            <el-form-item label="充值时间">
                <el-date-picker
                    @change="changeDateRange"
                    v-model="time"
                    type="daterange"
                    range-separator="至"
                    value-format="timestamp"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"/>
            </el-form-item>
            <el-form-item label="审核状态">
                <el-select v-model="query.status" :value="query.status" style="width: 140px">
                    <el-option :value="undefined" label="全部"/>
                    <el-option value="1" label="通过"/>
                    <el-option value="2" label="不通过"/>
                    <el-option value="0" label="审核中"/>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">查询</el-button>
                <el-button type="primary" @click="clearQuery">清空</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="table.data" border>
            <el-table-column label="充值业务ID" align="center" prop="id"/>
            <el-table-column label="店铺名" align="center" prop="storeName"/>
            <el-table-column label="店铺ID" align="center" prop="storeId"/>
            <el-table-column label="所在地" align="center" prop="storeAddr"/>
            <el-table-column label="充值金额" align="center">
                <template slot-scope="scope">
                    {{scope.row.amount | priceFormat}}
                </template>
            </el-table-column>
            <el-table-column label="审核人" align="center" width="300px">
                <div slot-scope="scope" class="md-audit-list">
                    <p v-for="(item, index) in scope.row.auditingList" :key="index"
                       :class="item.auditingStatus !== 0 ? 'md-mute' : ''">
                        {{item.roleName}}:
                        <span v-if="item.auditingStatus !== 0">{{item.auditingUserName}}</span>
                        <span v-if="item.auditingStatus !== 0">({{item.auditingStatus | statusFilter}} {{item.createTime | dateFilter}})</span>
                    </p>
                </div>
            </el-table-column>
            <el-table-column label="审核状态" align="center">
                <template slot-scope="scope">
                    {{scope.row.status | statusFilter}}
                </template>
            </el-table-column>
            <el-table-column label="充值时间" align="center">
                <template slot-scope="scope">
                    {{scope.row.createTime | dateFilter}}
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark"/>
            <el-table-column label="管理" align="center">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status === 0" @click="auditRecharge(scope.row)">审核
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background @current-change="getData()"
                       :current-page.sync="query.page" :page-size="query.pageSize"
                       layout="total, ->, prev, pager, next, jumper" :total="table.page.total"/>
        <el-dialog :visible.sync="dialog" title="审核预存款" width="500px" v-loading="loading">
            <el-form @submit.native.prevent="auditRechargeSubmit" :model="form" label-width="60px" :rules="rules"
                     ref="f">
                <el-form-item label="状态" prop="status">
                    <el-radio v-model="form.status" :label="1">通过</el-radio>
                    <el-radio v-model="form.status" :label="2">拒绝</el-radio>
                </el-form-item>
                <el-form-item label="备注" v-if="form.status === 2" prop="status">
                    <el-input v-model="form.remark" placeholder="30个字符以内" type="textarea" :rows="2"/>
                </el-form-item>
                <el-form-item align="center">
                    <el-button type="primary" native-type="submit">确定</el-button>
                    <el-button type="primary" @click="resetForm">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import api from '@/common/apis/deposit';
    import validator from 'el-form-validator';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                time: [],
                query: {
                    id: undefined,
                    storeName: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    status: undefined,
                    page: 1,
                    pageSize: 20
                },
                recharge: {},
                dialog: false,
                form: {
                    status: undefined,
                    id: undefined,
                    remark: undefined
                },
                rules: {
                    status: {
                        required: true,
                        message: '请选择状态'
                    },
                    remark: {
                        rules: 'nullable|string|max:30',
                        validator: validator.verification
                    }
                }
            };
        },
        methods: {
            getData(isSearch) {
                if (isSearch === true) this.query.page = 1;
                this.loading = true;
                api.storeCashDepositList(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.page.total = data.rowCount;
                        this.table.data = data.rows;
                    });
                }).finally(() => this.loading = false);
            },
            clearQuery() {
                this.time = [];
                this.query = {
                    id: undefined,
                    storeName: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    status: undefined,
                    page: this.query.page,
                    pageSize: 20
                };
            },
            auditRecharge(recharge) {
                this.recharge = recharge;
                this.form.id = recharge.id;
                this.dialog = true;
            },
            auditRechargeSubmit() {
                this.$refs['f'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        api.storeCashDepositAuditing(this.form).then(res => {
                            this.$util.handelHttpResponseResult(res, true).then(() => {
                                this.dialog = false;
                                this.getData();
                            });
                        }).finally(() => this.loading = false);
                    } else {
                        this.$message.warning('无法提交，请填写完整');
                    }
                });
            },
            resetForm() {
                this.form = {
                    status: undefined,
                    id: undefined,
                    remark: undefined
                };
                this.dialog = false;
            }
        },
        mounted() {
            this.getData();
        },
        filters: {
            statusFilter(v) {
                switch (v) {
                    case 0:
                        return '审核中';
                    case 1:
                        return '已通过';
                    case 2:
                        return '不通过';
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .md-audit-list {
        text-align: left;

        > p {
            font-size: 12px;
        }

        .md-mute {
            color: #969696;
        }
    }
</style>
