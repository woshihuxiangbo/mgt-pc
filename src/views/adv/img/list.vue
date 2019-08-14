<template>
    <div class="main kd-flex" v-loading="loading">
        <breadcrumb :options="['广告管理', '图片列表']"/>
        <div class="container kd-flex-item kd-flex">
            <div class="action" v-if="$util.checkPermission('adv',['c'])">
                <el-button type="primary" @click="onCreate">添加图片</el-button>
            </div>
            <div class="search-container">
                <el-form :inline="true" :model="query" :rules="query_rules" ref="query">
                    <el-form-item prop="imgTitle" label="图片标题:">
                        <el-input type="text" v-model="query.picTitle" style="width: 150px"/>
                    </el-form-item>
                    <el-form-item prop="articleTitle" label="文章标题:">
                        <el-input type="text" v-model="query.articleTitle" style="width: 150px"/>
                    </el-form-item>
                    <el-form-item prop="goodsName" label="商品名称:">
                        <el-input type="text" v-model="query.itemName" style="width: 150px"/>
                    </el-form-item>
                    <el-form-item prop="activityName" label="活动标题:">
                        <el-input type="text" v-model="query.eventTitle" style="width: 150px"/>
                    </el-form-item>
                    <el-form-item prop="videoSrc" label="视频地址:">
                        <el-input type="text" v-model="query.url" style="width: 150px"/>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="query.status" @change="changeQueryStatus" :value="query.status"
                                   style="width: 150px">
                            <el-option :value="undefined" label="正常"></el-option>
                            <el-option :value="2" label="禁用"></el-option>
                            <el-option :value="3" label="全部"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="table.data" border class="kd-flex-item" height="100%">
                <el-table-column prop="id" label="图片ID" width="200" align="center"></el-table-column>
                <el-table-column prop="advName" label="广告名称" align="center"></el-table-column>
                <el-table-column prop="title" label="图片标题" align="center"></el-table-column>
                <el-table-column prop="linkType" label="链接类型" align="center"></el-table-column>
                <el-table-column prop="linkName" label="链接目标" width="180" align="center"></el-table-column>
                <el-table-column prop="sortId" label="排序ID" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">{{scope.row | statusFilter}}</template>
                </el-table-column>
                <el-table-column fixed="right" v-if="$util.checkPermission('adv',['u', 'd'])" label="管理" width="180"
                                 align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="onEdit(scope.row)" v-if="$util.checkPermission('adv',['u'])">编辑</el-button>
                        <el-button
                            type="text"
                            v-if="$util.checkPermission('adv',['d']) && isSaasAdv(scope.row)"
                            @click="switchDeleted(scope.row)"
                        >{{scope.row.deleteTime ? '恢复' : '删除'}}
                        </el-button>
                        <el-button type="text" @click="switchDisabled(scope.row)"
                                   v-if="$util.checkPermission('adv',['d']) && isSaasAdv(scope.row)">{{scope.row.disabled ? '启用' : '禁用'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @current-change="pageChange"
                :current-page.sync="query.page"
                :page-size="query.pageSize"
                layout="total, ->, prev, pager, next, jumper"
                :total="table.page.total"
            ></el-pagination>
        </div>
    </div>
</template>
<style lang="scss" scoped>
</style>
<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';
    import api from '@/common/apis/advImg';
    import {mapGetters} from 'vuex';

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
                    column: 'id,advId,title,imgUrl,sortId,disabled,storeId,articleId,skuId,eventId,externalUrl,articleTitle,eventTitle,itemName,storeName,advName,sortId,linkType,ownerId',
                    name: undefined,
                    id: undefined,
                    page: 1,
                    pageSize: 20,
                    sortOrder: 'sort_id',
                    sortBy: 'desc',
                    disabled: 0,
                    deleted: 0,
                    storeId: 0
                },
                query_rules: {},
                types: {},
                //  0 无 1 文章 2商品 3活动 4 视频地址
                linkTypes: [
                    {
                        type: '无',
                        target: '-'
                    },
                    {
                        type: '文章',
                        target: 'articleTitle'
                    },
                    {
                        type: '商品',
                        target: 'itemName'
                    },
                    {
                        type: '活动',
                        target: 'eventTitle'
                    },
                    {
                        type: '视频地址',
                        target: 'externalUrl'
                    }
                ]
                // typeName: '图片',
            };
        },
        mounted() {
            this.query.storeId = this.shop.id;
            this.query.advId = this.$route.params.id;
            this.getData();
        },
        computed: {
            ...mapGetters(['shop', 'role'])
        },
        methods: {
            pageChange() {
                this.getData();
            },
            // 添加
            onCreate() {
                this.$router.push({name: 'advImgAdd', params: {id: this.$route.params.id}});
            },
            // 编辑
            onEdit(item) {
                this.$router.push({name: 'advImgEdit', params: {id: item.id}});
            },
            // 搜索按钮
            onSearch() {
                this.getData();
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
                            let list = data.rows;
                            let linkTypes = this.linkTypes;
                            if (!!list) {
                                list = list.map(item => {
                                    // console
                                    item.sortId = item.sortId || 0;
                                    let linkType = item.linkType || 0;

                                    item.linkType = linkTypes[linkType].type;
                                    item.linkName = item[linkTypes[linkType].target];
                                    return item;
                                });
                            }
                            this.table.data = list;
                            this.table.page.total = data.rowCount;
                        });
                    })
                    .finally(() => (this.loading = false));
            },
            isSaasAdv(item) {
                return !(item.ownerId === '0' && this.role.roleID === '14');
            }
        }
    };
</script>
