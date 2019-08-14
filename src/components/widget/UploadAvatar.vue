<template>
    <el-upload v-loading="loading"
               class="avatar-uploader"
               :action="apiUrl"
               :multiple="false"
               :disabled="disabled"
               :before-upload="beforeUpload"
               accept=".jpg,.jpeg,.png"
               :show-file-list="false" :style="{width, height}">
        <h4 v-if="label">{{label}}</h4>
        <img v-if="imageUrl" :src="imageUrl|imgSrc" class="avatar" alt="">
        <i v-else class="el-icon-plus avatar-uploader-icon" :style='"line-height:"+height'></i>
        <p>点击更换图片</p>
    </el-upload>
</template>

<script>
    import oss from '@/common/apis/oss';
    import request from '@/common/request';

    export default {
        name: 'UploadAvatar',
        props: {
            apiUrl: {type: String, default: ''},
            value: {type: String},
            width: {type: String, default: '178px'},
            height: {type: String, default: '178px'},
            ossType: {
                default: () => {
                    return oss.ossType.customize;
                }
            },
            subMod: {
                default: undefined
            },
            fileId: {
                type: String, default: () => {
                    return Math.random().toString(36).slice(4) + new Date().getTime();
                }
            },
            label: {type: String},
            disabled: {type: Boolean}
        },
        data() {
            return {
                loading: false,
                imageUrl: this.value
            };
        },
        watch: {
            value(n) {
                this.imageUrl = n;
            },
            imageUrl(n) {
                this.$emit('input', n);
            }
        },
        methods: {
            beforeUpload(file) {
                this.loading = true;
                let filename = this.getFileName(file.type);
                oss.getOssSignature(this.ossType, this.fileId, this.subMod).then(res => {
                    let data = res.data;
                    let formDate = new FormData();
                    formDate.append('key', data.dir + filename);
                    formDate.append('callback', data.callback);
                    formDate.append('policy', data.policy);
                    formDate.append('OSSAccessKeyId', data.accessid);
                    formDate.append('success_action_status', 200);
                    formDate.append('signature', data.signature);
                    formDate.append('file', file);
                    formDate.append('name', filename);
                    this.loading = true;
                    request.post(data.host, formDate, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(res => {
                        if (res.data.status === 200) {
                            this.$message.success('上传成功');
                            this.imageUrl = res.data.url;
                            this.$emit('fileUploaded', this.image);
                        } else {
                            this.$message.error('文件上传失败');
                        }
                    }).finally(() => {
                        this.loading = false;
                    });
                }).finally(() => this.loading = false);
                return false;
            },
            getFileName(mime) {
                let arr = mime.split('/');
                return Math.random().toString(36).slice(4) + '-' + new Date().getTime() + '.' + arr[1];
            }
        }
    };
</script>

<style>
    .avatar-uploader .el-upload {width: 100%; height: 100%}
</style>

<style scoped lang="scss">
    .avatar-uploader .el-upload {
        border: 1px dashed #D9D9D9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader {
        display: inline-block;
        margin-right: 10px;

        p {
            text-align: center;
            color: #777;
            font-size: 10px;
            margin: 0;
            padding: 0;
        }
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8C939D;
        width: 100%;
        height: 100%;
        line-height: 178px;
        text-align: center;
        border: 1px dotted #E3E3E3;
    }

    .avatar {
        width: 100%;
        height: 100%;
        display: block;
        border: 1px dotted #E3E3E3;
    }
</style>
