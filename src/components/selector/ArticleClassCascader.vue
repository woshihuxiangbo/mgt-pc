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
        name: 'ArticleClassCascader',
        props: {
            value: {type: String},
            selectValue: {
                type: Array, default: () => {
                    return [];
                }
            },
            dataId: {type: String},
            topClass: {
                type: Object, default: () => {
                    return undefined;
                }
            }
        },
        data() {
            return {
                loading: false,
                options: [],
                selectedOptions: this.selectValue,
                defaultOption: []
            };
        },
        methods: {
            getData() {
                this.loading = true;
                api.struct({storeId: this.shop.id}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.defaultOption = data;
                        this.options = this.resolveClassData(this.defaultOption);
                    });
                }).finally(() => this.loading = false);
            },
            handleChange(items) {
                let length = items.length;
                if (length > 0) {
                    this.$emit('change', items[length - 1]);
                    this.$emit('input', items[length - 1]);
                }
            },
            changeData(items) {
                let length = items.length;
                if (length > 0) {
                    this.$emit('change', items[length - 1]);
                    this.$emit('input', items[length - 1]);
                }
            },
            resolveClassData(data) {
                let list = [];
                data.forEach((item) => {
                    if (item.class.id === this.dataId) {
                    } else {
                        let obj = {
                            value: item.class.id,
                            label: item.class.name
                        };

                        if (!!item.subClass) {
                            obj.children = this.resolveClassData(item.subClass);
                        }
                        list.push(obj);
                    }
                });
                return list;
            }
        },
        watch: {
            async selectValue(n) {
                await this.$nextTick();
                this.selectedOptions = n;
            },
            value() {
                this.options = this.resolveClassData(this.defaultOption);
            }
        },
        computed: {
            ...mapGetters({shop: 'shop'}),
            selectData() {
                if (this.topClass === undefined) {
                    return this.options;
                }
                return [
                    this.topClass,
                    ...this.options
                ];
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped>

</style>