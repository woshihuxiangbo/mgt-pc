<template>
    <el-checkbox-group v-model="checks">
        <el-checkbox label="c">创建</el-checkbox>
        <el-checkbox label="u">修改</el-checkbox>
        <el-checkbox label="r">读取</el-checkbox>
        <el-checkbox label="d">删除</el-checkbox>
        <el-checkbox label="l">列表</el-checkbox>
    </el-checkbox-group>
</template>

<script>
    export default {
        name: 'RoleFormCheckboxItem',
        props: {
            value: {type: Array, default: () => {return []}},
        },
        data () {
            return {
                checks: this.value
            }
        },
        watch: {
            value (n) {
                this.checks = n;
            },
            checks (n) {
                this.$emit('input', n);
            }
        }
    };
</script>

<style scoped>

</style>