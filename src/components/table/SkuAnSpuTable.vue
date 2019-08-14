<template>
    <el-table size="mini" :data="table" border :span-method="arraySpanMethod">
        <el-table-column align="center" width="300" label="规格名称" prop="spuName">
            <template slot-scope="scope">
                <div class="box">
                    <p>规格名称: {{scope.row.spuName}}</p>
                    <p>总库存数: {{scope.row.stock}}</p>
                    <p>单件成本: ￥ {{scope.row.singleCost}}</p>
                    <p>单件市场价: ￥ {{scope.row.marketPrice}}</p>
                    <p>单件重量(g): {{scope.row.weight}}</p>
                </div>
                <div class="md-action">
                </div>
                <!-- <p>返佣比例:{{scope.row.allocConfig}}</p> -->
            </template>
        </el-table-column>
        <el-table-column align="center" label="单位">
            <template slot-scope="scope">{{scope.row.sku.skuName}}</template>
        </el-table-column>
        <el-table-column align="center" label="规格数量">
            <template slot-scope="scope">{{scope.row.sku.unit}}</template>
        </el-table-column>
        <el-table-column align="center" label="零售价 (元)">
            <template slot-scope="scope">{{scope.row.sku.price}}</template>
        </el-table-column>
        <el-table-column align="center" label="批发价 (元)" v-if="shop.id === '0'">
            <template slot-scope="scope">{{scope.row.sku.wholesalePrice}}</template>
        </el-table-column>
        <!-- <el-table-column align="center" label="拿货价 (元)">
            <template slot-scope="scope">{{scope.row.sku.wholesalePrice}}</template>
        </el-table-column>
        <el-table-column align="center" label="供货价 (元)">
            <template slot-scope="scope">{{scope.row.sku.wholesalePrice}}</template>
        </el-table-column> -->
        <el-table-column align="center" label="是否批发" v-if="shop.id === '0'">
            <template slot-scope="scope">{{scope.row.sku.wholesaleMark?'是':'否'}}</template>
        </el-table-column>
        <el-table-column align="center" label="是否零售">
            <template slot-scope="scope">{{scope.row.sku.retailMark?'是':'否'}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
            <template slot-scope="scope">
                <el-button @click="onEdit(scope.row)" type="primary" class="margin" size="mini">编辑</el-button>
                <el-button @click="onDelete(scope.row)" type="warning" size="mini">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import {mapGetters} from 'vuex';

    export default {
        name: 'SkuAnSpuTable',
        mixins: [vModelMixins],
        data() {
            return {
                loading: false,
                table: []
            };
        },
        methods: {
            formatData() {
                if (!this.form) return;
                let list = [];
                this.form.forEach((item) => {
                    // console.info(item);
                    if (item.deleted) {
                        return;
                    }
                    let index = 0;
                    try {
                        item.sku.forEach((sku) => {
                            if (sku.deleted) {
                                return;
                            }
                            list.push({
                                id: item.id,
                                spuIdx: item.spuIdx,
                                spuName: item.spuName,
                                marketPrice: item.marketPrice,
                                singleCost: item.singleCost,
                                weight: item.weight,
                                deleted: item.deleted,
                                childCount: item.sku.length,
                                stock: item.stock,
                                allocConfig: item.allocConfig,
                                index,
                                sku: sku
                            });
                            index++;
                        });
                    } catch (err) {
                    }

                });
                this.table = list;
            },
            arraySpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 0) {
                    if (row.index === 0) {
                        return {
                            rowspan: row.childCount,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
                if (columnIndex === 7) {
                    if (row.index === 0) {
                        return {
                            rowspan: row.childCount,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },

            onEdit(row) {
                this.$emit('onEdit', row);
            },
            onDelete(row) {
                this.$emit('onDelete', row);
            }
        },
        watch: {
            async form() {
                await this.$nextTick();
                this.formatData();
            }
        },
        mounted() {
            this.formatData();
        },
        computed: {
            ...mapGetters(['shop'])
        }
    };
</script>

<style lang="scss" scoped>
    .margin {
        margin-bottom: 10px;
    }

    .box {
        display: flex;
        flex-wrap: wrap;

        > p {
            flex: 0 0 50%;
        }
    }
</style>
