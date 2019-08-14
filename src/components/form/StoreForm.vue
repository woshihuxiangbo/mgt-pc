<template>
    <div class="md-store-form">
        <el-form ref="form" :model="form" :rules="rules" label-width="200px" class="form"
                 @submit.native.prevent="onSubmit">
            <legend>基本信息</legend>
            <el-form-item label="店铺Logo" prop="storeLogo">
                <upload-avatar v-model="form.storeLogo" :oss-type="ossType.customize"/>
            </el-form-item>
            <el-form-item label="社区团购图片" prop="groupImg">
                <upload-avatar v-model="form.groupImg" :oss-type="ossType.customize" width="300px"/>
            </el-form-item>
            <el-form-item label="店铺名称" prop="storeName">
                <el-input v-model="form.storeName"/>
            </el-form-item>
            <el-form-item label="店铺简称" prop="shortName">
                <el-input v-model="form.shortName"/>
            </el-form-item>
            <el-form-item label="店铺地址" prop="location">
                <el-cascader :options="regionData" v-model="location" @change="handleChange"/>
            </el-form-item>
            <el-form-item required prop="addr">
                <el-input type="textarea" v-model="form.addr"></el-input>
            </el-form-item>
<!--            <el-form-item label="满包邮" prop="freeExpress">-->
<!--                <el-input v-model="form.freeExpress" placeholder="满多少金额包邮"/>-->
<!--            </el-form-item>-->
            <el-form-item label="店铺状态" prop="disabled">
                <el-col :span="8">
                    <el-select v-model="form.disabled" :value="form.disabled">
                        <el-option label="启用" :value="false"/>
                        <el-option label="禁用" :value="true"/>
                    </el-select>
                </el-col>
            </el-form-item>
            <div class="md-store-share">
                <el-form-item label="首页分享标题" prop="shareTitle">
                    <el-input v-model="form.shareTitle"/>
                </el-form-item>
                <el-form-item label="首页分享图片">
                    <cropper-image v-model="form.sharePic"
                                   :options="{autoCropWidth: 250,autoCropHeight: 200, info: false, enlarge: 3}"
                                   width="250px"
                                   height="200px"/>
                </el-form-item>
                <el-form-item label="首页分享图片设置" prop="shareGroup.store.poster">
                    <div class="md-share-group">
                        <el-row :gutter="20" type="flex" class="md-flex">
                            <el-col v-for="(g, x) in form.shareGroup.store.poster" :key="x"
                                    :style="{backgroundImage: 'url(' + getImgSrc(g.src) +')'}">
                                <div class="md-share-data">
                                    <div class="md-share-action">
                                        <el-button type="primary" icon="el-icon-edit" plain circle
                                                   @click="editShare(g, x, 'store')"></el-button>
                                        <el-button type="danger" icon="el-icon-delete" plain circle
                                                   @click="deleteShare(x, 'store')"></el-button>
                                        <div class="md-share-text">
                                            <p :style="{color: g.fontColor}">{{g.title}}</p>
                                            <p :style="{color: g.fontColor}">{{g.subtitle}}</p>
                                            <p :style="{color: g.fontColor}">{{g.footerText }}</p>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div style="width: 100%">
                        <el-button type="primary" @click="addShareGroup('store')">添加</el-button>
                    </div>
                </el-form-item>
            </div>
            <div class="md-group-share">
                <el-form-item label="团购小店分享标题" prop="shareGroup.group.posterTitle">
                    <el-input v-model="form.shareGroup.group.posterTitle"/>
                </el-form-item>
                <el-form-item label="团购小店分享图片">
                    <cropper-image v-model="form.shareGroup.group.indexPoster"
                                   :options="{autoCropWidth: 250,autoCropHeight: 200, info: false, enlarge: 3}"
                                   width="250px"
                                   height="200px"/>
                </el-form-item>
                <el-form-item label="团购小店分享图片设置" prop="shareGroup.group.poster">
                    <div class="md-share-group">
                        <el-row :gutter="20" type="flex" class="md-flex">
                            <el-col v-for="(g, x) in form.shareGroup.group.poster" :key="x"
                                    :style="{backgroundImage: 'url(' + getImgSrc(g.src) +')'}">
                                <div class="md-share-data">
                                    <div class="md-share-action">
                                        <el-button type="primary" icon="el-icon-edit" plain circle
                                                   @click="editShare(g, x, 'group')"></el-button>
                                        <el-button type="danger" icon="el-icon-delete" plain circle
                                                   @click="deleteShare(x, 'group')"></el-button>
                                        <div class="md-share-text">
                                            <p :style="{color: g.fontColor}">{{g.title}}</p>
                                            <p :style="{color: g.fontColor}">{{g.subtitle}}</p>
                                            <p :style="{color: g.fontColor}">{{g.footerText }}</p>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div style="width: 100%">
                        <el-button type="primary" @click="addShareGroup('group')">添加</el-button>
                    </div>
                </el-form-item>
            </div>
            <div class="md-invite-share">
                <el-form-item label="邀请入驻分享标题" prop="shareGroup.invite.posterTitle">
                    <el-input v-model="form.shareGroup.invite.posterTitle"/>
                </el-form-item>
                <el-form-item label="邀请入驻分享图片">
                    <cropper-image v-model="form.shareGroup.invite.indexPoster"
                                   :options="{autoCropWidth: 250,autoCropHeight: 200, info: false, enlarge: 3}"
                                   width="250px"
                                   height="200px"/>
                </el-form-item>
                <el-form-item label="邀请入驻分享图片设置" prop="shareGroup.invite.poster">
                    <div class="md-share-group">
                        <el-row :gutter="20" type="flex" class="md-flex">
                            <el-col v-for="(g, x) in form.shareGroup.invite.poster" :key="x"
                                    :style="{backgroundImage: 'url(' + getImgSrc(g.src) +')'}">
                                <div class="md-share-data">
                                    <div class="md-share-action">
                                        <el-button type="primary" icon="el-icon-edit" plain circle
                                                   @click="editShare(g, x, 'invite')"></el-button>
                                        <el-button type="danger" icon="el-icon-delete" plain circle
                                                   @click="deleteShare(x, 'invite')"></el-button>
                                        <div class="md-share-text">
                                            <p :style="{color: g.fontColor}">{{g.title}}</p>
                                            <p :style="{color: g.fontColor}">{{g.subtitle}}</p>
                                            <p :style="{color: g.fontColor}">{{g.footerText }}</p>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div style="width: 100%">
                        <el-button type="primary" @click="addShareGroup('invite')">添加</el-button>
                    </div>
                </el-form-item>
            </div>
            <legend>店铺负责人</legend>
            <el-form-item label="名称" prop="managerName">
                <el-input v-model="form.managerName"/>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="form.mobile" type="tel" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="登录密码" prop="password">
                <el-input v-model="form.password" :type="password" autocomplete="new-password"
                          @focus="password = 'password'"/>
            </el-form-item>
            <legend>微信设置</legend>
            <el-form-item label="小程序AppID" prop="tppConfig.appId">
                <el-input v-model="form.tppConfig.appId"/>
            </el-form-item>
            <el-form-item label="小程序AppSecret" prop="tppConfig.appSecret">
                <el-input v-model="form.tppConfig.appSecret"/>
            </el-form-item>
            <el-form-item label="微信支付商户ID" prop="tppConfig.merchantId">
                <el-input v-model="form.tppConfig.merchantId"/>
            </el-form-item>
            <el-form-item label="微信支付API Key" prop="tppConfig.apiKey">
                <el-input v-model="form.tppConfig.apiKey"></el-input>
            </el-form-item>
            <!--        <el-form-item label="商品二维码URL" prop="tppConfig.qrcodeUrl">-->
            <!--            <el-input v-model="form.tppConfig.qrcodeUrl"/>-->
            <!--        </el-form-item>-->
            <el-form-item label="微信支付证书pkcs12格式">
                <input type="file" hidden ref="certificate" @change="onCertificateChange"
                       accept="application/x-pkcs12"/>
                <el-button size="small" type="primary" @click="onCertificateClick">选择证书文件</el-button>

                <el-switch v-if="form.certificate !== undefined" v-model="hasSelectCert"
                           active-text="已选择" disabled class="md-checkbox"/>
                <el-switch v-else-if="form.cert" v-model="form.cert" active-text="已上传" disabled class="md-checkbox"/>
            </el-form-item>
            <legend v-if="showRole">角色设置</legend>
            <div v-if="showRole">
                <el-form-item label="访客称呼" prop="lvConfig.lv9.name">
                    <el-col :span="8">
                        <el-input v-model="form.lvConfig.lv9.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="买家称呼" prop="lvConfig.lv10.name">
                    <el-col :span="8">
                        <el-input v-model="form.lvConfig.lv10.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-row class="md-form-row">
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <el-form-item label="Lv1代理称呼" prop="lvConfig.lv10.name">
                            <el-input v-model="form.lvConfig.lv1.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <!--                    <el-form-item label="入店礼包价格" prop="lvConfig.lv1.price">-->
                        <!--                        <el-input v-model="form.lvConfig.lv1.price">-->
                        <!--                            <template slot="prepend">￥</template>-->
                        <!--                        </el-input>-->
                        <!--                    </el-form-item>-->
                    </el-col>
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <el-form-item label="折扣率" prop="lvConfig.lv1.discount">
                            <el-input-number :min="0" v-model="form.lvConfig.lv1.discount"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <!--                    <el-form-item label="平级返佣率" prop="lvConfig.lv1.rebate">-->
                        <!--                        <el-input-number :min="0" :max="10" v-model="form.lvConfig.lv1.rebate"/>-->
                        <!--                    </el-form-item>-->
                    </el-col>
                </el-row>
                <el-row class="md-form-row">
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <el-form-item label="Lv2代理称呼" prop="lvConfig.lv2.name">
                            <el-input v-model="form.lvConfig.lv2.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <el-form-item label="预付款金额" prop="lvConfig.lv2.price">
                            <el-input v-model="form.lvConfig.lv2.price">
                                <template slot="prepend">￥</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <el-form-item label="折扣率" prop="lvConfig.lv2.discount">
                            <el-input-number :min="0" v-model="form.lvConfig.lv2.discount"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <el-form-item label="平级返佣率" prop="lvConfig.lv2.rebate">
                            <el-input-number :min="0" :max="10" v-model="form.lvConfig.lv2.rebate"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="md-form-row">
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <el-form-item prop="lvConfig.lv3.name" label="Lv3代理称呼">
                            <el-input v-model="form.lvConfig.lv3.name"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <el-form-item label="预付款金额" prop="lvConfig.lv3.price">
                            <el-input v-model="form.lvConfig.lv3.price">
                                <template slot="prepend">￥</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <el-form-item label="折扣率" prop="lvConfig.lv3.discount">
                            <el-input-number :min="0" v-model="form.lvConfig.lv3.discount"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <el-form-item label="平级返佣率" prop="lvConfig.lv3.rebate">
                            <el-input-number :min="0" :max="10" v-model="form.lvConfig.lv3.rebate"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <el-form-item label="销售额(单位万)" prop="lvConfig.lv3.saleAmount">
                            <el-input-number :min="0" :max="10" v-model="form.lvConfig.lv3.saleAmount"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" :xs="24" :sm="24" :md="12" :xl="6">
                        <el-form-item label="销售额返佣率" prop="lvConfig.lv3.saleRate">
                            <el-input-number :min="0" :max="10" v-model="form.lvConfig.lv3.saleRate"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <legend>入群通道</legend>
            <el-form-item>
                <upload-avatar :label="(form.lvConfig.lv1.name ? form.lvConfig.lv1.name : 'LV1') + '微信群二维码'"
                               v-model="form.wechatGroup.lv1Qrcode"/>
                <upload-avatar :label="(form.lvConfig.lv2.name ? form.lvConfig.lv2.name : 'LV2') + '微信群二维码'"
                               v-model="form.wechatGroup.lv2Qrcode"/>
                <upload-avatar :label="(form.lvConfig.lv3.name ? form.lvConfig.lv3.name : 'LV3') + '微信群二维码'"
                               v-model="form.wechatGroup.lv3Qrcode"/>
                <upload-avatar :label="(form.lvConfig.lv9.name ? form.lvConfig.lv9.name : 'LV9') + '微信群二维码'"
                               v-model="form.wechatGroup.lv9Qrcode"/>
                <upload-avatar :label="(form.lvConfig.lv10.name ? form.lvConfig.lv10.name : 'LV10') + '微信群二维码'"
                               v-model="form.wechatGroup.lv10Qrcode"/>
            </el-form-item>
            <el-form-item>
                <slot/>
            </el-form-item>
        </el-form>
        <el-dialog title="分享图片设置" :visible.sync="dialog">
            <store-share-form v-model="dialogForm" @submit="onSubmitShareForm"/>
        </el-dialog>
        <el-dialog title="分享图片设置" :visible.sync="editDialog">
            <store-share-form v-model="editDialogForm" @submit="onSubmitShareFormEdit"/>
        </el-dialog>
    </div>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    import UploadAvatar from '../widget/UploadAvatar';
    import {regionData, CodeToText, TextToCode} from 'element-china-area-data';
    import CropperImage from '@/components/widget/CropperImage';
    import {ossType, subMold} from '@/common/apis/oss';
    import validator from 'el-form-validator';
    import StoreShareForm from '@/components/form/StoreShareForm';

    export default {
        name: 'StoreForm',
        components: {StoreShareForm, CropperImage, UploadAvatar},
        mixins: [vModelMixins],
        props: {
            showRole: {type: Boolean, default: true}
        },
        data() {
            return {
                ossType,
                subMold,
                regionData,
                location: [],
                rules: {
                    storeLogo: {
                        required: true,
                        message: '请上传店铺LOGO',
                        trigger: 'blur'
                    },
                    groupImg: {
                        required: true,
                        message: '请上传图片',
                        trigger: 'blur'
                    },
                    storeName: {
                        required: true,
                        message: '请输入店铺名称',
                        trigger: 'blur'
                    },
                    location: {
                        required: true,
                        message: '请选择店铺地区',
                        trigger: 'blur'
                    },
                    addr:[
                        {
                            required: true,
                            message: '请输入地址'
                        },
                        {
                            rules: 'required|string|min:2',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    freeExpress: [
                        {
                            required: true,
                            message: '请输入'
                        },
                        {
                            rules: 'numeric|min:0',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    ],
                    disabled: {
                        required: true,
                        message: '请设置店铺状态'
                    },
                    shareTitle: {
                        required: true,
                        message: '请填写分享标题',
                        trigger: 'blur'
                    },
                    shareGroup: {
                        store: {
                            poster: {
                                required: true,
                                message: '请上传分享海报',
                                trigger: 'blur'
                            },
                            posterTitle: {
                                required: true,
                                message: '请填写分享标题',
                                trigger: 'blur'
                            }
                        },
                        group: {
                            poster: {
                                required: true,
                                message: '请上传分享海报',
                                trigger: 'blur'
                            },
                            posterTitle: {
                                required: true,
                                message: '请填写分享标题',
                                trigger: 'blur'
                            }
                        },
                        invite: {
                            poster: {
                                required: true,
                                message: '请上传分享海报',
                                trigger: 'blur'
                            },
                            posterTitle: {
                                required: true,
                                message: '请填写分享标题',
                                trigger: 'blur'
                            }
                        }
                    },
                    managerName: {
                        required: true,
                        message: '请选输入店铺老板名称',
                        trigger: 'blur'
                    },
                    mobile: {
                        required: true,
                        message: '请选输入店铺老板手机号',
                        trigger: 'blur'
                    },
                    password: {
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    tppConfig: {
                        appId: {
                            required: true,
                            message: '请填写小程序AppID',
                            trigger: 'blur'
                        },
                        appSecret: {
                            required: true,
                            message: '请填写小程序AppSecret',
                            trigger: 'blur'
                        },
                        merchantId: {
                            required: true,
                            message: '请填写微信支付商户ID',
                            trigger: 'blur'
                        },
                        apiKey: {
                            required: true,
                            message: '请填写微信支付API Key',
                            trigger: 'blur'
                        },
                        qrcodeUrl: {
                            rules: 'string|url|nullable',
                            validator: validator.verification,
                            trigger: 'blur'
                        }
                    },
                    lvConfig: {
                        lv1: {
                            name: {
                                required: true,
                                message: '请输入lv1代理称呼',
                                trigger: 'blur'
                            },
                            price: [
                                {
                                    required: true,
                                    message: '入店礼包价格',
                                    trigger: 'blur'
                                },
                                {
                                    rules: 'numeric|min:0',
                                    validator: validator.verification,
                                    trigger: 'blur'
                                }
                            ],
                            discount: [
                                {
                                    required: true,
                                    message: '请输入lv1折扣率',
                                    trigger: 'blur'
                                },
                                {
                                    rules: 'integer|min:0|max:100',
                                    validator: validator.verification,
                                    trigger: 'blur'
                                }
                            ],
                            rebate: [
                                {
                                    required: true,
                                    message: '请输入lv1返佣率',
                                    trigger: 'blur'
                                },
                                {
                                    rules: 'integer|min:0|max:10',
                                    validator: validator.verification,
                                    trigger: 'blur'
                                }
                            ]
                        },
                        lv2: {
                            name: {
                                required: true,
                                message: '请输入lv2代理称呼',
                                trigger: 'blur'
                            },
                            price: [
                                {
                                    required: true,
                                    message: '请输入lv2预付款金额',
                                    trigger: 'blur'
                                },
                                {
                                    rules: 'numeric|min:0',
                                    validator: validator.verification,
                                    trigger: 'blur'
                                }
                            ],
                            discount: [
                                {
                                    required: true,
                                    message: '请输入lv2折扣率',
                                    trigger: 'blur'
                                },
                                {
                                    rules: 'integer|min:0|max:100',
                                    validator: validator.verification,
                                    trigger: 'blur'
                                }
                            ],
                            rebate: [
                                {
                                    required: true,
                                    message: '请输入lv2返佣率',
                                    trigger: 'blur'
                                },
                                {
                                    rules: 'integer|min:0|max:10',
                                    validator: validator.verification,
                                    trigger: 'blur'
                                }
                            ]
                        },
                        lv3: {
                            name: {
                                required: true,
                                message: '请输入lv3代理称呼',
                                trigger: 'blur'
                            },
                            price: [
                                {
                                    required: true,
                                    message: '请输入lv3预付款金额',
                                    trigger: 'blur'
                                },
                                {
                                    rules: 'numeric|min:0',
                                    validator: validator.verification,
                                    trigger: 'blur'
                                }
                            ],
                            discount: [
                                {
                                    required: true,
                                    message: '请输入lv3折扣率',
                                    trigger: 'blur'
                                },
                                {
                                    rules: 'integer|min:0|max:100',
                                    validator: validator.verification,
                                    trigger: 'blur'
                                }
                            ],
                            rebate: [
                                {
                                    required: true,
                                    message: '请输入lv3返佣率',
                                    trigger: 'blur'
                                },
                                {
                                    rules: 'integer|min:0|max:10',
                                    validator: validator.verification,
                                    trigger: 'blur'
                                }
                            ],
                            saleAmount: [
                                {
                                    required: true,
                                    message: '请输入lv3销售额',
                                    trigger: 'blur'
                                },
                                {
                                    rules: 'integer|min:0|max:10',
                                    validator: validator.verification,
                                    trigger: 'blur'
                                }
                            ],
                            saleRate: [
                                {
                                    required: true,
                                    message: '请输入lv3销售额返佣率',
                                    trigger: 'blur'
                                },
                                {
                                    rules: 'integer|min:0|max:10',
                                    validator: validator.verification,
                                    trigger: 'blur'
                                }
                            ]
                        },
                        lv9: {
                            name: {
                                required: true,
                                message: '请输入访客称呼',
                                trigger: 'blur'
                            }
                        },
                        lv10: {
                            name: {
                                required: true,
                                message: '请输入买家称呼',
                                trigger: 'blur'
                            }
                        }
                    }
                },
                password: 'text',
                url: process.env.VUE_APP_UPLOAD_URL,
                hasSelectCert: true,
                dialog: false,
                dialogKey: undefined,
                dialogForm: {
                    src: undefined,                 // 图片资源
                    color: undefined,               // 颜色
                    fontColor: undefined,
                    title: undefined,               // 主标题
                    subtitle: undefined,            // 副标题
                    footerText: undefined           // 底部文字
                },
                editDialog: false,
                editDialogKey: undefined,
                editDialogForm: {},
                editIndex: undefined
            };
        },
        methods: {
            handleChange(data) {
                let l = [];
                for (let i in data) {
                    l.push(CodeToText[data[i]]);
                }
                this.form.location = l;
            },
            locationTextToCode() {
                let data = this.form.location;
                let list = [];
                try {
                    list.push(TextToCode[data[0]].code);
                    list.push(TextToCode[data[0]][data[1]].code);
                    list.push(TextToCode[data[0]][data[1]][data[2]].code);
                } catch (e) {
                }
                this.location = list;
            },
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$emit('submit', e);
                    } else {
                        this.$message.warning('表单参数不正确');
                    }
                });
            },
            onCertificateClick() {
                this.$refs.certificate.click();
            },
            onCertificateChange(e) {
                let el = e.srcElement;
                let file = el.files[0];
                if (file === undefined) return;
                this.$set(this.form, 'certificate', file);
                this.$message.success('证书文件已选择，提示：点击 保存/更新 才会上传的');
            },
            addShareGroup(key) {
                this.dialog = true;
                this.dialogKey = key;
            },
            onSubmitShareForm() {
                this.dialog = false;
                this.form.shareGroup[this.dialogKey].poster.push(this.dialogForm);
                this.dialogForm = {
                    src: undefined,
                    color: undefined,
                    title: undefined,
                    subtitle: undefined,
                    footerText: undefined
                };
                this.dialogKey = undefined;
            },
            getImgSrc(val) {
                if (!val) {
                    return '';
                } else {
                    if (/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(val)) {
                        return val;
                    }
                    return process.env.VUE_APP_IMAGE_BASE_URL + val;
                }
            },
            editShare(g, i, key) {
                this.editDialog = true;
                this.editDialogForm = g;
                this.editDialogKey = key;
                this.editIndex = i;
            },
            onSubmitShareFormEdit() {
                this.editDialog = false;
                this.form.shareGroup[this.editDialogKey].poster[this.editIndex] = this.editDialogForm;
                this.editDialogKey = undefined;
            },
            deleteShare(x, key) {
                this.form.shareGroup[key].poster.splice(x, 1);
            }
        },
        watch: {
            async 'form.location'() {
                await this.$nextTick();
                this.locationTextToCode();
            }
        },
        mounted() {
            this.locationTextToCode();
        }
    };
</script>

<style scoped lang="scss">
    .form {
        legend {
            line-height: 40px;
            display: block;
            font-weight: bold;
        }

        .md-checkbox {
            padding-left: 10px;
            opacity: 1 !important;
        }

        .md-flex {
            width: 100%;
            flex-wrap: wrap;
            margin-bottom: 10px;
            padding-left: 10px;

            .el-col {
                flex: 0 0 240px;
                width: 240px;
                height: 400px;
                background-size: 100% 100%;
                border: 1px solid #E3E3E3;
                position: relative;

                &:hover {
                    &:after {
                        content: ' ';
                        position: absolute;
                        z-index: 1;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        background-color: rgba(0, 0, 0, .5);
                    }

                    .md-share-data {
                        display: flex;
                    }
                }

                .md-share-data {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    z-index: 2;
                    color: white;
                    display: none;
                    padding: 10px;
                    justify-content: center;
                    align-items: center;

                    .md-share-action {
                        text-align: center;
                    }

                    .md-share-text {
                        margin-top: 10px;

                        > p {
                            padding: 0;
                            margin: 0;
                            line-height: 30px;
                            height: 30px;
                            min-width: 1px;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }
</style>

<style lang="scss">
    .md-form-row {
        width: 100%;
        padding-left: 100px;
        box-sizing: border-box;
        border-bottom: 1px dotted #E3E3E3;
        margin-bottom: 10px;

        .el-col {
            .el-form-item {
                display: flex;
                padding: 0 10px;

                label {
                    width: auto !important;
                    flex: 0 0 120px;
                    display: block;
                }

                .el-form-item__content {
                    margin-left: 0 !important;
                    flex: 1;
                }

                .el-input-number {
                    width: 100%;
                }
            }
        }
    }

    .md-share-group {
        display: flex;

        .el-col {
            margin-right: 15px;
        }
    }
</style>
