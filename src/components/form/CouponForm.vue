<template>
    <el-form label-width="100px" class="coupon-form">
        <el-form-item label="代金券名称">
            <el-input v-model="form.title" placeholder="请输入代金券的名称"/>
        </el-form-item>
        <el-form-item label="卡片背景色">
            <el-color-picker v-model="form.backgroundColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="优惠内容">
            <el-radio v-model="form.type" label="1">降价</el-radio>
            <el-radio v-model="form.type" label="2">打折</el-radio>
        </el-form-item>
        <el-form-item label="优惠内容">
            <el-radio v-model="form.expiredType" :label="1">指定时间</el-radio>
            <el-radio v-model="form.expiredType" :label="2">指定范围</el-radio>
            <div>
                <el-date-picker v-if="form.expiredType === 1"
                        v-model="form.expiredDate"
                        type="datetime"
                        placeholder="选择日期时间">
                </el-date-picker>
                <el-date-picker v-if="form.expiredType === 2"
                        v-model="form.expiredDateRange"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                </el-date-picker>
            </div>
        </el-form-item>
        <el-form-item label="指定原价享受优惠活动">
            <el-radio v-model="form.radio2" :label="true">是</el-radio>
            <el-radio v-model="form.radio2" :label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="活动范围">
            <el-radio v-model="form.radio3" :label="true">全店参与</el-radio>
            <el-radio v-model="form.radio3" :label="false">自选商品</el-radio>
        </el-form-item>
        <el-form-item label="是否可以转增">
            <el-radio v-model="form.isPresentation" :label="true">是</el-radio>
            <el-radio v-model="form.isPresentation" :label="false">否</el-radio>
        </el-form-item>
        <legend>领取设置</legend>
        <el-form-item label="没人领取限制">
            <el-radio v-model="form.radio4" :label="1">不限制</el-radio>
            <el-radio v-model="form.radio4" :label="0">限制</el-radio>
        </el-form-item>
        <el-form-item label="身份限制">
            <el-radio v-model="form.radio5" :label="1">全部会员</el-radio>
            <el-radio v-model="form.radio5" :label="0">部分会员</el-radio>
        </el-form-item>
        <legend>使用须知</legend>
        <el-form-item label="使用须知">
            <el-input type="textarea" rows="10" v-model="form.terms">

            </el-input>
        </el-form-item>
        <el-form-item>
            <slot/>
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        name: "CouponForm",
        props: {
            value: {
                type: Object, default: () => {
                    return {}
                }
            }
        },
        data() {
            return {
                form: this.value
            }
        },
        watch: {
            value(newVal) {
                this.form = newVal
            },
            form(val) {
                this.$emit('input', val);
            }
        }
    }
</script>

<style lang="scss">
    .coupon-form {
        .el-color-picker__trigger {
            width: 200px;
        }
        legend {
            display: block;
            line-height: 30px;
            border-bottom: 1px solid #e3e3e3;
            margin-bottom: 20px;
        }
    }
</style>