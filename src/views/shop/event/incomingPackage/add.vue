<template>
    <div class="incoming-package-add" v-loading="loading">
        <breadcrumb :options="['活动管理', '创建入店礼包']"/>
        <div class="main-container">
            <incoming-package-form v-model="form" @submit="submit">
                <el-button type="primary" native-type="submit">添加</el-button>
            </incoming-package-form>
        </div>
    </div>
</template>

<script>
    import IncomingPackageForm from "@/components/form/IncomingPackageForm";
    import event from '@/common/apis/event';
    import eventItem from '@/common/apis/eventItem';
    import {mapGetters} from 'vuex';

    export default {
        components: {IncomingPackageForm},
        data() {
            return {
                loading: false,
                form: {
                    type: 5,
                    title: undefined,
                    showTime: undefined,
                    endTime: undefined,
                    startTime: undefined,
                    skuId: undefined,
                    sortId: undefined,
                    eventPrice: undefined,
                    rule: {
                        level: 1
                    }
                }
            }
        },
        methods: {
            submit() {
                this.loading = true;
                let params = Object.assign({}, this.form);
                params.storeId = this.shop.id;
                params.rule = JSON.stringify(params.rule);
                event.add(params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        let p = {
                            eventId: data,
                            eventPrice: this.$util.formatPrice(this.form.eventPrice),
                            skuId: this.form.skuId,
                            sortId: this.form.sortId
                        };
                        eventItem.add(p).then(res => {
                            this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                                this.$router.push({name: 'IncomingPackageList'})
                            })
                        })
                    }).finally(() => {
                        this.loading = false
                    });
                }).finally(() => {
                    this.loading = false
                });
            }
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    }
</script>

<style scoped>

</style>