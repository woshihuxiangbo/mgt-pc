<template>
    <div class="shop" v-loading="loading">
        <breadcrumb :options="['管理员', '编辑管理员']"/>
        <div class="main-container">
            <administrator-form v-model="form" @submit="onSubmit" :required-password="false">
                <el-button type="primary" native-type="submit">提交</el-button>
            </administrator-form>
        </div>
    </div>
</template>

<script>
    import api from '@/common/apis/administrator';
    import AdministratorForm from '@/components/form/AdministratorForm';

    export default {
        components: {AdministratorForm},
        data() {
            return {
                loading: false,
                id: undefined,
                form: {
                    name: undefined,
                    phone: undefined,
                    password: undefined,
                    roleId: undefined,
                    storeId: [],
                    disabled: false
                },
                column: 'id'
            };
        },
        methods: {
            getData() {
                this.loading = true;
                api.get({id: this.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        let form = data.manager;
                        form.id = this.id;
                        if (!data.stores) {
                            form.storeId = [];
                        } else {
                            form.storeId = data.stores;
                        }
                        if (form.disabled === undefined) form.disabled = false;
                        this.form = form;
                    });
                }).finally(() => this.loading = false);
            },
            onSubmit() {
                this.loading = true;
                let params = Object.assign({}, this.form);
                if (params.storeId && params.storeId.length > 0) params.stores = params.storeId.join(',');
                delete params.storeId;
                api.edit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '更新成功').then(() => {
                        this.$router.push({name: 'AdministratorList'});
                    });
                }).finally(() => this.loading = false);
            }
        },
        created() {
            this.id = this.$route.params.id;
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped lang="scss">
</style>
