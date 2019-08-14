<template>
    <el-select v-model="status" :value="status">
        <el-option :value="undefined" label="全部" v-if="showAll"/>
        <el-option :value="0" label="待付款"/>
        <el-option :value="1" label="待发货"/>
        <el-option :value="2" label="已发货"/>
        <el-option :value="3" label="已收货"/>
        <el-option :value="5" label="已关闭"/>
        <el-option :value="6" label="申请退款"/>
        <el-option :value="7" label="同意退款"/>
        <el-option :value="8" label="退款完成"/>
        <el-option :value="9" label="拒绝退款"/>
        <el-option :value="10" label="订单完成"/>
    </el-select>
</template>
<script>
    export default {
        name: "OrderStatusSelector",
        props: {
            value: {default: undefined},
            showAll: {type: Boolean, default: false}
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