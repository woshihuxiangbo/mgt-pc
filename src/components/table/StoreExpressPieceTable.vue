<template>
    <el-table :data="form" border>
        <el-table-column label="运送方式" align="center" width="80px">
            <template>快递</template>
        </el-table-column>
        <el-table-column label="地区" align="center">
            <template slot-scope="scope">
                <div v-if="scope.row.isDefault">默认</div>
                <div v-else>{{scope.row.area | areaFilter}}</div>
            </template>
        </el-table-column>
        <el-table-column width="120px" label="首件数（件）" align="center" prop="first.count"/>
        <el-table-column width="120px" label="首费（元）" align="center" prop="first.price"/>
        <el-table-column width="120px" label="续件数（件）" align="center" prop="extend.count"/>
        <el-table-column width="120px" label="续费（元）" align="center" prop="extend.price"/>
        <el-table-column width="160px" label="管理" align="center">
            <template slot-scope="scope">
                <el-button type="text" @click="deleteRow(scope)" :disabled="scope.row.isDefault">删除</el-button>
                <el-button type="text" @click="edit">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import {CodeToText} from 'element-china-area-data';
    import vModelMixins from '@/components/mixins/vModelMixins';

    export default {
        name: 'StoreExpressPieceTable',
        mixins: [vModelMixins],
        props: {
            value: {
                type: Array, default: () => {
                    return [];
                }
            }
        },
        filters: {
            areaFilter(e) {
                return e.map(item => CodeToText[item]).join(' ');
            }
        },
        methods: {
            deleteRow(row) {
                this.form.splice(row.$index, 1)
            },
            edit() {
                this.$emit('edit')
            }
        }
    };
</script>

<style scoped>

</style>
