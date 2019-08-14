<!-- 运营后台首页 -->
<template>
    <div class="defaultHome" v-loading="loading">
        <p style="display: flex; padding-bottom: 10px">
            <breadcrumb :options="['系统管理', '数据统计']" style="flex: 1"/>
            <el-button type="primary" style="flex: 0" size="mini" @click="exportData">导出</el-button>
        </p>
        <div class="topLeft">
            <div @click="gotoToDayOrder" class="md-pointer">
                <p class="num">{{data['今日订单数'] | defaultData}}</p>
                <p class="name">今日订单数</p>
            </div>
            <div class="left">
                <p class="num">{{$util.priceFormat(data['今日订单总金额'])}}</p>
                <p class="name">今日订单总金额</p>
            </div>
            <div class="left md-pointer" @click="sendExpressOrder">
                <p class="num">{{data['待发货订单'] | defaultData}}</p>
                <p class="name">待发货订单</p>
            </div>
        </div>
        <div class="topCenter">
            <div class="left md-pointer" @click="gotoItemPage">
                <p class="num">{{data['今日上架商品'] | defaultData}}</p>
                <p class="name">今日上架商品</p>
            </div>
        </div>
        <div class="topRight-fy">
            <div class="left-fy">
                <p class="num">{{data['今日返佣金额'] | defaultData}}</p>
                <p class="name">今日返佣金额</p>
            </div>
            <div class="left-fy">
                <p class="num">{{data['本月返佣金额'] | defaultData}}</p>
                <p class="name">本月返佣金额</p>
            </div>
        </div>
        <div class="topLeft">
            <div @click="gotoMonthOrder" class="md-pointer">
                <p class="num">{{data['本月订单数'] | defaultData}}</p>
                <p class="name">本月订单数</p>
            </div>
            <div class="left">
                <p class="num">{{$util.priceFormat(data['本月订单总金额'])}}</p>
                <p class="name">本月订单总金额</p>
            </div>
            <div class="left">
                <p class="num">{{data['售后订单'] | defaultData}}</p>
                <p class="name">售后订单</p>
            </div>
        </div>
        <div class="topCenter">
            <div class="left">
                <p class="num">{{data['今日下架商品'] | defaultData}}</p>
                <p class="name">今日下架商品</p>
            </div>
        </div>
        <div class="bottomLeft">
            <div class=""><p class="num">{{data['今日加入店主'] | defaultData}}</p>
                <p class="name">今日加入{{levels.lv1}}</p></div>
            <div class="left"><p class="num">{{data['今日加入总监'] | defaultData}}</p>
                <p class="name">今日加入{{levels.lv2}}</p></div>
            <div class="left"><p class="num">{{data['今日加入合伙人'] | defaultData}}</p>
                <p class="name">今日加入{{levels.lv3}}</p></div>
            <div class="left"><p class="num">{{$util.priceFormat(data['今日商品毛利润'])}}</p>
                <p class="name">普通商品今日毛利润</p></div>
            <div class="left"><p class="num">{{$util.priceFormat(data['活动商品今日毛利润'])}}</p>
                <p class="name">团购商品今日毛利润</p></div>
            <div class=""><p class="num">{{data['本月加入店主'] | defaultData}}</p>
                <p class="name">本月加入{{levels.lv1}}</p></div>
            <div class="left"><p class="num">{{data['本月加入总监'] | defaultData}}</p>
                <p class="name">本月加入{{levels.lv2}}</p></div>
            <div class="left"><p class="num">{{data['本月加入合伙人'] | defaultData}}</p>
                <p class="name">本月加入{{levels.lv3}}</p></div>
            <div class="left"><p class="num">{{$util.priceFormat(data['本月商品毛利润'])}}</p>
                <p class="name">普通商品本月毛利润</p></div>
            <div class="left"><p class="num">{{$util.priceFormat(data['活动商品本月毛利润'])}}</p>
                <p class="name">团购商品本月毛利润</p></div>
        </div>
        <div class="bottomRight">
            <div>
                <p class="num">{{data['今日访客'] | defaultData}}</p>
                <p class="name">今日{{levels.lv9}}</p>
            </div>
            <div>
                <p class="num">{{data['今日新增会员'] | defaultData}}</p>
                <p class="name">今日新增{{levels.lv10}}</p>
            </div>
            <div>
                <p class="num">{{data['今日新增粉丝数'] | defaultData}}</p>
                <p class="name">今日新增粉丝数</p>
            </div>
            <div>
                <p class="num">{{data['本月访客'] | defaultData}}</p>
                <p class="name">本月{{levels.lv9}}</p>
            </div>
            <div>
                <p class="num">{{data['本月新增会员'] | defaultData}}</p>
                <p class="name">本月新增{{levels.lv10}}</p>
            </div>
            <div>
                <p class="num">{{data['本月新增粉丝数'] | defaultData}}</p>
                <p class="name">本月新增粉丝数</p>
            </div>
            <div>
                <p class="num">{{data['访客总数'] | defaultData}}</p>
                <p class="name">{{levels.lv9}}总数</p>
            </div>
            <div>
                <p class="num">{{data['会员总数'] | defaultData}}</p>
                <p class="name">{{levels.lv10}}总数</p>
            </div>
            <div>
                <p class="num">{{data['粉丝总数'] | defaultData}}</p>
                <p class="name">粉丝总数</p>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '@/common/apis/statistics';
    import {mapGetters} from 'vuex';
    import userApi from '@/common/apis/user';

    export default {
        data() {
            return {
                loading: false,
                data: {},
                query: {
                    storeIds: undefined
                },
                levels: {
                    lv1: '店主',
                    lv2: '总监',
                    lv3: '合伙人',
                    lv9: '访客',
                    lv10: '买家'
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;
                api.mainStatistics(this.query).then(res => {
                    console.info(res.data);
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.data = data;
                    });
                }).finally(() => this.loading = false);
            },
            gotoToDayOrder() {
                let date = new Date();
                let startTime = parseInt(new Date(date.toDateString()).getTime() / 1000);
                let endTime = startTime + 60 * 60 * 24;
                this.$router.push({name: 'OrderRetail', query: {startTime, endTime}});
            },
            sendExpressOrder() {
                this.$router.push({name: 'OrderRetail', query: {orderStatus: '2'}});
            },
            gotoMonthOrder() {
                let date = new Date();
                let endTime = parseInt(new Date(date.toDateString()).getTime() / 1000) + 60 * 60 * 24;
                let startTime = endTime - 60 * 60 * 24 * 30;
                this.$router.push({name: 'OrderRetail', query: {startTime, endTime}});
            },
            afterSaleOrder() {
                this.$router.push({name: 'OrderRetail', query: {orderStatus: '2'}});
            },
            gotoUserListToDay(level) {
                this.$router.push({name: 'UserList', query: {level}});
            },
            gotoUserListToMonth(level) {
                this.$router.push({name: 'UserList', query: {level}});
            },
            gotoItemPage() {
                let date = new Date();
                let startTime = parseInt(new Date(date.toDateString()).getTime() / 1000);
                let endTime = startTime + 60 * 60 * 24;
                this.$router.push({name: 'salesmanGoods', query: {startTime, endTime}});
            },
            getStoreLevel() {
                userApi.getUserLevel(this.query.storeIds.split(',')[0]).then(res => {
                    this.$util.handelHttpResponseResult(res, false, '', false).then(({data}) => {
                        /** @type data [] */
                        for (let key in data) {
                            this.$set(this.levels, key + '', data[key].name);
                        }
                        console.info(this.levels);
                    });
                });
            },
            exportData() {
                this.loading = true;
                api.exportIndex(this.query).then(res => {
                    let fileName = '数据统计 ' + new Date().toLocaleString() + '.xlsx';
                    this.$util.xhrDownloadFileHandel(res.data, fileName);
                }).finally(() => this.loading = false);
            }
        },
        mounted() {
            let id = this.$route.query.id;
            if (!id) {
                this.query.storeIds = this.shop.id;
            } else {
                this.query.storeIds = id;
            }
            this.getData();
            this.getStoreLevel();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        },
        filters: {
            defaultData(v) {
                if (v) return v;
                return 0;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .defaultHome {
        overflow: hidden;
        font-size: 10px;
    }

    .defaultHome .name {
        font-size: 13px !important;
    }

    .defaultHome .num {
        font-size: 18px !important;
        font-weight: bold !important;
    }

    .defaultHome > div > div {
        height: 240px;
        float: left;
        min-height: 36px;
        box-shadow: 0 3px 9px 0 rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        background-color: #FFF;
        text-align: center;
        padding: 0 16px;
        box-sizing: border-box;
    }

    .defaultHome > div > div > p.num {
        font-size: 32px;
        font-weight: normal;
        font-stretch: normal;
        color: #333;
        margin-top: 80px;
    }

    .defaultHome > div > div > p.name {
        font-size: 17px;
        letter-spacing: 0;
        color: #999;
        margin-top: 10px;
    }

    .bottomRight > div > p.num {
        margin-top: 37px !important;
    }

    .topLeft, .bottomLeft, .bottomRight {
        width: 50%;
        float: left;
        overflow: hidden;
        padding-bottom: 15px;
    }

    .topLeft > div {
        width: 32%;

    }

    .topLeft > div.left {
        margin-left: 2%;
    }

    .topCenter {
        width: 33.4%;
        float: left;
        padding-bottom: 15px;
    }

    .topCenter > div {
        width: 97%;
    }

    .topCenter > div.left {
        margin-left: 3%;
    }

    .topRight > div {
        height: 495px !important;
    }

    .topRight-fy,
    .topRight1 {
        width: 16.6%;
        float: right;
        padding-bottom: 15px;
    }

    .topRight > div {
        width: 94%;
    }

    .topRight > div.left {
        margin-left: 6%;
    }

    .bottomLeft > div {
        width: 18.4%;
        margin-bottom: 15px;
    }

    .bottomLeft > div.left {
        margin-left: 2%;
    }

    .bottomRight > div {
        width: 31.3%;
        height: 150px !important;
        margin-left: 2%;
        margin-bottom: 22.5px;
    }

    .topRight-fy {
        display: flex;
        flex-direction: column;

        .left-fy {
            margin: 0 15px;

            &:first-child {
                margin-bottom: 15px;
            }
        }
    }
</style>
