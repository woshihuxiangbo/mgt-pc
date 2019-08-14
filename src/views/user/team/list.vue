<template>
    <div class="kd-page-master kd-flex" v-loading="loading">
        <breadcrumb :options="options"/>
        <div class="kd-flex kd-flex-item main-container">
            <el-form :model="query" inline @submit.native.prevent="getData">
                <el-form-item label="用户昵称">
                    <el-input v-model="query.nickname"/>
                </el-form-item>
                <!--                <el-form-item label="用户ID">-->
                <!--                    <el-input v-model="query.userId"/>-->
                <!--                </el-form-item>-->
                <el-form-item label="用户手机号">
                    <el-input v-model="query.mobile"/>
                </el-form-item>
                <el-form-item label="用户角色">
                    <el-select v-model="query.level" :value="query.level">
                        <el-option label="全部" :value="undefined"/>
                        <el-option v-for="(l,i) in levels" :label="l.label" :value="l.value" :key="i"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="关系角色">
                    <el-select v-model="query.relation" :value="query.relation">
                        <el-option label="全部" :value="undefined"/>
                        <el-option label="直招" :value="1"/>
                        <el-option label="间招" :value="2"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="md-table-h">
                    <div class="md-statistics">
                        <span v-if="count.sumCount !== undefined">当前小程序共有{{count.sumCount}}代理商 (包含直招和间招)</span>
                        <el-button v-if="count.partnerCount !== undefined" disabled>{{levelData.lv3}}
                            {{count.partnerCount}} 人
                        </el-button>
                        <el-button v-if="count.directorCount !== undefined" disabled>{{levelData.lv2}}
                            {{count.directorCount}} 人
                        </el-button>
                        <el-button v-if="count.ownerCount !== undefined" disabled>{{levelData.lv1}} {{count.ownerCount}}
                            人
                        </el-button>
                    </div>
                    <div class="md-action">
                        <el-button type="primary" native-type="submit">搜索</el-button>
                        <el-button type="text" @click="clearQuery">清空搜索条件</el-button>
                    </div>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border height="100%">
                <el-table-column fixed="left" align="center" label="头像" width="80px">
                    <template slot-scope="scope">
                        <a :href="scope.row.header | imgSrc" target="_blank">
                            <img :src="scope.row.header | imgSrc" alt="" height="45px">
                        </a>
                    </template>
                </el-table-column>
                <el-table-column fixed="left" align="center" label="用户昵称" prop="nickname" width="200px"/>
                <el-table-column align="center" label="用户ID" prop="userid" width="200px"/>
                <el-table-column align="center" label="用户身份" prop="level"/>
                <el-table-column align="center" label="用户手机号" prop="mobile" width="150px"/>
                <el-table-column align="center" label="购买总金额" width="100px">
                    <template slot-scope="scope">
                        {{$util.priceFormat(scope.row.buyamount)}}
                    </template>
                </el-table-column>
                <!--                <el-table-column align="center" label="最后购买"></el-table-column>-->
                <el-table-column align="center" label="购买次数" prop="buycount"/>
                <el-table-column align="center" label="关系角色">
                    <template slot-scope="scope">
                        {{scope.row.n === 1 ? '直招' : '间招'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="团队人数" prop="teamcount"/>
                <el-table-column align="center" label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" @click="queryUserData(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @current-change="getData"
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
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import userApi from '@/common/apis/user';
    import {mapGetters} from 'vuex';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                options: ['用户管理', '团队关系'],
                query: {
                    nickname: undefined,
                    userId: undefined,
                    mobile: undefined,
                    level: undefined,
                    relation: undefined,
                    pageSize: 20,
                    pageNum: 1
                },
                count: {
                    directorCount: undefined,
                    ownerCount: undefined,
                    sumCount: undefined,
                    partnerCount: undefined
                },
                levels: [],
                levelData: {
                    lv1: '店主',
                    lv2: '总监',
                    lv3: '合伙人',
                    lv9: '访客',
                    lv10: '买家'
                },
                time: new Date().getTime() + 1000
            };
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                userApi.findUserTeamRelationList(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.count.directorCount = data.directorCount;
                        this.count.ownerCount = data.ownerCount;
                        this.count.sumCount = data.sumCount;
                        this.count.partnerCount = data.partnerCount;
                        this.table.data = data.pageUserTeamRelationList.list;
                        this.table.page.total = data.pageUserTeamRelationList.total;

                        if (data.userName) {
                            this.options = ['用户管理', '团队关系', data.userName];
                            return;
                        }
                        this.options = ['用户管理', '团队关系'];
                    });
                }).finally(() => this.loading = false);
            },
            queryUserData(item) {
                this.$router.push({
                    name: 'RelationList',
                    params: {id: item.userid},
                    query: {roleName: item.level, type: 2}
                });
                // this.query.userId = item.userid;
                // this.query.nickname = undefined;
                // this.getData();
            },
            getStoreLevel() {
                userApi.getUserLevel(this.shop.id).then(res => {
                    this.$util.handelHttpResponseResult(res, false, '').then(({data}) => {
                        let list = [];
                        for (let key in data) {
                            this.$set(this.levelData, key + '', data[key].name);
                            switch (key) {
                                case 'lv1':
                                    list.push({
                                        value: '1',
                                        label: data[key].name
                                    });
                                    break;
                                case 'lv2':
                                    list.push({
                                        value: '2',
                                        label: data[key].name
                                    });
                                    break;
                                case 'lv3':
                                    list.push({
                                        value: '3',
                                        label: data[key].name
                                    });
                                    break;
                                case 'lv9':
                                    list.push({
                                        value: '9',
                                        label: data[key].name
                                    });
                                    break;
                                case 'lv10':
                                    list.push({
                                        value: '10',
                                        label: data[key].name
                                    });
                                    break;
                            }
                        }
                        this.levels = list;
                    });
                });
            },
            clearQuery() {
                this.query = {
                    nickname: undefined,
                    userId: undefined,
                    mobile: undefined,
                    level: undefined,
                    relation: undefined,
                    pageSize: 20,
                    pageNum: 1
                };
                this.getData();
            }
        },
        mounted() {
            this.getData();
            this.getStoreLevel();
        },
        watch: {
            $route(v) {
                this.query = this.$util.conversionRouterParamsToInteger(v.query, ['pageNum', 'pageSize']);
                this.$nextTick(() => {
                    this.getData();
                });
            },
            query: {
                handler(v) {
                    if (this.time < new Date().getTime()) {
                        console.info(v);
                        this.$router.push({
                            name: 'UserTeamList',
                            query: {
                                nickname: v.nickname,
                                userId: v.userId,
                                mobile: v.mobile,
                                level: v.level,
                                relation: v.relation,
                                pageSize: 20,
                                pageNum: 1
                            }
                        });
                        this.time = new Date().getTime() + 1000;
                    }
                },
                immediate: true,
                deep: true
            }
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    };
</script>

<style lang="scss">
    .md-table-h {
        .el-form-item__content {
            display: flex;
            width: 100%;
        }
    }
</style>

<style scoped lang="scss">
    .md-table-h {
        width: 100%;
        display: flex;

        > * {

        }

        .md-statistics {
            flex: 1;

            > span {
                padding-right: 10px;
            }

            .el-button {
                color: #2E2E2E !important;
                cursor: default !important;
            }
        }

        .md-action {
            flex: 0 0 200px;
        }
    }
</style>
