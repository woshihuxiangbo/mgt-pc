<template>
    <div class="user-edit" v-loading="loading">
        <breadcrumb :options="['用户管理', '用户编辑']"/>
        <div class="main-container">
            <user-form v-model="form">
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </user-form>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from "@/components/widget/breadcrumb";
    import UserForm from "@/components/form/UserForm";
    import userApi from '@/common/apis/user';
    import {mapGetters} from 'vuex';

    export default {
        components: {UserForm, Breadcrumb},
        data() {
            return {
                loading: false,
                form: {}
            }
        },
        methods: {
            getUserInfo(userId) {
                this.loading = true;
                userApi.getUserInfo(userId).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (data === undefined) {
                            data = {};
                        }
                        if (data.birthday === 0) {
                            data.birthday = undefined;
                        } else {
                            data.birthday = data.birthday * 1000;
                        }
                        this.form = data;
                    })
                }).finally(() => this.loading = false);
            },
            onSubmit() {
                this.loading = true;
                let params = Object.assign({}, this.form);
                if (['1', '2', '3'].indexOf(params.level) === -1) {
                    delete params.level;
                }
                if (!!params.birthday) params.birthday = parseInt(params.birthday / 1000);
                params.storename = params.storeName;
                delete params.storeName;
                params.storeId = this.shop.id;
                userApi.userBackUserUpdate(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '更新成功').then(() => {
                        this.$router.back();
                    })
                }).finally(() => this.loading = false);
            }
        },
        mounted() {
            this.getUserInfo(this.$route.params.id);
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    }
</script>

<style scoped>

</style>
