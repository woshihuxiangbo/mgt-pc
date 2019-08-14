<template>
    <div class="md-group-edit" v-loading="loading">
        <div class="main-container">
            <event-group-form v-model="form" @submit="onEditSubmit" :set-item="item">
                <el-button native-type="submit" type="primary">保存</el-button>
            </event-group-form>
        </div>
    </div>
</template>

<script>
    import EventGroupForm from "@/components/form/EventGroupForm";
    import eventGroupBuy from "@/common/apis/eventGroupBuy";

    export default {
        components: {EventGroupForm},
        data() {
            return {
                loading: false,
                item: {},
                form: {
                    list: []
                }
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                this.loading = true;
                eventGroupBuy.get({id: this.$route.params.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        data.startTime = data.startTime * 1000;
                        data.endTime = data.endTime * 1000;
                        data.list = data.list.map(item => {
                            item.price = this.$util.integerToPrice(item.price);
                            return item;
                        });
                        this.item = {
                            thumbnail: data.thumbnail,
                            name: data.itemName,
                            skuName: `${data.spuName} ${data.skuName}*${data.skuUnit}`
                        };
                        delete data.thumbnail;
                        delete data.itemName;
                        delete data.spuName;
                        delete data.skuName;
                        delete data.skuUnit;
                        delete data.skuPrice;
                        this.form = data;
                    });
                }).finally(() => this.loading = false);
            },
            onEditSubmit() {
                let params = this.$util.deepClone(this.form);
                params.startTime = parseInt(this.form.startTime / 1000);
                params.endTime = parseInt(this.form.endTime / 1000);

                params.list = params.list.map(item => {
                    item.commission = parseInt(item.commission);
                    item.personNumber = parseInt(item.personNumber);
                    item.price = this.$util.priceToInteger(item.price);
                    return item;
                });
                this.loading = true;
                eventGroupBuy.edit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true).then(() => this.$router.back())
                }).finally(() => this.loading = false)
            }
        }
    }
</script>

<style scoped>

</style>