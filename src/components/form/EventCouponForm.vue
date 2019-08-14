<template>
    <el-form ref="form" @submit.native.prevent="onSubmit" label-width="140px" :model="form" :rules="rules">
        <el-form-item label="卡券名称" prop="couponName">
            <el-input v-model="form.couponName"/>
        </el-form-item>
        <el-form-item>
            <div slot="label"><span class="md-red">*</span> 面额</div>
            <event-coupon-form-amount v-model="form.reelYjkList"/>
        </el-form-item>
        <el-form-item label="能领取的角色" prop="level">
            <lv-selector style="display:none;" @onGetData="onGetLevelData"/>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
                         class="md-checkbox-all">全选
            </el-checkbox>
            <el-checkbox-group v-model="form.level" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(l, i) in levels" :label="l.value" :key="i">{{l.label}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="使用有效期" prop="selectTime">
            <el-date-picker v-model="form.selectTime"
                            type="datetimerange"
                            align="right"
                            unlink-panels
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期" @change="changeDateRange"/>
        </el-form-item>
        <el-form-item label="优惠券使用天数" prop="day">
            <el-input-number v-model="form.day" :min="0"/>
            <span class="md-red">&nbsp;&nbsp;&nbsp; 从优惠券领取时间开始计算使用天数，如果没有填写按照使用有效期为准</span>
        </el-form-item>
        <el-form-item label="卡券使用范围" prop="scope">
            <el-radio v-model="form.scope" :label="1">全店通用</el-radio>
            <el-radio v-model="form.scope" :label="2">特定商品使用</el-radio>
        </el-form-item>
        <el-form-item v-if="form.scope === 2" prop="reelItemYjkList">
            <el-button type="text" @click="addItem">添加商品</el-button>
        </el-form-item>
        <el-form-item label="发行量" prop="circulation">
            <el-input-number v-model="form.circulation" :min="0" :max="9999999"/>
        </el-form-item>
        <el-form-item label="每日发行量" prop="everydayCirculation">
            <el-input-number v-model="form.everydayCirculation" :min="0" :max="9999999"/>
        </el-form-item>
        <el-form-item label="每人限领次数" prop="limitToReceive">
            <el-input-number v-model="form.limitToReceive" :min="0" :max="9999999"/>
        </el-form-item>
        <el-form-item align="center">
            <slot/>
        </el-form-item>

        <event-coupon-form-item :md-active.sync="dialog" v-model="form.reelItemYjkList"/>
    </el-form>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import LvSelector from '@/components/selector/LvSelector';
    import EventCouponFormAmount from '@/components/form/coupon/EventCouponFormAmount';
    import validator from 'el-form-validator';
    import EventCouponFormItem from '@/components/form/coupon/EventCouponFormItem';

    export default {
        name: 'EventCouponForm',
        components: {EventCouponFormItem, EventCouponFormAmount, LvSelector},
        mixins: [vModelMixins],
        data() {
            return {
                levels: [],
                checkAll: false,
                isIndeterminate: false,
                rules: {
                    couponName: [
                        {
                            required: true,
                            message: '请输入'
                        },
                        {
                            rules: 'required|string|max:15',
                            validator: validator.verification
                        }
                    ],
                    level: [
                        {
                            required: true,
                            message: '请输入'
                        }, {
                            rules: 'required|array|min:1',
                            validator: validator.verification
                        }
                    ],
                    selectTime: {
                        required: true,
                        message: '请选择时间'
                    },
                    day: {
                        rules: 'nullable|integer|min:0|max:9999999',
                        validator: validator.verification
                    },
                    scope: {
                        required: true,
                        message: '请选择'
                    },
                    circulation: [
                        {
                            required: true,
                            message: '请输入'
                        }, {
                            rules: 'required|integer|min:1|max:9999999',
                            validator: validator.verification
                        }
                    ],
                    everydayCirculation: {
                        rules: 'integer|min:1|max:9999999|nullable',
                        validator: validator.verification
                    },
                    limitToReceive: [
                        {
                            required: true,
                            message: '请输入'
                        }, {
                            rules: 'required|integer|min:1|max:9999999',
                            validator: validator.verification
                        }
                    ],
                    reelItemYjkList: [
                        {
                            required: true,
                            message: '请选择商品'
                        }, {
                            rules: 'required|array|min:1',
                            validator: validator.verification
                        }
                    ]
                },
                dialog: false
            };
        },
        methods: {
            changeDateRange(e) {
                try {
                    this.form.validStartTime = parseInt(new Date(e[0]).getTime() / 1000);
                    this.form.validEndTime = parseInt(new Date(e[1]).getTime() / 1000);
                } catch (e) {
                }
            },
            onGetLevelData(data) {
                this.levels = data;
            },
            handleCheckAllChange(val) {
                this.form.level = val ? ['1', '2', '3', '9', '10'] : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.levels.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.levels.length;
            },
            addItem() {
                this.dialog = true;
            }
        }
    };
</script>

<style scoped lang="scss">
    .md-checkbox-all {
        display: inline-block;
    }

    .el-checkbox-group {
        display: inline-block;
        margin-left: 30px;
    }
</style>
