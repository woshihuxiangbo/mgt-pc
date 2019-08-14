<template>
    <div class="md-class">
        <h3>
            {{data.title}}
        </h3>
        <el-table :data="data.children" border
                  @selection-change="onTableSelect"
                  @select="onSelectData" ref="table" id="1">
            <el-table-column align="center" type="selection" width="55"/>
            <el-table-column align="center" label="商品">
                <template slot-scope="scope">
                    <div class="item-info">
                        <img :src="scope.row.thumbnail|imgSrc" alt="" height="50px">
                        <div class="item-name">
                            <p>{{scope.row.name}}</p>
                            <p>{{scope.row.skuName.join(' | ')}}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="进货数量" width="200px">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.buyCount" @change="selectInputChange(scope.row)"
                                     :min="1"
                                     :max="parseInt(scope.row.stock / scope.row.unit)"/>
                </template>
            </el-table-column>
            <el-table-column align="center" label="剩余库存" prop="stock"/>
            <el-table-column align="center" label="进货单价">
                <template slot-scope="scope">
                    ￥{{$util.priceFormat(scope.row.price * scope.row.unit)}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="进货总价">
                <template slot-scope="scope">
                    ￥{{$util.priceFormat(scope.row.price * scope.row.buyCount * scope.row.unit)}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="deleteItem(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="md-ac">
            <span>总价：￥ {{$util.priceFormat(getItemsTotalPrice)}}</span>
            <el-button type="primary" @click="removeData(data.producerId)">清空</el-button>
            <el-button type="success" @click="createOrder">下单</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ShoppingCarTable',
        props: {
            data: Array | Object
        },
        data() {
            return {
                selectItems: []
            };
        },
        methods: {
            removeData(i) {
                this.$store.dispatch('rmParent', i);
                location.reload();
            },
            onTableSelect(items) {
                this.selectItems = items;
            },
            onSelectData(items, row) {
            },
            selectInputChange(item) {
                this.$emit('countChange', item);
            },
            deleteItem(item) {
                this.$store.dispatch('rmShoppingCarItem', item).then(item => {
                    this.$emit('updateTable', item);
                });
            },
            createOrder() {
                if (!this.selectItems || this.selectItems.length <= 0) {
                    return this.$message.error('请选择商品');
                }
                let can = true;
                let errorMessage = '';
                this.selectItems.forEach((item) => {
                    if (!item.buyCount) {
                        can = false;
                        errorMessage = item.name + '的购买数量不正确';
                        return
                    }
                    console.info(item);
                });
                if (can === false) {
                    return this.$message.error('无法下单,' + errorMessage);
                }
                this.$emit('create', this.selectItems);
            }
        },
        computed: {
            getItemsTotalPrice() {
                let price = 0;
                this.selectItems.forEach((item) => {
                    price += item.price * item.buyCount * item.unit;
                });
                return price;
            }
        }
    };
</script>

<style scoped lang="scss">

    .item-info {
        display: flex;

        img {
            flex: 0 0 50px;
            margin-right: 10px;
        }

        .item-name {
            flex: 1;
            text-align: left;
        }
    }

    .md-class {
        border: 1px dotted #E3E3E3;

        > h3 {
            padding: 10px;
        }

        .el-table {
            margin-top: 0 !important;
        }

        margin-bottom: 5px;

        .md-ac {
            padding: 5px;

            > span {
                display: inline-block;
                width: 150px;
            }
        }
    }
</style>
