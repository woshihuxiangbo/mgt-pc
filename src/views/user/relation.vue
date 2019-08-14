<template>
    <div class="relation" v-loading="loading">
        <breadcrumb :options="['用户管理', '用户列表', '关系详情']"/>
        <div class="main-container">
            <el-form inline @submit.native.prevent="getData">
                <el-form-item label="用户ID">
                    <el-input placeholder="精确匹配" v-model="query.subUserId"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input placeholder="模糊匹配" v-model="query.nickname"></el-input>
                </el-form-item>
                <el-form-item label="所属店铺">
                    <el-input placeholder="模糊匹配" v-model="query.storeName"></el-input>
                </el-form-item>
                <el-form-item label="用户手机">
                    <el-input placeholder="精确匹配" v-model="query.mobile"></el-input>
                </el-form-item>
                <el-form-item label="身份">
                    <lv-selector v-model="query.level"/>
                </el-form-item>
                <br>
                <el-form-item label="加入时间">
                    <el-date-picker type="daterange"
                                    v-model="time_1"
                                    range-separator="至"
                                    value-format="timestamp"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活跃时间" style="margin-left: 60px;">
                    <el-date-picker type="daterange"
                                    v-model="time_2"
                                    range-separator="至"
                                    value-format="timestamp"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="margin-left: 50px">
                    <el-button type="primary" native-type="submit">过滤</el-button>
                    <!--<el-button type="success">导出</el-button>-->
                </el-form-item>
            </el-form>


            <div class="head-table">
                <table class="info" width="100%">
                    <tbody>
                    <tr>
                        <td class="title">用户昵称</td>
                        <td class="content">{{userInfo.nickname}}</td>
                        <td class="title">用户ID</td>
                        <td class="content">{{userInfo.userId}}</td>
                        <td class="title">身份</td>
                        <td class="content">{{userInfo.level}}</td>
                        <td class="title">所属店铺</td>
                        <td class="content">{{userInfo.storeName}}</td>
                    </tr>
                    <tr>
                        <td class="title">加入时间</td>
                        <td class="content">{{userInfo.createTime | dateFilter}}</td>
                        <td class="title">加入方式</td>
                        <td class="content"> {{userInfo.jointype}}</td>
                        <td class="title">团队总人数</td>
                        <td class="content">{{userInfo.teamMount}}</td>
                        <td class="title">团队付费会员数</td>
                        <td class="content">{{userInfo.seniorTeamMount}}</td>
                    </tr>
                    </tbody>
                </table>

                <table class="sup" width="100%" style="margin-top: 20px;">
                    <tbody>
                    <tr v-for="(item,index) in supData" :key="index">
                        <td class="title">上级用户头像</td>
                        <td class="content" style="width: 8%;">
                            <img :src="item.header|imgSrc" alt="" height="50px" width="50px">
                        </td>
                        <td class="title">上级用户昵称</td>
                        <td class="content" style="width:10%;">{{item.nickname}}</td>
                        <td class="title">上级用户ID</td>
                        <td class="content" style="width: 13%">{{item.userid}}</td>
                        <td class="title">上级用户身份</td>
                        <td class="content">{{item.levelname}}</td>
                        <td class="title">关联时间</td>
                        <td class="content" style="width: 12.2%">{{item.linktime | dateFilter}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>


            <el-table :data="subData" border style="margin-top: 20px;">
                <el-table-column align="center" label="下级头像" width="80px">
                    <template slot-scope="scope">
                        <img :src="scope.row.header|imgSrc" alt="" height="50px">
                    </template>
                </el-table-column>
                <el-table-column align="center" label="下级用户昵称" prop="nickname" width="150px"/>
                <el-table-column align="center" label="下级ID" prop="userid"/>
                <el-table-column align="center" label="下级身份" prop="levelname" width="100px"/>
                <el-table-column align="center" label="下级手机号" prop="mobile" width="150px"/>
                <el-table-column align="center" label="下级消费金额" prop="buyamunt">
                    <template slot-scope="scope">
                        ￥{{$util.priceFormat(scope.row.buyamunt)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="下级返佣金额" prop="incomeamount">
                    <template slot-scope="scope">
                        ￥{{$util.priceFormat(scope.row.incomeamount)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="加入方式" prop="jointype" width="150px"/>
                <el-table-column align="center" label="加入时间" prop="createtime">
                    <template slot-scope="scope">
                        {{scope.row.createtime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="最近活动时间" prop="accesstime">
                    <template slot-scope="scope">
                        {{scope.row.accesstime | dateFilter}}
                    </template>
                </el-table-column>
            </el-table>

            <div class="mp-page" style="text-align: right;">
                <el-pagination
                    background
                    style="margin-top: 10px"
                    @current-change="onPageCurrentChange"
                    :current-page.sync="query.pageNum"
                    :page-size="query.pageSize"
                    layout="prev, pager, next, jumper"
                    :total="table.page.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '@/common/apis/user';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import {mapGetters} from 'vuex'
    import LvSelector from '@/components/selector/LvSelector';
    import Breadcrumb from '@/components/widget/breadcrumb';

    export default {
        components: {LvSelector, Breadcrumb},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                userInfo: {//用户自己
                    nickname: '',
                    userId: '',
                    level: '',
                    storeName: '',
                    createTime: '',
                    teamMount: '',
                    seniorTeamMount: '',
                    jointype: ''
                },


                supData: [{
                    nickname: '',
                    header: '',
                    levelname: '',
                    userid: ''
                }],

                pageTotal: 1,
                subData: [{
                    header: '',
                    nickname: '',
                    userid: '',
                    levelname: '',
                    mobile: '',
                    buyamunt: '',
                    incomeamount: '',
                    jointype: '',
                    createtime: '',
                    accesstime: ''

                }],
                time_1: undefined,
                time_2: undefined,
                query: {   //査下级参数
                    subUserId: undefined,
                    userId: undefined,
                    nickname: undefined,
                    storeName: undefined,
                    mobile: undefined,
                    level: undefined,
                    createTimeStart: undefined,
                    createTimeEnd: undefined,
                    accessTimeStart: undefined,
                    accessTimeEnd: undefined,
                    pageNum: 1,
                    pageSize: 10,
                    storeId: ''
                },


            }
        },
        methods: {
            getData() {
                this.loading = true;
                if (this.time_1) {
                    this.query.createTimeStart = Math.floor(this.time_1[0] / 1000);
                    this.query.createTimeEnd = Math.floor(this.time_1[1] / 1000);
                }
                if (this.time_2) {
                    this.query.accessTimeStart = Math.floor(this.time_2[0] / 1000);
                    this.query.accessTimeEnd = Math.floor(this.time_2[1] / 1000);
                }
                api.getUserRelation(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        console.info(data);
                        this.userInfo.jointype = data.jointype;
                        this.supData = data.teamInfo;
                        this.subData = data.rows;
                        this.pageTotal = Math.ceil(data.rowCount / this.query.pageSize);
                    });
                }).finally(() => this.loading = false);
            }

        },
        mounted() {
            this.userInfo = this.$route.query;
            this.query.storeId = this.shop.id;
            this.query.userId = this.userInfo.userId;
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    }
</script>

<style lang="scss">
    .relation {
        .el-form-item__label {
            width: 70px;
            text-align: right;
        }
    }

</style>
<style scoped lang="scss">
    .head-table {
        font-size: 14px;
        color: #606266;

        table {
            border-collapse: collapse;
        }

        td {
            border: 1px solid #EBEEF5;
            padding: 12px;
        }

        .title {
            width: 4.5%;
            font-size: 14px;
            color: #909399;
            font-weight: bold;
        }

        .info .content {
            width: 8%;
        }


        .sup {
            .title {
                width: 8.6%;
            }


            td {
                text-align: center;
            }

        }


    }


</style>
