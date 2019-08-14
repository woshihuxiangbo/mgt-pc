<template>
    <div class="store-selector">
        <el-select v-model="form" filterable remote reserve-keyword :remote-method="getData" :value="form"
                   :disabled="disabled">
            <el-option :value="undefined" label="全部" v-if="showAll"/>
            <el-option v-for="item in list" :key="item.value" :label="item.name" :value="item.id"/>
        </el-select>
    </div>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    import api from '../../common/apis/firm';

    export default {
        name: 'FirmSelector',
        mixins: [vModelMixins],
        props: {
            value: {},
            showAll: {type: Boolean, default: false},
            disabled: Boolean
        },
        data() {
            return {
                list: []
            };
        },
        methods: {
            getData(search) {
                api.list({name: search, column: 'id,name', pageSize: 100}).then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.list = data.rows;
                    });
                });
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped>
</style>
