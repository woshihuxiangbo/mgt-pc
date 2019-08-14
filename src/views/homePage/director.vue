<!-- 运营副总监后台首页 -->
<template>
    <div class="main-container kd-page-master kd-flex">
        <div class="header">
            <!--<el-button @click="addShop">添加门店</el-button>-->
            <span>您当前管理{{mfCount}}位运营经理，共{{sCount}}家店铺</span>
        </div>
        <br>
        <div class="shopMsg">
            <div v-for="(item, index) in list" :key="index">
                <p class="title" @click="goto(item)">{{item.managerName}}</p>
                <p v-for="(store, i) in item.stores" :key="store.id" v-if="item.stores !== null && i < 4">
                    <span class="left">{{store.storeName}}</span><span class="right" @click="gotoHome(store)">查看</span>
                </p>
                <p style="border:none;color: #a0bce7;cursor: pointer;" @click="goto(item)"
                   v-show="item.stores && item.stores.length >= 4">查看更多...</p>
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
                shopName: '', //店铺名称
                list: [],
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                query: {
                    directorId: undefined
                },
                mfCount: 0,
                sCount: 0
            };
        },
        methods: {
            getData() {
                this.loading = true;
                api.directorStatistics(this.query.directorId).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        console.info(data);
                        this.mfCount = data['经理数量'];
                        this.sCount = data['店铺数量'];
                        this.list = data.content;
                        console.info(this.list)
                    });
                }).finally(() => this.loading = false);
            },
            onSubmit() {

            },
            addShop() {
                this.$router.push({name: 'ShopAdd'});
            },
            goto(item) {
                this.$router.push({name: 'Manager', query: {managerId: item.managerId}});
            },
            gotoHome(s) {
                this.$store.dispatch('updateShop', {id: s.storeId, name: s.storeName});
                this.$router.push({name: 'Home', query: {id: s.storeId}});
            }
        },
        mounted() {
            if (this.$route.query.id !== undefined) {
                this.query.directorId = this.$route.query.id;
            } else {
                this.query.directorId = this.user.managerId;
            }
            this.getData();
        },
        computed: {
            ...mapGetters({user: 'user'})
        }
    };
</script>
<style lang="scss" scoped>
    .header {
        height: 40px;

        .el-button {
            width: 120px;
            height: 40px;
            margin-right: 20px;
        }

        span {
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
                    line-height: 58px;
                    text-align: left;
                    box-sizing: border-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

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
                font-size: 22px;
                font-weight: 600;
                letter-spacing: 0;
                cursor: pointer;
                color: #333333;
            }
        }
    }

    .page {
        text-align: center;
    }
</style>
