<template>
    <el-select v-model="form" filterable remote reserve-keyword :remote-method="getData" :value="form"
               v-loading="loading"
               :disabled="disabled"
               @click.native.prevent="getData()">
        <el-option :value="undefined" label="全部" v-if="showAll"/>
        <el-option v-for="item in list" :key="item.value" :label="item.name" :value="item.id"/>
    </el-select>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import api from '@/common/apis/brand';
    import {mapGetters} from 'vuex';

    export default {
        name: 'BrandSelector',
        mixins: [vModelMixins],
        props: {
            value: {type: String},
            showAll: {type: Boolean, default: false},
            disabled: Boolean,
            ownerId: {type: String},
            hasDefault: {type: Boolean, default: false}
        },
        data() {
            return {
                loading: false,
                list: []
            };
        },
        methods: {
            getData(search) {
                this.loading = false;
                let params = {name: search, column: 'id,name', pageSize: 100, storeId: this.shop.id, verifyStatus: 2};
                params.ownerId = this.ownerId;
                params.list = true;
                api.list(params).then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.list = data.rows;
                        if (data.rowCount > 0 && this.hasDefault && this.role.roleID === '14') this.form = data.rows.pop().id + '';
                    });
                }).finally(() => this.loading = false);
            }
        },
        mounted() {
            this.getData();
        },
        watch: {
            async ownerId() {
                await this.$nextTick();
                this.getData();
            }
        },
        computed: {
            ...mapGetters({shop: 'shop', role: 'role', user: 'user'})
        }
    };
</script>

<style scoped>
</style>
