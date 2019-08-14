<template>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" @submit.native.prevent="onSubmit">
        <el-form-item label="分类图标" v-if="role.roleID !== '14'">
            <upload-avatar
                :oss-type="ossType.itemClass"
                :sub-mod="subMold.item"
                v-model="form.icon"/>
        </el-form-item>
        <el-form-item label="上级分类" prop="parentId" v-if="role.roleID !== '14'">
            <el-select v-model="form.parentId" :value="form.parentId">
                <el-option :value="undefined" label="一级分类"/>
                <el-option v-for="(item, i) in parents" :key="i" :value="item.id" :label="item.name"/>
            </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="分类名称(英文)">
            <el-input v-model="form.nameEn"/>
        </el-form-item>
        <el-form-item label="排序ID" prop="sortId">
            <el-popover placement="right" width="200" trigger="hover" content="数值越大越靠前。">
                <el-input-number slot="reference" :step="1" :precision="0" :min="0" v-model="form.sortId"/>
            </el-popover>
        </el-form-item>
        <el-form-item label="状态" prop="disabled">
            <el-select v-model="form.disabled" :value="form.disabled">
                <el-option :value="false" label="正常"/>
                <el-option :value="true" label="禁用"/>
            </el-select>
        </el-form-item>
        <el-form-item>
            <slot/>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    import {ossType, subMold} from '@/common/apis/oss';
    import ItemClassCascader from '@/components/selector/ItemClassCascader';
    import UploadAvatar from '@/components/widget/UploadAvatar';
    import api from '@/common/apis/category';
    import {mapGetters} from 'vuex';

    export default {
        name: 'CategoryForm',
        components: {ItemClassCascader, UploadAvatar},
        mixins: [vModelMixins],
        data() {
            return {
                ossType,
                subMold,
                imgOptions: {
                    logo: {
                        width: '200px',
                        height: '200px',
                        options: {
                            autoCropWidth: 200,
                            autoCropHeight: 200
                        }
                    }
                },
                rules: {
                    name: {
                        required: true,
                        message: '请输入分类名称'
                    },
                    disabled: {
                        required: true,
                        message: '请选择状态'
                    },
                    sortId: [
                        {required: true, message: '请输入排序ID', trigger: 'blur'}
                    ]
                },
                topClass: {
                    value: undefined,
                    label: '一级分类'
                },
                parents: []
            };
        },
        methods: {
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$emit('submit', e);
                    } else {
                        this.$message.warning('数据不完整');
                    }
                });
            },
            onClassChange(e) {
                this.form.parentId = e;
            },
            getData() {
                api.list({
                    parentId: '0',
                    column: 'id,name',
                    pageSize: 100,
                    storeId: this.shop.id,
                    isList: true
                }).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.parents = data.rows;
                    });
                });
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop', role: 'role'})
        }
    };
</script>

<style scoped>
</style>
