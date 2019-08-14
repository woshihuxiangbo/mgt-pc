<template>
    <el-form :model="form" label-width="80px" @submit.native.prevent="onSubmit" :rules="rules" ref="form">
        <el-form-item label="收件人" prop="name">
            <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="座机号码" prop="tel">
            <el-input v-model="form.tel"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="form.mobile"/>
        </el-form-item>
        <el-form-item label="地区" :rules="{required: true, message: '请选择地址'}">
            <el-cascader :options="regionData" v-model="location" @change="handleChange"/>
        </el-form-item>
        <el-form-item prop="details">
            <el-input type="textarea" v-model="form.details"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="postcode">
            <el-input v-model="form.postcode"/>
        </el-form-item>
        <el-form-item label="是否默认">
            <el-switch v-model="form.isDefault"/>
        </el-form-item>
        <el-form-item>
            <slot>
                <el-button type="primary" native-type="submit">提交</el-button>
            </slot>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import validator from 'el-form-validator';
    import {regionData, CodeToText, TextToCode} from 'element-china-area-data';

    export default {
        name: 'AddressForm',
        mixins: [vModelMixins],
        data() {
            return {
                location: [],
                regionData,
                rules: {
                    name: {
                        required: true,
                        message: '请输入联系人',
                        trigger: 'blur'
                    },
                    mobile: [
                        {
                            required: true,
                            message: '请输入手机号',
                            trigger: 'blur'
                        },
                        {
                            rules: ['string', 'min:11', 'max:11', 'regex:/^1[3|4|5|7|8][0-9]{9}$/'],
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    tel: [
                        {
                            rules: ['string', 'min:6', 'max:18', 'regex:/^0\d{2,3}-?\d{7,8}$/', 'nullable'],
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    details: {
                        required: true,
                        message: '请输入详细地址',
                        trigger: 'blur'
                    },
                    postcode: {
                        rules: ['string', 'min:6', 'max:6', 'regex: /^[1-9][0-9]{5}$/', 'nullable'],
                        validator: validator.verification,
                        trigger: 'blur'
                    }
                }
            };
        },
        methods: {
            handleChange(data) {
                let l = [];
                for (let i in data) {
                    l.push(CodeToText[data[i]]);
                }
                try {
                    this.form.province = l[0];
                    this.form.city = l[1];
                    this.form.county = l[2];
                } catch (e) {
                    this.$message.error('格式化地址出错啦');
                }
            },
            locationTextToCode() {
                let data = [this.form.province, this.form.city, this.form.county];
                let list = [];
                try {
                    list.push(TextToCode[data[0]].code);
                    list.push(TextToCode[data[0]][data[1]].code);
                    list.push(TextToCode[data[0]][data[1]][data[2]].code);
                } catch (e) {
                }
                this.location = list;
            }
        },
        watch: {
            async value(newVal) {
                this.form = newVal;
                await this.$nextTick();
                this.locationTextToCode();
            }
        },
        created() {
            this.locationTextToCode();
        }
    };
</script>

<style scoped>

</style>
