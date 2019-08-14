<template>
    <el-form label-width="80px" :data="form" :model="form" :rules="rules" class="article-form"
             @submit.native.prevent="onSubmit" ref="form">
        <el-form-item label="内容图片">
            <cropper-image v-model="form.picture" :oss-type="ossType.article" :options="options" width="200px" height="150px"/>
        </el-form-item>
        <el-form-item label="内容栏目" prop="classId">
            <article-class-cascader v-model="form.classId" @change="onClassChange" :select-value="defaultSelectClass" style="width: 400px"/>
        </el-form-item>
        <el-form-item label="内容标题" prop="title">
            <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="内容摘要" prop="digest">
            <el-input type="textarea" v-model="form.digest"/>
        </el-form-item>
        <!--<el-form-item label="来源名称" prop="sourceName">-->
            <!--<el-input v-model="form.sourceName"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="来源地址" prop="sourceUrl">-->
            <!--<el-input v-model="form.sourceUrl"/>-->
        <!--</el-form-item>-->
        <el-form-item label="展示时间">
            <el-date-picker v-model="form.showTime" type="datetime" placeholder="选择日期时间"
                            :picker-options="pickerOptions" value-format="timestamp"/>
        </el-form-item>
        <el-form-item label="排序ID" prop="sortId">
            <el-input-number v-model="form.sortId" placeholder="数值越大越靠前"/>
        </el-form-item>
        <el-form-item label="状态" prop="disabled">
            <el-select v-model="form.disabled" @change="disabledChange">
                <el-option :value="false" label="正常"/>
                <el-option :value="true" label="禁用"/>
            </el-select>
        </el-form-item>
        <el-form-item label="内容">
            <editor v-model="form.body"/>
        </el-form-item>
        <el-form-item>
            <slot/>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import CropperImage from "@/components/widget/CropperImage";
    import StoreSelector from "@/components/selector/StoreSelector";
    import ArticleClassSelector from "@/components/selector/ArticleClassSelector";
    import Editor from "@/components/widget/Editor";
    import {ossType} from '@/common/apis/oss';
    import ArticleClassCascader from "@/components/selector/ArticleClassCascader";

    export default {
        name: "ArticleForm",
        components: {ArticleClassCascader, Editor, ArticleClassSelector, StoreSelector, CropperImage},
        mixins: [vModelMixins],
        props: {
            defaultSelectClass: {type: Array, default: () => { return [] }}
        },
        data() {
            return {
                ossType,
                options: {

                },
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                selectGoods: {},
                tempSelect: {},
                rules: {
                    body: {},
                    classId: {
                        required: true,
                        message: '请选择分类'
                    },
                    storeId: {
                        required: true,
                        message: '请选择店铺'
                    },
                    picture: {},
                    title: {
                        required: true,
                        message: '请输入标题'
                    },
                    digest: {
                        message: '请输入内容摘要'
                    },
                    sourceName: {
                        required: false,
                        message: '请输入来源名称'
                    },
                    sourceUrl: {
                        required: false,
                        message: '请选择来源地址'
                    },
                    sortId: [
                        {
                            required: true,
                            message: '请输入排序ID'
                        }, {
                            type: 'number',
                            message: '只能输入数字'
                        }
                    ],
                    disabled: {
                        required: true,
                        message: '请选择状态'
                    }
                }
            }
        },
        methods: {
            realTime() {

            },
            imgLoad() {

            },
            selectFile() {
                this.$refs['image'].click();
            },
            fileChange(e) {
                let el = e.srcElement;
                let file = el.files[0];
                let reader = new FileReader();
                reader.onload = (file) => {
                    this.option.img = file.srcElement.result;
                };
                reader.readAsDataURL(file);
            },
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$emit('submit');
                    }
                });
            },
            disabledChange (e) {

            },
            onClassChange (e) {
                this.form.classId = e;
            }
        },
        mounted() {
            console.info(this.form);
        }
    }
</script>

<style scoped lang="scss">
    .article-form {
        .cropper {
            width: 300px;
            height: 300px;
        }

        .select-image-btn {
            margin-top: 10px;
        }

        .dialog-content {
            max-height: 80%;
            overflow-y: auto;
        }

        .el-card {
            width: 200px;
            display: inline-block;
            margin: 5px;

            img {
                width: 100%;
            }

            &.active {
                background-color: #1d88e5;
                color: white;
            }
        }

        .goods-info {
            display: inline-block;

            .goods-image {
                display: inline-block;
                width: 50px;

                img {
                    width: 50px;
                    height: 50px;
                }
            }

            .goods-detail {
                display: inline-block;
                padding-left: 10px;
            }
        }
    }
</style>