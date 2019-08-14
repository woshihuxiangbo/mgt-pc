<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:15:31
 * @LastEditTime: 2019-08-12 16:03:07
 * @LastEditors: Please set LastEditors
 -->
<template>
    <div class="user-list kd-flex" v-loading="loading">
        <breadcrumb :options="['用户管理', '用户列表']"/>
        <el-container class="kd-flex-item kd-flex">
            <el-form inline :model="query" @submit.native.prevent="onSearch" style="padding-bottom: 20px;">

                <el-form-item label="用户ID">
                    <el-input v-model="query.userId" placeholder="精确匹配"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input v-model="query.nickname" placeholder="模糊匹配"></el-input>
                </el-form-item>

                <!--v-if="role.roleScope !== 2 && shop.id === '0'"-->
                <el-form-item label="店铺名称">
                    <el-input v-model="query.storeName" placeholder="模糊匹配"></el-input>
                </el-form-item>

                <el-form-item label="用户手机">
                    <el-input v-model="query.mobile" placeholder="精确匹配"></el-input>
                </el-form-item>

                <!--<el-form-item label="店铺手机号" v-if="role.roleScope !== 2  && shop.id === '0'">-->
                <!--<el-input v-model="query.storeMobile"></el-input>-->
                <!--</el-form-item>-->

                <el-form-item label="用户角色">
                    <!--is-complete-->
                    <lv-selector v-model="query.level"/>
                </el-form-item>
                <br>
                <el-form-item label="加入时间">
                    <el-date-picker type="daterange"
                                    range-separator="至"
                                    value-format="timestamp"
                                    start-placeholder="开始日期"
                                    v-model="time_1"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活跃时间" style="margin-left: 60px;">
                    <el-date-picker type="daterange"
                                    range-separator="至"
                                    value-format="timestamp"
                                    v-model="time_2"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>

                <!--                <el-form-item label="状态">-->
                <!--                    <status-selector @change="changeQueryStatus" v-model="status" size="small"/>-->
                <!--                </el-form-item>-->
                <el-form-item style="margin-left: 50px">
                    <!--type="success"-->
                    <el-button type="primary" native-type="submit">过滤</el-button>
                    <!--<el-button type="primary" @click.native.stop="clearSearchParams">清除搜索条件</el-button>-->
                    <el-button type="success" @click="exportUser">导出</el-button>
                </el-form-item>
            </el-form>


            <el-table border :data="table.data" ref="multipleTable" class="kd-flex-item" height="100%">
                <el-table-column prop="avatar" label="头像" width="70" fixed>
                    <template slot-scope="scope">
                        <img :src="scope.row.header|imgSrc" alt="" class="table-avatar">
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="nickname" label="用户昵称" width="110" fixed/>
                <el-table-column align="center" prop="userId" label="用户ID" width="105"/>
                <el-table-column align="center" prop="level" label="角色" width="70"/>
                <el-table-column align="center" prop="mobile" label="手机号" width="120px"/>


                <!--v-if="role.roleScope !== 2"-->
                <el-table-column align="center" prop="storeName" label="所属店铺" width="100px"/>

                <el-table-column align="center" prop="personStoreName" label="会员店铺" width="100px"/>
                <el-table-column align="center" prop="parentNickname" label="上级昵称" width="110px"/>
                <el-table-column align="center" prop="teamMount" label="下级总数量" width="75px"/>

                <el-table-column align="center" prop="seniorTeamMount" label="下级付费会员数量" width="80px"/>
                <el-table-column align="center" prop="totalMoney" label="团队消费总额" width="130px">
                    <template slot-scope="scope">
                        ￥{{$util.priceFormat(scope.row.totalMoney)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="buyAmount" label="本人消费总额" width="130px">
                    <template slot-scope="scope">
                        ￥{{$util.priceFormat(scope.row.buyAmount)}}
                    </template>
                </el-table-column>

                <el-table-column align="center" prop="incomeTotal" label="返佣金额" width="110px">
                    <template slot-scope="scope">
                        <el-button type="text" @click='goReturnMoney(scope.row)'>￥{{$util.priceFormat(scope.row.incomeTotal)}}</el-button>
                    </template>
                </el-table-column>

                <el-table-column align="center" prop="buyLastDatetime" width="100px" label="加入时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="buyLastDatetime" width="105px" label="最后访问时间">
                    <template slot-scope="scope">
                        {{scope.row.accessTime | dateFilter}}
                    </template>
                </el-table-column>

                <!--<el-table-column align="center" prop="buyLastDatetime" width="150" label="管理">-->

                <!--</el-table-column>-->


                <!--<el-table-column align="center" label="交易总金额">-->
                <!--<template slot-scope="scope">-->
                <!--￥{{$util.priceFormat(scope.row.buyAmount)}}-->
                <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column align="center" prop="buyCount" label="交易次数"/>-->
                <!--<el-table-column align="center" prop="incomeTotal" label="收益金额"/>-->
                <!--                <el-table-column align="center" prop="buyLastDatetime" label="最后交易时间">-->
                <!--                    <template slot-scope="scope">-->
                <!--                        {{scope.row.createTime | dateFilter}}-->
                <!--                    </template>-->
                <!--                </el-table-column>-->


                <!--<el-table-column label="状态" align="center" width="80">-->
                <!--<template slot-scope="scope">-->
                <!--{{scope.row | statusFilter}}-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column align="center" fixed="right" label="管理">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editUser(scope.row)" v-if="$util.checkPermission('user',['u']) ">
                            编辑
                        </el-button>
                        <el-button type="text" @click="showUserRelation(scope.row)">关系</el-button>
                        <br>
                        <!--@click="$router.push({name: 'OrderRetail', query: {userId: scope.row.userId}})"-->
                        <el-button type="text" disabled>赠送</el-button>

                        <!--<el-button type="text" @click="switchUserDeleted(scope.row)">-->
                        <!--{{scope.row.deleteTime ? '恢复' : '删除'}}-->
                        <!--</el-button>-->
                        <el-button type="text"
                                   @click="switchUserDisabled({userId:scope.row.userId,disabled:scope.row.disabled})"
                                   style="color: #f56c6c;">
                            {{scope.row.disabled ? '启用' : '禁用'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="mp-page">
                <div class="total">共 {{table.page.total}} 人</div>
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
        </el-container>
    </div>
</template>

<script>
    import Breadcrumb from '@/components/widget/breadcrumb';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';
    import StoreSelector from '@/components/selector/StoreSelector';
    import RegionSelector from '@/components/selector/RegionSelector';
    import StatusSelector from '@/components/selector/StatusSelector';
    import api from '@/common/apis/user';
    import {mapGetters} from 'vuex';
    import LvSelector from '@/components/selector/LvSelector';

    export default {
        components: {LvSelector, StatusSelector, RegionSelector, StoreSelector, Breadcrumb},
        mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
        data() {
            return {
                loading: false,
                status: undefined,
                time_1: undefined,
                time_2: undefined,
                query: {
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
                    pageSize: 20,
                    storeId: ''
                },
                levels: []
            };
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                if (this.time_1) {
                    this.query.createTimeStart = Math.floor(this.time_1[0] / 1000);
                    this.query.createTimeEnd = Math.floor(this.time_1[1] / 1000);
                }
                if (this.time_2) {
                    this.query.accessTimeStart = Math.floor(this.time_2[0] / 1000);
                    this.query.accessTimeEnd = Math.floor(this.time_2[1] / 1000);
                }

                api.getUserList(this.query).then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.list;
                        this.table.page.total = data.total;
                    });
                }).finally(() => this.loading = false);
            },
            onSearch() {
                this.getData();
            },
            clearSearchParams() {
                this.status = undefined;
                this.query.userId = undefined;
                this.query.nickname = undefined;
                this.query.storeName = undefined;
                this.query.mobile = undefined;
                this.query.level = undefined;
                this.query.createTimeStart = undefined;
                this.query.createTimeEnd = undefined;
                this.query.accessTimeStart = undefined;
                this.query.accessTimeEnd = undefined;

                this.getData();
            },
            editUser(user) {
                if (user.userId === undefined) return this.$message.error('无法处理此用户 id无法找到');
                this.$router.push({name: 'UserEdit', params: {id: user.userId}});
            },
            showUserRelation(item) {
                if (item.userId === undefined) return this.$message.error('无法处理此用户 id无法找到');
                this.$router.push({
                    name: 'RelationList',
                    // params : item
                    query: item
                });
            },
            getStoreLevel() {
                api.getUserLevel(this.shop.id).then(res => {
                    this.$util.handelHttpResponseResult(res, false, '').then(({data}) => {
                        this.lvConfig = data;
                    });
                });
            },
            exportUser() {
                this.loading = true;
                let params = this.$util.deepClone(this.query);
                params.storeId = this.shop.id;
                delete params.pageNum;
                delete params.pageSize;
                api.exportUserList(params).then(res => {
                    let fileName = '用户列表 ' + new Date().toLocaleString() + '.xlsx';
                    this.$util.xhrDownloadFileHandel(res.data, fileName);
                }).finally(() => this.loading = false);
            },
            //禁用用户
            switchUserDisabled(e) {
                this.$alert(e.disabled ? '启用该用户' : '禁用该用户', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        if (action == 'confirm') {
                            api.userDisabled({
                                id: e.userId,
                                disabled: !e.disabled,
                                storeId: this.shop.id
                            }).then((res) => {
                                this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                                    for (let i = 0; i < this.table.data.length; i++) {
                                        if (this.table.data[i].userId == e.userId) {
                                            this.table.data[i].disabled = !e.disabled;
                                            this.$message({
                                                type: 'success',
                                                message: `操作成功`
                                            });
                                            return;
                                        }
                                    }
                                });
                            }).finally(() => this.loading = false);


                        }


                    }
                })


            },
            // 跳转佣金列表
            goReturnMoney(row){
                this.$router.push({ name: 'returnMoney', query: row})

            },
        },
        mounted() {
            let query = this.$util.conversionRouterParamsToInteger(this.$route.query, ['pageNum', 'pageSize']);
            this.query = Object.assign({}, this.query, query);
            this.getData();
            this.getStoreLevel();
        },
        computed: {
            ...mapGetters({shop: 'shop', role: 'role'})
        },
        filters: {}
    };
</script>
<style lang="scss">
    .user-list {
        .el-form-item__label {
            width: 70px;
            text-align: right;
        }

    }

</style>
<style scoped lang="scss">
    .mp-page {
        display: flex;

        .total {
            flex: 1;
            line-height: 42px;
            font-size: 14px;
        }
    }

    .user-list {
        height: 100%;

        .el-container {
            background-color: white;
            padding: 20px;
            flex-direction: column;

            .search-action {
                text-align: right;
                padding: 0 0 25px;
            }

            .table-avatar {
                width: 50px;
                height: 50px;
            }

            .block {
                display: flex;

                .table-select-action {
                    flex: 1;
                    padding: 10px;
                }

                .el-pagination {
                    padding-top: 15px;
                }
            }
        }
    }
</style>
