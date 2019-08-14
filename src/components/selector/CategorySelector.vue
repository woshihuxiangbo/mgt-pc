<template>
    <div class="category-cascader">
        <!--        <div>-->
        <!--            <el-checkbox v-if="showGift && hasIsGiftCategory" v-model="check" label="是否礼包商品"/>-->
        <!--        </div>-->
        <el-cascader v-loading="loading" v-show="!check"
                     :options="options"
                     v-model="selectedOptions"
                     :disabled="disabled"
                     @change="handleChange"
                     change-on-select
                     @active-item-change="changeData"/>
    </div>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    import api from '../../common/apis/category';
    import {mapGetters} from 'vuex';

    export default {
        name: 'CategorySelector',
        mixins: [vModelMixins],
        props: {
            value: {type: String},
            showAll: {type: Boolean, default: false},
            defaultData: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            isGroup: {type: Boolean},
            selectValue: {
                type: Array, default: () => {
                    return [];
                }
            },
            showGift: {type: Boolean, default: false},
            disabled: {type: Boolean, default: false},
            isChecked: {type: Boolean, default: false},
            ownerId: {type: String}
        },
        data() {
            return {
                options: [],
                loading: false,
                isGift: false,
                selectedOptions: this.selectValue,
                hasIsGiftCategory: false,
                giftCategoryId: undefined,
                check: this.isChecked
            };
        },
        methods: {
            getData() {
                let params = {storeId: this.shop.id, isGroup: this.isGroup, verifyStatus: 2};
                if (this.ownerId && this.ownerId !== '0') {
                    params.ownerId = this.ownerId
                }
                api.struct(params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.options = this.resolveClassData(data);
                    });
                });
                api.list({storeId: this.shop.id, column: 'id,name', isGroup: this.isGroup}).then(res => {
                    this.$util.handelHttpResponseResult(res, false, '', false).then(({data}) => {
                        if (data.rowCount <= 0) {
                            this.hasIsGiftCategory = false;
                        } else {
                            this.giftCategoryId = data.rows[0].id;
                            this.hasIsGiftCategory = true;
                        }
                    });
                }).catch(() => this.hasIsGiftCategory = false);
            },
            resolveClassData(data) {
                let list = [];
                data.forEach((item) => {
                    let obj = {
                        value: item.category.id,
                        label: item.category.name
                    };

                    if (!!item.subCategory) {
                        obj.children = this.resolveClassData(item.subCategory);
                    }
                    list.push(obj);
                });
                return list;
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
                    console.info(items[length - 1]);
                    this.$emit('change', items[length - 1]);
                    this.$emit('input', items[length - 1]);
                }
            }
        },
        mounted() {
            this.getData(undefined, this.defaultData);
        },
        computed: {
            ...mapGetters(['shop'])
        },
        watch: {
            check(n) {
                if (n) {
                    this.$emit('input', this.giftCategoryId);
                } else {
                    this.$emit('input', undefined);
                }
            },
            isChecked(n) {
                this.check = n;
            },
            value(n) {
                if (n === undefined) {
                    this.selectedOptions = [];
                }
            },
            async ownerId () {
                await this.$nextTick();
                this.getData();
            }
        }
    };
</script>

<style scoped lang="scss">
</style>
