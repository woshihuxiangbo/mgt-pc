<!-- 运营经理后台首页 -->
<template>
    <div class="manager main-container kd-page-master kd-flex">
        <div class="header">
            <el-button @click="addShop" v-if="$util.checkPermission('store',['c']) && $util.checkRole(['1']) === false">
                添加门店
            </el-button>
            <p>您当前管理{{count}}家店铺</p>
        </div>
        <br>
        <!-- 搜索 -->
        <div class="search">
            <el-form ref="form" :model="query" inline>
                <el-form-item label="店铺名称">
                    <el-input v-model="query.storeName"/>
                </el-form-item>
                <el-form-item label="负责人姓名">
                    <el-input v-model="query.managerName"/>
                </el-form-item>
                <el-form-item label="负责人电话">
                    <el-input v-model="query.managerMobile"></el-input>
                </el-form-item>
                <el-form-item label="门店状态">
                    <el-select v-model="query.disabled" :value="query.disabled">
                        <el-option label="全部" :value="undefined"></el-option>
                        <el-option label="启用" :value="false"></el-option>
                        <el-option label="禁用" :value="true"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getData">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="shopMsg kd-flex-item kd-flex scrollbar">
            <div v-for="item in list" :key="item.id" class="kd-flex-item" @click="gotoHome(item)">
                <p class="title">{{item.storeName}}</p>
                <p>{{item.addr}}</p>
                <p>{{item.ownerName}} &nbsp;&nbsp; {{item.mobile}}</p>
                <p>
                    <span>
                        <i>今日营业额：</i>
                        <i class="num">{{item.todayAmount | priceFormat}}</i>
                    </span>
                    <span>
                        <i>今日毛利润：</i><i class="num">{{item.todayBenefit | priceFormat}}</i>
                    </span>
                </p>
                <p>
                    <span>
                        <i>订单总数：</i><i class="num">{{item.orderCount}}</i>
                    </span>
                    <span>
                        <i>会员总数：</i><i class="num">{{item.lv10Count}}</i>
                    </span>
                </p>
                <p>粉丝总数 &nbsp;&nbsp;<i class="red">{{item.fanCount}}</i></p>
                <!--<p>-->
                <!--<i class="pop" @click="gotoPage(item)">编辑店铺</i>-->
                <!--<i class="bar">&nbsp;&nbsp;|&nbsp;&nbsp;</i>-->
                <!--<i class="pop">更换负责人</i>-->
                <!--</p>-->
            </div>
        </div>
    </div>
</template>

<script>
    import api from '@/common/apis/statistics';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                loading: false,
                list: [],
                query: {
                    managerId: undefined,
                    managerName: undefined,
                    managerMobile: undefined,
                    storeName: undefined,
                    disabled: undefined
                },
                count: 0
            };
        },
        methods: {
            getData() {
                this.loading = true;
                api.managerStatistics(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.list = data.content;
                        this.count = data['店铺数量'];
                    });
                }).finally(() => this.loading = false);
            },
            addShop() {
                this.$router.push({name: 'ShopAdd'});
            },
            gotoHome(item) {
                this.$store.dispatch('updateShop', {id: item.storeId, name: item.storeName});
                this.$router.push({name: 'Home', query: {id: item.storeId}});
            }
        },
        mounted() {
            if (this.$route.query.managerId !== undefined) {
                this.query.managerId = this.$route.query.managerId;
            } else {
                this.query.managerId = this.user.managerId;
            }
            this.getData();
        },
        computed: {
            ...mapGetters(['user'])
        }
    };
</script>
<style lang="scss" scoped>
    .header {
        height: 40px;

        .el-button {
            width: 120px;
            height: 40px;
        }

        span {
            color: #333333;
        }
    }

    .search {
        overflow: hidden;
        box-sizing: border-box;

        div.sea {
            margin-top: 30px;
            width: 33.33%;
            float: left;

            .el-input {
                width: 60%;
            }
        }

        .screen {
            float: left;
            width: 100%;
            height: 40px;
            text-align: right;
            margin: 20px 0;

            .el-button {
                width: 120px;
                height: 40px;
                text-align: center;
                margin-right: 20px;
            }

            span {
                color: #a0bce7;
                font-size: 20px;
            }
        }
    }

    // 店铺信息
    .shopMsg {
        overflow-y: auto;
        flex-wrap: wrap;
        flex-direction: row;
        cursor: pointer ;

        > div {
            margin: 0 1% 15px 0;
            flex: 0 0 32%;
            border: 1px solid #666;

            > p {
                /*height: 58px;*/
                border-bottom: 1px solid #666;
                text-align: center;
                font-size: 18px;
                color: #666666;
                line-height: 58px;

                > span {
                    width: 50%;
                    float: left;
                    height: 58px;
                    box-sizing: border-box;

                    i {
                        font-style: normal;
                        font-size: 18px;
                    }

                    i.num {
                        color: #ff0000;
                    }
                }

                > span:nth-of-type(1) {
                    border-right: 1px solid #666;
                }

                > i {
                    font-style: normal;
                    color: #ff0000;
                }

                > i.pop {
                    font-size: 18px;
                    letter-spacing: 0;
                    color: #a0bce7;
                    cursor: pointer;
                }

                > i.bar {
                    color: #a0bce7;
                }
            }

            > p.title {
                height: 58px;
                background-color: #c8c8c8;
                border-bottom: solid 1px #666666;
                text-align: center;
                line-height: 58px;
                font-size: 22px;
                font-weight: 600;
                text-wrap: normal;
                text-overflow: ellipsis;
                overflow: hidden;
                color: #333333;
            }
        }
    }

    .page {
        text-align: center;
    }
</style>
