<template>
    <div class="manager kd-flex kd-page-master" v-loading="loading">
        <div class="main-container kd-flex-item">
            <div class="header">
                <span>您当前管理 {{count}}运营总监 {{mCount}}运营副总监 {{mfCount}}位运营经理，共{{sCount}}家店铺</span>
            </div>
            <div class="shopMsg">
                <div v-for="item in list" :key="item.id">
                    <p class="title md-pointer" @click="gotoInspectorPage(item)">{{item.name}}</p>
                    <p v-for="(m, i) in item.Directors" :key="i" @click="gotoDirectorPage(m)" v-if="i <= 4">
                        <span class="left">{{m.name}}</span><span class="right">查看数据</span>
                    </p>
                    <p @click="gotoInspectorPage(item)" class="md-pointer" v-show="item.Directors > 4">查看更多...</p>
                </div>
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
                form: {
                    name: undefined,
                    region: undefined,
                    date1: undefined,
                    date2: undefined,
                    delivery: undefined,
                    type: undefined,
                    resource: undefined,
                    desc: undefined
                },
                count: 0,
                mCount: 0,
                mfCount: 0,
                sCount: 0
            }
        },
        methods: {
            getData() {
                if (this.role.roleID === '1') {
                    this.getAdminData();
                }
            },
            getAdminData() {
                this.loading = true;
                api.adminStatistics().then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        console.info(data);
                        this.list = data.content;
                        this.count = data['运营总监数量'];
                        this.mCount = data['运营副总监数量'];
                        this.mfCount = data['运营经理数量'];
                        this.sCount = data['店铺数量'];
                    });
                }).finally(() => this.loading = false);
            },
            gotoInspectorPage(item) {
                this.$router.push({name: 'Inspector', query: {id: item.id}})
            },
            addShop() {
                this.$router.push({name: 'ShopAdd'});
            },
            gotoDirectorPage(i) {
                this.$router.push({name: 'Director', query: {id: i.id}});
            }
        },
        computed: {
            ...mapGetters({shop: 'shop', user: 'user', role: 'role'})
        },
        mounted() {
            this.getData();
        }
    }
</script>
<style lang="scss" scoped>
    .shopMsg {
        margin-top: 10px;
    }

    .header {
        height: 40px;

        .el-button {
            width: 120px;
            height: 40px;
            margin-right: 20px;
            font-family: MicrosoftYaHei;
        }

        span {
            font-family: MicrosoftYaHei;
            font-size: 20px;
            color: #333333;
        }
    }

    .search {
        overflow: hidden;
        padding: 15px;
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
                font-family: MicrosoftYaHei;
            }

            span {
                color: #a0bce7;
                font-family: MicrosoftYaHei;
                font-size: 20px;
            }
        }
    }

    // 店铺信息
    .shopMsg {
        overflow: hidden;

        > div {
            width: 31%;
            height: 354px;
            border: 1px solid #666;
            margin: 0 1%;
            float: left;
            margin-bottom: 15px;
            box-sizing: border-box;
            padding-top: 1px;

            > p {
                height: 58px;
                border-bottom: 1px solid #666;
                text-align: center;
                font-family: MicrosoftYaHei;
                font-size: 18px;
                color: #666666;
                line-height: 58px;
                padding: 0 30px;
                box-sizing: border-box;

                > span.left {
                    width: 50%;
                    float: left;
                    height: 58px;
                    text-align: left;
                    box-sizing: border-box;
                }

                > span.right {
                    width: 50%;
                    float: left;
                    height: 58px;
                    text-align: right;
                    box-sizing: border-box;
                    color: #a0bce7;
                    cursor: pointer;
                }
            }

            > p.title {
                height: 58px;
                background-color: #c8c8c8;
                border-bottom: solid 1px #666666;
                text-align: center;
                line-height: 58px;
                font-family: MicrosoftYaHei;
                font-size: 22px;
                font-weight: 600;
                letter-spacing: 0px;
                color: #333333;
            }
        }
    }

    .page {
        text-align: center;
    }
</style>
