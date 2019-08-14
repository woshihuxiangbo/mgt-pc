<template>
    <el-select v-model="status" @change="changeQueryStatus" :value="status" :size="size">
        <el-option :value="undefined" label="正常"></el-option>
        <el-option :value="1" label="删除"></el-option>
        <el-option :value="2" label="禁用"></el-option>
        <el-option :value="3" label="全部"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: "StatusSelector",
        props: {
            value: {default: undefined},
            size: String
        },
        data() {
            return {
                status: this.value
            }
        },
        methods: {
            changeQueryStatus(e) {
                this.$emit('change', e);
            }
        },
        watch: {
            value(newVal) {
                this.status = newVal
            },
            status(val) {
                this.$emit('input', val);
            }
        }
    }
</script>

<style scoped>

</style>