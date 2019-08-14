<template>
    <el-select v-model="form" :value="form">
        <el-option :value="0" label="全部"/>
        <el-option :value="1" label="是"/>
        <el-option :value="2" label="否"/>
    </el-select>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';

    export default {
        name: "TrueOrFalseOrAllSelector",
        mixins: [vModelMixins],
        props: {
            value: {}
        },
        data () {
            return {}
        }
    }
</script>

<style scoped lang="scss">
    .el-select {
        width: 80px;
    }
</style>