<template>
    <div class="goods-form">
        <div class="navigation">
            <a @click="scrollTo('base')">基础<br>信息</a>
            <a @click="scrollTo('sku')">商品<br>规格</a>
            <a @click="scrollTo('img')">商品<br>图片</a>
            <a @click="scrollTo('info')">商品<br>详情</a>
        </div>
        <el-form ref="form" :model="form" label-width="120px" @submit.native.prevent="onSubmit" class="form"
                 :rules="rules">
            <legend ref="base">基础信息</legend>

            <el-form-item prop="name" :rules="{ required: true, message: '请输入商品名称'}" label="商品名称">
                <el-input v-model="form.name" :disabled="isMasterItem"/>
            </el-form-item>
            <el-form-item label="商品功效" prop="effect" :rules="{ required: true, message: '请输入商品功效'}">
                <el-input v-model="form.effect" type="textarea" :disabled="isMasterItem"></el-input>
            </el-form-item>

            <el-form-item class="selector" label="商品分类" prop="categoryId" :rules="{ required: true, message: '请选择'}">
                <category-selector :select-value="defaultSelectClass" v-model="form.categoryId" :disabled="isMasterItem"
                                   :is-group="form.isGroupStoreItem" show-gift :owner-id="form.owner"/>
            </el-form-item>
            <el-form-item class="selector" label="商品品牌" prop="brandId" :rules="{ required: true, message: '请选择'}"
                          v-show="role.roleID !== '14'">
                <brand-selector v-model="form.brandId" :disabled="isMasterItem" owner-id="0" has-default/>
            </el-form-item>

            <el-form-item class="selector" label="商品厂商" prop="producerId"
                          v-if="!form.isGroupStoreItem && shop.id === '0'"
                          :rules="{ required: true, message: '请选择'}">
                <firm-selector v-model="form.producerId" :disabled="isMasterItem"/>
            </el-form-item>

            <el-form-item label="质检报告">
                <upload-img v-model="form.aptitude" :ossType="ossType.item" :subMod="subMold.itemDoc"
                            :disabled="isMasterItem"/>
            </el-form-item>
            <el-form-item label="按ID倒叙排列" v-if="!isMasterItem" prop="sortId">
                <el-input-number :min="0" :max="99999999" v-model="form.sortId" :precision="0"/>
                <el-checkbox v-model="form.isTopping" style="margin-left: 20px">置顶 &nbsp;&nbsp;&nbsp;置顶优先于不置顶，置顶中有排序
                </el-checkbox>
            </el-form-item>
            <el-form-item label="服务承诺" prop="service">
                <el-checkbox-group v-model="form.service" :disabled="isMasterItem">
                    <el-checkbox v-for="(s, i) in serviceData" :key="i" :label="s" :value="s"/>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="推荐属性">
                <el-checkbox :disabled="isMasterItem" v-model="form.isNew" true-label="1"
                             v-if="form.isGroupStoreItem !== true">新品
                </el-checkbox>
                <el-checkbox :disabled="isMasterItem" v-model="form.isHot" true-label="1">热销</el-checkbox>
                <el-checkbox :disabled="isMasterItem" v-model="form.isRecommend" true-label="1"
                             v-if="form.isGroupStoreItem !== true">推荐
                </el-checkbox>
                <el-checkbox :disabled="isMasterItem" v-model="form.cartRecommend" true-label="1"
                             v-if="form.isGroupStoreItem !== true">购物车推荐
                </el-checkbox>
            </el-form-item>
            <el-form-item label="虚拟销量" prop="fictitiousSalesCount">
                <el-input-number v-model="form.fictitiousSalesCount" :min="0" :max="999999999" :precision="0"
                                 :disabled="isMasterItem"/>
            </el-form-item>

            <el-form-item label="运费模板" prop="expressType">
                <el-radio v-model="form.expressType" :label="1">全国包邮</el-radio>
                <br>
                <el-radio v-model="form.expressType" :label="2">按件数选择运费</el-radio>
                <br>
                <el-radio v-model="form.expressType" :label="3">按续件选择运费</el-radio>
            </el-form-item>

            <el-collapse-transition>
                <el-form-item v-if="form.expressType === 2" prop="postage">
                    <store-express-number-table v-model="form.postage" @edit="editPost" @delete="deletePost"/>
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="editPost({})">添加运费</el-button>
                </el-form-item>
                <el-form-item v-if="form.expressType === 3" prop="postage">
                    <store-express-piece-table v-model="form.postage" @edit="editPost({})"/>
                    <el-button icon="el-icon-plus" size="small" type="primary" @click="editPost({})">添加运费</el-button>
                </el-form-item>
            </el-collapse-transition>

            <el-form-item label="商品状态" v-if="role.roleID !== '14'">
                <el-select v-model="form.disabled" placeholder="请选择" :value="form.disabled" :disabled="isMasterItem">
                    <el-option label="正常" :value="undefined"></el-option>
                    <el-option label="禁用" :value="1"></el-option>
                </el-select>
            </el-form-item>


            <!-- <el-form-item label="支付方式" v-if="isGroupStoreItem">
              <el-radio v-model="form.groupDeliverType" :label="1">线上支付</el-radio>
              <el-radio v-model="form.groupDeliverType" :label="2">到店自提</el-radio>
              <el-radio v-model="form.groupDeliverType" :label="3">线下支付</el-radio>
              <el-radio v-model="form.groupDeliverType" :label="4">到家自提<small>(仅团购商品)</small></el-radio>
            </el-form-item> -->
            <el-form-item v-if="form.isGroupStoreItem" label="发货方式">
                <el-radio :disabled="isMasterItem" v-model="form.groupDeliverType" :label="1">线上发货</el-radio>
                <el-radio :disabled="isMasterItem" v-model="form.groupDeliverType" :label="2">到店自提</el-radio>
                <el-radio :disabled="isMasterItem" v-model="form.groupDeliverType" :label="3">团长家中自提</el-radio>
            </el-form-item>
            <el-form-item label="参与活动" :rules="{required: true, message: '请选择参与活动'}" prop="allowEvent"
                          v-if="false && form.isGroupStoreItem !== true">
                <el-radio :disabled="isMasterItem" v-model="form.allowEvent" :label="2">代金券活动享受</el-radio>
                <el-radio :disabled="isMasterItem" v-model="form.allowEvent" :label="1">不参与任何活动</el-radio>
            </el-form-item>

            <legend ref="sku">商品规格</legend>

            <el-form-item label="商品规格" prop="spec">
                <sku-an-spu-table
                        @onEdit="editSku"
                        @onDelete="deleteSku"
                        :value="spec|spuDeleted">
                </sku-an-spu-table>
                <el-button icon="el-icon-plus" size="small" type="primary" @click="addSku"
                           v-if="showSpec()">添加规格
                </el-button>
            </el-form-item>

            <legend ref="img">商品图片</legend>

            <el-form-item class="flex-wrap" label="商品缩略图">
                <cropper-image v-model="form.thumbnail" :oss-type="ossType.item" :sub-mod="subMold.item"
                               width="200px" height="200px"
                               :disabled="isMasterItem"
                               :options="{autoCropWidth: 200, autoCropHeight: 200, enlarge: 3, info: false}"/>
            </el-form-item>
            <el-form-item label="商品头图" prop="headerPic">
                <cropper-image v-model="form.headerPic" :oss-type="ossType.item" :sub-mod="subMold.item"
                               width="230px" height="115px"
                               :disabled="isMasterItem"
                               :options="{autoCropWidth: 230, autoCropHeight: 115, enlarge: 3, info: false}"/>
            </el-form-item>
            <el-form-item label="轮播图" :rules="{required: true, message: '轮播图必须上传'}" prop="slide">
                <upload-slider :disabled="isMasterItem" :oss-type="ossType.item" :sub-mod="subMold.slide"
                               v-model="form.slide" @preview="onSliderPreview"/>
            </el-form-item>

            <el-form-item label="商品视频">
                <el-input v-model="form.videoUrl" :disabled="isMasterItem"></el-input>
            </el-form-item>

            <legend ref="info" v-if="!isMasterItem">商品详情</legend>

            <el-form-item label="商品详情" :rules="{required: true, message: '必须输入'}" v-if="!isMasterItem">
                <editor v-model="form.body" prop="body"></editor>
            </el-form-item>
            <el-form-item>
                <slot/>
            </el-form-item>
        </el-form>
        <el-dialog :title="postDialog.title" :close-on-click-modal="false" :visible.sync="postDialog.show"
                   width="1000px" :show-close="false" :close-on-press-escape="false">
            <store-express-form v-model="postDialog.data" @submit="onPostDialogSubmit" :options-data="form.postage"
                                v-if="form.expressType === 2">
                <template slot="prepend">
                    <el-form-item label="选择模板" v-loading="loadPostage" v-if="this.role.roleID !== '14'">
                        <el-select v-model="selectPostage" :value="selectPostage" @change="changeNumberPostage">
                            <el-option v-for="(k, i) in postageTemplate" :key="i" :value="i" :label="k.name"/>
                        </el-select>
                    </el-form-item>
                </template>
                <el-button type="primary" native-type="submit">确定</el-button>
                <el-button type="primary" @click="postDialog.show = false">取消</el-button>
            </store-express-form>
            <store-express-piece-form v-model="form" v-if="form.expressType === 3" @submit="postDialog.show = false">
                <template slot="prepend">
                    <el-form-item label="选择模板" v-loading="loadPostage" v-if="this.role.roleID !== '14'">
                        <el-select v-model="selectPostage" :value="selectPostage" @change="changePiecePostage">
                            <el-option v-for="(k, i) in postageTemplate" :key="i" :value="i" :label="k.name"/>
                        </el-select>
                    </el-form-item>
                </template>
                <el-button @click="postDialog.show = false">取消</el-button>
                <el-button type="primary" native-type="submit">确定</el-button>
            </store-express-piece-form>
        </el-dialog>
        <el-dialog :title="skuDialog.title" center :close-on-click-modal="false" :visible.sync="skuDialog.show"
                   v-if="skuDialog.show" width="90%">
            <sku-form v-model="skuDialog.data" @submit="onSkuDialogSubmit" :is-group="form.isGroupStoreItem"
                      :is-create-by-group="form.owner && form.owner !== '0'">
                <div style="text-align:center">
                    <el-button type="primary" native-type="submit">确定</el-button>
                    <el-button type="info" @click="skuDialog.show=false">取消</el-button>
                </div>
            </sku-form>
        </el-dialog>
    </div>
</template>
<script>

    import vModelMixins from '@/components/mixins/vModelMixins';
    import UploadAvatar from '@/components/widget/UploadAvatar';
    import UploadSlider from '@/components/widget/UploadSlider';
    import {ossType, subMold} from '@/common/apis/oss';
    import Editor from '@/components/widget/Editor';
    import CategorySelector from '../selector/CategorySelector';
    import BrandSelector from '../selector/BrandSelector';
    import UploadImg from '../widget/UploadImg';
    import validator from 'el-form-validator';
    import StoreExpressForm from '@/components/form/StoreExpressForm';
    import SkuForm from '@/components/form/SkuForm';
    import {CodeToText} from 'element-china-area-data';
    import SkuAnSpuTable from '@/components/table/SkuAnSpuTable';
    import CropperImage from '@/components/widget/CropperImage';
    import {mapGetters} from 'vuex';
    import FirmSelector from '@/components/selector/FirmSelector';
    import StoreExpressPieceForm from '@/components/form/StoreExpressPieceForm';
    import StoreExpressPieceTable from '@/components/table/StoreExpressPieceTable';
    import StoreExpressNumberTable from '@/components/table/StoreExpressNumberTable';
    import api from '@/common/apis/postageTemplate';

    export default {
        name: 'GoodsForm',
        components: {
            StoreExpressNumberTable,
            StoreExpressPieceTable,
            StoreExpressPieceForm,
            FirmSelector,
            CropperImage,
            CategorySelector,
            BrandSelector,
            UploadAvatar,
            Editor,
            UploadImg,
            UploadSlider,
            StoreExpressForm,
            SkuForm,
            SkuAnSpuTable
        },
        mixins: [vModelMixins],
        props: {
            defaultSelectClass: {
                type: Array, default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                postDialog: {
                    show: false,
                    title: '添加运费',
                    isAdd: true,
                    data: []
                },
                skuDialog: {
                    show: false,
                    title: '商品规格',
                    data: []
                },
                rules: {
                    postage: [
                        {
                            required: true,
                            message: '邮费模板必须输入'
                        },
                        {
                            rules: ['required', 'array', 'min:1'],
                            validator: validator.verification
                        }
                    ],
                    isFreeExpress: {
                        required: true,
                        message: '邮费模板必须选择'
                    },
                    headerPic: {
                        required: true,
                        message: '商品头图必须上传'
                    },
                    spec: {
                        required: true,
                        message: '商品规格必须填写'
                    },
                    sortId: [
                        {
                            required: true,
                            message: '排序ID必须输入'
                        },
                        {
                            rules: ['required', 'integer', 'min:0', 'max:99999999'],
                            validator: validator.verification
                        }
                    ],
                    fictitiousSalesCount: [
                        {
                            required: true,
                            message: '必须输入'
                        },
                        {
                            rules: ['required', 'integer', 'min:0', 'max:99999999'],
                            validator: validator.verification
                        }
                    ]
                },
                validator,
                ossType,
                subMold,
                sortID: 0,
                CodeToText,
                oldPostage: {
                    1: [],
                    2: [],
                    3: []
                },
                postageTemplate: [],
                loadPostage: false,
                selectPostage: undefined,
                // serviceData: ['库存', '销量', '闪电发货', '假一赔十', '七天无理由退货', '免邮费']
                serviceData: ['库存', '销量', '闪电发货', '假一赔十', '七天无理由退货']
            };
        },
        computed: {
            spec() {
                return this.form.spec.map((item, idx) => {
                    item.spuIdx = idx;
                    return item;
                });
            },
            ...mapGetters({shop: 'shop', role: 'role'}),
            isMasterItem() {
                if (this.form.storeId !== this.shop.id) return true;
                if (this.form.storeId === '0') {
                    if (this.role.roleScope === 2) {
                        return true;
                    }
                }
                return false;
            }
        },
        filters: {
            spuDeleted(list) {
                return list.filter(item => {
                    return !item.deleted;
                });
            }
        },
        methods: {
            scrollTo(ref) {
                this.$refs[ref].scrollIntoView();
            },
            _checkImg() {
                // if (!this.form.thumbnail) {
                //     this.$message.error('请上传商品缩略图');
                //     return false;
                // }
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
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        if (!this._checkImg()) return;
                        if (!this.form.body) {
                            this.$message.error('请输入商品详情');
                            return;
                        }
                        this.$emit('submit', e);
                    } else {
                        this.$message.error('数据填写不完整，请检查表单');
                    }
                });
            },
            deleteSku(row) {
                this.confirm('规格', () => {
                    let idx = row.spuIdx;
                    this.form.spec[idx].deleted = true;
                });
            },
            addSku() {
                this.skuDialog.data = {
                    id: '',
                    spuName: undefined,
                    marketPrice: undefined,
                    singleCost: undefined,
                    weight: undefined,
                    stock: undefined,
                    allocConfig: undefined,
                    deleted: false, //接受数据的时候 为true 删掉本条 //编辑的时候删除操作  deleted=true 传回 id  //
                    sku: [
                        {
                            skuName: undefined,
                            unit: undefined, //一盒/箱 多少个
                            price: undefined,
                            wholesalePrice: undefined,
                            wholesaleMark: false,
                            retailMark: true,
                            deleted: false,
                            id: '',
                            skuIdx: 0
                        }
                    ]
                };
                this.skuDialog.show = true;
            },
            editSku(row) {
                let idx = row.spuIdx;
                let data = this.$util.deepClone(this.form.spec[idx]);

                if (data.allocConfig.other === undefined && this.$util.objectLength(data.allocConfig) > 0) {
                    data.allocConfig.other = {self: 0}
                }
                console.info("data:", data);
                this.skuDialog.data = data;
                this.skuDialog.data.sku = this.skuDialog.data.sku.map((item, skuIdx) => {
                    item.skuIdx = skuIdx;
                    return item;
                });
                this.skuDialog.show = true;
            },
            onSkuDialogSubmit() {
                this.skuDialog.show = false;
                let idx = this.skuDialog.data.spuIdx;
                let obj = this.$util.deepClone(this.skuDialog.data);
                console.log(obj);
                if (this.form.spec[idx]) {
                    this.$set(this.form.spec, idx, obj);
                } else {
                    this.form.spec.push(obj);
                }
            },
            confirm(name, cb) {
                this.$confirm(`是否删除此${name}?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    cb && cb();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            },
            editPost({data, index}) {
                console.info(data, index);
                if (this.form.expressType === 2) {
                    if (data === undefined) {
                        this.postDialog.isAdd = true;
                        this.postDialog.idx = undefined;
                        this.postDialog.data = {
                            method: 1,
                            area: []
                        };
                    } else {
                        this.postDialog.isAdd = false;
                        this.postDialog.idx = index;
                        this.postDialog.data = this.$util.deepClone(data);
                    }
                } else if (this.form.expressType === 3) {
                    if (this.form.postage.length <= 0) {
                        this.$set(this.form, 'postage', [
                            {
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
                            }
                        ]);
                    }
                }
                this.postDialog.show = true;
            },
            deletePost({index}) {
                this.confirm('运费模板', () => {
                    this.form.postage.splice(index, 1);
                });
            },
            onPostDialogSubmit() {
                let obj = this.$util.deepClone(this.postDialog.data);
                let postage = Object.assign([], this.form.postage);

                if (this.postDialog.isAdd) {
                    postage.push(obj);
                } else {
                    postage[this.postDialog.idx] = obj;
                }
                console.info(obj);
                this.$set(this.form, 'postage', postage);
                console.info(this.form);
                this.postDialog.show = false;
            },
            showSpec() {
                if (this.role.roleID === '14') {
                    if (this.form.spec.length >= 1) return false;
                }
                return true;
            },
            getPostageTemplate() {
                this.loadPostage = true;
                api.list({storeId: this.shop.id, expressType: this.form.expressType, disabled: false}).then(res => {
                    this.$util.handelHttpResponseResult(res, false, '', false).then(({data}) => {
                        this.postageTemplate = data.rows;
                    });
                }).finally(() => this.loadPostage = false);
            },
            changeNumberPostage(index) {
                console.info(this.postageTemplate[index]);
                let postage = JSON.parse(this.postageTemplate[index].postage);
                postage.first = this.$util.priceFormat(postage.first);
                postage.extend = this.$util.priceFormat(postage.extend);
                postage.batch = this.$util.priceFormat(postage.batch);
                this.$set(this.postDialog, 'data', postage);
            },
            changePiecePostage(index) {
                let postage = JSON.parse(this.postageTemplate[index].postage);
                postage = postage.map(item => {
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
                        isDefault: item.isDefault
                    };
                });
                this.$set(this.form, 'postage', postage);
            },
            cancelPostage() {
                this.form.postage = [];
                this.postDialog.show = false;
            },
            onSliderPreview(item) {
                console.info(item);
            }
        },
        mounted() {
            if (this.form.expressType > 1) this.getPostageTemplate();
        },
        watch: {
            async 'form.expressType'(n, o) {
                this.postageTemplate = [];
                this.selectPostage = undefined;
                this.oldPostage[o] = this.$util.deepClone(this.form.postage);
                this.$set(this.form, 'postage', this.$util.deepClone(this.oldPostage[n]));
                await this.$nextTick();
                if (n > 1 && this.role.roleID !== '14') {
                    this.getPostageTemplate();
                }
            }
        }
    };
</script>
<style lang="scss">
    .goods-form {
        color: #606266;
        position: relative;

        .inline {
            width: 100px;
            position: relative;
            display: inline-block;
        }

        .margin {
            margin: 5px 0
        }

        legend {
            width: 500px;
            margin: 10px 20px 30px;
            font-weight: 900;
            border-bottom: 1px solid #999;
            padding-bottom: 10px;
            padding-left: 20px
        }

        .table {
            margin-top: 0;

            .el-form-item__error {
                background: #FFF;
                top: -5px;
                right: 12px;
                left: auto;
            }
        }

        .form {
            padding-right: 15px;
        }

        .navigation {
            position: fixed;
            right: 29px;
            top: 116px;
            font-size: 12px;
            z-index: 999;
            background: #F4F4F5;
            border-color: #D3D4D6;

            a {
                text-decoration: none;
                display: block;
                color: #909399;
                padding: 5px;
                cursor: pointer;
            }
        }
    }
</style>
