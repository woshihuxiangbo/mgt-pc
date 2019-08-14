<template>
    <div class="kd-page-master" v-loading="loading">
        <breadcrumb :options="['预存款管理', '预存款批复']"/>
        <div class="main-container">
            <el-form inline @submit.native.prevent="getData">
                <el-form-item label="用户昵称">
                    <el-input v-model="query.nickname"/>
                </el-form-item>
                <el-form-item label="用户ID">
                    <el-input v-model="query.userId"/>
                </el-form-item>
                <el-form-item label="状态" v-if="$util.checkRole(['1'])">
                    <el-select v-model="query.status" :value="query.status">
                        <el-option :value="undefined" label="全部"/>
                        <el-option :value="1" label="用户申请"/>
                        <el-option :value="2" label="首批同意"/>
                        <el-option :value="3" label="首批拒绝"/>
                        <el-option :value="4" label="复批拒绝"/>
                        <el-option :value="5" label="完成"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="有效时间">
                    <el-date-picker @change="changeDateRange"
                                    v-model="daterange"
                                    type="daterange"
                                    range-separator="至"
                                    value-format="timestamp"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <div class="text-right">
                    <el-form-item>
                        <el-button type="success" @click="add" v-if="$util.checkPermission('deposit', ['c'])">添加
                        </el-button>
                        <el-button type="primary" native-type="submit">搜索</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="用户昵称" align="center" prop="userName"></el-table-column>
                <el-table-column label="用户身份" align="center">
                    <template slot-scope="scope">
                        {{list[scope.row.userLevel]}}
                    </template>
                </el-table-column>
                <el-table-column label="申请等级" align="center">
                    <template slot-scope="scope">
                        {{list[scope.row.applyLevel]}}
                    </template>
                </el-table-column>
                <el-table-column label="转账金额" align="center">
                    <template slot-scope="scope">
                        {{scope.row.amount | priceFormat}}
                    </template>
                </el-table-column>
                <!--                <el-table-column label="收款账户" align="center">-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <el-button type="success" @click="showBank(scope.row)">查看</el-button>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->
                <el-table-column label="转账截图" align="center">
                    <template slot-scope="scope">
                        <a v-for="(img ,i) in scope.row.imgs" :key="i" :href="img | imgSrc" target="_blank">
                            <img :src="img | imgSrc" alt="" width="30px" height="30px"
                                 style="display: inline-block;margin-right: 10px">
                        </a>
                    </template>
                </el-table-column>
                <el-table-column label="提交审批时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.applyTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.status | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="审批" align="center" v-if="$util.checkPermission('verify', ['s', 'f'])">
                    <template slot-scope="scope">
                        <el-button type="text" @click="firstBatchDeposit(scope.row)"
                                   v-if="$util.checkPermission('verify', ['f']) && scope.row.status === 1">首批
                        </el-button>
                        <el-button type="text" @click="batchDeposit(scope.row)"
                                   v-if="$util.checkPermission('verify', ['s']) && scope.row.status === 2">复批
                        </el-button>
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
        <el-dialog title="添加记录" :visible.sync="dialog" :close-on-click-modal="false" v-loading="loading">
            <el-form :model="form" ref="form" @submit.native.prevent="onAddSubmit" label-width="100px" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="真实名称" prop="trueName">
                            <el-input v-model="form.trueName"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户昵称" prop="userId">
                            <user-selector v-model="form.userId" style="width: 100%"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="转账金额" prop="amount">
                            <el-input v-model="form.amount"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请角色" prop="applyLevel">
                            <lv-selector v-model="form.applyLevel" style="width: 100%" is-advanced
                                         :advanced-data="['1', '9', '10']"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="转账时间" prop="applyTime">
                            <el-date-picker style="width: 100%;"
                                            v-model="form.applyTime"
                                            type="datetime"
                                            value-format="timestamp"
                                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="上传图片" prop="imgs">
                    <upload-img v-model="form.imgs" :oss-type="ossType.item" :sub-mod="subMold.slide" :max-pic="5"/>
                </el-form-item>
                <el-form-item>
                    <div class="text-right">
                        <el-button type="primary" native-type="submit">提交</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="reviewDialog.show" width="450px" v-loading="loading">
            <p>{{reviewDialog.subtitle}}</p>
            <br/>
            <el-input v-model="reviewDialog.data.accoutantRemark" placeholder="如果拒绝 ，请输入拒绝原因"/>
            <div slot="footer">
                <el-button type="error" @click="confirmReview(false)">拒绝</el-button>
                <el-button type="success" @click="confirmReview(true)">同意</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';
    import LvSelector from '@/components/selector/LvSelector';
    import UserSelector from '@/components/selector/UserSelector';
    import depositApi from '@/common/apis/deposit';
    import userApi from '@/common/apis/user';
    import {mapGetters} from 'vuex';
    import UploadImg from '@/components/widget/UploadSlider';
    import {ossType, subMold} from '@/common/apis/oss';
    import validator from 'el-form-validator';

    export default {
        components: {UploadImg, UserSelector, LvSelector},
        mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
        data() {
            return {
                ossType,
                subMold,
                loading: false,
                daterange: [],
                query: {
                    nickname: undefined,
                    userId: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    status: undefined,
                    pageNum: 1,
                    pageSize: 20
                },
                dialog: false,
                form: {
                    userId: undefined,
                    trueName: undefined,
                    imgs: [],
                    amount: undefined,
                    applyLevel: undefined,
                    storeId: undefined,
                    applyTime: undefined,
                    userRemark: undefined
                },
                list: {},
                reviewDialog: {
                    subtitle: '',
                    first: false,
                    show: false,
                    data: {}
                },
                rules: {
                    trueName: [
                        {
                            required: true,
                            message: '必须输入'
                        }, {
                            rules: 'required|string|max:10',
                            validator: validator.verification
                        }
                    ],
                    userId: {
                        required: true,
                        message: '必须输入'
                    },
                    amount: [
                        {
                            required: true,
                            message: '必须输入'
                        }, {
                            rules: 'required|numeric|min:0',
                            validator: validator.verification
                        }
                    ],
                    applyLevel: {
                        required: true,
                        message: '必须输入'
                    },
                    applyTime: {
                        required: true,
                        message: '必须输入'
                    }
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;
                this.setStatusByPermission();
                depositApi.selectIncomeDeposit(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (data.rowCount > 0) {
                            data.rows.map(item => {
                                item.bankAccount = JSON.parse(item.bankAccount);
                                item.imgs = JSON.parse(item.imgs);
                            });
                        }
                        this.table.data = data.rows || [];
                        this.table.page.total = data.rowCount;
                    });
                }).finally(() => this.loading = false);
            },
            getUserLevel() {
                userApi.getUserLevel(this.shop.id).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        let list = {};
                        for (let key in data) {
                            list[key.replace('lv', '')] = data[key].name;
                        }
                        this.list = list;
                    });
                });
            },
            add() {
                this.dialog = true;
            },
            setStatusByPermission() {
                if (this.$util.checkRole(['1'])) return;
                if (this.$util.checkPermission('verify', ['f'])) {
                    this.query.status = 1;
                } else if (this.$util.checkPermission('verify', ['s'])) {
                    this.query.status = 2;
                } else {
                    this.query.status = 5;
                }
            },
            onAddSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let params = this.$util.deepClone(this.form);
                        params.storeId = this.shop.id;
                        params.amount = this.$util.formatPrice(params.amount);
                        params.imgs = params.imgs.map(item => {
                            return item.url.replace(process.env.VUE_APP_IMAGE_BASE_URL, '');
                        });
                        params.imgs = JSON.stringify(params.imgs);
                        params.applyTime = parseInt(params.applyTime / 1000);
                        this.loading = true;
                        depositApi.examineAndApprove(params).then((res) => {
                            this.$util.handelHttpResponseResult(res, true, '添加成功').then(() => {
                                this.dialog = false;
                                this.getData();
                                this.form = {
                                    userId: undefined,
                                    trueName: undefined,
                                    imgs: [],
                                    amount: undefined,
                                    applyLevel: undefined,
                                    storeId: undefined,
                                    applyTime: undefined,
                                    userRemark: undefined
                                };
                            });
                        }).finally(() => this.loading = false);
                    } else {
                        this.$message.error('数据填写不完整');
                    }
                });
            },
            batchDeposit(item) {
                this.reviewDialog.subtitle = '是否批复';
                this.reviewDialog.show = true;
                this.reviewDialog.first = false;
                this.reviewDialog.data = {
                    id: item.id,
                    status: 4,
                    accoutantRemark: undefined
                };
            },
            firstBatchDeposit(item) {
                this.reviewDialog.first = true;
                this.reviewDialog.subtitle = '是否首批';
                this.reviewDialog.show = true;
                this.reviewDialog.data = {
                    id: item.id,
                    status: 3,
                    accoutantRemark: undefined
                };
            },
            confirmReview(b) {
                let api = depositApi.addIncomeDepositApplyByStaff;
                if (this.reviewDialog.first) {
                    this.reviewDialog.data.status = b === true ? 2 : 3;
                } else {
                    api = depositApi.ApplyAgreeByAccount;
                    this.reviewDialog.data.status = b === true ? 5 : 4;
                }
                this.loading = true;
                api(this.reviewDialog.data).then(res => {
                    this.$util.handelHttpResponseResult(res, true).then(() => {
                        this.reviewDialog.show = false;
                        this.getData();
                    });
                }).finally(() => this.loading = false);
            }
        },
        mounted() {
            this.query.storeId = this.shop.id;
            this.getData();
            this.getUserLevel();
        },
        computed: {
            ...mapGetters(['shop'])
        },
        filters: {
            statusFilter(v) {
                switch (v) {
                    case 1:
                        return '申请中';
                    case 2:
                        return '首批通过';
                    case 3:
                        return '首批拒绝';
                    case 4:
                        return '复批拒绝';
                    case 5:
                        return '复批同意';
                }
            }
        }
    };
</script>

<style scoped>

</style>
