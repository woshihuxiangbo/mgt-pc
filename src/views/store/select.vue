<template>
    <div class="select-store kd-page-master kd-flex" v-loading="loading">
        <breadcrumb :options="['选择店铺']"/>
        <div class="main-container kd-flex">
            <div class="search">
                <el-form :model="query" inline @submit.native.prevent="getData">
                    <el-form-item label="店铺名">
                        <el-input v-model="query.name"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" native-type="submit">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-pagination background @current-change="getData"
                                       :current-page.sync="query.page" :page-size="query.pageSize"
                                       layout="total, ->, prev, pager, next, jumper" :total="total"/>
                    </el-form-item>
                </el-form>
            </div>
            <div class="kd-flex-item md-store">
                <div class="md-list" v-for="(s, i) in stores" :key="i">
                    <div class="storeLogo" @click="onSelectStore(s)">
                        <img :src="s.storeLogo | imgSrc" alt="">
                        <p>{{s.name}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .select-store {
        width: 100%;
        box-sizing: border-box;

        .md-store {
            display: flex;
            flex-wrap: wrap;

            .md-list {
                padding-right: 10px;
                padding-top: 10px;
            }
        }
    }

    .storeLogo {
        text-align: center;
        max-width: 85px;
        max-height: 115px;

        img {
            width: 75px;
            height: 75px;
            display: block;
            background-color: #E3E3E3;
            border-radius: 50px;
        }

        p {
            line-height: 30px;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            text-wrap: normal;
            height: 30px;
            width: 85px;
            display: block;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
        }
    }
</style>

<script>
    import api from '@/common/apis/store';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                loading: false,
                stores: [],
                total: 0,
                query: {
                    name: undefined,
                    column: 'id,name,storeLogo',
                    sortBy: 'asc',
                    sortOrder: 'id',
                    page: 1,
                    pageSize: 100
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;
                api.getStoreList(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.stores = data.rows;
                        this.total = data.rowCount;
                    });
                }).finally(() => this.loading = false);
            },
            onSelectStore(s) {
                this.$store.dispatch('updateShop', s);
                // console.info(__.$route);
                if (this.role.roleID === '14') {
                    this.$router.push({name: 'Welcome'});
                    return;
                }
                this.$router.push({name: 'Home', query: {id: s.id}});
            }
        },
        activated() {
            this.getData();
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({user: 'user', role: 'role'})
        }
    };
</script>
