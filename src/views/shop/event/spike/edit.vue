<template>
    <div class="md-bargain-add" v-loading="loading">
        <breadcrumb :options="['活动管理', '秒杀配置']"/>
        <div class="main-container">
            <event-spike-form v-model="form" @submit="onAddSubmit"/>
        </div>
    </div>
</template>

<script>
    import EventSpikeForm from "@/components/form/EventSpikeForm";
    import api from '@/common/apis/event/seckill';
    import {mapGetters} from 'vuex';

    export default {
        components: {EventSpikeForm},
        data() {
            return {
                loading: false,
                form: {
                    eventName: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    items: [
                        {
                            eventStock: undefined,
                            seckillPrice: undefined,
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
        mounted () {
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
                            item.seckillPrice = this.$util.integerToPrice(item.seckillPrice);
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
                params.startTime = this.$util.timestampToUnix(params.startTime);
                params.storeId = this.shop.id;
                params.endTime = this.$util.timestampToUnix(params.endTime);
                params.item = params.items.map(item => {
                    delete item.itemName;
                    delete item.skuName;
                    item.seckillPrice = this.$util.priceToInteger(item.seckillPrice);
                    return item;
                });
                delete params.items;
                console.info('params:', params);
                this.loading = true;
                api.edit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true).then(() => {
                        this.$router.back()
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