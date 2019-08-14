<template>
    <div class="article-category-list kd-page-master kd-flex" v-loading="loading">
        <breadcrumb :options="['内容管理', '栏目管理']"/>
        <div class="main-container kd-flex kd-flex-item">
            <div v-if="$util.checkPermission('contentClass',['c'])" style="padding-bottom: 20px">
                <el-button type="primary" @click="createCategory">创建栏目</el-button>
            </div>
            <div class="search">
                <el-form :inline="true" :model="query" @submit.native.prevent="onSearch" inline>
                    <!--<el-form-item label="店铺名称">-->
                    <!--<el-input v-model="query.name"></el-input>-->
                    <!--</el-form-item>-->
                    <el-form-item label="状态">
                        <el-select v-model="selectStatus" @change="changeQueryStatus" :value="selectStatus">
                            <el-option :value="undefined" label="正常"></el-option>
                            <el-option :value="1" label="删除"></el-option>
                            <el-option :value="2" label="禁用"></el-option>
                            <el-option :value="3" label="全部"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table border :data="table.data" height="100%" class="kd-flex-item">
                <el-table-column align="left" label="分类名称" prop="name"/>
                <el-table-column align="center" label="内容数量" prop="articleCount"/>
                <el-table-column align="center" label="排序ID" prop="sortId"/>
                <el-table-column align="center" label="状态" prop="statusDesc">
                    <template slot-scope="scope">
                        {{scope.row | statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column v-if="$util.checkPermission('contentClass',['u', 'd'])" align="center" label="管理">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editCategory(scope.row)"
                                   v-if="$util.checkPermission('contentClass',['u'])">编辑
                        </el-button>
                        <el-button type="text" @click="switchClassDeleted(scope.row)"
                                   v-if="$util.checkPermission('contentClass',['d'])">
                            {{scope.row.deleteTime ? '恢复' : '删除'}}
                        </el-button>
                        <el-button type="text" @click="switchClassDisabled(scope.row)"
                                   v-if="$util.checkPermission('contentClass',['d'])">
                            {{scope.row.disabled ? '启用' : '禁用'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from '@/components/widget/breadcrumb';
    import articleClassApi from '@/common/apis/articleClass';
    import {mapGetters} from 'vuex';
    import tableDataMixins from '@/components/mixins/tableDataMixins';

    export default {
        components: {Breadcrumb},
        mixins: [tableDataMixins],
        data() {
            return {
                loading: true,
                selectDate: undefined,
                selectStatus: undefined,
                query: {
                    name: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    sortOrder: 'id',
                    sortBy: 'asc',
                    disabled: 0,
                    deleted: 0
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                articleClassApi.struct(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (data === null) {
                            this.table.data = [];
                            return;
                        }
                        this.table.data = this.resolveClassData(data);
                    });
                }).catch().finally(() => this.loading = false);
            },
            resolveClassData(data, parentName) {
                let list = [];
                data.forEach((item) => {
                    let obj = item.class;
                    if (parentName !== undefined) {
                        obj.name = parentName + ' / ' + obj.name;
                    }
                    list.push(obj);
                    if (!!item.subClass) {
                        list.push(...this.resolveClassData(item.subClass, obj.name));
                    }
                });
                return list;
            },
            createCategory() {
                this.$router.push({name: 'ArticleCategoryCreate'});
            },
            editCategory(category) {
                this.$router.push({name: 'ArticleCategoryEdit', params: {id: category.id}});
            },
            onSearch() {
                this.getData();
            },
            changeDateRange(date) {
                try {
                    this.query.startTime = parseInt(new Date(date[0]).getTime() / 1000);
                    this.query.endTime = parseInt(new Date(date[1]).getTime() / 1000);
                } catch (e) {
                }
            },
            switchClassDeleted(item) {
                this.$util.actionConfirm('是否' + (item.deleteTime ? '恢复' : '删除') + '此分类?').then(() => {
                    this.loading = true;
                    articleClassApi.deleted({id: item.id}).then(res => {
                        this.$util.handelHttpResponseResult(res).then(() => {
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            },
            switchClassDisabled(item) {
                this.$util.actionConfirm('是否' + (item.disabled ? '启用' : '禁用') + '此分类?').then(() => {
                    this.loading = true;
                    articleClassApi.disabled({id: item.id}).then(res => {
                        this.$util.handelHttpResponseResult(res).then(() => {
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            },
            onSortChange({prop, order}) {
                if (order === null) {
                    this.query.sortOrder = '';
                    this.query.sortBy = '';
                } else {
                    this.query.sortOrder = prop;
                    this.query.sortBy = order.replace('ending', '');
                }
                this.getData();
            }
        },
        mounted() {
            this.getData();
        },
        filters: {
            statusFilter(val) {
                if (val.disabled) {
                    return '已禁用';
                } else if (val.deleteTime) {
                    return '已删除';
                }
                return '正常';
            }
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    };
</script>

<style scoped lang="scss">
    .article-category-list {

    }
</style>
