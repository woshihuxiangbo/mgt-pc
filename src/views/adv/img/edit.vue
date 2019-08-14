<template>
    <div class="shop" v-loading="loading">
        <breadcrumb :options="['广告管理', '添加广告']"/>
        <div class="main-container">
            <my-form v-model="form" @submit="onSubmit" ref="form">
                <el-button type="primary" native-type="submit">保存</el-button>
                <el-button @click="()=>this.$router.go(-1)">返回</el-button>
            </my-form>
        </div>
    </div>
</template>

<script>
    import myForm from '@/components/form/AdvImgForm';
    import api from '@/common/apis/advImg';
    import skuApi from '@/common/apis/itemSku';
    import {mapGetters} from 'vuex';

    export default {
        components: {myForm},
        data() {
            return {
                loading: false,
                form: {
                    storeId: 0,
                    sortId: 0,
                    title: undefined,
                    imgUrl: undefined,
                    advId: undefined,
                    skuId: undefined,
                    eventId: undefined,
                    articleId: undefined,
                    externalUrl: undefined,
                    linkType: '0'
                },
                linkTypes: [
                    {
                        type: '无',
                        target: '--'
                    },
                    {
                        name: 'articleId',
                        type: '文章',
                        target: 'articleName',
                        msg: '请选择文章'
                    },
                    {
                        name: 'skuId',
                        type: '商品',
                        target: 'skuName',
                        msg: '请选择商品'
                    },
                    {
                        name: 'eventId',
                        type: '活动',
                        target: 'eventName',
                        msg: '请选择活动'
                    },
                    {
                        name: 'externalUrl',
                        type: '视频地址',
                        target: 'externalUrl',
                        msg: '请填写链接地址'
                    }
                ]
            };
        },
        computed: {
            ...mapGetters(['shop']),
            linkType() {
                return this.form.linkType;
            }
        },
        watch: {
            linkType(val, old) {
                this.form[this.linkTypes[old].name] = undefined;
            }
        },
        methods: {
            _getItem(obj) {
                if (obj.linkType === '2') {
                    this.loading = true;
                    skuApi.get({skuId: obj.skuId, storeId: this.shop.id}).then((res) => {
                        this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                            const item = {
                                id: data.id,
                                name: data.itemName,
                                price: data.marketPrice,
                                skuId: obj.skuId,
                                thumbnail: data.thumbnail,
                                skuName: [data.spuName + ' ' + data.skuName]
                            };
                            this.$refs['form'].skuItem = {...item};
                        });
                    })
                        .finally(() => (this.loading = false));
                }
            },
            onSubmit() {
                const {articleId, eventId, skuId, linkType, externalUrl} = this.form;
                if (linkType !== '0' && !this.form[this.linkTypes[linkType].name]) {
                    this.$message.error(this.linkTypes[linkType].msg);
                    return;
                }
                this.loading = true;
                api.edit({...this.form})
                    .then((res) => {
                        this.$util.handelHttpResponseResult(res, false).then(() => {
                            this.$message.success('保存成功');
                            this.$router.back();
                        });
                    })
                    .finally(() => (this.loading = false));
            },
            getData() {
                this.loading = true;
                api.get({
                    id: this.$route.params.id,
                    column: 'id,advId,title,imgUrl,sortId,disabled,storeId,articleId,skuId,eventId,externalUrl,linkType,ownerId'
                })
                    .then((res) => {
                        this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                            const obj = data;
                            obj.sortId = parseInt(obj.sortId) || 0;
                            obj.linkType = obj.linkType ? obj.linkType + '' : '0';
                            this._getItem(obj);
                            this.form = {...this.form, ...obj};
                        });
                    })
                    .finally(() => (this.loading = false));
            }
        },
        mounted() {
            this.form.storeId = this.shop.id;
            this.getData();
        }
    };
</script>

<style scoped lang="scss">
</style>
