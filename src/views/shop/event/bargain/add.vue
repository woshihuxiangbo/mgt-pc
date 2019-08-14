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
    import api from '@/common/apis/event/bargain';
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
                            maxHaggleTim: undefined,
                            buyLimit: undefined,
                            itemId: undefined,
                            spuId: undefined,
                            skuId: undefined,
                            hotSale: 0
                        }
                    ]
                }
            }
        },
        methods: {
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
                delete params.items;
                console.info('params:', params);
                this.loading = true;
                api.add(params).then(res => {
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