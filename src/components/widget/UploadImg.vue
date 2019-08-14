<template>
    <div>
        <a :href="imageUrl" target="_Blank">{{imageUrl}}</a>
        <el-upload
            v-loading="loading"
            :action="apiUrl"
            :multiple="false"
            list-type="picture"
            :disabled="disabled"
            :before-upload="beforeUpload">
            <el-button v-if="!imageUrl" :disabled="disabled">上传图片</el-button>
            <el-button v-else :disabled="disabled">重新上传</el-button>
        </el-upload>
    </div>
</template>

<script>
    import oss from '@/common/apis/oss';
    import request from '@/common/request';

    export default {
        name: 'UploadImg',
        props: {
            apiUrl: {type: String, default: ''},
            value: {type: String},
            ossType: {
                default: () => {
                    return oss.ossType.customize;
                }
            },
            subMod: {
                default: undefined
            },
            fileId: {
                type: String,
                default: () => {
                    return (
                        Math.random()
                            .toString(36)
                            .slice(4) + new Date().getTime()
                    );
                }
            },
            label: {type: String},
            disabled: Boolean
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
            _checkImg(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            beforeUpload(file) {
                if (!this._checkImg(file)) return false
                this.loading = true;
                console.info(file);
                oss.getOssSignature(this.ossType, this.fileId, this.subMod)
                    .then((res) => {
                        let data = res.data;
                        let formDate = new FormData();
                        formDate.append('key', data.key);
                        formDate.append('callback', data.callback);
                        formDate.append('policy', data.policy);
                        formDate.append('OSSAccessKeyId', data.accessid);
                        formDate.append('success_action_status', 200);
                        formDate.append('signature', data.signature);
                        formDate.append('file', file);
                        formDate.append('name', file.name);
                        this.loading = true;
                        request
                            .post(data.host, formDate, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            })
                            .then((res) => {
                                if (res.data.status === 200) {
                                    this.$message.success('上传成功');
                                    this.imageUrl = res.data.url;
                                    this.$emit('fileUploaded', this.image);
                                } else {
                                    this.$message.error('文件上传失败');
                                }
                            })
                            .finally(() => {
                                this.loading = false;
                            });
                    })
                    .finally((this.loading = file));
                return false;
            }
        }
    };
</script>

<style scoped lang="scss">
</style>
