<template>
    <div class="shop" v-loading="loading">
        <breadcrumb :options="['商品管理', '分类管理', '修改分类']"/>
        <div class="main-container">
            <category-form v-model="form" @submit="onSubmit">
                <el-button type="primary" native-type="submit">修改</el-button>
            </category-form>
        </div>
    </div>
</template>

<script>
    import api from '@/common/apis/category';
    import CategoryForm from '@/components/form/CategoryForm';
    import {mapGetters} from 'vuex'

    export default {
        components: {CategoryForm},
        data() {
            return {
                loading: false,
                id: undefined,
                form: {},
                column: 'id,name,icon,itemCount,sortId,disabled,deleteTime,name,isGift,nameEn,parentId,isGroup'
            };
        },
        methods: {
            onSubmit() {
                this.loading = true;
                let params = JSON.parse(JSON.stringify(this.form));
                if (params.parentId === undefined) params.parentId = '0';
                params.storeId = this.shop.id;
                api.edit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '更新成功').then(() => {
                        this.$router.back()
                    });
                }).finally(() => this.loading = false);
            },
            getData() {
                this.loading = true;
                api.get({id: this.id, column: this.column, storeId: this.shop.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        data.id = this.id;
                        if (data.disabled === undefined) data.disabled = false;
                        if (data.sortId === undefined) data.sortId = 0;
                        if (data.parentId === '0') data.parentId = undefined;
                        this.form = data;
                    });
                }).finally(() => this.loading = false);
            }
        },
        created() {
            this.id = this.$route.params.id;
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    };
</script>

<style scoped lang="scss">
</style>
