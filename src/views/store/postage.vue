<template>
    <div class="postage kd-flex kd-page-master" v-loading="loading">
        <breadcrumb :options="['店铺管理', '设置运费模板']"/>
        <div class="main-container kd-flex-item">
            <div>
                <el-button type="primary" @click="add">添加运费模板</el-button>
            </div>
            <div class="postage-list">
                <div class="postage-item" v-for="(item, i) in table.data" :key="i">
                    <div class="postage-info">
                        <div>
                            首重费用: ￥{{$util.priceFormat(item.normal.first)}}
                        </div>
                        <div>
                            续重费用: ￥{{$util.priceFormat(item.normal.extend)}}
                        </div>
                    </div>
                    <div class="postage-title">城市</div>
                    <div class="postage-special-list">
                        <div class="postage-special-item" v-for="(d, x) in item.special" :key="x">
                            <p>城市:{{provinceCodeToText(d.province)}}</p>
                            <p>首重费用: ￥{{$util.priceFormat(d.first)}}</p>
                            <p>续重费用: ￥{{$util.priceFormat(d.extend)}}</p>
                        </div>
                    </div>

                    <div class="postage-btn">
                        <el-button type="success" @click="onEdit(item)">编辑</el-button>
                        <el-button type="danger" @click="onDelete(item)">删除</el-button>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog :title="dialogTitle" :visible.sync="dialog" width="100%">
            <store-express-form v-model="form" @submit="onSubmit">
                <el-button type="primary" native-type="submit">提交</el-button>
            </store-express-form>
        </el-dialog>
    </div>
</template>

<script>
    import api from '@/common/apis/postage';
    import StoreExpressForm from "@/components/form/StoreExpressForm";
    import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import {CodeToText} from 'element-china-area-data';

    export default {
        components: {StoreExpressForm},
        mixins: [deleteOrDisableConfirmMixins, tableDataMixins],
        data() {
            return {
                loading: false,
                storeId: undefined,
                dialog: false,
                form: {
                    normal: {
                        first: undefined,
                        extend: undefined
                    },
                    special: [
                        {
                            province: undefined,
                            first: undefined,
                            extend: undefined
                        }
                    ]
                },
                query: {
                    page: 1,
                    pageSize: 20,
                    storeId: undefined
                },
                typeName: '运费模板'
            }
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.storeId;
                api.list(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.page.total = data.rowCount;
                        let list = data.rows;
                        if (!list) {
                            this.table.data = [];
                            return;
                        }
                        let tableData = [];
                        list.forEach((item) => {
                            item.normal = JSON.parse(item.normal);
                            item.special = JSON.parse(item.special);
                            tableData.push(item);
                        });
                        this.table.data = tableData;
                    })
                }).finally(() => this.loading = false);
            },
            add() {
                this.dialog = true;
            },
            onSubmit() {
                let data = this.formFormatPrice();
                if (data === false) return;
                if (!data.id) {
                    this.loading = true;
                    api.add(data).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '添加成功').then(() => {
                            this.defForm();
                            this.getData();
                            this.dialog = false;
                        })
                    }).finally(() => this.loading = false);
                } else {
                    api.edit(data).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '更新成功').then(() => {
                            this.defForm();
                            this.getData();
                            this.dialog = false;
                        })
                    }).finally(() => this.loading = false);
                }
            },
            onDelete(item) {
                this.onDeleted(item, api);
            },
            onEdit(item) {
                let form = this.formPriceFormat(item);
                console.info(form);
                if (!form) return;
                this.form = form;
                this.dialog = true;
            },
            defForm() {
                this.form = {
                    normal: {
                        first: undefined,
                        extend: undefined
                    },
                    special: [
                        {
                            province: undefined,
                            first: undefined,
                            extend: undefined
                        }
                    ]
                }
            },
            provinceCodeToText(code) {
                return CodeToText[code];
            },
            formFormatPrice() {
                let form = JSON.parse(JSON.stringify(this.form));
                let special = [];
                form.storeId = this.storeId;
                try {
                    form.normal.first = this.$util.formatPrice(form.normal.first);
                    form.normal.extend = this.$util.formatPrice(form.normal.extend);
                    form.special.forEach((item) => {
                        item.first = this.$util.formatPrice(item.first);
                        item.extend = this.$util.formatPrice(item.extend);
                        special.push(item);
                    });
                    form.special = JSON.stringify(special);
                    form.normal = JSON.stringify(form.normal);
                    return form;
                } catch (e) {
                    this.$message.error('格式化数据失败');
                    return false;
                }
            },
            formPriceFormat(item) {
                let form = JSON.parse(JSON.stringify(item));
                let special = [];
                form.storeId = this.storeId;
                try {
                    form.normal.first = this.$util.priceFormat(form.normal.first);
                    form.normal.extend = this.$util.priceFormat(form.normal.extend);
                    form.special.forEach((item) => {
                        item.first = this.$util.priceFormat(item.first);
                        item.extend = this.$util.priceFormat(item.extend);
                        special.push(item);
                    });
                    return form;
                } catch (e) {
                    this.$message.error('格式化数据失败');
                    return false;
                }
            }
        },
        mounted() {
            this.storeId = this.$route.params.id;
            this.getData();
        },
        computed: {
            dialogTitle() {
                if (this.form.id) return '修改运费模板';
                return '添加运费模板';
            }
        }
    }
</script>

<style scoped lang="scss">
    .postage-list {
        padding-top: 10px;
        display: flex;
        flex-wrap: wrap;

        .postage-item {
            flex: 0 0 400px;
            border: 1px solid #e3e3e3;
            margin-bottom: 10px;
            margin-right: 10px;
        }
    }

    .postage-title {
        line-height: 35px;
        text-align: center;
        font-size: 13px;
        color: #777;
    }

    .postage-special-item,
    .postage-info {
        display: flex;
        border-bottom: 1px solid #e3e3e3;
        line-height: 50px;
        padding: 0 10px;

        > div {
            text-align: center;
            flex: 1;

            &:first-child {
                border-right: 1px solid #e3e3e3;
            }
        }
    }

    .postage-special-list {
        border-top: 1px solid #e3e3e3;
    }

    .postage-special-item {
        > p {
            flex: 1;
            font-size: 12px;

            &:nth-child(2) {
                text-align: center;
            }

            &:nth-child(3) {
                text-align: right;
            }
        }
    }

    .postage-btn {
        text-align: right;
        padding: 10px;
    }
</style>