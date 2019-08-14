<template>
    <div v-loading="loading">
        <breadcrumb :options="['内容管理', '修改栏目']"/>
        <div class="main-container">
            <article-category-form
                    v-model="form"
                    @restore="restore"
                    @submit="onSubmit"
                    :select-value="selectClass">
                <el-button type="primary" native-type="submit">保存</el-button>
                <el-button @click="$router.push({name: 'ArticleCategoryList'})">取消</el-button>
            </article-category-form>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from '../../../components/widget/breadcrumb';
    import ArticleCategoryForm from '../../../components/form/ArticleCategoryForm';
    import articleClassApi from '../../../common/apis/articleClass';

    export default {
        components: {ArticleCategoryForm, Breadcrumb},
        data() {
            return {
                loading: false,
                form: {
                    parentId: undefined
                },
                selectClass: []
            };
        },
        methods: {
            onSubmit() {
                this.loading = true;
                articleClassApi.edit(this.form).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '更新成功').then(() => {
                        this.$router.replace({name: 'ArticleCategoryList'});
                    });
                }).finally(() => this.loading = false);
            },
            getCategoryData() {
                this.loading = true;
                articleClassApi.get({id: this.form.id, column: 'id,icon,name,sortId,disabled,parentId'}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(data => {
                        let category = data.data;
                        let classPath = category.classPath;
                        delete category.classPath;
                        if (category.disabled === undefined) {
                            category.disabled = false;
                        }
                        this.form = category;
                        this.setSelectClass([classPath], category.id);
                        console.info(this.selectClass);
                    });
                }).finally(() => this.loading = false);
            },
            restore() {
                this.$util.actionConfirm('是否' + (this.form.deleteTime ? '恢复' : '删除') + '此分类?').then(() => {
                    this.loading = true;
                    articleClassApi.deleted(this.form.id).then(res => {
                        this.$util.handelHttpResponseResult(res).then(() => {
                            this.getCategoryData();
                        });
                    }).finally(() => this.loading = false);
                });
            },
            setSelectClass(data, id) {

                try {
                    data.forEach((item) => {
                        if (item.class.id === id) return;
                        if (item.class.id === undefined ) return;
                        this.selectClass.push(item.class.id);
                        if (item.subClass !== null && item.subClass !== undefined) {
                            this.setSelectClass(item.subClass, id);
                        }
                    });
                } catch (e) {
                    this.$message.warning('解析类别失败');
                }
            }
        },
        mounted() {
            this.form.id = this.$route.params.id;
            this.getCategoryData();
        }
    };
</script>

<style scoped>

</style>