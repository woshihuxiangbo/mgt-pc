<template>
    <div class="article" v-loading="loading">
        <breadcrumb :options="['内容管理', '编辑内容']"/>
        <div class="main-container">
            <article-form v-model="form" @submit="onSubmit" :default-select-class="selectClass">
                <el-button type="primary" native-type="submit">保存</el-button>
            </article-form>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from "../../components/widget/breadcrumb";
    import ArticleForm from "../../components/form/ArticleForm";
    import articleApi from '../../common/apis/article';
    import {mapGetters} from 'vuex';

    export default {
        components: {ArticleForm, Breadcrumb},
        data() {
            return {
                loading: false,
                id: undefined,
                form: {},
                column: '',
                selectClass: []
            }
        },
        methods: {
            getData () {
                this.loading = true;
                articleApi.get(this.id, this.column).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        let article = data.article;
                        article.id = this.id;
                        article.showTime = parseInt(this.form.showTime * 1000);
                        article.showTime = parseInt(this.form.showTime * 1000);
                        if (article.disabled === undefined) {
                            article.disabled = false;
                        }
                        if (!article.sortId) article.sortId = 0;
                        this.form = article;
                        this.setSelectClass([data.classPath]);
                    })
                }).finally(() => this.loading = false)
            },
            onSubmit () {
                this.loading = true;
                let params = Object.assign({}, this.form, {id: this.id});
                params.showTime = parseInt(params.showTime / 1000);
                articleApi.update(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '文章更新成功').then(() => {
                        this.$router.replace({name: 'ArticleList'});
                    });
                }).finally(() => this.loading = false);
            },
            setSelectClass (data) {
                try {
                    data.forEach((item) => {
                        if (item.class.id === undefined) return;
                        this.selectClass.push(item.class.id);
                        if (item.subClass !== null && item.subClass !== undefined) {
                            this.setSelectClass(item.subClass);
                        }
                    })
                } catch (e) {
                    this.$message.warning('解析类别失败');
                }
            }
        },
        created() {
            this.id = this.$route.params.id;
            this.getData ();
        },
        computed: {
            ...mapGetters({shop: "shop"})
        }
    }
</script>

<style scoped lang="scss">

</style>