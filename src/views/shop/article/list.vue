<template>
    <div class="shop-article-list" v-loading="loading">
        <breadcrumb :options="['文章管理', '文章列表']"/>
        <div class="main-container">
            <div class="action">
                <el-button type="primary" @click="createShopArticle">创建文章</el-button>
            </div>
            <div class="search">
                <el-form @submit.native.prevent="onSearch" label-width="40px" inline>
                    <el-form-item label="来源">
                        <el-select v-model="query.storeId">
                            <el-option label="全部" :value="undefined"/>
                            <el-option label="平台" :value="0"/>
                            <el-option label="店铺" :value="1"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="search.status" @change="changeQueryStatus">
                            <el-option :value="undefined" label="正常"></el-option>
                            <el-option :value="1" label="删除"></el-option>
                            <el-option :value="2" label="禁用"></el-option>
                            <el-option :value="3" label="全部"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-select v-model="query.classId" filterable remote :remote-method="getClassListData">
                            <el-option :value="undefined" label="全部"></el-option>
                            <el-option :value="item.id" :label="item.name" v-for="(item, i) in classList" :key="i"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标题">
                        <el-input v-model="query.title"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-table :data="table.data" border height="500px">
                    <el-table-column align="center" label="来源">
                        <template slot-scope="scope">
                            {{scope.row.storeId | storeFilter}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="分类名称" prop="className"/>
                    <el-table-column align="center" label="文章标题" prop="title"/>
                    <el-table-column align="center" label="点击数" prop="viewCount"/>
                    <el-table-column align="center" label="显示时间">
                        <template slot-scope="scope">
                            {{new Date(parseInt(scope.row.showTime * 1000)).format('yyyy-MM-dd HH:mm:ss')}}
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
                    <el-table-column align="center" label="管理">
                        <template slot-scope="scope">
                            <el-button type="text" @click="editShopArticle(scope.row)">编辑</el-button>
                            <el-button type="text" @click="switchArticleDeleted(scope.row)">
                                {{scope.row.deleteTime ? '恢复' : '删除'}}
                            </el-button>
                            <el-button type="text" @click="switchArticleDisabled(scope.row)">
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
                        :total="table.page.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import articleApi from '../../../common/apis/shop/article';
    import articleClassApi from '../../../common/apis/articleClass';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                search: {
                    status: undefined
                },
                table: {
                    data: [],
                    page: {
                        total: 0
                    }
                },
                classList: [],
                query: {
                    storeId: undefined,
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
                }
            }
        },
        methods: {
            getData () {

            },
            onSearch() {
                this.getData();
            },

            getClassListData(val) {
                this.getClassList(val);
            },
            getClassList(name) {
                articleClassApi.getList({name, column: 'id,name'}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(data => {
                        this.classList = data.data.rows;
                    });
                })
            },
            createShopArticle () {
                this.$router.push({name: 'ShopArticleAdd'})
            },
            editShopArticle (item) {
                this.$router.push({name: 'ShopArticleEdit', params: {id: item.id}})
            },
            switchArticleDeleted (item) {
                this.$util.actionConfirm('是否' + (item.deleteTime ? '恢复' : '删除') + '此文章?').then(() => {
                    this.loading = true;
                    articleApi.deleted(item.id).then(res => {
                        this.$util.handelHttpResponseResult(res).then(() => {
                            this.getData();
                        })
                    }).finally(() => this.loading = false);
                })
            },
            switchArticleDisabled (item) {
                this.$util.actionConfirm('是否' + (item.disabled ? '启用' : '禁用') + '此文章?').then(() => {
                    this.loading = true;
                    articleApi.disabled(item.id).then(res => {
                        this.$util.handelHttpResponseResult(res).then(() => {
                            this.getData();
                        })
                    }).finally(() => this.loading = false);
                })
            },
            pageChange () {
                this.getData();
            }
        },
        mounted() {
            this.getData();
            this.getClassList();
        },
        filters: {
            storeFilter (v) {
                if (v > 0) {
                    return '店铺'
                }
                return '平台';
            }
        }
    }
</script>

<style scoped>

</style>