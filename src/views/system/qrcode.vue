<!-- 获取二维码 -->
<template>
    <div class="qrcode" v-loading="loading">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules" @submit.native.prevent="onSubmit">
            <el-form-item label="商品名称" prop="spuId">
                <goods-selector @change="onChange"/>
                <goods-info-mini :option="selectItem"/>
            </el-form-item>
            <el-form-item label="数量" prop="count">
                <el-input type="num" v-model.number="form.count"></el-input>
            </el-form-item>
            <el-form-item label="说明">
                <el-input :rows="3" type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <div>
                <el-button type="primary" native-type="submit">生成</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
    import GoodsSelector from '@/components/selector/GoodsSelector';
    import GoodsInfoMini from '@/components/widget/GoodsInfoMini';
    import validator from 'el-form-validator';
    import qrcodeApi from '@/common/apis/qrcode';

    export default {
        name: 'qrcode',
        components: {GoodsInfoMini, GoodsSelector},
        data() {
            return {
                loading: false,
                selectItem: {},
                form: {
                    spuId: undefined,
                    count: undefined,
                    desc: undefined
                },
                rules: {
                    spuId: {
                        required: true,
                        message: '请选择商品'
                    },
                    count: [
                        {
                            required: true,
                            message: '请输入生成数量'
                        },
                        {
                            rules: 'integer|min:1|max:100000',
                            validator: validator.verification
                        }
                    ]
                }
            };
        },
        methods: {
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.gen();
                    } else {
                        this.$message.warning('请检查表单数据');
                    }
                });
            },
            onChange(e) {
                this.selectItem = e;
                this.form.spuId = e.spuId;
                console.info(e);
            },
            gen() {
                this.loading = true;
                qrcodeApi.gen(this.form).then(res => {
                    this.$util.handelHttpResponseResult(res, true, '生成成功').then(() => {
                        this.$router.replace({name: 'ComputedQrcode'});
                    });
                }).finally(() => this.loading = false);
            }
        }
    };
</script>
<style lang="scss" scoped>
    .qrcode {
        width: 100%;
        height: 100%;
    }

    .el-input, .el-form-item__content {
        width: 200px !important;
    }

    .qrcode .el-form-item__label {
        text-align: left !important;
    }

    .el-button {
        margin-left: 80px;
    }

    .el-textarea__inner {
        height: 80px;
    }

    .qrcode .el-textarea__inner {
        height: 80px !important;
    }
</style>
