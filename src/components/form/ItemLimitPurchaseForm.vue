<template>
    <el-form :model="form" @submit.native.prevent="onSubmit" ref="form" :rules="rules" label-width="80px">
        <el-form-item label="选择商品" prop="itemId">
            <goods-selector @select="onItemSelect" :select-sku="false" :modal="false" :is-gift="0" btn-text="选择"/>
            <item-brief :data="itemInfo"/>
        </el-form-item>
        <el-form-item label="限购数量" prop="count">
            <el-input-number v-model="form.count" :min="1"/>
        </el-form-item>
        <el-form-item>
            <slot>
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </slot>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import GoodsSelector from '@/components/selector/GoodsSelector';
    import ItemBrief from '@/components/widget/ItemBrief';
    import validator from 'el-form-validator';

    export default {
        name: 'ItemLimitPurchaseForm',
        components: {ItemBrief, GoodsSelector},
        mixins: [vModelMixins],
        data() {
            return {
                itemInfo: {},
                rules: {
                    itemId: {
                        required: true,
                        message: '必须选择商品'
                    },
                    count: [
                        {
                            required: true,
                            message: '数量必须填写'
                        }, {
                            rules: ['required', 'integer', 'min:1'],
                            validator: validator.verification
                        }
                    ]
                }
            };
        },
        methods: {
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$emit('submit', this.form);
                    } else {
                        this.$message.error('表单数据不完整');
                    }
                });
            },
            onItemSelect(item) {
                this.itemInfo = item;
                this.form.itemId = item.id;
            }
        },
        watch: {
            form (n) {
                this.itemInfo = {};
                this.$emit('input', n);
            }
        }
    };
</script>

<style scoped>

</style>
