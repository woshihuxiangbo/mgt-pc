<template>
    <div class="shop" v-loading="loading">
        <breadcrumb :options="['管理员', '创建管理员']"/>
        <div class="main-container">
            <administrator-form v-model="form" @submit="onSubmit">
                <el-button type="primary" native-type="submit">提交</el-button>
            </administrator-form>
        </div>
    </div>
</template>

<script>
    import api from '@/common/apis/administrator';
    import AdministratorForm from '@/components/form/AdministratorForm';
    import {mapGetters} from 'vuex';

    export default {
        components: {AdministratorForm},
        data() {
            return {
                loading: false,
                form: {
                    name: undefined,
                    mobile: undefined,
                    password: undefined,
                    roleId: undefined,
                    storeId: undefined,
                    disabled: false
                }
            };
        },
        methods: {
            onSubmit() {
                this.loading = true;
                let params = Object.assign({}, this.form);
                if (params.storeId && params.storeId.length > 0) {
                    params.stores = params.storeId.join(',');
                }
                delete params.storeId;
                api.add(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.$router.push({name: 'AdministratorList'});
                    });
                }).finally(() => this.loading = false);
            }
        },
        computed: {
            ...mapGetters({role: 'role'})
        },
        mounted() {
            if (process.env.VUE_APP_IS_SAAS !== 'false') {
                // this.form.storeId = this.role.stores;
            }
        }
    };
</script>

<style scoped lang="scss">
</style>
