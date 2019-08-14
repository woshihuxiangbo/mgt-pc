<template>
    <div class="coupon-list">
        <breadcrumb :options="['活动管理', '代金券']"/>
        <div class="main-container">
            <el-row type="flex" class="row-bg">
                <el-col :span="12">
                    <el-button type="primary" icon="el-icon-plus" @click="createCoupon">创建代金券</el-button>
                    <el-button>批量导出</el-button>
                </el-col>
                <el-col :span="12" class="search-box">
                    <el-input v-model="searchParams.name" placeholder="搜索名称" class="search" type="search"/>
                    <el-button type="primary" class="search-btn">搜索</el-button>
                </el-col>
            </el-row>
            <el-table border :data="table.data">
                <el-table-column align="center" label="名称" prop="name"/>
                <el-table-column align="center" label="有效期范围" prop="validityRange"/>
                <el-table-column align="center" label="生效条件" prop="effectiveCondition"/>
                <el-table-column align="center" label="优惠内容" prop="preferential"/>
                <el-table-column align="center" label="数量(剩余)" prop="stock"/>
                <el-table-column align="center" label="状态" prop="statusDes"/>
                <el-table-column align="center" label="领取状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.isReceive" active-color="#13ce66" inactive-color="#ff4949"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="管理">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editCoupon(scope.row)">编辑</el-button>
                        <el-button type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    :current-page.sync="table.page.current"
                    :page-size="table.page.size"
                    layout="total, ->, prev, pager, next, jumper"
                    :total="table.page.total">
            </el-pagination>
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
                    name: undefined
                },
                table: {
                    data: [
                        {
                            id: 1,
                            name: '新店开张，代金券无限量送',
                            validityRange: '领取后一天生效，有效期7天',
                            effectiveCondition: '满398元',
                            preferential: '减30.00元',
                            stock: '数量(剩余)',
                            statusDes: '已生效',
                            isReceive: false
                        }
                    ],
                    page: {
                        size: 20,
                        current: 1,
                        total: 1254
                    }
                }
            }
        },
        methods: {
            createCoupon () {
                this.$router.push({name: 'ActivityCouponAdd'})
            },
            editCoupon (item) {
                this.$router.push({name: 'ActivityCouponEdit', params: {id: item.id}});
            }
        }
    }
</script>

<style scoped lang="scss">
    .coupon-list {
        .search-box {
            text-align: right;

            .search {
                width: 300px;
            }

            .search-btn {
                margin-left: 10px;
            }
        }
        .el-table {
            margin: 10px 0;
        }
    }
</style>