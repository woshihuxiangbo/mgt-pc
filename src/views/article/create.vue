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
    import Breadcrumb from "../../components/widget/breadcrumb";
    import ArticleForm from "../../components/form/ArticleForm";
    import articleApi from '../../common/apis/article';
    import {mapGetters} from 'vuex';

    export default {
        components: {ArticleForm, Breadcrumb},
        data() {
            return {
                loading: false,
                form: {
                    body: '',
                    classId: undefined,
                    storeId: undefined,
                    picture: undefined,
                    title: undefined,
                    abstract: undefined,
                    viewCount: undefined,
                    sourceName: undefined,
                    sourceUrl: undefined,
                    sortId: 0,
                    disabled: false,
                    keepTime: 100,
                    showTime: undefined
                }
            }
        },
        methods: {
            onSave () {
                this.loading = true;
                let params = Object.assign({}, this.form);
                params.showTime = parseInt(params.showTime / 1000);
                params.storeId = this.shop.id;
                articleApi.create(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.$router.replace({name: 'ArticleList'});
                    });
                }).finally(() => this.loading = false)
            }
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    }
</script>

<style scoped lang="scss">
</style>