<template>
    <div class="free-gift-list" v-loading="loading">
        <breadcrumb :options="['活动管理', '入店礼包']"/>
        <div class="main-container">
            <el-form :model="query" inline label-width="40px" @submit.native.prevent="getEventItem">
                <el-form-item label="状态">
                    <el-select v-model="query.deleted" :value="query.deleted">
                        <el-option :value="undefined" label="正常"></el-option>
                        <el-option :value="1" label="已删除"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">过滤</el-button>
                    <el-button v-if="$util.checkPermission('event',['c'])" type="primary" @click="showItem = true">
                        添加商品
                    </el-button>
                    <el-button type="primary" @click="gotoGetList" v-if="$util.checkPermission('retailOrder',['l'])">
                        购买记录
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border v-if="event.id !== undefined">
                <el-table-column align="center" label="商品名称" prop="itemName"/>
                <el-table-column align="center" label="礼包价格" prop="eventPrice">
                    <template slot-scope="scope">
                        ￥ {{$util.priceFormat(scope.row.eventPrice)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="购买次数" prop="salesCount"/>
                <el-table-column align="center" label="排序" prop="sortId"/>
                <el-table-column align="center" label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column v-if="$util.checkPermission('event',['u', 'd'])" align="center" label="管理">
                    <template slot-scope="scope">
                        <el-button type="text" @click="edit(scope.row)" v-if="$util.checkPermission('event',['u'])">
                            编辑
                        </el-button>
                        <el-button type="text" @click="switchDeleted(scope.row)"
                                   v-if="$util.checkPermission('event',['d'])">
                            {{scope.row.deleteTime?'恢复':'删除'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="修改" :visible.sync="dialog">
            <el-form :model="event.rule" @submit.native.prevent="onSubmitEvent">
                <el-form-item label="level">
                    <el-input-number v-model="event.rule.level"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="选择商品" :visible.sync="showItem">
            <el-form ref="form" :model="itemForm" label-width="80px" @submit.native.prevent="onSubmitEventItem">
                <el-form-item label="选择商品">
                    <goods-selector :modal="false" @change="onSelectItem" :is-gift="1"/>
                    <div class="goods-info" v-if="itemForm">
                        <img :src="itemForm.thumbnail|imgSrc" alt="" width="80px">
                        <div>
                            <p><span>{{itemForm.name}}</span> <span> {{itemForm.skuName | skuNameFilter}}</span></p>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="礼包价格">
                    <el-input v-model="itemForm.eventPrice">
                        <template slot="prepend">￥</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="排序ID">
                    <el-input-number v-model="itemForm.sortId" :min="0"/>
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
    import GoodsSelector from '@/components/selector/GoodsSelector';
    import eventItem from '@/common/apis/eventItem';

    export default {
        components: {GoodsSelector, StatusSelector},
        mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
        data() {
            return {
                loading: false,
                status: undefined,
                typeName: '活动',
                query: {
                    eventId: undefined,
                    page: 1,
                    pageSize: 20,
                    sortOrder: 'sortId',
                    sortBy: 'desc',
                    deleted: undefined,
                    column: 'id,eventPrice,itemName,createTime,itemName,eventItemId,deleteTime,sortId,salesCount'
                },
                event: {
                    type: 5,
                    rule: {
                        level: undefined
                    }
                },
                dialog: false,
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
                event.list({type: 5, column: 'id,rule,type', storeId: this.shop.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (data.rows === null) return;
                        if (data.rows && data.rows.length > 0) {
                            data.rows.forEach((item, index) => {
                                if (index === 0) {
                                    item.rule = JSON.parse(item.rule);
                                    this.event = item;
                                    this.getEventItem();
                                }
                            });
                        }
                    });
                }).finally(() => this.loading = false);
            },
            getEventItem() {
                this.loading = true;
                this.query.eventId = this.event.id;
                eventItem.list(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                    });
                }).finally(() => this.loading = false);
            },
            add() {
                this.$router.push({name: 'FreeGiftAdd'});
            },
            edit(item) {
                let column = 'id,itemName,thumbnail,eventPrice,skuId,eventItemId,createTime,sortId';
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
                            sortId: data.sortId || 0,
                            skuName: data.specName,
                            thumbnail: data.thumbnail
                        };
                        this.showItem = true;
                    });
                }).finally(() => this.loading = false);
            },
            switchDeleted(item) {
                let str = item.deleteTime ? '恢复' : '删除';
                this.$util.actionConfirm(`是否${str}礼包`).then(() => {
                    this.loading = true;
                    eventItem.deleted({id: item.eventItemId}).then(res => {
                        this.$util.handelHttpResponseResult(res, true, `${str}成功`).then(() => {
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
            onSubmitEvent() {
                this.loading = true;
                this.dialog = false;
                if (this.event.id !== undefined) {
                    this.onUpdate();
                } else {
                    this.onCreate();
                }
            },
            onUpdate() {
                let params = {
                    id: this.event.id,
                    type: 5,
                    rule: JSON.stringify(this.event.rule)
                };
                event.edit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(() => {
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
                    this.$util.handelHttpResponseResult(res, false).then(() => {
                        this.getData();
                    });
                }).finally(() => {
                    this.loading = false;
                });
            },
            onSelectItem(item) {
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
                    sortId: this.itemForm.sortId,
                    storeId: this.shop.id
                };
                this.loading = true;
                if (this.itemForm.id !== undefined) {
                    eventItem.edit(params).then(res => {
                        this.$util.handelHttpResponseResult(res, false).then(() => {
                            this.showItem = false;
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                } else {
                    eventItem.add(params).then(res => {
                        this.$util.handelHttpResponseResult(res, false).then(() => {
                            this.showItem = false;
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                }
            },
            gotoGetList() {
                this.$router.push({name: 'IncomingPackageOrder'});
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
