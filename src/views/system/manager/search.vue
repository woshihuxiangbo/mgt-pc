<template>
    <div class="main">
        <div class="main-nav">
            <div class="nav-breadcrumb">
                <el-breadcrumb class="nav-title" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                    <el-breadcrumb-item>管理员账号</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="nav-tab">
                <ul>
                    <li>
                        <router-link to="/manager/list"><i class="el-icon-tickets"></i> 列表</router-link>
                    </li>
                    <li class="active"><i class="el-icon-search"></i> 搜索</li>
                    <li>
                        <router-link to="/manager/add"><i class="el-icon-plus"></i> 添加</router-link>
                    </li>
                    <li>
                        <router-link to="/manager/trash"><i class="el-icon-delete"></i> 回收站</router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="container">
            <el-form
                style="width: 550px"
                label-position="right"
                label-width="120px"
                :model="form"
                ref="form"
                :rules="rules"
                @submit.native.prevent="formSubmit"
            >
                <el-form-item label="名称">
                    <el-col :span="9">
                        <el-input v-model="form.nickname"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                    <el-col :span="9">
                        <el-input type="number" v-model="form.mobile"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="状态">
                    <el-col :span="9">
                        <el-select v-model="form.status" placeholder="请选择">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="正常" value="normal"></el-option>
                            <el-option label="已禁用" value="disabled"></el-option>
                            <el-option label="已删除" value="deleted"></el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button native-type="submit" type="primary">搜 索</el-button>
                    <el-button v-on:click="$router.back()">返 回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>

<script>
import {CheckMobile} from '@/assets/global.js';

export default {
    data() {
        let checkMobile = (rule, value, callback) => {
            if (value !== '') {
                let result = CheckMobile(value);
                if (result !== '') {
                    callback(new Error(result));
                    return;
                }
            }
            callback();
        };
        return {
            form: {
                nickname: undefined,
                mobile: undefined,
                status: undefined
            },
            rules: {
                mobile: [
                    {
                        required: false,
                        validator: checkMobile,
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    methods: {
        formSubmit(event) {
            //阻止默认事件
            event.preventDefault();

            let This = this;
            //验证表单
            this.$refs['form'].validate((valid) => {
                if (!valid) {
                    return;
                }
                This.search();
            });
        },
        search () {

        }
    },
    mounted() {}
};
</script>
