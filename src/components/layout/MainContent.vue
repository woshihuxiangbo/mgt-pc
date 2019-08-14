<template>
    <el-container class="main-content scrollbar">
        <div class="kd-main">
            <slot/>
        </div>
    </el-container>
</template>

<script>
    export default {
        name: "MainContent"
    }
</script>

<style scoped lang="scss">
    .main-content {
        padding: 20px 20px 20px 220px;
        overflow: auto;
    }
</style>
