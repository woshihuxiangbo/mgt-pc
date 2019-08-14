<template>
    <el-dialog :visible.sync="show" append-to-body title="选择商品" v-loading="loading" width="650px"
               class="md-event-coupon-form-item">
        <el-transfer v-model="form" :data="itemList" :titles="['商品列表', '已选择商品']" filterable filter-placeholder="搜索"
                     :filter-method="filterMethod"></el-transfer>
        <div slot="footer">
            <el-button type="success" @click="show=false">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import {mapGetters} from 'vuex';
    import api from '@/common/apis/goods';

    export default {
        name: 'EventCouponFormItem',
        mixins: [vModelMixins],
        data() {
            return {
                loading: false,
                show: false,
                itemList: [],
                query: {
                    storeId: undefined,
                    column: 'id,name',
                    pageSize: 100,
                    page: 1,
                    itemName: undefined
                }
            };
        },
        props: {
            value: {
                type: Array, default: () => {
                    return [];
                }
            },
            mdActive: {type: Boolean, default: false}
        },
        watch: {
            mdActive(n) {
                this.show = n;
            },
            show(n) {
                this.$emit('update:mdActive', n);
            }
        },
        computed: {
            ...mapGetters(['shop'])
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                api.list(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res).then(({data}) => {
                        this.getGroupItem();
                        if (data.rowCount <= 0) {
                            this.itemList = [];
                            return;
                        }
                        this.itemList = data.rows.map((item) => {
                            return {
                                key: item.id,
                                label: item.name
                            };
                        });
                    });
                }).finally(() => this.loading = false);
            },
            getGroupItem() {
                let params = this.$util.deepClone(this.query);
                params.isGroupStoreItem = true;
                this.loading = true;
                api.list(params).then(res => {
                    this.$util.handelHttpResponseResult(res).then(({data}) => {
                        if (data.rowCount <= 0) {
                            return;
                        }
                        let item = data.rows.map((item) => {
                            return {
                                key: item.id,
                                label: item.name
                            };
                        });
                        this.itemList = [...this.itemList, ...item];
                    });
                }).finally(() => this.loading = false);
            },
            filterMethod(query, item) {
                return item.label.indexOf(query) > -1;
            }
        }
    };
</script>

<style lang="scss">
    .md-event-coupon-form-item {
        .el-transfer {
            display: flex;

            .el-transfer-panel {
                flex: 1;
                height: 400px;

                .el-input {
                    display: block;
                    width: auto;
                }

                .el-transfer-panel__body {
                    height: 358px;

                    .el-checkbox-group {
                        height: 297px
                    }
                }
            }

            .el-transfer__buttons {
                padding-top: 155px;
                padding-bottom: 155px;
            }
        }
    }
</style>
