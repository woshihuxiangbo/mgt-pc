<template>
    <div class="article" v-loading="loading">
        <breadcrumb :options="['内容管理', '添加内容']"/>
        <div class="main-container">
            <article-form v-model="form" @submit="onSave">
                <el-button type="primary" native-type="submit">保存</el-button>
            </article-form>
        </div>
    </div>
</template>

<script>
    import ArticleForm from "../../../components/form/ArticleForm";
    import articleApi from '../../../common/apis/shop/article';

    export default {
        components: {ArticleForm},
        data () {
            return {
                loading: false,
                form: {}
            }
        },
        methods: {
            onSave () {
                this.loading = true;
                articleApi.add(this.form).then (res => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.$router.push({name: 'ShopArticleList'});
                    })
                }).finally(() => this.loading = false)
            }
        }
    }
</script>

<style scoped>

</style>