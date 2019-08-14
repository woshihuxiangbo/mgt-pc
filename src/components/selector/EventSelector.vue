<template>
    <div class="store-selector">
        <el-select v-model="form" filterable remote reserve-keyword :remote-method="getData" style="width: 300px"
                   :value="form" :disabled="disabled">
            <el-option :value="undefined" label="全部" v-if="showAll"/>
            <el-option v-for="item in list" :key="item.value" :label="gotToType(item.type)" :value="item.id"/>
        </el-select>
    </div>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    import api from '../../common/apis/event';
    import {mapGetters} from 'vuex';

    export default {
        name: "EventSelector",
        mixins: [vModelMixins],
        props: {
            value: {},
            showAll: {type: Boolean, default: false},
            storeId: {type: Number | String, default: undefined},
            disabled: {type: Boolean}
        },
        data() {
            return {
                list: []
            }
        },
        computed: {
            ...mapGetters(['shop'])
        },
        methods: {
            getData(search) {
                api.list({storeName: search, column: 'id,title,type', storeId: this.shop.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.list = data.rows;
                    })
                })
            },
            gotToType (type) {
                switch (type) {
                    case 1: return '普通';
                    case 2: return '秒杀';
                    case 3: return '社区拼团';
                    case 4: return '砍价';
                    case 5: return '入店礼包';
                    case 6: return '免费领礼品';
                    default: return '-';
                }
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>
