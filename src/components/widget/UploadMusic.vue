<template>
    <div class="md-upload-music" v-loading="loading">
        <input type="file" hidden ref="file" accept="audio/*" @change="fileChange"/>
        <el-button @click="onClick">上传音频</el-button>
        <div v-if="form" class="md-play">
            <audio :src="form | imgSrc" controls></audio>
        </div>
    </div>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import api from '@/common/apis/oss';
    import request from '@/common/request';

    export default {
        name: 'UploadMusic',
        mixins: [vModelMixins],
        props: {
            value: {type: String},
            fileId: {
                type: String, default: () => {
                    return Math.random().toString(36).slice(4) + new Date().getTime();
                }
            },
        },
        data () {
            return {
                loading: false
            }
        },
        methods: {
            onClick () {
                this.$refs.file.click();
            },
            fileChange (e) {
                let el = e.target;
                let file = el.files[0];
                if (file === undefined) return;
                let fileName = Math.random().toString(36).slice(4) + new Date().getTime() + '.' + file.type.split('/')[1];
                this.loading = true;
                api.getOssSignature(api.ossType.article, this.fileId).then(res => {
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
                    request.post(data.host, formDate, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(res => {
                        if (res.data.status === 200) {
                            this.$message.success('上传成功');
                            this.form = res.data.url;
                            el.value = '';
                            this.$emit('fileUploaded', this.form);
                        } else {
                            this.$message.error('文件上传失败');
                        }
                    }).finally(() => {
                        this.loading = false
                    })
                }).finally(() => this.loading = false);
            }
        }
    };
</script>

<style scoped>
    .md-play {
        margin-top: 10px;
    }
</style>
