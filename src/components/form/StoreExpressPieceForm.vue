<template>
    <el-form class="form" :model="formData" :rules="rules" ref="form" @submit.native.prevent="onSubmit">
        <slot name="prepend" :data="formData"></slot>
        <el-form-item label="模板名称" :rules="rules.name" prop="name" label-width="80px" v-if="inputTempName">
            <el-input v-model="formData.name"/>
        </el-form-item>
        <br>
        <el-form-item>
            <el-table :data="formData.postage" border size="mini">
                <el-table-column label="运送到" align="center" width="300">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isDefault">
                            默认
                        </div>
                        <el-form-item v-else :prop="'postage.'+scope.$index+'.area'" :rules="rules.address"
                                      inline-messagew>
                            <area-selector v-model="formData.postage[scope.$index].area"
                                           :disable-data="formData.postage"/>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="首件数（件）" align="center">
                    <template slot-scope="scope">
                        <el-form-item :prop="'postage.'+scope.$index+'.first.count'" :rules="rules.num" inline-message>
                            <el-input-number :min="0" :max="99999999" v-model="scope.row.first.count" size="mini"/>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="首费（元）" align="center">
                    <template slot-scope="scope">
                        <el-form-item :prop="'postage.'+scope.$index+'.first.price'" :rules="rules.price"
                                      inline-message>
                            <el-input-number :min="0" :max="99999999" v-model="scope.row.first.price" size="mini"/>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="续件数（件）" align="center">
                    <template slot-scope="scope">
                        <el-form-item :prop="'postage.'+scope.$index+'.extend.count'" :rules="rules.num" inline-message>
                            <el-input-number :min="0" :max="99999999" v-model="scope.row.extend.count" size="mini"/>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="续件费（元）" align="center">
                    <template slot-scope="scope">
                        <el-form-item :prop="'postage.'+scope.$index+'.extend.price'" :rules="rules.nextPrice"
                                      inline-message>
                            <el-input-number :min="-99999999" :max="99999999" v-model="scope.row.extend.price"
                                             size="mini"/>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="50px">
                    <template slot-scope="scope" v-if="!scope.row.isDefault">
                        <el-button type="text" size="mini" @click="deleteRow(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-row type="flex">
                <el-col :span="12">
                    <el-button @click="add" type="text">添加行</el-button>
                </el-col>
                <el-col :span="12" align="end">
                    <slot/>
                </el-col>
            </el-row>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import validator from 'el-form-validator';
    import AreaSelector from '@/components/selector/AreaSelector';

    export default {
        name: 'StoreExpressPieceForm',
        components: {AreaSelector},
        mixins: [vModelMixins],
        props: {
            inputTempName: {type: Boolean, default: false}
        },
        data() {
            return {
                rules: {
                    name: {
                        required: true,
                        message: '请输入模版名称'
                    },
                    address: {
                        required: true,
                        message: '请输入商品规格',
                        trigger: 'blur'
                    },
                    num: {
                        rules: 'required|integer|min:0|max:99999999',
                        validator: validator.verification
                    },
                    price: {
                        rules: 'required|numeric|min:0|max:99999999',
                        validator: validator.verification
                    },
                    nextPrice: {
                        rules: 'required|numeric|min:-99999999|max:99999999',
                        validator: validator.verification
                    },
                    postage: [
                        {
                            required: true,
                            message: '请输入邮费模板',
                            trigger: 'blur'
                        }, {
                            rules: 'required|array|min:1',
                            validator: validator.verification
                        }
                    ]
                },
                formData: {}
            };
        },
        methods: {
            add() {
                this.formData.postage.push({
                    area: [],
                    first: {
                        count: undefined,
                        price: undefined
                    },
                    extend: {
                        count: undefined,
                        price: undefined
                    },
                    isDefault: !this.formData.postage.length
                });
            },
            deleteRow(item) {
                this.formData.postage.splice(item.$index, 1);
            },
            onSubmit(e) {
                e.preventDefault();
                if (this.formData.postage.length <= 0) {
                    return this.$message.error('运费模板不能为空');
                }
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.form = this.$util.deepClone(this.formData);
                        this.$nextTick(() => {
                            this.$emit('submit', e);
                        });
                    } else {
                        this.$message.warning('无法提交，请填写完整');
                    }
                });
            }
        },
        watch: {
            value: {
                handler(n) {
                    console.info('change Value');
                    this.$nextTick(() => {
                        this.formData = this.$util.deepClone(n);
                    });
                },
                deep: true,
            }
        },
        created() {
            this.formData = this.$util.deepClone(this.value);
        }
    };
</script>

<style scoped>

</style>
