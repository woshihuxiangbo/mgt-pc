<template>
    <div class="main kd-flex" v-loading="loading">
        <breadcrumb :options="['店铺财务']"/>
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
                            <p class="disc">线下支付: ￥{{$util.priceFormat(info['线下收入'])}}</p>
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
                            <p class="disc">{{levels.lv3}}：{{info['合伙人']}}</p>
                            <p class="disc">{{levels.lv2}}：{{info['总监']}}</p>
                            <p class="disc">{{levels.lv1}}：{{info['店主']}}</p>
                            <p class="disc">{{levels.lv10}}：{{info['会员']}}</p>
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
                        <div class="bottom-card">
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
                                <span class="number">￥{{$util.priceFormat(info['预存款总数'])}}</span>
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
                                <span class="number">{{info['可提现金额']}}</span>
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
    import {mapGetters} from "vuex";
    import userApi from '@/common/apis/user';

    export default {
        data() {
            return {
                loading: false,
                searchTime: [],
                query: {
                    startTime: undefined,
                    endTime: undefined,
                    storeId: undefined
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
        created() {
            this.query.storeId = this.shop.id
        },
        mounted() {
            this.getData();
            this.getStoreLevel();
        },
        computed: {
            ...mapGetters(['shop'])
        },
        methods: {
            onCardClick(idx) {
                console.log(idx);
            },
            // 获取数据
            getData(data) {
                this.loading = true
                api
                    .store(this.query)
                    .then((res) => {
                        this.$util.handelHttpResponseResult(res).then((data) => {
                            this.info = data.data
                        });
                    })
                    .finally(() => (this.loading = false));
            },
            // 搜索按钮
            onSearch() {
                if (this.searchTime.length) {
                    let oTime = this.searchTime.map(item => {
                        return item.getTime() / 1000
                    })
                    this.query.startTime = oTime[0]
                    this.query.endTime = oTime[1]
                } else {
                    this.query.startTime = undefined
                    this.query.endTime = undefined
                }
                this.getData();
            },
            getStoreLevel() {
                userApi.getUserLevel(this.shop.id).then(res => {
                    this.$util.handelHttpResponseResult(res, false, '', false).then(({data}) => {
                        /** @type data [] */
                        for (let key in data) {
                            this.$set(this.levels, key + '', data[key].name)
                        }
                        console.info(this.levels)
                    });
                });
            }
        }
    };
</script>
