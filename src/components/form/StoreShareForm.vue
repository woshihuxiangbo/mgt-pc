<template>
    <el-form ref="form" :model="form" :rules="rules" label-position="left"
             @submit.native.prevent="onSubmit">
        <el-row type="flex" :gutter="20">
            <el-row>
                <el-form-item label="图片设置" prop="src" label-width="80px">
                    <cropper-image v-model="form.src"
                                   :options="{autoCropWidth: 240,autoCropHeight: 400, info: false, enlarge: 4}"
                                   width="240px"
                                   height="400px"/>
                </el-form-item>
            </el-row>
            <el-row style="flex: 1">
                <el-form-item label="颜色" prop="color" label-width="80px">
                    <el-color-picker v-model="form.color"/>
                </el-form-item>
                <el-form-item label="文字颜色" prop="fontColor" label-width="80px">
                    <el-color-picker v-model="form.fontColor"/>
                </el-form-item>
                <el-form-item label="标题" prop="title" label-width="80px">
                    <el-input v-model="form.title"/>
                </el-form-item>
                <el-form-item label="副标题" prop="title" label-width="80px">
                    <el-input v-model="form.subtitle"/>
                </el-form-item>
                <el-form-item label="底部文字" prop="title" label-width="80px">
                    <el-input v-model="form.footerText"/>
                </el-form-item>
            </el-row>
        </el-row>
        <el-form-item align="end">
            <el-button type="primary" native-type="submit">保存</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import CropperImage from '@/components/widget/CropperImage';
    import vModelMixins from '@/components/mixins/vModelMixins';

    export default {
        name: 'StoreShareForm',
        mixins: [vModelMixins],
        components: {CropperImage},
        data() {
            return {
                rules: {
                    src: {
                        required: true,
                        message: '必须上传图片'
                    },
                    fontColor: {
                        required: true,
                        message: '必须选择颜色'
                    },
                    color: {
                        required: true,
                        message: '必须选择颜色'
                    }
                }
            };
        }
    };
</script>

<style scoped>

</style>
