<template>
    <el-form
            ref="form"
            :model="form"
            label-width="120px"
            @submit.native.prevent="onSubmit"
            class="goods-form"
    >
        <legend>基本资料</legend>
        <el-form-item label="缩略图">
            <upload-avatar v-model="form.thumbnail"
                           :oss-type="ossType.item"
                           :sub-mod="subMold.item"/>
        </el-form-item>
        <el-form-item label="头图">
            <upload-avatar
                    v-model="form.headerPic"
                    :oss-type="ossType.item"
                    :sub-mod="subMold.item"
                    width="345px"
                    height="172px"
            />
        </el-form-item>
        <el-form-item label="轮播图">
            <upload-slider
                    :oss-type="ossType.item"
                    :sub-mod="subMold.slide"
                    v-model="form.slide"
            />
        </el-form-item>
        <el-form-item
                prop="name"
                :rules="{ required: true, message: '请输入商品名称',  }"
                label="商品名称"
        >
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item
                label="商品功效"
                prop="effect"
                :rules="{ required: true, message: '请输入商品功效',  }"
        >
            <el-input v-model="form.effect" type="textarea"></el-input>
        </el-form-item>

        <!-- <el-form-item label="店铺名称" prop="storeId" v-show="!this.shop.id">
            <store-selector v-model="form.storeId" :showAll="true"></store-selector>
        </el-form-item>-->
        <el-form-item class="selector" label="商品分类" prop="categoryId" :rules="{ required: true, message: '请选择',  }">
            <category-selector :disabled="form.isGift" v-model="form.categoryId" :show-gift="!form.isGroupStoreItem&&!form.id"></category-selector>
        </el-form-item>
        
        <el-form-item class="selector" label="商品品牌" prop="brandId" :rules="{ required: true, message: '请选择',  }">
            <brand-selector v-model="form.brandId"></brand-selector>
        </el-form-item>

        <!-- <el-form-item class="selector" label="商品厂商" prop="producerId" :rules="{ required: true, message: '请选择',  }">
            <firm-selector v-model="form.producerId"></firm-selector>
        </el-form-item> -->

        <el-form-item label="市场价" prop="marketPrice" 
            :rules="{ 
                rules:'required|numeric|min:0',
                validator: validator.verification,
                trigger: 'blur'  
            }
        ">
            <el-col :span="4">
                <!-- <el-input-number :min="0" :precision="2" v-model="form.marketPrice"/> -->
                <el-input type="number" v-model="form.marketPrice" placeholder=""></el-input>
            </el-col>
            <el-col :span="1" align="center">元</el-col>
        </el-form-item>
        
        <el-form-item 
            v-if="form.isGroupStoreItem"
            label="发货方式" 
            >
            <el-radio v-model="form.groupDeliverType" :label="true">线下自提</el-radio>
            <el-radio v-model="form.groupDeliverType" :label="undefined">线上发货</el-radio>
        </el-form-item>

        <el-form-item v-if="!form.isGroupStoreItem" label="属性">
            <el-checkbox v-model="form.isNew" true-label="1">新品</el-checkbox>
            <el-checkbox v-model="form.isHot" true-label="1">热销</el-checkbox>
            <el-checkbox v-model="form.isRecommend" true-label="1">推荐</el-checkbox>
            <el-checkbox v-model="form.cartRecommend" true-label="1">购物车推荐</el-checkbox>
        </el-form-item>
        <el-form-item label="资质报告">
            <upload-img 
                v-model="form.aptitude" 
                :ossType="ossType.item" 
                :subMod="subMold.itemDoc"
                />
        </el-form-item>
        <el-form-item label="商品状态">
            <el-select v-model="form.disabled" placeholder="请选择">
                <el-option label="正常" :value="undefined"></el-option>
                <el-option label="禁用" :value="1"></el-option>
            </el-select>
        </el-form-item>

        <legend>商品规格</legend>
        <el-form-item>
            <div class="table-container">
                <div class="table">
                    <div class="row">
                        <div class="col1">规格名称</div>
                        <div class="col2 title">规格属性</div>
                        <div class="col3" v-if="canEdit">操作</div>
                    </div>
                    <div class="row" v-for="(item,idx) in form.spec" :key="idx">
                        <div class="col1">
                            <el-form-item
                                    :prop="'spec.' + idx + '.name'"
                                    :rules="{
                                    required: true, message: '不能为空',
                                }"
                            >
                                <el-input class="table-input" :disabled="!canEdit" size="mini" v-model="item.name"/>
                            </el-form-item>
                        </div>
                        <div class="col2">
                            <div class="input-container" v-for="(val,index) in item.values" :key="index">
                                <el-form-item
                                        :prop="'spec.'+idx+'.values.' + index + '.value'"
                                        :rules="{
                                        required: true, message: '不能为空',
                                    }"
                                >
                                    <el-input class="table-input" :disabled="!canEdit" size="mini" v-model="val.value"/>
                                </el-form-item>
                                <el-button
                                        v-if="canEdit"
                                        size="mini"
                                        type="text"
                                        @click="delCol(item.values,index,idx)"
                                        icon="el-icon-close"
                                ></el-button>
                            </div>
                        </div>
                        <div class="col3" v-if="canEdit">
                            <el-button type="text" @click="addCol(form.spec,idx)">添加</el-button>
                            <el-button type="text" @click="delRow(form.spec,idx)">删除</el-button>
                        </div>
                    </div>
                </div>
                <el-button v-if="canEdit" type="text" @click="addRow()">添加规格</el-button>
            </div>
        </el-form-item>

        <el-form-item label="商品详情">
            <editor v-model="form.body" prop="body"></editor>
        </el-form-item>
        <el-form-item>
            <slot/>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';

    import UploadAvatar from "@/components/widget/UploadAvatar";
    import UploadSlider from "@/components/widget/UploadSlider";

    // import CropperImage from '../widget/CropperImage';
    import {ossType, subMold} from '@/common/apis/oss';
    import Editor from '@/components/widget/Editor';
    import CategorySelector from '../selector/CategorySelector';
    import BrandSelector from '../selector/BrandSelector';
    // import FirmSelector from '../selector/FirmSelector';
    // import StoreSelector from '../selector/StoreSelector';
    import UploadImg from '../widget/UploadImg';
    import validator from 'el-form-validator';
    export default {
        name: 'GoodsForm',
        components: {
            // CropperImage,
            CategorySelector,
            BrandSelector,
            // FirmSelector,
            // StoreSelector,
            UploadAvatar,
            Editor,
            UploadImg,
            UploadSlider
        },
        props: {
            canEdit: {
                type: Boolean,
                default: true
            }
        },
        mixins: [vModelMixins],
        data() {
            return {
                validator,
                ossType,
                subMold,
                sortID: 0
            };
        },
        methods: {
            _checkImg() {
                if (!this.form.thumbnail) {
                    this.$message.error('请上传商品缩略图');
                    return false;
                }
                if (!this.form.headerPic) {
                    this.$message.error('请上传商品头图');
                    return false;
                }
                if (!this.form.slide.length) {
                    this.$message.error('请上传商品轮播图');
                    return false;
                }
                return true;
            },
            onSubmit(e) {
                e.preventDefault();
                if (!this._checkImg()) return;
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if (!this.form.body) {
                            this.$message.error('请输入商品详情');
                            return;
                        }
                        this.$emit('submit', e);
                    }
                });
            },
            delRow(row, index) {
                if (this.form.spec.length > 1) {
                    this.form.spec.splice(index, 1);
                } else {
                    // this.$message.error('规格不能为空');
                }
            },
            addRow() {
                this.sortID++;
                this.form.spec.push({
                    name: '',
                    sortID: this.sortID,
                    values: [
                        {
                            value: '',
                            sortID: 0
                        }
                    ]
                });
            },
            addCol(val, index) {
                this.sortID++;
                this.form.spec[index].values.push({
                    value: '',
                    sortID: this.sortID
                });
            },
            delCol(list, idx, index) {
                if (list.length <= 1) {
                    if (this.form.spec.length > 1) {
                        this.form.spec.splice(index, 1);
                    } else {
                        // this.$message.error('规格不能为空');
                    }
                } else {
                    this.form.spec[index].values.splice(idx, 1);
                }
            }
        }
    };
</script>
<style lang="scss">
.goods-form{
    .selector {
        width: 600px;
        .el-select{
            width: 100%;
        }
    }
    .table-container {
        .el-form-item__error {
            top: 10px;
            right: 12px;
            left: auto;
        }

        .table {
            border: 1px solid #eee;
            text-align: center;

            .table-input {
                width: 150px;
                margin: 0 5px;
            }

            .row {
                border-bottom: 1px solid #eee;
                display: flex;

                .col1 {
                    width: 200px;
                    border-right: 1px solid #eee;
                }

                .col2 {
                    min-width: 175px;
                    flex-grow: 1;
                    border-right: 1px solid #eee;
                    display: flex;
                    flex-wrap: wrap;

                    &.title {
                        flex-direction: row;
                        justify-content: center;
                    }
                }

                .col3 {
                    width: 120px;
                }

                .col1,
                .col3 {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }

            .input-container {
                display: flex;
            }
        }

        .el-col {
            margin: 0 0;
        }
    }

    .el-col {
        margin: 2px 0;
    }

    legend {
        margin-bottom: 15px;
        padding-left: 40px;
    }

    .table-container .el-input.is-disabled .el-input__inner {
        background-color: inherit !important;
        color: inherit !important;
        cursor: not-allowed;
    }

    .el-input-number__decrease,
    .el-input-number__increase {
        display: none;
    }

    .el-input-number {
        width: auto;

        .el-input__inner {
            padding: 0;
        }
    }
}
</style>