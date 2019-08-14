<template>
    <el-form ref="form" class="shops" :rules="rules" :model="form" label-width="100px"
             @submit.native.prevent="onSubmit">
        <el-form-item label="名称" prop="name">
            <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="form.mobile" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="登录密码" :prop="requiredPassword ? 'password' : ''">
            <el-input v-model="form.password" type="password" autocomplete="new-password"/>
        </el-form-item>

        <el-form-item v-if="disabledRole" label="上级" prop="parentManagerId">
            <parent-role-selector :adminId="adminId" :needFilter="false" v-model="form.parentManagerId"/>
        </el-form-item>

        <el-form-item label="职务" prop="roleId">
            <role-selector :needFilter="false" :disabled="disabledRole" v-model="form.roleId"/>
        </el-form-item>

        <el-form-item label="管理店铺" v-show="!disabled">
            <el-select :disabled="disabled" v-model="form.storeId" :value="form.storeId" multiple style="width: 100%">
                <el-option v-for="(s, i) in storeList" :key="i" :value="s.id" :label="s.name"
                           :disabled="!disabled&&s.id==0"/>
            </el-select>
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
    import storeApi from '../../common/apis/store';
    import RoleSelector from '@/components/selector/RoleSelector';
    import ParentRoleSelector from '@/components/selector/ParentRoleSelector';
    import validator from 'el-form-validator';

    export default {
        name: 'AdministratorForm',
        components: {RoleSelector, ParentRoleSelector},
        mixins: [vModelMixins],
        props: {
            requiredPassword: {type: Boolean, default: true}
        },
        data() {
            return {
                disabled: true,

                rules: {
                    name: {
                        required: true,
                        message: '请输入名称'
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
                    password: [
                        {
                            required: true,
                            message: '请输入密码'
                        },
                        {
                            rules: 'string|min:6|max:32',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    storeId: {
                        required: true,
                        message: '请选择店铺',
                        trigger: 'blur'
                    },
                    disabled: {
                        required: true,
                        message: '请选择状态'
                    },
                    roleId: {
                        required: true,
                        message: '请选择职务'
                    }
                },
                storeList: []
            };
        },
        computed: {
            roleId() {
                return this.form.roleId;
            },
            disabledRole() {
                return !!this.form.id;
            },
            adminId() {
                return this.$route.params.id;
            }
        },
        watch: {
            roleId(val) {
                this.setStore(val);
            }
        },
        methods: {
            setStore(roleId) {
                if (['0', '1', '2', '3', '5', '6', '7', '11'].indexOf(roleId) !== -1){
                    this.disabled = true;
                    // this.form.storeId = ['0'];
                } else {
                    this.disabled = false;
                    if (!this.form.id) {
                        // this.form.storeId = [];
                    }
                }
            },
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$emit('submit', e);
                    }
                });
            },
            getStoreList() {
                storeApi.getStoreList({column: 'id,name', pageSize: 100}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(data => {
                        this.storeList = data.data.rows;
                    });
                });
            }
        },
        mounted() {
            this.setStore(this.form.roleId);
            this.getStoreList();
        }
    };
</script>

<style lang="scss">
    .shops .el-select .el-tag {
        background-color: #409eff;

        .el-select__tags-text {
            color: #fff;
        }

        .el-tag__close.el-icon-close {
            background: none
        }
    }
</style>
