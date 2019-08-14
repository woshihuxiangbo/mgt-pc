<template>
    <el-form ref="form" :model="form" @submit.native.prevent="onSubmit" :rules="rules" label-width="140px">
        <el-form-item label="活动名称" prop="couponName">
            <el-input v-model="form.couponName"/>
        </el-form-item>
        <el-form-item>
            <template slot="label"><span class="md-red">*</span>签到金额</template>
            <checkin-form-amount v-model="form.reelYjkList"/>
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
        <el-form-item label="每周签到多少天生效">
            <el-input-number :min="1" :max="7" v-model="form.day"/>
        </el-form-item>
        <el-form-item label="活动开始时间">
            <el-date-picker v-model="form.validStartTime" type="date" placeholder="选择日期" @change="dateChange"
                            value-format="timestamp" style="width: 150px"/>
            <span> 到 </span>
            <el-date-picker v-model="form.validEndTime" type="date" placeholder="选择日期" readonly
                            value-format="timestamp" style="width: 150px"/>
            <span class="md-muted"> 开始时间是开始日期的00:00:00，结束时间是结束日期的23:59:59</span>
        </el-form-item>
        <el-form-item label="卡券使用范围" prop="scope">
            <el-radio v-model="form.scope" :label="1">全店通用</el-radio>
            <el-radio v-model="form.scope" :label="2">特定商品使用</el-radio>
            <span class="md-muted"> 当选择全店通用时，实际上系统只有红包金额低于零售价才能使用</span>
        </el-form-item>
        <el-form-item v-if="form.scope === 2" prop="reelItemYjkList">
            <el-button type="text" @click="addItem">添加商品</el-button>
            <event-coupon-form-item :md-active.sync="dialog" v-model="form.reelItemYjkList" />
        </el-form-item>
        <el-form-item align="end">
            <slot/>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import LvSelector from '@/components/selector/LvSelector';
    import validator from 'el-form-validator';
    import CheckinFormAmount from '@/components/form/checkin/CheckinFormAmount';
    import EventCouponFormItem from '@/components/form/coupon/EventCouponFormItem';

    export default {
        name: 'CheckinForm',
        components: {EventCouponFormItem, CheckinFormAmount, LvSelector},
        mixins: [vModelMixins],
        data() {
            return {
                levels: [],
                checkAll: false,
                isIndeterminate: false,
                rules: {
                    couponName: {
                        required: true,
                        message: '请输入'
                    },
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
                    day: [
                        {
                            required: true,
                            message: '请输入'
                        }, {
                            rules: 'required|integer|min:1|max:7',
                            validator: validator.verification
                        }
                    ],
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
            dateChange(time) {
                this.form.validEndTime = time + 3600 * 24 * 7 * 1000 - 1;
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

