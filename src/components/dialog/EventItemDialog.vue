<template>
    <el-dialog :visible.sync="show" title="禁用或启用商品活动">
        <el-table :data="form" border>
            <el-table-column label="商品名称" align="center" prop="itemName"/>
            <el-table-column label="规格" align="center" prop="spuName"/>
            <el-table-column  width="60" label="禁用" align="center">
                <template slot-scope="scope">
                    <el-checkbox v-model="form[scope.$index].disabled"/>
                </template>
            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-button type="primary" @click="enter">确定</el-button>
            <el-button type="primary" @click="show = false">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import MdActiveMixin from "@/components/mixins/MdActiveMixin";
    import vModelMixins from "@/components/mixins/vModelMixins";

    export default {
        name: "EventItemDialog",
        mixins: [MdActiveMixin, vModelMixins],
        props: {
            value: {type: Array, default: () => []}
        },
        data () {
            return {
            }
        },
        methods: {
            enter () {
                this.$emit('submit', this.form)
            }
        }
    }
</script>

<style scoped>

</style>