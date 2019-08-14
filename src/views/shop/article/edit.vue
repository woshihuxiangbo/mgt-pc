<template>
    <div class="article" v-loading="loading">
        <breadcrumb :options="['内容管理', '编辑内容']"/>
        <div class="main-container">
            <article-form v-model="form" @submit="onSubmit">
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
                id: undefined,
                form: {

                },
                column: ''
            }
        },
        methods: {
            getData () {
                this.loading = true;
                articleApi.get({id: this.id}).then(res => {
                    this.$util.handelHttpResponseResult(res).then(data => {
                        this.form = data.data;
                        if (this.form.disabled === undefined) {
                            this.form.disabled = false;
                        }
                    })
                }).finally(() => this.loading = false)
            },
            onSubmit () {
                this.loading = true;
                let params = Object.assign({}, this.form, {id: this.id});
                articleApi.update(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '文章更新成功').then();
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