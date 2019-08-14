<template>
    <div class="main kd-flex" v-loading="loading">
        <breadcrumb :options="['广告管理', '广告列表']"/>

        <div class="container kd-flex-item kd-flex">
            <!-- <div class="action">
                <el-button type="primary" @click="onCreate">添加广告</el-button>
            </div> -->
            <div class="search-container">
                <el-form :inline="true" :model="query" :rules="query_rules" ref="query" v-if="role.roleID !== '14'">
                    <el-form-item prop="id" label="广告ID:">
                        <el-input type="number" v-model="query.id"></el-input>
                    </el-form-item>
                    <el-form-item prop="name" label="广告名称:">
                        <el-input type="text" v-model="query.name"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="状态" prop="status">
                        <el-select v-model="query.status" @change="changeQueryStatus">
                            <el-option :value="undefined" label="正常"></el-option>
                            <el-option :value="1" label="删除"></el-option>
                            <el-option :value="2" label="禁用"></el-option>
                            <el-option :value="3" label="全部"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" @click="onSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="table.data" border class="kd-flex-item" height="100%">
                <el-table-column prop="id" label="ID" width="220" align="center"></el-table-column>
                <el-table-column prop="name" label="广告名称" align="center"></el-table-column>

                <el-table-column prop="ratio" label="宽高" align="center"></el-table-column>
                <!--				<el-table-column prop="displayCount" label="展示图片数" align="center"></el-table-column>-->
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">{{scope.row | statusFilter}}</template>
                </el-table-column>
                <el-table-column fixed="right" label="管理" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="toImglist(scope.row)">图片管理</el-button>
                        <!-- <el-button type="text" @click="onEdit(scope.row)">编辑</el-button> -->
                        <!-- <el-button
                            type="text"
                            @click="switchDeleted(scope.row)"
                        >{{scope.row.deleteTime ? '恢复' : '删除'}}</el-button>
                        <el-button type="text" @click="switchDisabled(scope.row)">{{scope.row.disabled ? '启用' : '禁用'}}</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-if="role.roleID !== '14'"
                           background
                           @current-change="pageChange"
                           style="margin-top: 10px"
                           :current-page.sync="query.page"
                           :page-size="query.pageSize"
                           layout="total, ->, prev, pager, next, jumper"
                           :total="table.page.total"
            ></el-pagination>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .search-button-group {
        min-width: 180px;
        padding-top: 36px;
    }

    .el-col {
        margin: 10px 0;
    }
</style>
<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';
    import api from '@/common/apis/adv';
    import advImageApi from '@/common/apis/advImg';
    import {mapGetters, mapActions} from 'vuex';

    export default {
        mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
        data() {
            return {
                loading: false,
                table: {
                    data: [],
                    page: {
                        total: 0
                    }
                },
                query: {
                    column: 'id,name,note,display_count, disabled,delete_time,ratio,storeId',
                    name: undefined,
                    id: undefined,
                    page: 1,
                    pageSize: 20,
                    sortOrder: 'id',
                    sortBy: 'asc',
                    disabled: 0,
                    deleted: 0,
                    storeId: 0
                },
                query_rules: {},
                typeName: '广告'
            };
        },
        computed: {
            ...mapGetters(['shop', 'role'])
        },
        created() {
            // this.query.storeId = this.shop.id;
        },
        mounted() {
            this.getData();
        },

        methods: {
            ...mapActions(['setImgSize']),
            onSearch() {
                this.getData();
            },
            pageChange() {
                this.getData();
            },
            toImglist(item) {
                let aSize = item.ratio.split(':');
                const size = {
                    width: aSize[0],
                    height: aSize[1]
                };
                this.setImgSize(size);
                console.info(item);
                if (item.id === '3101') {
                    this.getImageList(item.id);
                } else {
                    this.$router.push({name: 'advImgList', params: {id: item.id}});
                }
            },
            onEdit(item) {
                this.$router.push({name: 'advEdit', params: {id: item.id}});
            },
            // 添加
            onCreate() {
                this.$router.push({name: 'advAdd'});
            },
            // 恢复/删除
            switchDeleted(item) {
                this.onDeleted(item, api);
            },
            // 启用/禁用
            switchDisabled(item) {
                this.onDisabled(item, api);
            },
            // 获取数据
            getData() {
                this.loading = true;
                api.list(this.query)
                    .then((res) => {
                        this.$util.handelHttpResponseResult(res).then(({data}) => {
                            if (this.role.roleID === '14') {
                                this.table.data = data.rows.filter((item) => {
                                    return item.id === '1100';
                                });
                                this.table.page.total = 1;
                                return;
                            }
                            this.table.data = data.rows;
                            this.table.page.total = data.rowCount;
                        });
                    })
                    .finally(() => (this.loading = false));
            },
            getImageList(advId) {
                this.loading = true;
                advImageApi.list({
                    column: 'id',
                    storeId: this.shop.id,
                    advId,
                    page: 1,
                    pageSize: 20,
                    sortOrder: 'sortId',
                    sortBy: 'desc',
                    disabled: 2,
                    deleted: 0
                }).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        console.info(data);
                        if (data.rowCount > 0) {
                            let adv = data.rows.pop();
                            this.$router.push({name: 'advImgEdit', params: {id: adv.id}});
                        } else {
                            this.$router.push({name: 'advImgAdd', params: {id: advId}});
                        }
                    });
                }).finally(() => this.loading = false);
            }
        }
    };
</script>
