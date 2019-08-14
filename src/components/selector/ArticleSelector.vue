<template>
    <div class="store-selector">
        <el-select v-model="form" filterable remote reserve-keyword :remote-method="getData" style="width: 300px"
                   :disabled="disabled">
            <el-option :value="undefined" label="全部" v-if="showAll"/>
            <el-option v-for="item in list" :key="item.value" :label="item.title" :value="item.id"/>
        </el-select>
    </div>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    import api from '../../common/apis/article';
    import {mapGetters} from 'vuex';

    export default {
        name: 'ArticleSelector',
        mixins: [vModelMixins],
        props: {
            value: {},
            showAll: {type: Boolean, default: false},
            disabled: {type: Boolean}
        },
        data() {
            return {
                list: [],
                defaultData: []
            };
        },
        computed: {
            ...mapGetters(['shop'])
        },
        methods: {
            getData(search) {
                if (search !== undefined) {
                    this.defaultData = [];
                }
                api.getList({title: search, column: 'id,title', storeId: this.shop.id, pageSize: 100}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        if (data.rowCount > 0) {
                            this.list = [...this.defaultData, ...data.rows];
                        } else {
                            this.list = this.defaultData;
                        }
                    });
                });
            },
            async getDefaultData() {
                if (!this.value) return await true;
                return await api.get(this.value, 'id,title').then(async (res) => {
                    return await this.$util.handelHttpResponseResult(res, false, '', false).then(async ({data}) => {
                        this.defaultData = [data];
                        return await true;
                    }).then(async () => {
                        return await true;
                    });
                });
            }
        },
        mounted() {
            this.getDefaultData().finally(() => {
                this.getData();
            });
        }
    };
</script>

<style scoped>

</style>
