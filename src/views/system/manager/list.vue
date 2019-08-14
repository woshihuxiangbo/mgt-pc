<template>
    <div class="main">
        <div class="main-nav">
            <div class="nav-breadcrumb">
                <el-breadcrumb class="nav-title" separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                    <el-breadcrumb-item>管理员账号</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="nav-tab">
                <ul>
                    <li class="active"><i class="el-icon-tickets"></i> 列表</li>
                    <li>
                        <router-link to="/manager/search"><i class="el-icon-search"></i> 搜索</router-link>
                    </li>
                    <li>
                        <router-link to="/manager/add"><i class="el-icon-plus"></i> 添加</router-link>
                    </li>
                    <li>
                        <router-link to="/manager/trash"><i class="el-icon-delete"></i> 回收站</router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="container" v-loading="loading">
            <el-table
                ref="selected"
                :data="table.rows"
                :empty-text="table.emptyText"
                :row-class-name="tableRowClassName"
                @sort-change="changeSort"
                class="table-width"
            >
                <el-table-column type="selection" width="50" fixed="left"></el-table-column>
                <el-table-column prop="nickname" label="名称" fixed="left"></el-table-column>
                <el-table-column prop="mobile" label="手机号码" width="120"></el-table-column>
                <el-table-column prop="create_time" label="创建时间" width="160" sortable="custom">
                    <template slot-scope="scope">
                        {{ timestampToStr(scope.row.createTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="70">
                    <template slot-scope="scope">
                        <span v-if="scope.row.deleteTime > 0">已删除</span>
                        <span v-else-if="scope.row.disabled === true">已禁用</span>
                        <span v-else>正常</span>
                    </template>
                </el-table-column>
                <el-table-column align="right" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-action" v-if="table.pagination.rowCount > table.pagination.size">
                <el-pagination
                    @current-change="changeCurrent"
                    background
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="table.pagination.size"
                    layout="total, prev, pager, next, jumper"
                    :total="table.pagination.rowCount"
                    class="pagination"
                ></el-pagination>
                <div class="table-btn">
                    <el-button size="mini" plain type="primary" @click="disableConfirm">禁用</el-button>
                    <el-button size="mini" plain type="primary" @click="deleteConfirm">删除</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {TimestampToStr, GetID} from '@/assets/global';

export default {
    data() {
        return {
            loading: false,
            tableNav: 0,
            table: {
                //空记录提示文字
                emptyText: '',
                //数据
                rows: [],
                //分页
                pagination: {
                    rowCount: 0, //总记录数
                    current: 1, //当前页
                    size: 1 //每页大小(行数)
                },
                //排序
                sort: {
                    by: undefined, //排序列名
                    order: undefined //排序方式(默认'asc'、'desc')
                },
                //搜索条件
                params: {
                    nickname: undefined,
                    mobile: undefined,
                    status: undefined
                }
            }
        };
    },
    computed: {
    },
    methods: {
        timestampToStr: TimestampToStr,
        tableRowClassName({row}) {
            if (row.deleteTime > 0) {
                return 'row-deleted';
            } else if (row.disabled === true) {
                return 'row-disabled';
            }
            return '';
        },
        //跳转到指定页
        changeCurrent(val) {
            this.table.pagination.current = val;
            //重新获取数据
            this.getData();
        },
        //更改排序
        changeSort({prop, order}) {
            this.table.sort.by = prop;
            switch (order) {
                case 'ascending':
                    this.table.sort.order = 'asc';
                    break;
                case 'descending':
                    this.table.sort.order = 'desc';
                    break;
                default:
                    this.table.sort.order = '';
            }
            this.getData();
        },
        notSelect() {
            this.$message({
                type: 'waring',
                message: '请勾选要操作的记录'
            });
        },
        //确认禁用数据
        disableConfirm() {
            let This = this;
            let id = GetID(this.$refs.selected.selection);
            if (id.length > 0) {
                this.$confirm('确认禁用选中的记录吗？', {type: 'warning'})
                    .then(() => {
                        This.disableDo(id);
                    })
                    .catch(() => {});
            } else {
                this.notSelect();
            }
        },
        //确认删除数据
        deleteConfirm() {
            let This = this;
            let id = GetID(this.$refs.selected.selection);
            if (id.length > 0) {
                this.$confirm('确认删除选中的记录吗？', {type: 'warning'})
                    .then(() => {
                        This.deleteDo(id);
                    })
                    .catch(() => {});
            } else {
                this.notSelect();
            }
        },
        disableDo(id) {
            let This = this;
            This.loading = true;
            let fields = 'disabled';
            let formData = new FormData();
            formData.append('id', 'aaaaaaaaaaaaaaa');
            this.$axios
                .post('/api/manager/disable', formData, {headers: {fields: fields}})
                .then((resp) => {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                    this.getData();
                })
                .catch(() => {})
                .finally(() => {
                    This.loading = false;
                });
        },
        deleteDo(id) {
            if (id.length === 0) {
                this.notSelect();
            }
            let This = this;
            This.loading = true;
            let fields = 'deleteTime';
            let formData = new FormData();
            formData.append('id', id);
            this.$axios
                .post('/api/manager/delete', formData, {headers: {fields: fields}})
                .then((resp) => {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    });
                    this.getData();
                })
                .catch(() => {})
                .finally(() => {
                    This.loading = false;
                });
        },
        //获取数据
        getData() {
            this.loading = true;
            let fields = 'id,mobile,nickname,createTime,disabled,deleteTime';
            let This = this;
            let params = Object.assign({}, this.table.pagination, this.table.sort, this.table.params);
            this.$axios
                .get('/api/manager/list', {
                    params,
                    headers: {fields}
                })
                .then((resp) => {
                    if (resp.data.data.rowCount === 0) {
                        This.table.emptyText = '没有数据';
                    } else {
                        This.table.rows = resp.data.data.rows;
                        This.table.pagination.rowCount = resp.data.data.rowCount;
                    }
                })
                .catch(() => {})
                .finally(() => {
                    This.loading = false;
                });
        }
    },
    mounted() {
        this.getData();
    }
};
</script>
