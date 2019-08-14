<template>
    <div class="shop" v-loading="loading">
        <breadcrumb :options="['商品管理', '品牌管理', '修改品牌']"/>
        <div class="main-container">
            <brand-form v-model="form" @submit="onSubmit">
                <el-button type="primary" native-type="submit">修改</el-button>
            </brand-form>
        </div>
    </div>
</template>

<script>
    import BrandForm from '@/components/form/BrandForm';
    import brandApi from '@/common/apis/brand';

    export default {
        components: {BrandForm},
        data() {
            return {
                loading: false,
                id: undefined,
                form: {},
                column: 'id,name,logo,sortId,disabled,deleteTime,itemCount'
            };
        },
        methods: {
            onSubmit() {
                this.loading = true;
                brandApi.edit(this.form).then((res) => {
                    this.$util.handelHttpResponseResult(res, true, '更新成功').then(()=>this.$router.back());
                }).finally(() => (this.loading = false));
            },
            getData() {
                this.loading = true;
                brandApi.get({id: this.id, column: this.column}).then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        data.id = this.id;
                        if (data.disabled === undefined) {
                            data.disabled = false;
                        }
                        if (!data.sortId) data.sortId = 0;
                        this.form = data;
                    });
                }).finally(() => (this.loading = false));
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