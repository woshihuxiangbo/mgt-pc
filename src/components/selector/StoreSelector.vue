<template>
    <div class="store-selector">
        <el-select v-model="form" filterable remote reserve-keyword  :remote-method="getData">
            <el-option :value="undefined" label="全部" v-if="showAll"/>
            <el-option v-for="item in list" :key="item.value" :label="item.name" :value="item.id"/>
        </el-select>
    </div>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    import storeApi from '../../common/apis/store';

    export default {
        name: "StoreSelector",
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
                storeApi.getStoreList({storeName: search, column: 'id,name'}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.list = data.rows;
                    })
                })
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>