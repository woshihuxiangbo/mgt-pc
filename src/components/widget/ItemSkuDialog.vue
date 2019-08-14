<template>
    <el-dialog :visible.sync="show" :title="title" append-to-body :modal="true" v-loading="loading">
        <item-sku-list :options="sku" @change="onSkuChange"/>
        <p style="line-height: 30px">单价: {{$util.priceFormat(selectSku.sku.price * selectSku.sku.unit)}}元</p>
        <div slot="footer">
            <el-button type="success" @click="onEnterSelectSku">确认选择</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import MdActiveMixin from "@/components/mixins/MdActiveMixin";
    import apiSku from '@/common/apis/itemSku';
    import api from '@/common/apis/goods';
    import {mapGetters} from 'vuex';
    import ItemSkuList from "@/components/list/ItemSkuList";

    export default {
        name: "ItemSkuDialog",
        components: {ItemSkuList},
        mixins: [MdActiveMixin],
        props: {
            title: String,
            itemId: {type: String | Object}
        },
        data() {
            return {
                loading: true,
                sku: [],
                selectSku: {
                    sku: {}
                },
                isSelect: false
            }
        },
        computed: {
            ...mapGetters(['shop'])
        },
        methods: {
            getData() {
                this.loading = true;
                api.get({
                    id: this.itemId,
                    column: 'id,name,thumbnail,categoryId',
                    storeId: this.shop.id
                }, 'v2').then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (!data) return this.showError('此商品没有规格可以选择');
                        this.sku = data.spec;
                    });
                }).finally(() => this.loading = false)
            },
            onSkuChange(sku) {
                this.selectSku = sku;
                this.isSelect = true;
            },
            onEnterSelectSku() {
                if (this.isSelect === false) {
                    return this.$message.error('请选择规格')
                }
                this.$emit('select', this.selectSku);
                this.show = false;
            }
        },
        watch: {
            async itemId() {
                await this.$nextTick();
                this.isSelect = false;
                this.selectSku = {sku: {}};
                this.getData()
            }

        },
        mounted() {
            if (!!this.itemId) this.getData();
        }
    }
</script>

<style scoped>

</style>