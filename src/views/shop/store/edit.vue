<template>
    <div class="store-edit" v-loading="loading">
        <breadcrumb :options="['编辑店铺']"/>
        <store-form v-model="form" @submit="onSubmit" :show-role="false">
            <el-button type="primary" native-type="submit">保存</el-button>
        </store-form>
    </div>
</template>

<script>
    import StoreForm from "../../../components/form/StoreForm";
    import api from '../../../common/apis/store';

    export default {
        name: "edit",
        components: {StoreForm},
        data() {
            return {
                form: {
                    loading: false,
                    location: []
                }
            }
        },
        methods: {
            getData() {

            },
            onSubmit() {
                this.loading = true;
                let params = Object.assign({}, this.form);
                params.location = params.location.join(',');
                api.updateStore(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '保存成功').then();
                }).finally(() => this.loading = false);
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>