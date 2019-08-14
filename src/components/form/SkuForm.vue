<template>
    <el-form
        class="form"
        label-width="120px"
        :model="form"
        :rules="rules"
        ref="form"
        @submit.native.prevent="onSubmit"
    >
        <el-form-item label="商品规格" prop="spuName">
            <el-input size="small" v-model="form.spuName"></el-input>
        </el-form-item>
        <el-form-item label="划线价" prop="marketPrice">
            <el-input size="small" v-model="form.marketPrice">
                <template slot="prefix">￥:</template>
            </el-input>
        </el-form-item>
        <el-form-item label="供应商出货价" prop="singleCost">
            <el-input size="small" v-model="form.singleCost">
                <template slot="prefix">￥:</template>
            </el-input>
        </el-form-item>
        <el-form-item label="供货价" prop="supplyPrice" v-if="role.roleID === '14' || isCreateByGroup">
            <el-input size="small" v-model="form.supplyPrice">
                <template slot="prefix">￥:</template>
            </el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
            <el-input size="small" :disabled="!!form.id" v-model="form.stock"></el-input>
        </el-form-item>
        <!-- <el-form-item label="新增入库" v-if="!!form.id" prop="addStock">
                <el-input size="small" v-model="form.addStock"></el-input>
            </el-form-item> -->
        <el-form-item label="重量(g)">
            <el-input size="small" v-model="form.weight"></el-input>
        </el-form-item>

        <el-form-item :rules="{ required: true, message: '请输入'}" label="团长分红比例"
                      v-if="isGroup === true">
            <el-input-number v-model="form.groupLeaderBenefit" :min="0" :max="100" placeholder="百分比"/>
        </el-form-item>
        <el-form-item label="分佣比例" :rules="{required: true, message: '请选择'}"
                      v-if="isGroup !== true && role.roleID !== '14'">
            <el-radio-group v-model="showPlatForm">
                <el-radio :label="false">分销裂变</el-radio>
                <el-radio :label="true">赚返佣</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item v-if="showPlatForm">
            <el-row :gutter="10" class="plat-item">
                <el-col :span="12">
                    <el-form-item label="Lv3(合伙人)的分红比例" label-width="180px"
                                  :prop="'allocConfig.lv3.self'"
                                  :rules="{
							rules: 'required|min:0|numeric',
							validator: validator.verification,
							trigger: 'blur'
						}">
                        <el-input v-model.number="form.allocConfig.lv3.self"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="1">%</el-col>
            </el-row>
        </el-form-item>
        <el-form-item v-if="showPlatForm">
            <el-row :gutter="10" class="plat-item">
                <el-col :span="12">
                    <el-form-item label="Lv2(总监)的分红比例" label-width="180px"
                                  :prop="'allocConfig.lv2.self'"
                                  :rules="{
							rules: 'required|min:0|numeric',
							validator: validator.verification,
							trigger: 'blur'
						}"
                    >
                        <el-input v-model.number="form.allocConfig.lv2.self"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="1">%</el-col>
                <el-col :span="8">
                    <el-form-item label="上级分红比例" label-width="120px"
                                  :prop="'allocConfig.lv2.parent'"
                                  :rules="{
							rules: 'required|min:0|numeric',
							validator: validator.verification,
							trigger: 'blur'
						}"
                    >
                        <el-input v-model.number="form.allocConfig.lv2.parent"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="1">%</el-col>
            </el-row>
        </el-form-item>
        <el-form-item v-if="showPlatForm">
            <el-row :gutter="10" class="plat-item">
                <el-col :span="12">
                    <el-form-item label="Lv1(店主)的分红比例" label-width="180px"
                                  :prop="'allocConfig.lv1.self'"
                                  :rules="{
							rules: 'required|min:0|numeric',
							validator: validator.verification,
							trigger: 'blur'
						}">
                        <el-input v-model.number="form.allocConfig.lv1.self"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="1">%</el-col>
                <el-col :span="8">
                    <el-form-item label="上级分红比例" label-width="120px"
                                  :prop="'allocConfig.lv1.parent'"
                                  :rules="{
							rules: 'required|min:0|numeric',
							validator: validator.verification,
							trigger: 'blur'
						}"
                    >
                        <el-input v-model.number="form.allocConfig.lv1.parent"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="1">%</el-col>
            </el-row>
        </el-form-item>
        <el-form-item v-if="showPlatForm">
            <el-row :gutter="10" class="plat-item">
                <el-col :span="12">
                    <el-form-item label="买家或访客分享分红比例" label-width="180px"
                                  :prop="'allocConfig.other.self'"
                                  :rules="{
							rules: 'required|min:0|numeric',
							validator: validator.verification,
							trigger: 'blur'
						}">
                        <el-input v-model.number="form.allocConfig.other.self"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="1">%</el-col>
                <el-col :span="11">
                    <span class="md-muted">（买家分享店铺或者商品链接出去后获得的分红比例）</span>
                </el-col>
            </el-row>
        </el-form-item>

        <el-form-item label="包装规格">
            <template slot="label">
                <span class="md-red">*</span>包装规格
            </template>
            <el-table class="table" size="mini" border :data="form.sku|skuDeleted" style="width: 100%">
                <el-table-column align="center" label="单位">
                    <template slot-scope="scope">
                        <el-form-item
                            :prop="'sku.'+scope.row.skuIdx+'.skuName'"
                            :rules="{
								rules: 'required',
								validator: validator.verification,
								trigger: 'blur'
							}"
                        >
                            <el-input class="table-input" size="small" v-model="scope.row.skuName"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="件数">
                    <template slot-scope="scope">
                        <el-form-item
                            :prop="'sku.'+scope.row.skuIdx+'.unit'"
                            :rules="{
								rules: 'required|min:0|numeric',
								validator: validator.verification,
								trigger: 'blur'
							}"
                        >
                            <el-input class="table-input" size="small" v-model="scope.row.unit"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="零售单价">
                    <template slot-scope="scope">
                        <el-form-item
                            :prop="'sku.'+scope.row.skuIdx+'.price'"
                            :rules="{
								rules: 'required|min:0|numeric',
								validator: validator.verification,
								trigger: 'blur'
							}"
                        >
                            <el-input class="table-input" size="small" v-model="scope.row.price"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="经销商批发价" v-if="role.roleScope !== 2 && shop.id === '0' || true">
                    <template slot-scope="scope">
                        <el-form-item
                            :prop="'sku.'+scope.row.skuIdx+'.wholesalePrice'"
                            :rules="{
								rules: 'required|min:0|numeric',
								validator: validator.verification,
								trigger: 'blur'
							}">
                            <el-input class="table-input" size="small" v-model="scope.row.wholesalePrice"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否零售" width="100">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.retailMark"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="是否批发" v-if="role.roleScope !== 2 && shop.id === '0' && false" width="100">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.wholesaleMark"></el-switch>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" align="center" width="80">
                    <template slot-scope="scope">
                        <el-button size="small" type="warning" icon="el-icon-delete" v-if="role.roleID !== '14'"
                                   @click="delSku(scope.row,scope.$index)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button icon="el-icon-plus" size="small" type="primary" @click="addSku" v-if="role.roleID !== '14'">
                添加规格
            </el-button>
        </el-form-item>
        <el-form-item>
            <slot/>
        </el-form-item>
    </el-form>
</template>
<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import validator from 'el-form-validator';
    import {mapGetters} from 'vuex';

    export default {
        name: 'SkuForm',
        mixins: [vModelMixins],
        props: {
            isGroup: {type: Boolean, default: false},
            isCreateByGroup: {type: Boolean, default: false}
        },
        data() {
            return {
                validator,
                showPlatForm: false,
                rules: {
                    spuName: [
                        {
                            required: true,
                            message: '请输入商品规格',
                            trigger: 'blur'
                        }
                        // {
                        // 	rules: 'required|min:0|numeric',
                        // 	validator: validator.verification,
                        // 	trigger: 'blur'
                        // }
                    ],
                    marketPrice: [
                        {
                            required: true,
                            message: '请输入价格',
                            trigger: 'blur'
                        },
                        {
                            rules: 'required|min:0|numeric',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    singleCost: [
                        {
                            required: true,
                            message: '请输入价格',
                            trigger: 'blur'
                        },
                        {
                            rules: 'required|min:0|numeric',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    supplyPrice: [
                        {
                            required: true,
                            message: '请输入价格',
                            trigger: 'blur'
                        },
                        {
                            rules: 'required|min:0|numeric',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    weight: [
                        {
                            required: true,
                            message: '请输入重量',
                            trigger: 'blur'
                        },
                        {
                            rules: 'required|min:0|numeric',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    stock: [
                        {
                            required: true,
                            message: '请输入重量库存',
                            trigger: 'blur'
                        },
                        {
                            rules: 'required|min:0|numeric',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ]
                }
            };
        },
        filters: {
            skuDeleted(list) {
                return list.filter(item => {
                    return !item.deleted;
                });
            }
        },
        mounted() {
            if (this.form.allocConfig === '{}' || !this.form.allocConfig || this.$util.objectLength(this.form.allocConfig) <= 0) {
                this.showPlatForm = false;
            } else {
                this.showPlatForm = true;
            }
        },
        watch: {
            showPlatForm(val) {
                let obj = {
                    lv1: {
                        self: 0,
                        parent: 0
                    },
                    lv2: {
                        self: 0,
                        parent: 0
                    },
                    lv3: {
                        self: 0
                    },
                    other: {
                        self: 0
                    }
                };
                if (val) {
                    if (this.form.allocConfig === '{}' || !this.form.allocConfig || this.$util.objectLength(this.form.allocConfig) <= 0) {
                        this.$set(this.form, 'allocConfig', obj);
                    }
                } else {
                    this.form.allocConfig = {};
                }
            }
        },
        methods: {
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.form.stock = parseInt(this.form.stock);
                        this.form.weight = parseInt(this.form.weight);
                        this.form.sku = this.form.sku.filter(item => {
                            if (!item.id) {
                                if (!item.deleted) {
                                    return item;
                                }
                            } else {
                                return item;
                            }
                        });
                        this.form.sku = this.form.sku.map(item => {
                            item.unit = parseInt(item.unit);
                            return item;
                        });
                        this.$emit('submit', e);
                    }
                });
            },
            delSku(row, idx) {
                this.$confirm(`是否删除此规格?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.form.sku[row.skuIdx].deleted = true;
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            },
            addSku() {
                let skuIdx = this.form.sku.length;
                this.form.sku.push({
                    skuName: undefined,
                    unit: undefined, //一盒/箱 多少个
                    price: undefined,
                    supplyPrice: undefined,
                    wholesalePrice: undefined,
                    // wholesaleMark: ['1', '4', '12', '13'].indexOf(this.role.roleID) !== -1 && this.shop.id === "0",
                    wholesaleMark: false,
                    retailMark: true,
                    deleted: false,
                    skuIdx,
                    id: ''
                });
            }
        },
        computed: {
            ...mapGetters({role: 'role', shop: 'shop'})
        }
    };
</script>
