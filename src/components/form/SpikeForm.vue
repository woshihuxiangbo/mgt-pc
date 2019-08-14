<template>
    <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="图片">
            <el-upload action="">
                <img v-if="form.image" :src="form.image|imgSrc" class="avatar" alt="">
                <i v-else class="el-icon-plus uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="活动名称">
            <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="活动开始时间">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="form.startDatetime"
                            value-format="yyyy-MM-dd HH:mm:ss"/>
        </el-form-item>
        <el-form-item label="活动结束时间">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="form.endDatetime"
                            value-format="yyyy-MM-dd HH:mm:ss"/>
        </el-form-item>
        <el-form-item label="价格">
            <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="售出">
            <el-input-number v-model="form.sellCount"/>
        </el-form-item>
        <el-form-item>
            <slot/>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '../mixins/vModelMixins';

    export default {
        name: "SpikeForm",
        mixins: [vModelMixins]
    }
</script>

<style scoped lang="scss">
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .uploader-icon {
        font-size: 28px;
        color: #8c939d;
        height: 178px;
        min-width: 178px;
        line-height: 178px;
        text-align: center;
        border: 1px dotted #e3e3e3;
    }

    .avatar {
        height: 178px;
        display: block;
    }
</style>