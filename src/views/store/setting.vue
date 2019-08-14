<template>
    <div class="main">
        <breadcrumb :options="['店铺管理', '店铺设置']"/>
        <div class="container" v-loading="loading">
            <el-form
                style="width: 550px"
                label-position="right"
                label-width="120px"
                :model="form"
                ref="form"
                :rules="rules"
                @submit.native.prevent="formSubmit"
            >
                <div class="form-title">基本设置</div>
                <el-form-item label="店铺名称" prop="name">
                    <el-col :span="15">
                        <el-input v-model="form.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="店铺地区" prop="location">
                    <el-cascader style="width: 430px" size="large" :options="regionData" v-model="form.location"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="addr">
                    <el-input type="textarea" v-model="form.addr"></el-input>
                </el-form-item>
                <div class="form-title">角色设置</div>
                <el-form-item label="访客称呼" prop="lv7Name">
                    <el-col :span="8">
                        <el-input v-model="form.lv7Name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="买家称呼" prop="lv8Name">
                    <el-col :span="8">
                        <el-input v-model="form.lv8Name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="Lv1代理称呼" required>
                    <el-col :span="8">
                        <el-form-item prop="lv1Name">
                            <el-input v-model="form.lv1Name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="预付款" prop="lv1Prepayment">
                            <el-input v-model="form.lv1Prepayment">
                                <template slot="prepend">
                                    ￥
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="Lv2代理称呼" required>
                    <el-col :span="8">
                        <el-form-item prop="lv2Name">
                            <el-input v-model="form.lv2Name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="预付款" prop="lv2Prepayment">
                            <el-input v-model="form.lv2Prepayment">
                                <template slot="prepend">
                                    ￥
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="Lv3代理称呼" required>
                    <el-col :span="8">
                        <el-form-item prop="lv3Name">
                            <el-input v-model="form.lv3Name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="预付款" prop="lv3Prepayment">
                            <el-input v-model="form.lv3Prepayment">
                                <template slot="prepend">
                                    ￥
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="店主称呼" prop="lv9Name">
                    <el-col :span="8">
                        <el-input v-model="form.lv9Name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button native-type="submit" type="primary">保 存</el-button>
                    <el-button v-on:click="$router.back()">返 回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>

<script>
import {regionData} from 'element-china-area-data';
import Breadcrumb from "../../components/widget/breadcrumb";
export default {
    components: {Breadcrumb},
    data() {
        return {
            loading: false,
            regionData,
            form: {
                name: '',
                location: [],
                addr: '',
                lv1Name: '',
                lv2Name: '',
                lv3Name: '',
                lv7Name: '',
                lv8Name: '',
                lv9Name: '',
                lv1Prepayment: 0,
                lv2Prepayment: 0,
                lv3Prepayment: 0
            },
            rules: {
                name: {
                    required: true,
                    message: '请输入店铺名称',
                    trigger: 'blur'
                },
                location: {
                    required: true,
                    message: '请选择店铺地区',
                    trigger: 'blur'
                },
                addr: {
                    required: true,
                    message: '请填写店铺详细地址',
                    trigger: 'blur'
                },
                lv7Name: {
                    required: true,
                    message: '请输入访客称呼',
                    trigger: 'blur'
                },
                lv8Name: {
                    required: true,
                    message: '请输入买家称呼',
                    trigger: 'blur'
                },
                lv1Name: {
                    required: true,
                    message: '请输入Lv1代理称呼',
                    trigger: 'blur'
                },
                lv1Prepayment: {
                    required: true,
                    message: '请输入Lv1代理预付款金额',
                    trigger: 'blur'
                },
                lv2Name: {
                    required: true,
                    message: '请输入Lv2代理称呼',
                    trigger: 'blur'
                },
                lv2Prepayment: {
                    required: true,
                    message: '请输入Lv2代理预付款金额',
                    trigger: 'blur'
                },
                lv3Name: {
                    required: true,
                    message: '请输入Lv3代理称呼',
                    trigger: 'blur'
                },
                lv3Prepayment: {
                    required: true,
                    message: '请输入Lv3代理预付款金额',
                    trigger: 'blur'
                },
                lv9Name: {
                    required: true,
                    message: '请输入店主称呼',
                    trigger: 'blur'
                }
            }
        };
    },
    methods: {
        getData() {
            let fields = 'name, location, addr, lv1Name,lv2Name,lv3Name,lv7Name,lv8Name,lv9Name,lv1Prepayment,lv2Prepayment,lv3Prepayment';
            // TODO
        },

        formSubmit(event) {
            //阻止默认事件
            event.preventDefault();

            let This = this;

            //验证表单
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    let formData = new FormData();
                    for (let key in This.form) {
                        if (key === 'location') {
                            formData.append(key, This.form['location'].join(','));
                        } else {
                            formData.append(key, This.form[key]);
                        }
                    }
                    let fields = 'mobile,nickname,disabled,deleteTime';
                    this.$axios
                        .post('/api/store/setting/update', formData, {headers: {fields: fields}})
                        .then((resp) => {
                            This.$message.success('操作成功');
                        })
                        .catch(() => {})
                        .finally(() => {
                            This.loading = false;
                        });
                }
            });
        }
    },
    mounted() {
        this.getData();
    }
};
</script>
