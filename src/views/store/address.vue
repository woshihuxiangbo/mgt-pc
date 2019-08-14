<template>
    <div class="store-address" v-loading="loading">
        <breadcrumb :options="['店铺管理', '收货地址']"/>
        <div class="main-container">
            <el-button v-if="$util.checkRole(['1', '4' ,'5', '8', '13', '12'])" type="primary" @click="createAddress">
                创建地址
            </el-button>
            <div class="address-list">
                <el-card class="box-card" v-for="(item, index) in table.data" :key="index">
                    <div slot="header" v-if="$util.checkRole(['1', '4' ,'5', '8', '13', '12'])" class="card-header">
                        <el-button type="primary" @click="setDefaultAddress(item)" :disabled="item.isDefault">设为默认
                        </el-button>
                        <div>
                            <el-button type="text" @click="editAddress(item)">编辑地址</el-button>
                            <el-button type="text" @click="deleteAddress(item)">删除地址</el-button>
                        </div>
                    </div>
                    <list-item label-width="80px" label="收件人">{{item.details.name}}</list-item>
                    <list-item label-width="80px" label="座机号码">{{item.details.tel}}</list-item>
                    <list-item label-width="80px" label="手机号码">{{item.details.mobile}}</list-item>
                    <list-item label-width="80px" label="收件地址">
                        <span>{{item.details.province}} {{item.details.city}} {{item.details.county}}</span>
                        <span> {{item.details.details}}</span>
                    </list-item>
                    <list-item label-width="80px" label="邮政编码">{{item.details.postcode}}</list-item>
                </el-card>
            </div>
        </div>
        <el-dialog :title="getDialogTitle" :visible.sync="dialog" v-loading="loading">
            <address-form v-model="form" @submit="onSubmit"/>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import api from '@/common/apis/receiver';
    import ListItem from '@/components/widget/ListItem';
    import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';
    import AddressForm from '@/components/form/AddressForm';

    export default {
        components: {AddressForm, ListItem},
        mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
        data() {
            return {
                loading: false,
                form: {
                    id: undefined,
                    name: undefined,
                    postcode: undefined,
                    province: undefined,
                    city: undefined,
                    county: undefined,
                    details: undefined,
                    national: undefined,
                    tel: undefined,
                    mobile: undefined,
                    storeId: undefined,
                    isDefault: false
                },
                dialog: false,
                addMode: true,
                column: 'id,details,storeId,isDefault',
            };
        },
        methods: {
            getData() {
                this.loading = true;
                api.list({storeId: this.shop.id, column: this.column, sortBy: 'desc', sortOrder: 'id'}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        data.rows.map(item => {
                            if (!item.isDefault) item.isDefault = false;
                            return item;
                        });
                        console.info(data.rows);
                        this.table.data = data.rows;
                    });
                }).finally(() => this.loading = false);
            },
            createAddress() {
                this.dialog = true;
                this.addMode = true;
            },
            editAddress(item) {
                let params = Object.assign({}, item.details);
                params.id = item.id;
                params.storeId = item.storeId;
                console.info(params);
                this.form = params;
                this.locationTextToCode();
                this.addMode = false;
                this.dialog = true;
            },
            onSubmit() {
                if (this.addMode === false) {
                    this.onEdit();
                } else {
                    this.onAdd();
                }
            },
            onEdit() {
                this.loading = true;
                api.edit(this.form).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
                        this.dialog = false;
                        this.getData();
                        this.defaultForm();
                    });
                }).finally(() => this.loading = false);
            },
            onAdd() {
                this.loading = true;
                this.form.storeId = this.shop.id;
                api.add(this.form).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '更新成功').then(() => {
                        this.dialog = false;
                        this.getData();
                        this.defaultForm();
                    });
                }).finally(() => this.loading = false);
            },
            deleteAddress(item) {
                this.onDeleted(item, api);
            },
            defaultForm() {
                this.form = {
                    id: undefined,
                    name: undefined,
                    postcode: undefined,
                    province: undefined,
                    city: undefined,
                    county: undefined,
                    details: undefined,
                    national: undefined,
                    tel: undefined,
                    mobile: undefined,
                    storeId: undefined
                };
            },
            setDefaultAddress(item) {
                this.$util.actionConfirm('是否设置默认').then(() => {
                    let params = this.$util.deepClone(item);
                    let details = params.details;
                    delete params.details;
                    params.isDefault = true;
                    params = Object.assign(params, details);
                    this.loading = true;
                    api.edit(params).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '设置成功').then(() => {
                            // this.table.data = [];
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters({shop: 'shop'}),
            getDialogTitle() {
                return (this.addMode ? '添加' : '创建') + '地址';
            }
        }
    };
</script>

<style scoped lang="scss">
    .address-list {
        display: flex;
        flex-wrap: wrap;
        padding-top: 10px;

        .box-card {
            flex: 0 0 400px;
            margin-right: 10px;
            margin-bottom: 10px;

            .card-header {
                padding: 10px;
                display: flex;

                > div {
                    flex: 1;
                    text-align: right;
                }
            }
        }
    }
</style>

<style>
    .address-list .el-card__header {
        padding: 0;
    }
</style>
