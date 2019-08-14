<template>
    <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent="onSubmit" :rules="rules">
        <el-form-item label="所属店铺">{{form.storeName}}</el-form-item>
        <el-form-item label="用户角色">
            <el-select v-model="form.level" :value="form.level">
                <el-option v-for="(l,i) in levels" :key="i" :value="l.value" :label="l.label"/>
            </el-select>
        </el-form-item>
        <el-form-item label="用户头像">
            <cropper-image v-model="form.header" :options="{autoCropWidth: 200, autoCropHeight: 200}" height="200px"
                           width="200px"/>
        </el-form-item>
        <el-form-item label="用户昵称">
            <el-input v-model="form.nickname" style="width: 600px"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
            <el-input v-model="form.mobile" style="width: 600px"></el-input>
        </el-form-item>
        <el-form-item label="性别">
            <el-radio v-model="form.gender" :label="1">男</el-radio>
            <el-radio v-model="form.gender" :label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="生日">
            <el-date-picker v-model="form.birthday" type="date" placeholder="请选择出生年月日" value-format="timestamp"/>
        </el-form-item>
        <el-form-item label="个性签名">
            <el-input v-model="form.signature" style="width: 600px"/>
        </el-form-item>
        <el-form-item label="地区">
            <region-selector v-model="location" @change="handleChange"/>
        </el-form-item>
        <el-form-item>
            <slot/>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';
    import UploadAvatar from "../widget/UploadAvatar";
    import CropperImage from "../widget/CropperImage";
    import RegionSelector from "../selector/RegionSelector";
    import {CodeToText, regionData, TextToCode} from 'element-china-area-data';
    import userApi from '@/common/apis/user';
    import {mapGetters} from 'vuex';

    export default {
        name: "UserForm",
        components: {RegionSelector, CropperImage, UploadAvatar},
        mixins: [vModelMixins],
        data() {
            return {
                location: [],
                rules: {},
                levels: []
            }
        },
        methods: {
            onSubmit(e) {
                e.preventDefault();
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.$emit('submit', e);
                    }
                });
            },
            handleChange(data) {
                try {
                    this.form.province = data[0];
                    this.form.city = data[1];
                    this.form.county = data[2];
                } catch (e) {
                    this.$message.error('格式化地址出错啦');
                }
            },
            locationTextToCode() {
                this.location = [this.form.province, this.form.city, this.form.county];
            },
            getStoreLevel() {
                userApi.getUserLevel(this.shop.id).then(res => {
                    this.$util.handelHttpResponseResult(res, false, '').then(({data}) => {
                        let list = [];
                        for (let key in data) {
                            switch (key) {
                                case 'lv1':
                                    list.push({
                                        value: '1',
                                        label: data[key].name
                                    });
                                    break;
                                case 'lv2':
                                    list.push({
                                        value: '2',
                                        label: data[key].name
                                    });
                                    break;
                                case 'lv3':
                                    list.push({
                                        value: '3',
                                        label: data[key].name
                                    });
                                    break;
                            }
                        }
                        this.levels = list;
                        console.info(this.levels);
                    });
                });
            }
        },
        mounted() {
            this.locationTextToCode();
            this.getStoreLevel();
        },
        computed: {
            ...mapGetters({shop: 'shop'})
        },
        watch: {
            async value(newVal) {
                await this.$nextTick();
                this.form = newVal;
                console.info('change form');
                this.locationTextToCode();
            }
        }
    }
</script>

<style scoped>

</style>
