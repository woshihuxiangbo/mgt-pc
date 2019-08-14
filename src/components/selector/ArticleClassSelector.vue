<template>
    <div class="store-selector">
        <el-select v-model="form" filterable remote reserve-keyword  :remote-method="getData">
            <el-option :value="undefined" label="全部" v-if="showAll"/>
            <el-option :value="item.id" :label="item.name" v-for="(item, i) in list" :key="i"/>
        </el-select>
    </div>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import api from '@/common/apis/articleClass';
    import {mapGetters} from 'vuex';

    export default {
        name: "ArticleClassSelector",
        mixins: [vModelMixins],
        props: {
            value: {},
            showAll: {type: Boolean, default: false}
        },
        data () {
            return {
                list: []
            }
        },
        methods: {
            getData (search) {
                api.getList({name: search, column: 'id,name', storeId: this.shop.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.list = data.rows;
                    })
                })
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        }
    }
</script>

<style scoped>

</style>