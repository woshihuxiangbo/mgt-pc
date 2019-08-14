<template>
    <div class="shopping-car">
        <breadcrumb :options="['购物车']"/>
        <div class="main-container">
            <div v-for="(d, i) in tableData" :key="i">
                <shopping-car-table :data="d"
                                    @countChange="selectInputChange"
                                    @create="showSelectPayMethod"
                                    @updateTable="formatTableData"/>
            </div>
            <el-row style="margin: 10px 0">
                <el-col :span="24" align="right">
                    <el-button type="text" @click="dialogAddress = true">选择地址</el-button>
                    <el-button type="text" @click="createAddress">添加地址</el-button>
                </el-col>
            </el-row>
            <div>
                <el-card class="box-card" v-if="selectAddress !== undefined">
                    <list-item label-width="80px" label="收件人">{{selectAddress.details.name}}</list-item>
                    <list-item label-width="80px" label="座机号码">{{selectAddress.details.tel}}</list-item>
                    <list-item label-width="80px" label="手机号码">{{selectAddress.details.mobile}}</list-item>
                    <list-item label-width="80px" label="收件地址">
                        <span>{{selectAddress.details.province}} {{selectAddress.details.city}} {{selectAddress.details.county}}</span>
                        <span> {{selectAddress.details.details}}</span>
                    </list-item>
                    <list-item label-width="80px" label="邮政编码">{{selectAddress.details.postcode}}</list-item>
                </el-card>
            </div>
        </div>
        <el-dialog :title="getDialogTitle" :visible.sync="dialog" v-loading="loading">
            <address-form v-model="form" @submit="onSubmit"/>
        </el-dialog>
        <el-dialog title="选择地址" :visible.sync="dialogAddress" v-loading="loading" append-to-body :modal-append-to-body="false">
            <div class="address-list">
                <el-card class="box-card" v-for="(item, index) in table.data" :key="index">
                    <div slot="header" class="card-header">
                        <el-button type="primary" @click="setDefaultAddress(item)" :disabled="item.isDefault">设为默认
                        </el-button>
                        <div>
                            <el-button type="text" @click="onSelectAddress(item)">选择地址</el-button>
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
        </el-dialog>
        <el-dialog title="扫码付" :visible.sync="qrCodeDialog" width="350px"
                   :close-on-press-escape="true"
                   :close-on-click-modal="false"
                   :show-close="false"
                   @closed="clearTime" v-loading="loading"
                   center>
            <div>
                <qrcode-vue :value="qrCodeUrl" :size="300" level="H"/>
                <span class="qr-code-tip">可以使用ESC关闭此窗口</span>
            </div>
        </el-dialog>
        <el-dialog title="支付成功" :visible.sync="successDialog" width="350px" center v-loading="loading">
            <div slot="footer">
                <el-button type="success" @click="$router.replace({name: 'OrderWholesale'})">支付成功</el-button>
            </div>
        </el-dialog>
        <el-dialog title="选择付款方式" :visible.sync="payDialog" center width="300px" v-loading="loading">
            <div>
                <!--                <el-radio v-model="payMethod" :label="1">线上支付 （微信支付 | 支付宝支付）</el-radio>-->
                <!--                <hr style="margin-bottom: 10px;margin-top: 10px">-->
                <el-radio v-model="payMethod" :label="2">银行卡转账</el-radio>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="createOrder">下一步</el-button>
            </div>
        </el-dialog>

        <el-dialog title="转账银行卡列表" :visible.sync="bandDialog" center v-loading="loading">
            <div class="card-list">
                <bank-card v-for="(bank, i) in banks" :key="i" :bank="bank" :show-del-btn="false"/>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import receiverApi from '@/common/apis/receiver';
    import {regionData, CodeToText, TextToCode} from 'element-china-area-data';
    import tableDataMixins from '@/components/mixins/tableDataMixins';
    import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';
    import ListItem from '@/components/widget/ListItem';
    import restockApi from '@/common/apis/restock';
    import QrcodeVue from 'qrcode.vue';
    import bankApi from '@/common/apis/bank';
    import BankCard from '@/components/widget/BankCard';
    import ShoppingCarTable from '@/components/widget/ShoppingCarTable';
    import AddressForm from '@/components/form/AddressForm';

    export default {
        components: {AddressForm, ShoppingCarTable, BankCard, QrcodeVue, ListItem},
        mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
        data() {
            return {
                tableData: [],
                selectItems: [],
                regionData,
                loading: false,
                location: [],
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
                    storeId: undefined
                },
                dialog: false,
                addMode: true,
                column: 'id,details,storeId,isDefault',
                selectAddress: undefined,
                dialogAddress: false,
                qrCodeDialog: false,
                qrCodeUrl: '',
                successDialog: false,
                orderId: undefined,
                time: null,
                maxTime: undefined,
                payMethod: undefined,
                payDialog: false,
                banks: [],
                bandDialog: false
            };
        },
        methods: {
            getData() {
                this.loading = true;
                receiverApi.list({storeId: this.shop.id, column: this.column, sortBy: 'desc',sortOrder: 'id'}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.table.data = data.rows;
                        if (this.selectAddress !== undefined) return;
                        data.rows.forEach((item) => {
                            if (item.isDefault) this.selectAddress = item;
                        });
                    });
                }).finally(() => this.loading = false);
            },
            createAddress() {
                this.dialog = true;
                this.addMode = true;
            },
            formatTableData() {
                let items = JSON.parse(JSON.stringify(this.carItems));
                let list = [];
                for (let k in items) {
                    let item = items[k];
                    item.producerId = k;
                    let data = [];
                    for (let x in item.children) {
                        data.push(item.children[x]);
                    }
                    item.children = data;
                    list.push(item);
                }
                this.tableData = list;
            },
            handleChange(data) {
                let l = [];
                for (let i in data) {
                    l.push(CodeToText[data[i]]);
                }
                try {
                    this.form.province = l[0];
                    this.form.city = l[1];
                    this.form.county = l[2];
                } catch (e) {
                    this.$message.error('格式化地址出错啦');
                }
            },
            locationTextToCode() {
                let data = [this.form.province, this.form.city, this.form.county];
                let list = [];
                try {
                    list.push(TextToCode[data[0]].code);
                    list.push(TextToCode[data[0]][data[1]].code);
                    list.push(TextToCode[data[0]][data[1]][data[2]].code);
                } catch (e) {
                }
                this.location = list;
            },
            deleteAddress(item) {
                this.dialogAddress = false;
                this.onDeleted(item, receiverApi);
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
                receiverApi.edit(this.form).then(res => {
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
                receiverApi.add(this.form).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '更新成功').then(() => {
                        this.dialog = false;
                        this.getData();
                        this.defaultForm();
                    });
                }).finally(() => this.loading = false);
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
            onSelectAddress(item) {
                this.selectAddress = item;
                this.dialogAddress = false;
            },
            showSelectPayMethod(item) {
                this.selectItems = item;
                if (this.selectItems.length <= 0) {
                    return this.$message.error('请选择商品');
                }
                if (this.selectAddress === undefined) {
                    return this.$message.error('请选择收件地址');
                }
                this.payDialog = true;
            },
            createOrder() {
                let items = [];
                this.selectItems.forEach(item => {
                    if (item.buyCount <= 0) {
                        return;
                    }
                    items.push({
                        skuId: item.skuId,
                        number: item.buyCount
                    });
                    this.$store.dispatch('rmShoppingCarItem', item);
                });
                this.formatTableData();
                let params = {
                    storeId: this.shop.id,
                    receiverId: this.selectAddress.id,
                    items: JSON.stringify(items),
                    payMethod: this.payMethod
                };
                restockApi.add(params).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '创建订单成功').then(({data}) => {
                        this.deleteSelectItemToShopping();
                        this.payDialog = false;
                        if (this.payMethod === 1) {
                            this.qrCodeDialog = true;
                            this.qrCodeUrl = data.codeUrl;
                            this.orderId = data.orderId;
                            this.maxTime = new Date().getTime() + 300000;
                            this.createTimer();
                        } else {
                            this.banks = data.bank;
                            this.bandDialog = true;
                        }
                    });
                });
            },
            createTimer() {
                this.clearTime();
                this.time = setInterval(() => {
                    if (new Date().getTime() > this.maxTime) {
                        this.clearTime();
                        this.$message.error('支付超时');
                    }
                    restockApi.check(this.orderId).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '支付成功', false).then(() => {
                            this.qrCodeDialog = false;
                            this.successDialog = true;
                            this.clearTime();
                        });
                    });
                }, 3000);
            },
            clearTime() {
                if (this.time !== null) {
                    clearInterval(this.time);
                }
                this.time = null;
            },
            selectInputChange (item) {
                this.$store.dispatch('editShoppingCarItem', item);
            },
            deleteSelectItemToShopping () {
                this.selectItems.forEach(item => {
                    if (item.buyCount <= 0) {
                        return;
                    }
                    this.$store.dispatch('rmShoppingCarItem', item);
                });
            },
            setDefaultAddress(item) {
                this.dialogAddress = false;
                this.$util.actionConfirm('是否设置默认', 'custom-class').then(() => {
                    let params = this.$util.deepClone(item);
                    let details = params.details;
                    delete params.details;
                    params.isDefault = true;
                    params = Object.assign(params, details);
                    this.loading = true;
                    receiverApi.edit(params).then(res => {
                        this.$util.handelHttpResponseResult(res, true, '设置成功').then(() => {
                            // this.table.data = [];
                            this.getData();
                        });
                    }).finally(() => this.loading = false);
                });

                this.formatTableData();
            }
        },
        computed: {
            ...mapGetters({carItems: 'shoppingCarItems', shop: 'shop'}),
            getDialogTitle() {
                return (this.addMode ? '添加' : '创建') + '地址';
            },
            getItemsTotalPrice() {
                let price = 0;
                this.selectItems.forEach((item) => {
                    price += item.price * item.buyCount * item.unit;
                });
                return price;
            }
        },
        watch: {
            selectItems() {
                console.info('change');
            }
        },
        mounted() {
            this.formatTableData();
            this.getData();
        },
        beforeDestroy() {
            this.clearTime();
        }
    };
</script>

<style scoped lang="scss">
    .qr-code-tip {
        display: block;
        margin-top: 30px;
        color: #777;
        text-align: center;
    }

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

    .card-list {
        > * {
            margin-left: 10px;
            margin-bottom: 10px;
        }
    }
</style>

<style lang="scss">
    .custom-class {

    }
</style>
