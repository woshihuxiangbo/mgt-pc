<template>
    <div class="shop" v-loading="loading">
        <breadcrumb :options="['广告管理', '编辑广告']"/>
        <div class="main-container">
            <my-form v-model="form" @submit="onSubmit" ref="form">
                <el-button type="primary" native-type="submit">保存</el-button>
                <el-button @click="()=>this.$router.go(-1)">返回</el-button>
            </my-form>
        </div>
    </div>
</template>

<script>
    import myForm from '@/components/form/AdvForm';
    import api from '@/common/apis/adv';
    import {mapGetters} from 'vuex';

    export default {
        components: {myForm},
        data() {
            return {
                loading: false,
                id: undefined,
                form: {
                    name: undefined, //名称
                    note: undefined, //说明
                    width: undefined,
                    height: undefined,
                    displayCount: undefined, //显示数量
                    disabled: undefined
                }
            };
        },
        methods: {
            onSubmit() {
                this.loading = true;
                api.edit(this.form).then((res) => {
                    this.$util.handelHttpResponseResult(res, true, '更新成功').then(() => {
                        this.$router.push({name: 'advList'});
                    });
                }).finally(() => (this.loading = false));
            },
            getData() {
                this.loading = true;
                api.get({
                    id: this.id,
                    column: 'id,name,note,display_count, disabled,delete_time,ratio'
                })
                    .then((res) => {
                        this.$util.handelHttpResponseResult(res, false).then((data) => {
                            const form = data.data;
                            let ratio = form.ratio;
                            form.width = ratio.split(':')[0];
                            form.height = ratio.split(':')[1];
                            if (form.disabled === undefined) {
                                form.disabled = false;
                            }
                            this.form = form;
                            this.form.id = this.id;
                        });
                    }).finally(() => (this.loading = false));
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