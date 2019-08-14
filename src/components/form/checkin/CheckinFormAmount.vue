<template>
    <div class="md-checkin-form-amount">
        <div class="md-item" v-for="(f, i) in form" :key="i">
            <el-form-item :rules="rule" :prop="'reelYjkList.' + i + '.money'" :label="'第'+ (i + 1) +'天'"
                          label-width="0px">
                <el-input v-model="f.money"/>
            </el-form-item>
        </div>
    </div>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import validator from 'el-form-validator';

    export default {
        name: 'CheckinFormAmount',
        mixins: [vModelMixins],
        props: {
            value: {
                type: Array, default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                rule: [
                    {
                        required: true,
                        message: '请输入金额'
                    }, {
                        rules: 'required|numeric|min:0|max:999999999',
                        validator: validator.verification
                    }
                ]
            };
        }
    };
</script>

<style scoped lang="scss">
    .md-checkin-form-amount {
        display: flex;

        .md-item {
            flex: 1;
            padding-left: 5px;
        }
    }
</style>
<style lang="scss">
    .md-checkin-form-amount {
        .md-item {
            .el-form-item {
                .el-form-item__label {
                    width: 100% !important;
                    display: block;
                    text-align: center;
                }
            }
        }
    }
</style>


