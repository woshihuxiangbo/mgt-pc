<template>
    <div v-loading="loading" class="md-purchase-item">
        <div>
            <span>剩余库存: {{count}}</span>
            <el-button type="text"
                       v-if="isPurchase && $util.checkRole(['5', '8']) && $util.checkPermission('wholesaleOrder', ['c'])"
                       @click="gotoPurchase">
                批发进货
            </el-button>
        </div>
    </div>
</template>

<script>
    import itemApi from '@/common/apis/goods';
    import {mapGetters} from 'vuex';

    export default {
        name: 'PurchaseItem',
        props: {
            skuId: {type: String, required: true}
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        },
        watch: {
            async skuId() {
                await this.$nextTick();
                this.isPurchase = false;
                this.getData();
            }
        },
        data() {
            return {
                loading: false,
                count: 0,
                isPurchase: false,
                itemId: undefined
            };
        },
        methods: {
            getData() {
                console.info(this.skuId);
                this.loading = true;
                itemApi.originalItemBySkuID({storeId: this.shop.id, skuId: this.skuId}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        console.info(data);
                        this.isPurchase = data.itemOriginStoreId === '0';
                        this.count = data.stock;
                        this.itemId = data.itemId;
                    });
                }).finally(() => this.loading = false);
            },
            gotoPurchase() {
                this.$router.push({name: 'PurchaseItemList', query: {itemId: this.itemId}});
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped lang="scss">
    .md-purchase-item {
        flex: 0 0 150px;
        padding-left: 20px;
        text-align: right;

        > div {
            display: flex;
            flex-flow: column;
            height: 100%;
            justify-content: right;

            span {
                display: block;
                line-height: 40px;
                flex: 1;
            }

            .el-button {
                flex: 0;
                text-align: right;
            }
        }
    }
</style>
