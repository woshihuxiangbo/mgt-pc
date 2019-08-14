<template>
    <div class="article-category-list kd-page-master kd-main kd-flex" v-loading="loading">
        <breadcrumb :options="['内容管理', '内容列表']"/>
        <div class="main-container kd-flex kd-flex-item">
            <div v-if="$util.checkPermission('content',['c'])" style="padding-bottom: 20px">
                <el-button type="primary" @click="createCategory">添加内容</el-button>
            </div>
            <div class="search">
                <el-form :inline="true" :model="searchParams" @submit.native.prevent="onSearch">
                    <el-form-item label="店铺名称" v-if="role.roleScope !== 2">
                        <el-input v-model="query.storeName"></el-input>
                    </el-form-item>
                    <el-form-item label="内容标题">
                        <el-input v-model="query.title"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker @change="changeDateRange"
                                        v-model="searchParams.createdAt"
                                        type="daterange"
                                        range-separator="至"
                                        value-format="timestamp"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="searchParams.status" @change="changeQueryStatus">
                            <el-option :value="undefined" label="正常"></el-option>
                            <el-option :value="1" label="删除"></el-option>
                            <el-option :value="2" label="禁用"></el-option>
                            <el-option :value="3" label="全部"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文章分类">
                        <article-class-cascader v-model="searchParams.classId" @change="onClassChange"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table border :data="tableData" class="kd-flex-item" height="100%">
                <el-table-column align="center" label="店铺名称" prop="storeName"/>
                <el-table-column align="left" resizable label="内容标题" prop="title" min-width="150px"/>
                <el-table-column align="center" label="内容栏目" prop="className"/>
                <el-table-column align="center" label="点击数" prop="viewCount"/>
                <!--<el-table-column align="center" label="必读时间(秒)" prop="keepTime"/>-->
                <!--<el-table-column align="center" label="赠送礼品" prop="giftName"/>-->
                <el-table-column align="center" label="显示时间">
                    <template slot-scope="scope">
                        {{scope.row.showTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="排序ID" prop="sortId"/>
                <el-table-column align="center" label="创建时间">
                    <template slot-scope="scope">
                        {{new Date(parseInt(scope.row.createTime * 1000)).format('yyyy-MM-dd HH:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column v-if="$util.checkPermission('content',['u', 'd'])" align="center" label="管理" width="150px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editCategory(scope.row)" v-if="$util.checkPermission('content',[ 'u'])">编辑</el-button>
                        <el-button type="text" @click="switchArticleDeleted(scope.row)" v-if="$util.checkPermission('content',[ 'd'])">
                            {{scope.row.deleteTime ? '恢复' : '删除'}}
                        </el-button>
                        <el-button type="text" @click="switchArticleDisabled(scope.row)" v-if="$util.checkPermission('content',[ 'd'])">
                            {{scope.row.disabled ? '启用' : '禁用'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    @current-change="pageChange"
                    style="margin-top: 10px"
                    :current-page.sync="query.page"
                    :page-size="query.pageSize"
                    layout="total, ->, prev, pager, next, jumper"
                    :total="page.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from "@/components/widget/breadcrumb";
    import articleApi from '@/common/apis/article';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import articleClassApi from '@/common/apis/articleClass';
    import {mapGetters} from 'vuex';
    import ArticleClassCascader from "@/components/selector/ArticleClassCascader";

    export default {
        components: {ArticleClassCascader, Breadcrumb},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                searchParams: {
                    name: undefined,
                    createdAt: undefined,
                    status: undefined,
                    category: undefined
                },
                tableData: [],
                page: {
                    size: 20,
                    current: 1,
                    total: 0
                },
                query: {
                    storeName: undefined,
                    title: undefined,
                    classId: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    page: 1,
                    pageSize: 20,
                    sortOrder: 'id',
                    sortBy: 'asc',
                    disabled: 0,
                    deleted: 0
                },
                categoryList: []
            }
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                articleApi.getList(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(data => {
                        this.tableData = data.data.rows;
                        this.page.total = data.data.rowCount;
                    });
                }).finally(() => this.loading = false);
            },
            createCategory() {
                this.$router.push({name: 'ArticleAdd'})
            },
            editCategory(category) {
                this.$router.push({name: 'ArticleEdit', params: {id: category.id}})
            },
            onSearch() {
                this.getData();
            },
            getClassListData(val) {
                this.getCategoryList(val);
            },
            getCategoryList(name) {
                articleClassApi.list({name, column: 'id,name', storeId: this.shop.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(data => {
                        this.categoryList = data.data.rows;
                    });
                })
            },
            switchArticleDeleted(item) {
                this.$util.actionConfirm('是否' + (item.deleteTime ? '恢复' : '删除') + '此文章?').then(() => {
                    this.loading = true;
                    articleApi.deleted(item.id).then(res => {
                        this.$util.handelHttpResponseResult(res).then(() => {
                            this.getData();
                        })
                    }).finally(() => this.loading = false);
                })
            },
            switchArticleDisabled(item) {
                this.$util.actionConfirm('是否' + (item.disabled ? '启用' : '禁用') + '此文章?').then(() => {
                    this.loading = true;
                    articleApi.disabled(item.id).then(res => {
                        this.$util.handelHttpResponseResult(res).then(() => {
                            this.getData();
                        })
                    }).finally(() => this.loading = false);
                })
            },
            pageChange() {
                this.getData();
            },
            onClassChange (classId) {
                this.query.classId = classId;
            }
        },
        mounted() {
            this.getData();
            this.getCategoryList();
        },
        computed: {
            ...mapGetters({shop: "shop", role: 'role'})
        }
    }
</script>

<style scoped lang="scss">
    .article-category-list {

    }
</style>