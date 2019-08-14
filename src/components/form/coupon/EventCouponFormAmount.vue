<template>
    <div class="md-event-coupon-form-amount">
        <div class="md-item" v-for="(f, i) in form" :key="i">
            <el-form-item :rules="rule" :prop="'reelYjkList.' + i + '.money'">
                <el-input v-model="f.money"/>
            </el-form-item>
            <el-form-item align="center">
                <el-checkbox v-model="f.status" :true-label="2" :false-label="1">满多少使用</el-checkbox>
            </el-form-item>
            <div>
                <el-form-item :rules="ruleAmount" :prop="'reelYjkList.' + i + '.amount'" v-if="f.status === 2">
                    <el-input v-model="f.amount"/>
                </el-form-item>
            </div>
            <el-form-item class="md-delete">
                <el-button type="text" @click="deleteRow(i)">删除</el-button>
            </el-form-item>
        </div>
        <el-button type="success" @click="add" :disabled="form.length >= 3">添加</el-button>
    </div>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import validator from 'el-form-validator';

    export default {
        name: 'EventCouponFormAmount',
        mixins: [vModelMixins],
        props: {
            value: {
                type: Array, default: () => {
                    return [];
                }
            },
            rule: {
                type: Object, default: () => {
                    return {
                        rules: 'required|integer|min:1|max:100',
                        validator: validator.verification
                    };
                }
            },

            ruleAmount: {
                type: Object, default: () => {
                    return {
                        rules: 'required|numeric|min:1|max:999999999',
                        validator: validator.verification
                    };
                }
            }
        },
        data() {
            return {
            };
        },
        methods: {
            add() {
                this.form.push({
                    type: 1,
                    money: undefined,
                    status: 1,
                    amount: undefined
                });
            },
            deleteRow(i) {
                this.form.splice(i, 1);
            }
        }
    };
</script>

<style scoped lang="scss">
    .md-event-coupon-form-amount {
        .md-item {
            display: flex;
            margin-bottom: 20px;

            > div {
                flex: 1
            }

            .md-delete {
                flex: 0;
                padding: 0 10px;
            }
        }
    }
</style>
