<template>
    <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="form"
        @submit.native.prevent="onSubmit"
    >
        <el-form-item label="头图" prop="imgUrl">
            <cropper-image
                :disabled="!isOwnerPic"
                :width="imgUrl.width"
                :height="imgUrl.height"
                :options="imgUrl.options"
                v-model="form.imgUrl"
                :oss-type="ossType.adv"
                :sub-mod="subMold.item"
            ></cropper-image>
        </el-form-item>

        <el-form-item label="图片标题" prop="title">
            <el-input v-model="form.title" :disabled="!isOwnerPic"/>
        </el-form-item>
        <el-form-item label="链接类型" prop="linkType">
            <el-select class="input" v-model="form.linkType" :value="form.linkType" :disabled="!isOwnerPic"
                       v-if="isCanGetMoney">
                <el-option
                    v-for="(link,idx) in this.linkOptions"
                    :key="idx"
                    :value="link.value"
                    v-if="['2', '3'].indexOf(link.value)"
                    :label="link.label"/>
            </el-select>
            <el-select class="input" v-model="form.linkType" :value="form.linkType" :disabled="!isOwnerPic" v-else>
                <el-option
                    v-for="(link,idx) in this.linkOptions"
                    :key="idx"
                    :value="link.value"
                    :label="link.label"/>
            </el-select>
        </el-form-item>

        <el-form-item label="选择商品" v-show="form.linkType==='2'">
            <goods-selector @change="onSelectItem" :disabled="!isOwnerPic" is-list/>
            <div class="goods-info" v-if="skuItem&&form.skuId">
                <img :src="skuItem.thumbnail|imgSrc" alt="">
                <div>
                    <p>
                        <span>{{skuItem.name}}</span>
                        <span> {{skuItem.skuName.join(' | ')}}</span>
                    </p>
                    <p>￥ {{$util.priceFormat(skuItem.price)}}</p>
                </div>
            </div>
        </el-form-item>
        <el-form-item label="选择文章" class="block" v-show="form.linkType==='1'" prop="articleId">
            <article-selector v-model="form.articleId" :disabled="!isOwnerPic"/>
        </el-form-item>

        <el-form-item label="选择活动" class="block" v-show="form.linkType==='3'" prop="eventId">
            <event-selector v-model="form.eventId" :disabled="!isOwnerPic"/>
        </el-form-item>

        <el-form-item label="视频地址" prop="externalUrl" v-show="form.linkType==='4'">
            <el-input v-model="form.externalUrl" :disabled="!isOwnerPic"/>
        </el-form-item>

        <el-form-item label="排序ID" prop="sortId" v-if="!isCanGetMoney">
            <el-popover placement="right" width="200" trigger="hover" content="数值越大越靠前。">
                <el-input-number slot="reference" :step="1" :precision="0" :min="0" v-model="form.sortId"/>
            </el-popover>
        </el-form-item>
        <el-form-item label="状态">
            <el-select v-model="form.disabled" placeholder :value="form.disabled" :disabled="!isOwnerPic">
                <el-option label="启用" :value="undefined"></el-option>
                <el-option label="禁用" :value="true"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <slot></slot>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    import CropperImage from '../widget/CropperImage';
    import {ossType, subMold} from '@/common/apis/oss';
    import GoodsSelector from '@/components/selector/GoodsSelector';
    import ArticleSelector from '../selector/ArticleSelector';
    import EventSelector from '../selector/EventSelector';
    import {mapGetters} from 'vuex';

    export default {
        components: {
            CropperImage,
            GoodsSelector,
            ArticleSelector,
            EventSelector
        },
        name: 'AdvImgForm',
        mixins: [vModelMixins],
        data() {
            return {
                ossType,
                subMold,
                imgUrl: {
                    width: '300px',
                    height: '150px',
                    options: {
                        autoCropWidth: 300,
                        autoCropHeight: 150
                    }
                },
                nowType: undefined,
                rules: {
                    imgUrl: {
                        required: true,
                        message: '请上传图片'
                    },
                    title: [
                        {
                            required: true,
                            message: '请输入标题'
                        }
                    ],
                    linkType: [
                        {
                            required: true,
                            message: '请选择类型'
                        }
                    ],
                    sortId: [
                        {required: true, message: '请输入排序ID'}
                    ]
                },
                skuItem: undefined,
                linkOptions: [
                    {
                        value: '0',
                        label: '无'
                    },
                    {
                        value: '1',
                        label: '文章'
                    },
                    {
                        value: '2',
                        label: '商品'
                    },
                    {
                        value: '3',
                        label: '活动'
                    },
                    {
                        value: '4',
                        label: '视频地址'
                    }
                ]
            };
        },
        created() {
            this._setImgSize();
        },
        computed: {
            ...mapGetters(['shop', 'imgSize', 'role']),
            isOwnerPic() {
                if (this.form.ownerId === undefined) return true;
                if (this.form.ownerId === '0') {
                    return this.role.roleID !== '14';
                }
                // return false;
                return this.form.ownerId !== '0' && this.role.roleID === '14';
            },
            isCanGetMoney() {
                return this.form.advId === '3101';
            }
        },
        methods: {
            _setImgSize() {
                let {width, height} = this.imgSize;
                const size = {
                    width: width + 'px',
                    height: height + 'px',
                    options: {
                        autoCropWidth: parseInt(width),
                        autoCropHeight: parseInt(height)
                    }
                };
                this.imgUrl = size;
            },
            onSelectItem(item) {
                this.skuItem = item;
                this.form.skuId = item.skuId;
            },
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$emit('submit', e);
                    }
                });
            }
        }
    };
</script>

<style lang="scss">
    .block .store-selector .el-select {
        display: block;
    }

    .goods-info {
        img {
            height: 50px;
            min-width: 50px;
            display: inline-block;
            margin-right: 10px;
        }

        > div {
            display: inline-block;
        }
    }

    .article-form {
        .cropper {
            width: 300px;
            height: 300px;
        }

        .select-image-btn {
            margin-top: 10px;
        }

        .dialog-content {
            max-height: 80%;
            overflow-y: auto;
        }

        .el-card {
            width: 200px;
            display: inline-block;
            margin: 5px;

            img {
                width: 100%;
            }

            &.active {
                background-color: #1D88E5;
                color: white;
            }
        }

        .goods-info {
            display: inline-block;

            .goods-image {
                display: inline-block;
                width: 50px;

                img {
                    width: 50px;
                    height: 50px;
                }
            }

            .goods-detail {
                display: inline-block;
                padding-left: 10px;
            }
        }
    }
</style>
