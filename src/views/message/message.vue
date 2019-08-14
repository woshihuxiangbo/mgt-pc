<template>
    <div class="main kd-flex" v-loading="loading">
        <breadcrumb :options="['消息管理', '消息列表']"/>
        <div class="main-container kd-flex-item kd-flex">
            <div class="action" v-if="$util.checkPermission('msg',['c'])">
                <el-button type="primary" @click="onCreate">添加</el-button>
            </div>
            <!-- <div class="search">
                <el-form :model="query" :inline="true" @submit.native.prevent="onSearch" label-width="100px">
                    <el-form-item label="xx">
                        <el-input v-model="query.xx"/>
                    </el-form-item>
                    <el-button type="primary" native-type="submit">过滤</el-button>
                </el-form>
            </div>-->
            <br>
            <el-table :data="table.data" border class="kd-flex-item" height="100%">
                <el-table-column align="center" width="200px" label="消息类型">
                    <template slot-scope="scope">{{scope.row.msgType|msgType}}</template>
                </el-table-column>
                <el-table-column align="center" width="200px" label="创建时间">
                    <template
                        slot-scope="scope"
                    >{{new Date(parseInt(scope.row.createTime)*1000).format('yyyy-MM-dd HH:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="消息内容">
                    <template slot-scope="scope">{{scope.row.msgDataJson.value.content}}</template>
                </el-table-column>
                <el-table-column fixed="right" label="管理" width="180" align="center"
                                 v-if="$util.checkPermission('msg',['d'])">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" @click="onEdit(scope.row)">编辑</el-button> -->
                        <el-button
                            type="text"
                            @click="switchDeleted(scope.row)">{{scope.row.deleteTime ? '恢复' : '删除'}}
                        </el-button>
<!--                        <el-button type="text" @click="switchDisabled(scope.row)">{{scope.row.disabled ? '启用' : '禁用'}}</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @current-change="onSearch"
                style="margin-top: 10px"
                :current-page.sync="query.pageNum"
                :page-size="query.pageSize"
                layout="total, ->, prev, pager, next, jumper"
                :total="table.page.total"
            ></el-pagination>
        </div>
        <el-dialog title="添加消息" center :visible.sync="dialog.show" width="800px" v-loading="loading">
            <el-form ref="form" :inline="true" :rules="rules" :model="form">
                <el-tabs v-model="form.msgClassify">
                    <el-tab-pane label="普通消息" name="1">
                        <div v-if="form.msgClassify=== '1'">
<!--                            <el-select v-model="form.msgSubType" class="input-width" :value="form.msgSubType">-->
<!--                                <el-option label="店主" value="1"></el-option>-->
<!--                                <el-option label="合伙人" value="2"></el-option>-->
<!--                                <el-option label="总监" value="3"></el-option>-->
<!--                            </el-select>-->

                            <lv-selector v-model="form.msgSubType" class="input-width" :value="form.msgSubType" value-key="value" is-advanced/>
                            <el-form-item class="margin" prop="temp1.0">
                                <el-input v-model="form.temp1[0]" class="input-width"></el-input>
                            </el-form-item>
                            <el-form-item>刚刚赚得收益</el-form-item>
                            <el-form-item prop="temp1.1">
                                <el-input type="number" v-model="form.temp1[1]" class="input-width"></el-input>
                            </el-form-item>
                            <el-form-item label="元"></el-form-item>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="团购消息" name="2">
                        <div v-if="form.msgClassify === '2'">
                            <el-form-item prop="temp2.0">
                                <el-input v-model="form.temp2[0]" class="input-width"></el-input>
                            </el-form-item>
                            <el-form-item>团购了</el-form-item>
                            <el-form-item prop="temp2.1">
                                <el-input v-model="form.temp2[1]"></el-input>
                            </el-form-item>
                            <el-form-item>商品赚得</el-form-item>
                            <el-form-item prop="temp2.2">
                                <el-input type="number" v-model="form.temp2[2]" class="input-width"></el-input>
                            </el-form-item>
                            <el-form-item>佣金</el-form-item>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="升级消息" name="3">
                        <div v-if="form.msgClassify === '3'">
                            <el-form-item>
                                恭喜
                            </el-form-item>
                            <el-form-item prop="temp3.0">
                                <el-input v-model="form.temp3[0]" class="input-width"></el-input>
                            </el-form-item>
                            <el-form-item>升级成为</el-form-item>
                            <el-form-item prop="temp3.1">
                                <lv-selector v-model="form.temp3[1]" value-key="label"></lv-selector>
                            </el-form-item>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.show = false">取 消</el-button>
                <el-button type="primary" @click="addMessage">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from '@/common/apis/message';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';
    import StatusSelector from '@/components/selector/StatusSelector';
    import LvSelector from '@/components/selector/LvSelector';
    import {mapGetters} from 'vuex';

    export default {
        components: {StatusSelector, LvSelector},
        mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
        data() {
            return {
                loading: false,
                query: {
                    orderId: undefined, //订单ID
                    orderStatus: undefined, //订单状态
                    pageNum: 1,
                    pageSize: 20,
                    paySn: undefined, //支付单号
                    storeName: undefined, //店铺名称
                    userId: undefined, //用户id
                    userStoreName: undefined //用户店铺名称
                },
                form: {
                    msgType: 4, //全网广播
                    msgClassify: '1', //1普通商品 2团购商品
                    msgSubType: undefined,
                    storeId: undefined, //
                    temp1: [],
                    temp2: [],
                    temp3: []
                },
                rules: {
                    temp1: {
                        0: {required: true, message: '不能为空'},
                        1: {required: true, message: '不能为空'}
                    },
                    temp2: {
                        0: {required: true, message: '不能为空'},
                        1: {required: true, message: '不能为空'},
                        2: {required: true, message: '不能为空'}
                    },
                    temp3: {
                        0: {required: true, message: '不能为空'},
                        1: {required: true, message: '不能为空'}
                    }
                },
                dialog: {
                    show: false
                },
                typeName: '消息'
            };
        },
        created() {
            this.query.userId = this.$route.params.id;
        },

        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters(['shop'])
        },
        methods: {
            onCreate() {
                this.dialog.show = true;
            },
            getData() {
                const parmas = {
                    ...this.query,
                    storeId: this.shop.id
                };
                this.loading = true;
                api.list(parmas)
                    .then((res) => {
                        this.$util.handelHttpResponseResult(res).then((data) => {
                            this.table.page.total = data.data.total;
                            this.table.data = data.data.list.sort((a, b) => b.createTime - a.createTime);
                        });
                    })
                    .finally(() => (this.loading = false));
            },
            addMessage() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let {msgType, msgSubType, msgClassify} = this.form;
                        let content = this.form['temp' + msgClassify].join(',');
                        if (msgClassify == 2) {
                            msgSubType = 1;
                        }
                        const parmas = {
                            storeId: this.shop.id,
                            msgType,
                            msgSubType,
                            msgClassify,
                            content,
                            robot: true
                        };
                        this.loading = true;
                        api.add(parmas)
                            .then((res) => {
                                this.$util.handelHttpResponseResult(res).then((data) => {
                                    this.$message.success('添加成功');
                                    this.dialog.show = false;
                                    this.getData();
                                });
                            })
                            .finally(() => (this.loading = false));
                    }
                });
            },
            onSearch() {
                this.getData();
            },

            switchDeleted(item) {
                console.info(item);
                this.$util.actionConfirm(`是否删除?`).then(() => {
                    this.loading = true;
                    api.deleted({msgId: item.id}).then(res => {
                        this.$util.handelHttpResponseResult(res).then(() => {
                            this.getData();
                        })
                    }).finally(() => this.loading = false);
                });
            }
        },
        filters: {
            msgType(val) {
                switch (val) {
                    case 1:
                        return '普通商品消息';
                    case 2:
                        return '团购商品消息';
                    case 3:
                        return '用户升级消息';
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .input-width {
        width: 100px;
    }

    .margin {
        margin: 0 10px;
    }
</style>
