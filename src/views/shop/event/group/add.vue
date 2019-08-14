<template>
    <div class="md-group-add" v-loading="loading">
        <div class="main-container">
            <event-group-form v-model="form" @submit="onAddSubmit">
                <el-button native-type="submit" type="primary">保存</el-button>
            </event-group-form>
        </div>
    </div>
</template>

<script>
    import EventGroupForm from "@/components/form/EventGroupForm";
    import api from '@/common/apis/eventGroupBuy';
    import {mapGetters} from 'vuex';

    export default {
        components: {EventGroupForm},
        data() {
            return {
                loading: false,
                form: {
                    groupName: undefined,
                    startTime: undefined,
                    endTime: undefined,
                    itemId: undefined,
                    spuId: undefined,
                    skuId: undefined,
                    disabled: false,
                    groupStock: undefined,
                    buyLimit: 0,
                    timeLimit: 12,
                    remark: undefined,
                    hotSale: undefined,
                    list: [{
                        personNumber: undefined,
                        price: undefined,
                        commission: 0
                    }]
                }
            }
        },
        computed: {
            ...mapGetters(['shop'])
        },
        methods: {
            onAddSubmit() {
                let params = this.$util.deepClone(this.form);
                params.startTime = parseInt(this.form.startTime / 1000);
                params.endTime = parseInt(this.form.endTime / 1000);
                params.storeId = this.shop.id;

                params.list = params.list.map(item => {
                    item.commission = parseInt(item.commission);
                    item.personNumber = parseInt(item.personNumber);
                    item.price = this.$util.priceToInteger(item.price);
                    return item;
                });
                this.loading = true;
                api.add(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true).then(() => {
                        this.$router.back();
                    })
                }).finally(() => this.loading = false)
            }
        }
    }
</script>

<style scoped lang="scss">
</style>