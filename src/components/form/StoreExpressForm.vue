<template>
    <el-form class="form" label-width="100px" :model="form" :rules="rules" ref="form" @submit.native.prevent="onSubmit">
        <slot name="prepend" :data="form"></slot>
        <el-form-item label="配送方式" prop="method">
            <el-select v-model="form.method" :value="form.method">
                <el-option
                    :value="1"
                    label="快递">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="选择省份" prop="area">
            <el-select v-model="form.area" filterable placeholder="请选择省份" multiple style="width: 100%;"
                       :value="form.area">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
        </el-form-item>
        <el-form-item label="首单费用" prop="first">
            <el-input v-model="form.first">
                <template slot="prepend">￥</template>
            </el-input>
        </el-form-item>
        <el-form-item label="三单以上" prop="extend">
            <el-input v-model="form.extend">
                <template slot="prepend">￥</template>
            </el-input>
        </el-form-item>
        <el-form-item label="每箱费用" prop="batch">
            <el-input v-model="form.batch">
                <template slot="prepend">￥</template>
            </el-input>
        </el-form-item>
        <slot name="append" :data="form"></slot>
        <el-form-item>
            <slot/>
        </el-form-item>
    </el-form>
</template>
<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import validator from 'el-form-validator';
    import {provinceAndCityData} from 'element-china-area-data';

    export default {
        name: 'StoreExpressForm',
        mixins: [vModelMixins],
        props: {
            optionsData: {
                type: Array, default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                provinceAndCityData,
                rules: {
                    first: [
                        {
                            required: true,
                            message: '请输入费用',
                            trigger: 'blur'
                        },
                        {
                            rules: 'required|min:0|numeric',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    extend: [{
                        required: true,
                        message: '请输入费用',
                        trigger: 'blur'
                    },
                        {
                            rules: 'required|min:0|numeric',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    batch: [
                        {
                            required: true,
                            message: '请输入费用',
                            trigger: 'blur'
                        },
                        {
                            rules: 'required|min:0|numeric',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    area: [{
                        required: true,
                        message: '请选择地区',
                        trigger: 'blur'
                    }],
                    method: [{
                        required: true,
                        message: '请选择配送方式',
                        trigger: 'blur'
                    }]
                }
            };
        },
        methods: {
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$emit('submit', e);
                    } else {
                        this.$message.warning('无法提交，数据不完整');
                    }
                });
            }
        },
        computed: {
            options() {
                let provinces = Object.assign([], this.provinceAndCityData);
                let area = [];
                this.optionsData.forEach((item) => {
                    area = [...area, ...item.area];
                });

                area = area.filter((item) => {
                    return this.form.area.indexOf(item) === -1;
                });

                let data = [];
                provinces.forEach((province) => {
                    delete province.children;
                    if (area.indexOf(province.value) !== -1) {
                        return;
                    }
                    data.push(province);
                });
                return data;
            }
        }
    };
</script>
