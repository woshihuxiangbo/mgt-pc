<template>
    <div class="free-gift-list" v-loading="loading">
        <breadcrumb :options="['活动管理', '免费礼品列表']"/>
        <div class="main-container">
            <!--<el-button type="primary" @click="add">创建礼品</el-button>-->
            <el-table :data="article" border>
                <el-table-column align="center" label="文章标题" prop="title"/>
                <el-table-column align="center" label="阅读时常(秒)" prop="keepTime"/>
                <el-table-column align="center" label="阅读数量" prop="viewCount"/>
                <el-table-column v-if="$util.checkPermission('event',['d', 'u'])" align="center" label="管理">
                    <template slot-scope="scope">
                        <el-button type="text" @click="dialogArticle = true" v-if="$util.checkPermission('event',['u'])">选择文章</el-button>
                        <el-button type="text" @click="switchDisabled(scope.row)" v-if="$util.checkPermission('event',['d'])">
                            {{event.disabled ? '启用' : '禁用'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-form :model="query" inline label-width="40px" @submit.native.prevent="getEventItem">
                <el-form-item label="状态">
                    <el-select v-model="status" @change="changeQueryStatus" :value="status">
                        <el-option :value="undefined" label="正常"></el-option>
                        <el-option :value="1" label="删除"></el-option>
                        <el-option :value="2" label="禁用"></el-option>
                        <el-option :value="3" label="全部"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">过滤</el-button>
                    <el-button v-if="$util.checkPermission('event',['c'])" type="primary" @click="showDialog">
                        添加商品
                    </el-button>
                    <el-button type="primary" @click="gotoStatistic" v-if="$util.checkPermission('retailOrder',['l'])">
                        领取记录
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border v-if="event.id !== undefined">
                <el-table-column align="center" label="商品名称" prop="itemName"/>
                <el-table-column align="center" label="阅读时间(秒)">
                    <template slot-scope="scope">
                        {{getRule(scope.row.rule, 'keepTime')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="邮费" prop="eventPrice">
                    <template slot-scope="scope">
                        ￥ {{$util.priceFormat(scope.row.eventPrice)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column v-if="$util.checkPermission('event',['u', 'd'])" align="center" label="管理">
                    <template slot-scope="scope">
                        <el-button type="text" @click="edit(scope.row)" v-if="$util.checkPermission('event',['u'])">编辑
                        </el-button>
                        <el-button type="text" @click="switchDeleted(scope.row)"
                                   v-if="$util.checkPermission('event',['d'])">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="选择文章" :visible.sync="dialogArticle" width="450px">
            <el-form :model="event.rule" @submit.native.prevent="onSubmitEvent" label-width="100px">
                <el-form-item label="选择文章">
                    <article-selector v-model="event.rule.articleId" style="width: 300px"/>
                </el-form-item>
                <el-form-item label="声音文件">
                    <upload-music v-model="event.voiceSrc"/>
                </el-form-item>
                <el-form-item label="阅读时间(秒)">
                    <el-input-number v-model="event.rule.keepTime" :min="0"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="选择礼品" :visible.sync="showItem">
            <el-form ref="form" :model="itemForm" label-width="80px" @submit.native.prevent="onSubmitEventItem">
                <el-form-item label="选择商品">
                    <goods-selector @change="onSelectItem" :is-gift="2" :modal="false"/>
                    <div class="goods-info" v-if="itemForm">
                        <img :src="itemForm.thumbnail | imgSrc" alt="" width="100px" height="100px">
                        <div>
                            <p><span>{{itemForm.name}}</span> <span> {{itemForm.skuName | skuNameFilter}}</span></p>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="活动邮费">
                    <el-input v-model="itemForm.eventPrice">
                        <template slot="prepend">￥</template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="primary" native-type="submit">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import StatusSelector from '@/components/selector/StatusSelector';
    import event from '@/common/apis/event';
    import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';
    import {mapGetters} from 'vuex';
    import article from '@/common/apis/article';
    import ArticleSelector from '@/components/selector/ArticleSelector';
    import GoodsSelector from '@/components/selector/GoodsSelector';
    import eventItem from '@/common/apis/eventItem';
    import UploadMusic from '@/components/widget/UploadMusic';

    export default {
        components: {UploadMusic, GoodsSelector, ArticleSelector, StatusSelector},
        mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
        data() {
            return {
                loading: false,
                status: undefined,
                typeName: '活动',
                query: {
                    type: 6,
                    articleName: undefined,
                    itemName: undefined,
                    page: 1,
                    pageSize: 20,
                    sortOrder: 'id',
                    sortBy: 'asc',
                    disabled: 2,
                    deleted: 0,
                    column: 'id,rule,type,disabled,voiceSrc'
                },
                event: {
                    voiceSrc: undefined,
                    rule: {
                        keepTime: undefined,
                        articleId: undefined
                    }
                },
                article: [{}],
                dialogArticle: false,
                showItem: false,
                itemForm: {
                    id: undefined,
                    eventPrice: undefined,
                    skuName: []
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                event.list(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (data.rows === null) return;
                        if (data.rows && data.rows.length > 0) {
                            data.rows.forEach((item, index) => {
                                if (index === 0) {
                                    item.rule = JSON.parse(item.rule);
                                    if (this.$util.objectLength(item.rule) === 0) {
                                        item.rule = {
                                            id: item.id,
                                            keepTime: undefined,
                                            articleId: undefined
                                        };
                                    }
                                    console.info(item);
                                    this.event = item;
                                    this.getEventItem();
                                }
                            });
                        }
                        this.getArticleInfo();
                    });
                }).finally(() => this.loading = false);
            },
            getEventItem() {
                this.loading = true;
                eventItem.list({
                    eventId: this.event.id,
                    column: 'id,eventItemId,eventPrice,itemName,createTime'
                }).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                    });
                }).finally(() => this.loading = false);
            },
            add() {
                this.$router.push({name: 'FreeGiftAdd'});
            },
            edit(item) {
                this.defaultItemForm();
                let column = 'id,itemName,thumbnail,eventPrice,skuId,spuName,eventItemId';
                this.loading = true;
                eventItem.get({id: item.eventItemId, column}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (data === null) {
                            this.$message.error('数据不存在');
                            return;
                        }
                        this.itemForm = {
                            id: data.eventItemId,
                            eventPrice: this.$util.priceFormat(data.eventPrice),
                            skuId: data.skuId,
                            name: data.itemName,
                            skuName: data.spuName,
                            thumbnail: data.thumbnail
                        };
                        this.showItem = true;
                    });
                }).finally(() => this.loading = false);
            },
            switchDeleted(item) {
                this.$util.actionConfirm('是否删除礼包').then(() => {
                    this.loading = true;
                    eventItem.deleted({id: item.eventItemId}).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '删除成功').then(() => {
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            },
            getRule(rule, k) {
                try {
                    let json = JSON.parse(rule);
                    return json[k];
                } catch (e) {
                    return '-';
                }
            },
            getArticleInfo() {
                this.loading = true;
                if (!this.event.rule.articleId) {
                    this.article = [{
                        title: '未选择文章',
                        keepTime: undefined,
                        viewCount: undefined
                    }];
                    return;
                }
                article.get(this.event.rule.articleId, 'id,title,viewCount').then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        let article = data.article;
                        this.article = [{
                            title: article.title,
                            keepTime: this.event.rule.keepTime,
                            viewCount: article.viewCount
                        }];
                        console.info(this.article);
                    });
                });
            },
            onSubmitEvent() {
                this.loading = true;
                this.dialogArticle = false;
                if (this.event.id !== undefined) {
                    this.onUpdate();
                } else {
                    this.onCreate();
                }
            },
            onUpdate() {
                let params = {
                    id: this.event.id,
                    type: 6,
                    rule: JSON.stringify(this.event.rule),
                    voiceSrc: this.event.voiceSrc
                };
                event.edit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true).then(() => {
                        this.getData();
                    });
                }).finally(() => {
                    this.loading = false;
                });
            },
            onCreate() {
                let params = {
                    storeId: this.shop.id,
                    type: 6,
                    rule: JSON.stringify(this.event.rule)
                };
                event.add(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true).then(() => {
                        this.getData();
                    });
                }).finally(() => {
                    this.loading = false;
                });
            },
            onSelectItem(item) {
                console.info(item);
                this.$set(this.itemForm, 'skuId', item.skuId);
                this.$set(this.itemForm, 'skuName', item.skuName);
                this.$set(this.itemForm, 'name', item.name);
                this.$set(this.itemForm, 'eventPrice', '');
                this.$set(this.itemForm, 'thumbnail', item.thumbnail);
            },
            onSubmitEventItem() {
                let params = {
                    id: this.itemForm.id,
                    eventId: this.event.id,
                    eventPrice: this.$util.formatPrice(this.itemForm.eventPrice),
                    skuId: this.itemForm.skuId,
                    storeId: this.shop.id
                };
                this.loading = true;
                if (this.itemForm.id !== undefined) {
                    eventItem.edit(params).then(res => {
                        this.$util.handelHttpResponseResult(res, true).then(() => {
                            this.showItem = false;
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                } else {
                    eventItem.add(params).then(res => {
                        this.$util.handelHttpResponseResult(res, true).then(() => {
                            this.showItem = false;
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                }
            },
            gotoStatistic() {
                this.$router.push({name: 'FreeGiftOrder'});
            },
            defaultItemForm() {
                this.itemForm = {
                    id: undefined,
                    eventPrice: undefined,
                    skuId: undefined,
                    name: undefined,
                    skuName: undefined,
                    thumbnail: undefined
                };
            },
            showDialog() {
                this.showItem = true;
                this.defaultItemForm();
            },
            switchDisabled() {
                console.info(this.event);
                this.onDisabled(this.event, event)
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        },
        filters: {
            skuNameFilter(v) {
                try {
                    return v.join(' | ');
                } catch (e) {
                    return v;
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .free-gift-list {

    }
</style>
