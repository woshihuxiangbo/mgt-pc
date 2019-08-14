<template>
    <div class="upload-queue" @change="updateList(form)" v-loading="loading">
        <draggable v-model="form" @start="drag=true" @end="drag=false" :disabled="disabled"
                   class="el-upload-list el-upload-list--picture-card">
            <div class="el-upload-list__item" v-for="(item, index) in form" :key="index">
                <img :src="item.url" class="el-upload-list__item-thumbnail" alt="">
                <span class="el-upload-list__item-actions" v-if="!disabled">
<!--                    <span class="el-upload-list__item-preview" @click="handlePreview(item)">-->
<!--                        <i class="el-icon-zoom-in"></i>-->
<!--                    </span>-->
                    <span class="el-upload-list__item-delete" @click="handleRemove(item, index)">
                        <i class="el-icon-delete"></i>
                    </span>
                </span>
            </div>
        </draggable>
        <el-upload
            accept="image/jpeg,image/png"
            v-if="disabled === false && form.length < max"
            :disabled="disabled"
            class="el-upload el-upload--picture-card"
            action="--"
            :file-list="form"
            :show-file-list="false"
            :before-upload="beforeUpload">
            <i class="el-icon-plus"></i>
        </el-upload>
        <div slot="tip" class="el-upload__tip">最多上传{{max}}张图片 (750x750) ,只能上传jpg/png文件，且不超过500kb</div>
    </div>
</template>

<script>
    import draggable from 'vuedraggable';
    import oss from '@/common/apis/oss';
    import request from '@/common/request';
    import vModelMixins from '@/components/mixins/vModelMixins';

    export default {
        name: 'UploadSlider', mixins: [vModelMixins],
        components: {draggable},
        props: {
            max: {
                type: Number,
                default: 3
            },
            ossType: {
                default: () => {
                    return oss.ossType.customize;
                }
            },
            disabled: Boolean,
            subMod: {
                default: undefined
            },
            value: {type: Array}
        },
        computed: {
            imgList: {
                get() {
                    return this.form;
                },
                set(val) {
                    this.updateList(val);
                }
            }
        },
        data() {
            return {
                drag: false,
                loading: false,
                dragOptions: {
                    animation: 200,
                    group: 'description',
                    disabled: false,
                    ghostClass: 'ghost'
                }
            };
        },

        methods: {
            updateList(list) {
                this.$emit('change', list);
            },
            beforeUpload(file) {
                const isValidFormat = ['image/jpeg', 'image/png'].indexOf(file.type) > -1;
                const isLt500KB = file.size / 1024 / 500; // 2M
                if (!isValidFormat) {
                    this.$message.error('图片只能是 JPG或PNG 格式!');
                    return false;
                } else if (!isLt500KB) {
                    this.$message.error('上传图片大小不能超过 500k!');
                    return false;
                }
                const maxLt = this.max === 1 && this.imgList.length > 0;
                if (maxLt && this.max > 0) {
                    this.$message.error('只能上传一张图片，请删除后再上传!');
                    return false;
                }
                let fileName = this.getFileName(file.type);
                this.loading = true;
                oss.getOssSignature(this.ossType, this.fileId, this.subMod).then((res) => {
                    let data = res.data;
                    let formDate = new FormData();
                    formDate.append('key', data.dir + fileName);
                    formDate.append('callback', data.callback);
                    formDate.append('policy', data.policy);
                    formDate.append('OSSAccessKeyId', data.accessid);
                    formDate.append('success_action_status', 200);
                    formDate.append('signature', data.signature);
                    formDate.append('file', file);
                    formDate.append('name', fileName);
                    this.loading = true;
                    request.post(data.host, formDate, {headers: {'Content-Type': 'multipart/form-data'}}).then((res) => {
                        if (res.data.status === 200) {
                            this.$message.success('上传成功');
                            this.form.push({
                                url: process.env.VUE_APP_IMAGE_BASE_URL + res.data.url
                            });
                            this.$emit('fileUploaded', this.form);
                        } else {
                            this.$message.error('文件上传失败');
                        }
                    }).finally(() => {
                        this.loading = false;
                    });
                }).finally(() => this.loading = false);
                return false;
            },
            handleRemove(file, index) {
                this.form.splice(index, 1);
                this.$emit('change', this.form);
            },
            handlePreview(item) {
                this.$emit('preview', item);
            },
            getFileName(mime) {
                let arr = mime.split('/');
                return Math.random().toString(36).slice(4) + '-' + new Date().getTime() + '.' + arr[1];
            }
        }
    };
</script>

<style lang="scss" scoped>
    .upload-queue {
        .el-upload-list__item:hover {
            .el-upload-list__item-actions {
                display: block;
                opacity: 1;
            }
        }
    }
</style>
