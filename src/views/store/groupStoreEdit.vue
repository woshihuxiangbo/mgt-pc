<template>
    <div class="main-container">
        <store-group-form v-model="form" @submit="submit"></store-group-form>
    </div>
</template>

<script>
    import StoreGroupForm from '@/components/form/StoreGroupForm';
    import api from '@/common/apis/group/leader';

    export default {
        components: {StoreGroupForm},
        data() {
            return {
                loading: false,
                form: {
                    id: undefined,
                    status: undefined, // 0下架 1 上架
                    logo: undefined,
                    backgroundImage: undefined,
                    storeName: undefined,
                    shopIntroduce: undefined,
                    developmentCourse: undefined,
                    companyAddress: undefined,
                    mobile: undefined,
                    picture: []
                }
            };
        },
        methods: {
            getData() {
                this.loading = true;
                api.getOne().then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (!data.picture) data.picture = [];
                        try {
                            data.picture = JSON.parse(data.picture);
                        } catch (e) {
                            data.picture = [];
                        }
                        data.picture = data.picture.map(item => {
                            return {url: process.env.VUE_APP_IMAGE_BASE_URL + item};
                        });
                        this.form = data;
                    });
                }).finally(() => this.loading = false);
            },
            submit() {
                this.loading = true;
                let params = this.$util.deepClone(this.form);
                params.picture = JSON.stringify(params.picture.map(item => {
                    return item.url.replace(process.env.VUE_APP_IMAGE_BASE_URL, '');
                }));
                api.updateStore(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true).then(this.getData);
                }).finally(() => this.loading = false);
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped>

</style>
