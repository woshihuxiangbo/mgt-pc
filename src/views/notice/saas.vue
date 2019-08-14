<template>
    <div class="main kd-flex" v-loading="loading">
        <breadcrumb :options="['平台财务']"/>
        <div class="container kd-flex-item kd-flex">
            <el-form :inline="true" ref="query">
                <el-form-item label="选择时间">
                    <el-date-picker
                        v-model="searchTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="search" @click="onSearch">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-row :gutter="20" class="kd-flex-item scrollbar">
                <el-col :span="8">
                    <div class="card">
                        <div class="top-card">
                            <div class="title padding">
                                <span class="title-left">总营业收入</span>
                                <span class="title-right right">（单位：元）</span>
                            </div>
                            <div class="content padding">
                                <span class="number">￥{{$util.priceFormat(info['总营业收入'])}}</span>
                            </div>
                        </div>
                        <div class="bottom-card">
                            <p class="disc">线上支付：￥{{$util.priceFormat(info['线上收入'])}}</p>
                            <p class="disc">银行卡支付：￥{{$util.priceFormat(info['线下收入'])}}</p>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="card">
                        <div class="top-card">
                            <div class="title padding">
                                <span class="title-left">总消费订单数</span>
                                <span class="title-right right"></span>
                            </div>
                            <div class="content padding">
                                <span class="number">{{info['总消费订单数']}}</span>
                            </div>
                        </div>
                        <div class="bottom-card">
                            <p class="disc">合伙人：{{info['合伙人']}}</p>
                            <p class="disc">总监：{{info['总监']}}</p>
                            <p class="disc">店主：{{info['店主']}}</p>
                            <p class="disc">会员：{{info['会员']}}</p>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="card">
                        <div class="top-card">
                            <div class="title padding">
                                <span class="title-left">加盟小程序</span>
                                <span class="title-right right"></span>
                            </div>
                            <div class="content padding">
                                <span class="number">{{info['加盟小程序']}}</span>
                            </div>
                        </div>
                        <div class="bottom-card">
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="card">
                        <div class="top-card">
                            <div class="title padding">
                                <span class="title-left">总毛利润</span>
                                <span class="title-right right">（单位：元）</span>
                            </div>
                            <div class="content padding">
                                <span class="number">￥{{$util.priceFormat(info['总毛利润'])}}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="card">
                        <div class="top-card">
                            <div class="title padding">
                                <span class="title-left">预存款总额</span>
                                <span class="title-right right">（单位：元）</span>
                            </div>
                            <div class="content padding">
                                <span class="number">￥{{$util.priceFormat(info['预存款总额'])}}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="card">
                        <div class="top-card">
                            <div class="title padding">
                                <span class="title-left">可提现金额</span>
                                <span class="title-right right">（单位：元）</span>
                            </div>
                            <div class="content padding">
                                <span class="number">￥{{$util.priceFormat(info['可提现金额'])}}</span>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .el-col {
        margin: 10px 0;
    }

    .kd-flex-item {
        overflow-y: auto;
    }

    .card {
        width: 100%;
        border-radius: 5px;
        box-sizing: border-box;
        border: 2px solid #ccc;
        padding: 20px;

        .top-card {
            height: 60px;

            .title-right {
                font-size: 12px;
                color: rgb(34, 34, 34);
                margin-top: 3px;
            }
        }

        .bottom-card {
            height: 78px;
        }

        .number {
            font-weight: 900;
            font-size: 24px;
        }
    }
</style>
<script>
    import api from '@/common/apis/statistics';
    import userApi from '@/common/apis/user';
    import {mapGetters} from "vuex";

    export default {
        data() {
            return {
                loading: false,
                searchTime: [],
                query: {
                    startTime: undefined,
                    endTime: undefined
                },
                info: {},
                levels: {
                    lv1: "店主",
                    lv2: "总监",
                    lv3: "合伙人",
                    lv9: "访客",
                    lv10: "买家",
                }
            };
        },
        mounted() {
            this.getData();
            this.getStoreLevel();
        },
        methods: {
            // 获取数据
            getData() {
                this.loading = true;
                api.saas(this.query).then((res) => {
                    this.$util.handelHttpResponseResult(res).then(({data}) => {
                        this.info = data;
                    });
                }).finally(() => (this.loading = false));
            },
            // 搜索按钮
            onSearch() {
                if (!!this.searchTime) {
                    let oTime = this.searchTime.map(item => {
                        return item.getTime() / 1000;
                    });
                    this.query.startTime = oTime[0];
                    this.query.endTime = oTime[1];
                } else {
                    this.query.startTime = undefined;
                    this.query.endTime = undefined;
                }
                this.getData();
            },
            getStoreLevel() {
                this.loading = true;
                userApi.getUserLevel(this.shop.id).then(res => {
                    this.$util.handelHttpResponseResult(res, false, '', false).then(({data}) => {
                        /** @type data [] */
                        for (let key in data) {
                            this.$set(this.levels, key + '', data[key].name)
                        }
                        console.info(this.levels)
                    });
                }).finally(() => this.loading = false);
            }
        },
        computed: {
            ...mapGetters(['shop'])
        },
    };
</script>
