<template>
    <el-dialog :visible.sync="show" title="转移店铺街" v-loading="loading" top>
        <el-form inline style="margin-top: -10px" @submit.native.prevent="getData(true)">
            <el-form-item label="目标店铺街某个团长姓名">
                <el-input v-model="query.name"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="table.data" border height="500px">
            <el-table-column label="选择" align="center" width="50px">
                <template slot-scope="scope">
                    <el-radio v-model="select" :label="scope.row.userId">&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column label="团长姓名" align="center" prop="name"/>
            <el-table-column label="手机号" align="center" prop="mobile"/>
            <el-table-column label="地址" align="center" prop="address"/>
            <el-table-column label="店铺类型" align="center" prop="storeType"/>
        </el-table>
        <el-pagination
            background
            @current-change="getData"
            :current-page.sync="query.page"
            :page-size="query.pageSize"
            layout="total, ->, prev, pager, next, jumper"
            :total="table.page.total"/>
        <div slot="footer" align="center">
            <el-button @click="onEnter" type="primary">确认</el-button>
            <el-button @click="show = false">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import MdActiveMixin from '@/components/mixins/MdActiveMixin';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import api from '@/common/apis/group/leader';
    import {mapGetters} from 'vuex';

    export default {
        name: 'TransferShopStreetDialog',
        mixins: [MdActiveMixin, tableDataMixins],
        props: {
            groupStoreId: {type: String | Number, required: true}
        },
        data() {
            return {
                loading: false,
                select: undefined,
                query: {
                    name: undefined,
                    pageNum: 1,
                    pageSize: 20
                }
            };
        },
        computed: {
            ...mapGetters(['shop'])
        },
        methods: {
            getData(b) {
                if (b === true) {
                    this.select = undefined;
                    this.query.pageNum = 1;
                }
                this.query.storeId = this.shop.id;
                this.loading = true;
                this.query.userId = this.groupStoreId;
                api.getLeaderListSpecial(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.list;
                        this.table.page.total = data.total;
                        this.query.pageNum = data.pageNum;
                    });
                }).finally(() => this.loading = false);
            },
            onEnter() {
                this.loading = true;
                api.updateLeader({userId: this.groupStoreId, invitUserId: this.select}).then(res => {
                    this.$util.handelHttpResponseResult(res, true).then(() => {
                        this.$emit('success');
                    });
                }).finally(() => this.loading = false);
            }
        },
        mounted() {
            if (this.groupStoreId) this.getData();
        },
        watch: {
            async groupStoreId() {
                await this.$nextTick();
                this.select = undefined;
                this.query.name = undefined;
                this.getData(true);
            }
        }
    };
</script>

<style scoped>

</style>
