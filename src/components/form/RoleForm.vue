<template>
    <el-form label-width="100px" :data="form" :model="form" :rules="rules" class="article-form"
             @submit.native.prevent="onSubmit" ref="form">
        <el-row :gutter="10">
            <el-col :span="12">
                <el-form-item label="角色名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="等级">
                    <el-input-number :step="1" :precision="0" :min="0" v-model="form.level" style="width: 100%;"/>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="管理范围">
                    <el-select v-model="form.scope" placeholder="" style="width: 100%">
                        <el-option label="全部" :value="undefined"></el-option>
                        <el-option label="仅平台" :value="1"></el-option>
                        <el-option label="仅店铺" :value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="上级角色">
                    <parent-role-selector :adminId="form.id" :isRole="true" :needFilter="false"
                                          v-model="form.parentRoleId"/>
                </el-form-item>
            </el-col>
        </el-row>
        <div class="exm-m">
            <el-form-item class="exm" label="超级管理员">
                <el-checkbox-group v-model="form.access.all">
                    <el-checkbox label="all">所有权限</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item class="exm" label="管理员">
                <role-form-checkbox-item v-model="form.access.manager"/>
            </el-form-item>
<!--            <el-form-item class="exm" label="系统收款银行">-->
<!--                <role-form-checkbox-item v-model="form.access.systemBank"/>-->
<!--            </el-form-item>-->
            <el-form-item class="exm" label="店铺">
                <role-form-checkbox-item v-model="form.access.store"/>
            </el-form-item>
            <el-form-item class="exm" label="用户">
                <role-form-checkbox-item v-model="form.access.user"/>
            </el-form-item>
            <el-form-item class="exm" label="商品">
                <role-form-checkbox-item v-model="form.access.item"/>
            </el-form-item>
            <el-form-item class="exm" label="品牌">
                <role-form-checkbox-item v-model="form.access.brand"/>
            </el-form-item>
            <!--<el-form-item class="exm" label="进货">-->
            <!--<role-form-checkbox-item v-model="form.access.wholesale"/>-->
            <!--</el-form-item>-->
            <el-form-item class="exm" label="批发订单">
                <role-form-checkbox-item v-model="form.access.wholesaleOrder"/>
            </el-form-item>
            <el-form-item class="exm" label="零售订单">
                <role-form-checkbox-item v-model="form.access.retailOrder"/>
            </el-form-item>
            <el-form-item class="exm" label="活动">
                <role-form-checkbox-item v-model="form.access.event"/>
            </el-form-item>
            <el-form-item class="exm" label="团购商品">
                <role-form-checkbox-item v-model="form.access.groupItem"/>
            </el-form-item>
            <el-form-item class="exm" label="团长管理">
                <role-form-checkbox-item v-model="form.access.groupLeader"/>
            </el-form-item>
            <el-form-item class="exm" label="内容栏目">
                <role-form-checkbox-item v-model="form.access.contentClass"/>
            </el-form-item>
            <el-form-item class="exm" label="内容">
                <role-form-checkbox-item v-model="form.access.content"/>
            </el-form-item>
            <el-form-item class="exm" label="广告">
                <role-form-checkbox-item v-model="form.access.adv"/>
            </el-form-item>
            <el-form-item class="exm" label="消息">
                <role-form-checkbox-item v-model="form.access.msg"/>
            </el-form-item>
            <el-form-item class="exm" label="防伪码">
                <role-form-checkbox-item v-model="form.access.securityCode"/>
            </el-form-item>
            <el-form-item class="exm" label="佣金管理">
                <role-form-checkbox-item v-model="form.access.income"/>
            </el-form-item>
            <el-form-item class="exm" label="预存款">
                <role-form-checkbox-item v-model="form.access.deposit"/>
            </el-form-item>
            <el-form-item class="exm" label="审批">
                <el-checkbox-group v-model="form.access.verify">
                    <el-checkbox label="f">首批</el-checkbox>
                    <el-checkbox label="s">复批</el-checkbox>
                    <el-checkbox label="t">核批</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </div>
        <el-form-item>
            <slot/>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import ParentRoleSelector from '@/components/selector/ParentRoleSelector';
    import RoleFormCheckboxItem from '@/components/widget/RoleFormCheckboxItem';

    export default {
        name: 'RoleForm',
        components: {RoleFormCheckboxItem, ParentRoleSelector},
        mixins: [vModelMixins],
        data() {
            return {
                rules: {
                    name: {
                        required: true,
                        message: '请输入管理员名称'
                    }
                }
            };
        },
        methods: {
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$emit('submit');
                    }
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .exm-m {
        display: flex;
        flex-wrap: wrap;

        .exm {
            flex: 0 0 48%;
            padding-right: 10px;
            margin-bottom: 0;
        }
    }
</style>
