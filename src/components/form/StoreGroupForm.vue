<template>
    <el-form ref="form" @submit.native.prevent="onSubmit" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="店铺街" prop="status">
            <el-radio v-model="form.status" :label="1">上架</el-radio>
            <el-radio v-model="form.status" :label="0">下架</el-radio>
        </el-form-item>
        <el-form-item label="店铺logo" prop="logo">
            <upload-avatar v-model="form.logo"/>
        </el-form-item>
        <el-form-item label="店铺背景图" prop="background_image">
            <cropper-image v-model="form.backgroundImage" :oss-type="ossType.customize" :sub-mod="subMold.item"
                           width="400px" height="170px"
                           :options="{autoCropWidth: 400, autoCropHeight: 170, enlarge: 2, info: false}"/>
        </el-form-item>
        <el-form-item label="店铺名称">
            <el-input v-model="form.storeName"/>
        </el-form-item>
        <el-form-item label="店铺介绍">
            <el-input v-model="form.shopIntroduce" type="textarea" :rows="4" placeholder="（对应小程序的店铺简介）"/>
        </el-form-item>
        <el-form-item label="发展历程">
            <el-input v-model="form.developmentCourse" type="textarea" :rows="4"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
            <el-input v-model="form.mobile"/>
        </el-form-item>
        <el-form-item label="企业地址">
            <el-input v-model="form.address"/>
        </el-form-item>
        <el-form-item label="企业相册">
            <upload-slider :oss-type="ossType.item" :sub-mod="subMold.slide"
                           v-model="form.picture" :max="10"/>
        </el-form-item>
        <el-form-item align="center">
            <slot>
                <el-button type="primary" native-type="submit">提交</el-button>
            </slot>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import UploadAvatar from '@/components/widget/UploadAvatar';
    import CropperImage from '@/components/widget/CropperImage';
    import {ossType, subMold} from '@/common/apis/oss';
    import UploadSlider from '@/components/widget/UploadSlider';
    import validator from 'el-form-validator';

    export default {
        name: 'StoreGroupForm',
        components: {UploadSlider, CropperImage, UploadAvatar},
        mixins: [vModelMixins],
        data() {
            return {
                subMold,
                ossType,
                rules: {
                    logo: {
                        required: true,
                        message: '必须上传logo'
                    },
                    backgroundImage: {
                        required: true,
                        message: '必须上传'
                    },
                    storeNme: {
                        required: true,
                        message: '必须输入'
                    },
                    mobile: [
                        {
                            required: true,
                            message: '请输入手机号码',
                            trigger: 'blur'
                        },
                        {
                            rules: 'required|min:11|max:11',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ]
                }
            };
        }
    };
</script>

<style scoped>

</style>
