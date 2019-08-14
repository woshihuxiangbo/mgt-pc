<template>
    <div class="main">
        <div class="main-nav">
            <div class="nav-breadcrumb">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                    <el-breadcrumb-item>状态统计</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container" v-loading="loading">
            系统状态
        </div>
    </div>
</template>

<style lang="scss" scoped></style>

<script>
export default {
    data() {
        return {
            loading: false
        };
    },
    mounted() {}
};
</script>
