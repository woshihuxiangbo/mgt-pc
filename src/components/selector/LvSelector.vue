<template>
    <!--filterable-->
    <el-select v-model="form" remote reserve-keyword :remote-method="getData" :value="form" :size="size"
               v-loading="loading">
        <el-option :value="undefined" label="全部" v-if="showAll"
                   @click.native="onOptionClick(item)"/>
        <el-option v-for="(item, i) in list" :key="i" :label="item.label" :value="item[valueKey]"
                   v-if="show(item)"
                   @click.native="onOptionClick(item)"/>
    </el-select>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    // import storeApi from '../../common/apis/store';
    import {mapGetters} from 'vuex';
    import userApi from '@/common/apis/user';

    export default {
        name: 'LvSelector',
        mixins: [vModelMixins],
        props: {
            value: {},
            showAll: {type: Boolean, default: false},
            isComplete: {type: Boolean, default: false},
            size: {type: String},
            valueKey: {type: String, default: 'value'},
            isAdvanced: {type: Boolean, default: false},
            advancedData: {
                type: Array,
                default: () => {
                    return ['9', '10'];
                }
            }
        },
        data() {
            return {
                loading: false,
                list: []
            };
        },
        computed: {
            ...mapGetters(['shop'])
        },
        methods: {
            getData() {
                this.loading = true;
                userApi.getUserLevel(this.shop.id).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        let list = [];
                        for (let key in data) {
                            let value = key.replace('lv', '');
                            list.push({
                                value,
                                label: data[key].name,
                                price: data[key].price
                            });
                        }
                        //[0] 副会长 lv1   [1]主席 lv3  [2] 会长 lv2  [3] 会员 lv10  [4] 访客 lv9

                        let lvlast2 = list.splice(3, 2);
                        list.unshift(lvlast2[1], lvlast2[0]);
                        let lv3 = list.splice(3, 1);
                        list.push(...lv3);

                        this.list = list;
                        this.$emit('onGetData', list);
                    });
                }).finally(() => this.loading = false);
            },
            onOptionClick(item) {
                console.info(item);
            },
            show(item) {
                return !(this.isAdvanced && this.advancedData.indexOf(item.value) !== -1);
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped>

</style>
