<template>
    <div class="md-bargain-add" v-loading="loading">
        <breadcrumb :options="['活动管理', '砍价配置']"/>
        <div class="main-container">
            <event-bargain-form v-model="form" @submit="onAddSubmit"/>
        </div>
    </div>
</template>

<script>
    import EventBargainForm from "@/components/form/EventBargainForm";
    import api from '@/common/apis/event/bargain'
    import {mapGetters} from 'vuex';

    export default {
        components: {EventBargainForm},
        data() {
            return {
                loading: false,
                form: {
                    eventName: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    timeLimit: undefined,
                    items: [
                        {
                            eventStock: undefined,
                            price: undefined,
                            minPrice: undefined,
                            maxHaggleTimes: undefined,
                            buyLimit: undefined,
                            itemId: undefined,
                            spuId: undefined,
                            skuId: undefined,
                            hotSale: false
                        }
                    ]
                }
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.loading = true;
                api.get({id: this.$route.params.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        console.info(data);
                        data.startTime = this.$util.unixToTimestamp(data.startTime);
                        data.endTime = this.$util.unixToTimestamp(data.endTime);
                        data.items = data.item.map(item => {
                            item.price = this.$util.integerToPrice(item.price);
                            item.minPrice = this.$util.integerToPrice(item.minPrice);
                            item.skuName = item.spuName;
                            return item;
                        });
                        delete data.item;
                        this.form = data;
                    });
                }).finally(() => this.loading = false)
            },
            onAddSubmit() {
                let params = this.$util.deepClone(this.form);
                params.storeId = this.shop.id;
                params.startTime = this.$util.timestampToUnix(params.startTime);
                params.endTime = this.$util.timestampToUnix(params.endTime);
                params.item = params.items.map(item => {
                    delete item.itemName;
                    delete item.skuName;
                    item.price = this.$util.priceToInteger(item.price);
                    item.minPrice = this.$util.priceToInteger(item.minPrice);
                    return item;
                });
                console.info('params:', params);
                delete params.items;
                this.loading = true;
                api.edit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true).then(() => {
                        this.$router.back();
                    })
                }).finally(() => this.loading = false)
            }
        },
        computed: {
            ...mapGetters(['shop'])
        }
    }
</script>

<style scoped>

</style>