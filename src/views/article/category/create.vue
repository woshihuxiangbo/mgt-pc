<template>
    <div class="create" v-loading="loading">
        <breadcrumb :options="['内容管理', '创建栏目']"/>
        <div class="main-container">
            <article-category-form v-model="form" @submit="onSubmit">
                <el-button type="primary" native-type="submit">立即创建</el-button>
                <el-button @click="$router.push({name: 'ArticleCategoryList'})">取消</el-button>
            </article-category-form>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from "../../../components/widget/breadcrumb";
    import ArticleCategoryForm from "../../../components/form/ArticleCategoryForm";
    import articleClassApi from '../../../common/apis/articleClass';
    import {mapGetters} from 'vuex';

    export default {
        components: {ArticleCategoryForm, Breadcrumb},
        data() {
            return {
                loading: false,
                form: {
                    parentId: undefined,
                    name: undefined,
                    disabled: false,
                    sortId: undefined
                }
            }
        },
        methods: {
            onSubmit() {
                this.loading = true;
                this.form.storeId = this.shop.id;
                articleClassApi.add(this.form).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建文章分类成功').then(() => {
                        this.$router.replace({name: 'ArticleCategoryList'});
                    })
                }).catch().finally(() => this.loading = false);
            }
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    }
</script>

<style scoped>

</style>