<template>
    <div class="md-postage-template">
        <breadcrumb :options="['商品管理', '运费模板']"/>
        <div class="main-container">
            <el-button type="primary" @click="createTemplate(2)">创建按件数模板</el-button>
            <el-button type="primary" @click="createTemplate(3)">创建按续件模板</el-button>
            <el-form :model="query" @submit.native.prevent="getData(true)" inline>
                <el-form-item label="名称">
                    <el-input v-model="query.name"/>
                </el-form-item>
                <el-form-item label="模板类型">
                    <el-select v-model="query.expressType" :value="query.expressType">
                        <el-option :value="undefined" label="全部"/>
                        <el-option value="2" label="按件数"/>
                        <el-option value="3" label="按续件"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="query.disabled" :value="query.disabled">
                        <el-option :value="undefined" label="全部"/>
                        <el-option :value="true" label="禁用"/>
                        <el-option :value="false" label="启用"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="table.data" border>
                <el-table-column label="模板名称" prop="name" align="center"/>
                <el-table-column label="模板类型" align="center">
                    <template slot-scope="scope">
                        {{scope.row.expressType === 2 ? '按件数' : '按续件'}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.disabled ? '禁用' : '启用'}}
                    </template>
                </el-table-column>
                <el-table-column label="管理" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-button type="text" @click="onDeleted(scope.row, api)">删除</el-button>
                        <el-button type="text" @click="onDisabled(scope.row, api)">{{scope.row.disabled ? '启用' :
                            '禁用'}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                @current-change="getData"
                :current-page.sync="query.page"
                :page-size="query.pageSize"
                layout="total, ->, prev, pager, next, jumper"
                :total="table.page.total"/>
        </div>

        <el-dialog :visible.sync="dialog" :title="dialogTitle" v-loading="loading" width="1000px">
            <store-express-form v-model="form.postage" v-if="form.expressType === 2" @submit="onCreateSubmitNumber">
                <template slot="prepend">
                    <el-form-item label="模板名称" :rules="rules.name" prop="name">
                        <el-input v-model="form.postage.name"/>
                    </el-form-item>
                </template>
                <el-button type="success" native-type="submit">提交</el-button>
            </store-express-form>
            <store-express-piece-form v-model="form" v-else-if="form.expressType === 3" @submit="onCreateSubmitPiece" input-temp-name>
                <el-button type="success" native-type="submit">提交</el-button>
            </store-express-piece-form>
        </el-dialog>
        <el-dialog :visible.sync="editDialog" :title="dialogEditTitle" v-loading="loading"
                   :close-on-click-modal="false" width="1000px">
            <store-express-form v-model="editForm.postage" v-if="editForm.expressType === 2"
                                @submit="onEditSubmitNumber">
                <template slot="prepend">
                    <el-form-item label="模板名称" :rules="rules.name" prop="name">
                        <el-input v-model="editForm.postage.name"/>
                    </el-form-item>
                </template>
                <el-button type="success" native-type="submit">提交</el-button>
            </store-express-form>
            <store-express-piece-form v-model="editForm" v-else-if="editForm.expressType === 3"
                                      @submit="onEditSubmitPiece" input-temp-name>
                <el-button type="success" native-type="submit">提交</el-button>
            </store-express-piece-form>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import api from '@/common/apis/postageTemplate';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import StoreExpressPieceForm from '@/components/form/StoreExpressPieceForm';
    import StoreExpressForm from '@/components/form/StoreExpressForm';
    import validator from 'el-form-validator';
    import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';

    export default {
        components: {StoreExpressForm, StoreExpressPieceForm},
        mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
        data() {
            return {
                api,
                typeName: '模板',
                loading: false,
                query: {
                    name: undefined,
                    expressType: undefined,
                    disabled: undefined,
                    page: 1,
                    pageSize: 20
                },
                dialog: false,
                form: {
                    name: undefined,
                    expressType: undefined,
                    postage: [],
                    disabled: false
                },
                editDialog: false,
                rules: {
                    name: [
                        {
                            required: true,
                            message: '必须输入名称'
                        },
                        {
                            rules: ['required', 'string', 'min:1', 'max:32'],
                            validator: validator.verification
                        }
                    ]
                },
                editForm: {}
            };
        },
        methods: {
            getData(b) {
                if (b) this.query.page = 1;
                this.query.storeId = this.shop.id;
                this.loading = true;
                api.list(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                }).finally(() => this.loading = false);
            },
            createTemplate(type) {
                let postage = {};
                if (this.form.expressType !== type) {
                    if (type === 2) {
                        postage = {
                            name: ''
                        };
                    } else {
                        postage = [{
                            area: [],
                            first: {
                                count: undefined,
                                price: undefined
                            },
                            extend: {
                                count: undefined,
                                price: undefined
                            },
                            isDefault: true
                        }];
                    }
                }
                this.form = {
                    name: undefined,
                    expressType: type,
                    postage,
                    disabled: false
                };
                this.dialog = true;
            },
            onCreateSubmitNumber() {
                let params = this.$util.deepClone(this.form);
                params.name = params.postage.name;
                delete params.postage.name;
                params.postage.first = this.$util.formatPrice(params.postage.first);
                params.postage.extend = this.$util.formatPrice(params.postage.extend);
                params.postage.batch = this.$util.formatPrice(params.postage.batch);
                params.postage = JSON.stringify(params.postage);
                params.storeId = this.shop.id;
                this.add(params);
            },
            onCreateSubmitPiece() {
                this.form.storeId = this.shop.id;
                let params = this.$util.deepClone(this.form);
                params.postage = params.postage.map(item => {
                    return {
                        area: item.area,
                        first: {
                            count: item.first.count,
                            price: this.$util.formatPrice(item.first.price)
                        },
                        extend: {
                            count: item.extend.count,
                            price: this.$util.formatPrice(item.extend.price)
                        },
                        isDefault: item.isDefault
                    };
                });
                params.postage = JSON.stringify(params.postage);
                this.add(params);
            },
            add(params) {
                this.loading = true;
                api.add(params).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(() => {
                        this.getData();
                        this.clearForm();
                        this.dialog = false;
                    });
                }).finally(() => this.loading = false);
            },
            clearForm() {
                this.form = {
                    name: undefined,
                    expressType: undefined,
                    postage: [],
                    disabled: false
                };
            },
            showEditDialog(item) {
                let data = this.$util.deepClone(item);
                data.postage = JSON.parse(data.postage);
                if (data.expressType === 2) {
                    data.postage.name = data.name;
                    data.postage.first = this.$util.priceFormat(data.postage.first);
                    data.postage.extend = this.$util.priceFormat(data.postage.extend);
                    data.postage.batch = this.$util.priceFormat(data.postage.batch);
                } else {
                    data.postage = data.postage.map(item => {
                        return {
                            area: item.area,
                            first: {
                                count: item.first.count,
                                price: this.$util.priceFormat(item.first.price)
                            },
                            extend: {
                                count: item.extend.count,
                                price: this.$util.priceFormat(item.extend.price)
                            },
                            isDefault: !!item.isDefault
                        };
                    });
                }
                this.editForm = data;
                this.editDialog = true;
            },
            onEditSubmitNumber() {
                let params = this.$util.deepClone(this.editForm);
                params.name = params.postage.name;
                delete params.postage.name;
                params.postage.first = this.$util.formatPrice(params.postage.first);
                params.postage.extend = this.$util.formatPrice(params.postage.extend);
                params.postage.batch = this.$util.formatPrice(params.postage.batch);
                params.postage = JSON.stringify(params.postage);
                this.edit(params);
            },
            onEditSubmitPiece() {
                let params = this.$util.deepClone(this.editForm);
                params.postage = params.postage.map(item => {
                    return {
                        area: item.area,
                        first: {
                            count: item.first.count,
                            price: this.$util.formatPrice(item.first.price)
                        },
                        extend: {
                            count: item.extend.count,
                            price: this.$util.formatPrice(item.extend.price)
                        },
                        isDefault: item.isDefault
                    };
                });
                params.postage = JSON.stringify(params.postage);
                this.edit(params);
            },
            edit(params) {
                this.loading = true;
                api.edit(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '更新成功').then(() => {
                        this.getData();
                        this.editDialog = false;
                    });
                }).finally(() => this.loading = false);
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'}),
            dialogTitle() {
                return this.form.expressType === 2 ? '按件数计费' : '按续件计费';
            },
            dialogEditTitle() {
                return this.editForm.expressType === 2 ? '按件数计费' : '按续件计费';
            }
        }
    };
</script>

<style scoped>

</style>
