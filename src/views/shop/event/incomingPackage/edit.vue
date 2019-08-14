<template>
    <div class="incoming-package-add" v-loading="loading">
        <breadcrumb :options="['活动管理', '修改入店礼包']"/>
        <div class="main-container">
            <incoming-package-form v-model="form" @submit="submit" v-if="form">
                <el-button type="primary" native-type="submit">修改</el-button>
            </incoming-package-form>
        </div>
    </div>
</template>

<script>
    import IncomingPackageForm from "@/components/form/IncomingPackageForm";
    import event from '@/common/apis/event';
    import eventItem from '@/common/apis/eventItem';

    export default {
        components: {IncomingPackageForm},
        data() {
            return {
                hasEventItem: false,
                loading: false,
                id: undefined,
                form: undefined,
                column: 'id,title,type,rule,eventPrice,showTime,startTime,endTime,disabled,itemName,eventItemId,specName,sortId,eventItemId,skuId,thumbnail'
            }
        },
        methods: {
            getData() {
                this.loading = true;
                event.get({id: this.id, column: this.column}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        data.rule = JSON.parse(data.rule);
                        data.showTime = parseInt(data.showTime * 1000);
                        data.eventPrice = this.$util.priceFormat(data.eventPrice);
                        if (data.disabled === undefined) data.disabled = false;
                        this.form = data;
                        console.info(this.form);
                    })
                }).finally(() => this.loading = false)
            },
            submit() {
                this.updateEvent();
                if (this.form.eventItemId !== undefined) {
                    this.updateEventItem();
                    this.hasEventItem = true;
                } else {
                    this.hasEventItem = false;
                }
            },
            updateEvent() {
                this.loading = true;
                let params = Object.assign({}, this.form);
                params.rule = JSON.stringify(params.rule);
                params.showTime = parseInt(params.showTime / 1000);
                delete params.skuId;
                delete params.eventPrice;
                event.edit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '修改成功').then(() => {
                        if (this.hasEventItem === false) this.$router.push({name: 'IncomingPackageList'});
                    });
                }).finally(() => this.loading = false);
            },
            updateEventItem() {
                this.loading = true;
                let params = {
                    id: this.form.eventItemId,
                    eventId: this.id,
                    eventPrice: this.$util.formatPrice(this.form.eventPrice),
                    skuId: this.form.skuId,
                    sortId: this.form.sortId
                };
                eventItem.edit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(() => this.$router.push({name: 'IncomingPackageList'}));
                }).finally(() => this.loading = false);
            }
        },
        mounted() {
            this.id = this.$route.params.id;
            this.getData();
        }
    }
</script>

<style scoped>

</style>