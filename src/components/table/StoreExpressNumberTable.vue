<template>
    <el-table class="table" size="mini" border :data="form" style="width: 100%">
        <el-table-column header-align="center" align="center" prop="method" label="运送方式" width="80px">
            快递
        </el-table-column>
        <el-table-column label="地区" align="center">
            <template slot-scope="scope">
                <span v-for="(area ,i) in scope.row.area" :key="i">
                    {{ CodeToText[area]}}
                </span>
            </template>
        </el-table-column>
        <el-table-column label="首单" prop="first" align="center" width="120px"/>
        <el-table-column label="三单以上" prop="extend" align="center" width="120px"/>
        <el-table-column label="每箱" prop="batch" align="center" width="120px"/>
        <el-table-column label="操作" align="center" width="180px">
            <template slot-scope="scope">
                <el-button type="primary"
                           @click="editPost(scope.row,scope.$index)">修改
                </el-button>
                <el-button @click="deletePost(scope.row,scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import {CodeToText} from 'element-china-area-data';
    import vModelMixins from '@/components/mixins/vModelMixins';

    export default {
        name: 'StoreExpressNumberTable',
        mixins: [vModelMixins],
        props: {
            value: {type: Array, default: () => []}
        },
        data() {
            return {
                CodeToText
            };
        },
        methods: {
            deletePost(data, index) {
                this.$emit('delete', {data, index});
            },
            editPost(data, index) {
                this.$emit('edit', {data, index});
            }
        }
    };
</script>

<style scoped>

</style>
