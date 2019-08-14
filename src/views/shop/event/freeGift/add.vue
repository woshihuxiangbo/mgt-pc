<template>
    <div class="free-gift-add" v-loading="loading">
        <breadcrumb :options="['活动管理','添加礼品']"/>
        <div class="main-container">
            <free-gift-form v-model="form" @submit="submit">
                <el-button type="primary" native-type="submit">创建</el-button>
            </free-gift-form>
        </div>
    </div>
</template>

<script>
    import FreeGiftForm from "@/components/form/FreeGiftForm";
    import event from '@/common/apis/event';
    import eventItem from '@/common/apis/eventItem';
    import {mapGetters} from 'vuex';

    export default {
        components: {FreeGiftForm},
        data() {
            return {
                loading: false,
                eventId: undefined,
                form: {
                    disabled: false,
                    endTime: undefined,
                    rule: {keepTime: undefined, articleId: undefined},
                    showTime: undefined,
                    sortId: 0,
                    startTime: undefined,
                    title: undefined,
                    type: 6,
                    eventPrice: undefined
                }
            }
        },
        methods: {
            submit() {
                if (this.eventId !== undefined) {
                    return this.createEventItem();
                }
                let params = Object.assign({}, this.form);
                params.storeId = this.shop.id;
                params.rule = JSON.stringify(params.rule);
                params.showTime = parseInt(params.showTime / 1000);
                delete params.skuId;
                delete params.eventPrice;
                this.loading = false;
                event.add(params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.eventId = data;
                        this.createEventItem();
                    })
                }).finally(() => {
                    this.loading = false
                });
            },
            createEventItem () {
                let p = {
                    eventId: this.eventId,
                    eventPrice: this.$util.formatPrice(this.form.eventPrice),
                    skuId: this.form.skuId,
                    sortId: this.form.sortId
                };
                this.loading = false;
                eventItem.add(p).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.$router.push({name: 'FreeGiftList'})
                    }).finally(() => {
                        this.loading = false
                    });
                })
            }
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    }
</script>

<style scoped>

</style>