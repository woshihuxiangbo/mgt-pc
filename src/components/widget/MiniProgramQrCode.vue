<template>
    <el-popover
        placement="top"
        title="小程序码"
        @show="showPopper"
        trigger="click"
        width="200">
        <div class="mini-program-qr-code" v-loading="loading">
            <img :src="img" alt="">
        </div>
        <el-button slot="reference" type="primary">查看</el-button>
    </el-popover>
</template>

<script>
    import userApi from '@/common/apis/user';
    import itemApi from '@/common/apis/goods';
    import {mapGetters} from 'vuex';

    export default {
        name: 'MiniProgramQrCode',
        props: {
            itemId: {type: String, required: true}
        },
        data() {
            return {
                loading: false,
                img: undefined,
                visible: false,
                showImg: false
            };
        },
        methods: {
            showPopper() {
                if (this.showImg === false && this.loading === false) {
                    this.getQrcode();
                }
            },
            getQrcode() {
                this.loading = true;
                this.getItemSkuId().then((skuId) => {
                    if (skuId !== false) {
                        this.loading = true;
                        let params = {
                            storeId: this.shop.id,
                            page: 'pages/goodsDetail/goodsDetail',
                            scene: 'skuId=' + skuId
                        };
                        userApi.miniProgramQrcode(params).then(res => {
                            this.showImg = true;
                            this.img = 'data:image/jpeg;base64,' + res.data;
                        }).finally(() => this.loading = false);
                    } else {
                        this.loading = false;
                    }
                }).catch(() => this.loading = false);
            },
            async getItemSkuId() {
                return await itemApi.get({
                    id: this.itemId,
                    storeId: this.shop.id,
                    column: 'id,name,thumbnail,categoryId'
                }, 'v2').then(async (res) => {
                    return await this.$util.handelHttpResponseResult(res, false).then(async ({data}) => {
                        let spec = data.spec;
                        if (!spec || spec.length <= 0) return await false;
                        let sku = spec[0].sku;
                        if (!sku || sku.length <= 0) return await false;
                        let skuId = undefined;
                        sku.forEach((item) => {
                            skuId = item.id;
                        });
                        return await skuId;
                    });
                });
            }
        },
        mounted() {
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        },
        watch: {
            itemId() {
                this.showImg = false;
                this.img = '';
            }
        }
    };
</script>

<style scoped lang="scss">
    .mini-program-qr-code {

        img {
            width: 200px;
            height: 200px;
            display: block;
            background-color: #CCC;
        }
    }
</style>
