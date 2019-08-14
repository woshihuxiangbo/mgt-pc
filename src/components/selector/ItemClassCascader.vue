<template>
    <el-cascader v-loading="loading"
            :options="selectData"
            v-model="selectedOptions"
            @change="handleChange"
            change-on-select
            @active-item-change="changeData"/>
</template>

<script>
    import api from '@/common/apis/articleClass';
    import {mapGetters} from 'vuex';

    export default {
        name: "ArticleClassCascader",
        props: {
            selectValue: {
                type: Array, default: () => {
                    return []
                }
            },
            topClass: {
                type: Object, default: () => {
                    return undefined
                }
            }
        },
        data() {
            return {
                loading: false,
                options: [],
                selectedOptions: this.selectValue,
            }
        },
        methods: {
            getData() {
                this.loading = true;
                api.struct({storeId: this.shop.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.options = this.resolveClassData(data);
                    })
                }).finally(() => this.loading = false);
            },
            handleChange(items) {
                let length = items.length;
                if (length > 0) {
                    this.$emit('change', items[length - 1]);
                }
            },
            changeData (items) {
                let length = items.length;
                if (length > 0) {
                    this.$emit('change', items[length - 1]);
                }
            },
            resolveClassData (data) {
                let list = [];
                data.forEach((item) => {
                    let obj = {
                        value: item.class.id,
                        label: item.class.name
                    };

                    if (!!item.subClass) {
                        obj.children = this.resolveClassData(item.subClass);
                    }
                    list.push(obj);
                });
                return list;
            }
        },
        watch: {
            async selectValue(n) {
                await this.$nextTick();
                this.selectedOptions = n;
            }
        },
        computed: {
            ...mapGetters({shop: "shop"}),
            selectData() {
                if (this.topClass === undefined) {
                    return this.options;
                }
                return [
                    this.topClass,
                    ...this.options
                ]
            }
        },
        mounted () {
            this.getData();
        }
    }
</script>

<style scoped>

</style>