<template>
    <el-form label-width="80px" :model="form" :rules="rules" ref="form" @submit.native.prevent="onSubmit">
        <el-form-item label="分类图标">
            <upload-avatar v-model="form.icon"/>
        </el-form-item>
        <el-form-item label="上级分类" prop="parentId">
            <article-class-cascader
                    :select-value='selectValue'
                    :top-class="topClass"
                    style="width: 100%"
                    v-model="form.parentId" :data-id="form.id"/>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="排序ID"
                      :rules="[{ required: true, message: '排序ID不能为空'},{ type: 'number', message: '排序ID必须为数字值'}]">
            <el-input v-model.number="form.sortId" placeholder="数值越大越靠前"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="disabled">
            <el-select v-model="form.disabled" :value="form.disabled" style="width: 100%">
                <el-option label="正常" :value="false"></el-option>
                <el-option label="禁用" :value="true"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="删除时间" v-if="form.deleteTime > 0">
            {{new Date(form.deleteTime * 1000).format('yyyy-MM-dd HH:mm:ss')}}
            <el-button type="text" @click="restore">恢复</el-button>
        </el-form-item>
        <el-form-item>
            <slot/>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    import ArticleClassCascader from '@/components/selector/ArticleClassCascader';
    import UploadAvatar from '@/components/widget/UploadAvatar';

    export default {
        name: 'ArticleCategoryForm',
        components: {UploadAvatar, ArticleClassCascader},
        mixins: [vModelMixins],
        props: {
            selectValue: {
                type: Array, default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                loading: false,
                rules: {
                    icon: {
                        required: true,
                        message: '请上传图标'
                    },
                    parentId: {
                        message: '请选择分类',
                        trigger: 'blur'
                    },
                    name: {
                        required: true,
                        message: '请输入分类名称',
                        trigger: 'blur'
                    },
                    sortId: [
                        {
                            required: true,
                            message: '请输入排序ID',
                            trigger: 'blur'
                        },
                        {
                            type: 'number',
                            message: '请输入数字',
                            trigger: 'blur'
                        }
                    ],
                    disabled: {
                        required: true,
                        message: '请选择状态',
                        trigger: 'blur'
                    }
                },
                topClass: {
                    value: '0',
                    label: '一级分类'
                }
            };
        },
        methods: {
            restore() {
                this.$emit('restore');
            },
            onSubmit(e) {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$emit('submit', e);
                    }
                });
            }
        },
        mounted() {
        }
    };
</script>

<style scoped>

</style>
