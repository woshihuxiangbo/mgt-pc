<template>
    <div class="shop" v-loading="loading">
        <breadcrumb :options="['商品管理', '分类管理', '创建分类']"/>
        <div class="main-container">
            <category-form v-model="form" @submit="onSubmit">
                <el-button type="primary" native-type="submit">提交</el-button>
            </category-form>
        </div>
    </div>
</template>

<script>
    import api from '../../../common/apis/category';
    import CategoryForm from '../../../components/form/CategoryForm';
    import {mapGetters} from 'vuex';

    export default {
        components: {CategoryForm},
        data() {
            return {
                loading: false,
                form: {
                    name: undefined,
                    icon: undefined,
                    sortId: 0,
                    disabled: false,
                    parentId: undefined,
                    isGift: false,
                    isGroup: false
                }
            };
        },
        methods: {
            onSubmit() {
                this.loading = true;
                this.form.storeId = this.shop.id;
                api.add(this.form).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.$router.push({name: 'salesmanCategory'});
                    });
                }).finally(() => this.loading = false);
            }
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    };
</script>

<style scoped lang="scss">
</style>
