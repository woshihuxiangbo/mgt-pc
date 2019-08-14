<template>
    <div class="spike">
        <breadcrumb :options="['活动列表', '秒杀']"/>
        <div class="main-container">
            <el-row :gutter="20">
                <el-col :span="3">
                    <el-button type="primary" @click="$router.push({name: 'SpikeAdd'})">创建秒杀</el-button>
                </el-col>
                <el-col :span="21">
                    <div style="text-align: right">
                        <el-form :inline="true" :model="searchParams">
                            <el-form-item label="开始时间">
                                <el-date-picker
                                        v-model="searchParams.startDate"
                                        type="daterange"
                                        value-format="timestamp"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="商品名称">
                                <el-input v-model="searchParams.goodsName" placeholder="商品名称"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSearch">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
            <div class="spike-table">
                <el-radio-group v-model="radioType">
                    <el-radio-button label="进行中"></el-radio-button>
                    <el-radio-button label="已结束"></el-radio-button>
                </el-radio-group>
                <el-table border :data="table.processing.data" style="margin-top: 0">
                    <el-table-column prop="avatar" label="" width="125">
                        <template slot-scope="scope">
                            <img :src="scope.row.image|imgSrc" alt="" width="100">
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="title" label="商品价格"/>
                    <el-table-column align="center" prop="price" label="活动价"/>
                    <el-table-column align="center" prop="sellCount" label="活动售出"/>
                    <el-table-column align="center" prop="startDatetime" label="开始时间"/>
                    <el-table-column align="center" prop="endDatetime" label="结束时间"/>
                    <el-table-column align="center" prop="statusDes" label="活动状态"/>
                    <el-table-column align="center" prop="buyCount" label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="editSpike(scope.row)">编辑</el-button>
                            <el-button type="text" size="small" @click="overSpike(scope.row)">结束</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                            :current-page.sync="table.processing.page.current"
                            :page-size="table.processing.page.size"
                            layout="total, ->, prev, pager, next, jumper"
                            :total="table.processing.page.total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from "../../../components/widget/breadcrumb";

    export default {
        components: {Breadcrumb},
        data() {
            return {
                searchParams: {
                    startDate: undefined,
                    goodsName: undefined
                },
                table: {
                    processing: {
                        data: [
                            {
                                id: 25,
                                image: 'https://fhimg.52xie.com/uploadfile/2016/0824/20160824040024285.jpg',
                                title: '商品名称',
                                price: 15.30,
                                sellCount: 0,
                                startDatetime: '2018-08-30 16:30:25',
                                endDatetime: '2018-08-30 16:50:25',
                                statusDes: '已结束'
                            }
                        ],
                        page: {
                            size: 20,
                            current: 1,
                            total: 1254
                        }
                    },
                    over: {
                        data: [
                            {
                                id: 25,
                                image: 'https://fhimg.52xie.com/uploadfile/2016/0824/20160824040024873.jpg',
                                title: '商品名称',
                                price: 15.30,
                                sellCount: 0,
                                startDatetime: '2018-08-30 16:30:25',
                                endDatetime: '2018-08-30 16:50:25',
                                statusDes: '已结束'
                            }
                        ],
                        page: {
                            size: 20,
                            current: 1,
                            total: 80
                        }
                    }
                },
                radioType: '进行中'
            }
        },
        methods: {
            onSearch() {
                // TODO 搜索秒杀活动
            },
            editSpike(item) {
                this.$router.push({name: 'SpikeEdit', params: {id: item.id}});
            },
            overSpike () {
                this.$confirm('是否结束此活动?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '结束成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            }
        }
    }
</script>

<style lang="scss">
    .spike .el-tabs__header {
        margin-bottom: 0;
    }
</style>