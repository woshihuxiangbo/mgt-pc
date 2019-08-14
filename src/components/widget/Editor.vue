<template>
    <div class="editor">
        <quill-editor v-model="content" :options="editorOption" ref="editor" :disabled="disabled"/>
    </div>
</template>

<script>
    import {Quill} from 'vue-quill-editor';
    import ImageResize from 'quill-image-resize-module';
    import {container, ImageExtend, imgHandler} from '@/common/plugins/ImageExtend/index';
    import oss from '@/common/apis/oss';
    import request from '@/common/request';
    import {EditorFullScreen} from '@/common/plugins/EditorFullScreen';

    Quill.register('modules/imageResize', ImageResize);
    Quill.register('modules/ImageExtend', ImageExtend);
    Quill.register('modules/EditorFullScreen', EditorFullScreen);

    export default {
        name: 'Editor',
        props: {
            value: {type: String},
            id: {
                type: String, default: () => {
                    return 'editId-' + new Date().getTime();
                }
            },
            ossType: {
                default: () => {
                    return oss.ossType.item;
                }
            },
            subMod: {
                default: () => {
                    return oss.subMold.itemDes;
                }
            },
            fileId: {
                type: String, default: () => {
                    return Math.random().toString(36).slice(4) + new Date().getTime();
                }
            },
            label: {type: String},
            disabled: Boolean
        },
        data() {
            return {
                options: {
                    fixedBox: false,
                    autoCropWidth: 150,
                    autoCropHeight: 150
                },
                content: this.value,
                editorOption: {
                    modules: {
                        toolbar: {
                            container: container,
                            handlers: {
                                'image': () => {
                                    imgHandler();
                                }
                            }
                        },
                        imageResize: {
                            displayStyles: {
                                backgroundColor: 'black',
                                border: 'none',
                                color: 'white'
                            },
                            modules: ['Resize', 'DisplaySize', 'Toolbar']
                        },
                        ImageExtend: {
                            loading: true,
                            action: true,
                            requestHandler: async (file, QuillWatch) => {
                                return await this.updateFile(file, QuillWatch).then(res => {
                                    return res;
                                });
                            },
                            response: (res) => {
                                console.info('response', res);
                                return process.env.VUE_APP_IMAGE_BASE_URL + res.url;
                            }
                        },
                        EditorFullScreen: {
                            icon: 'el-icon-rank',
                            className: ''
                        }
                    }
                },
                fileDialog: false,
                image: undefined
            };
        },
        methods: {
            async updateFile(file, QuillWatch) {
                if (file === undefined) return;
                QuillWatch.active.uploading();
                let filename = this.getFileName(file.type);
                return await oss.getOssSignature(this.ossType, this.fileId, this.subMod).then(async (res) => {
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
                    return await request.post(data.host, formDate, {
                        headers: {'Content-Type': 'multipart/form-data'},
                        onUploadProgress: (e) => {
                            let complete = (e.loaded / e.total * 100 | 0) + '%';
                            QuillWatch.active.progress(complete);
                        }
                    }).then(res => {
                        if (res.data.status === 200) {
                            this.$message.success('上传成功');
                            return res.data;
                            // this.onFileUploaded(process.env.VUE_APP_IMAGE_BASE_URL + res.data.url);
                        } else {
                            this.$message.error('文件上传失败');
                        }
                    }).catch(() => {
                        QuillWatch.active.uploadError();
                    }).finally(() => {
                        this.loading = false;
                    });
                }).finally(this.loading = file);
            },
            getFileName(mime) {
                let arr = mime.split('/');
                return Math.random().toString(36).slice(4) + '-' + new Date().getTime() + '.' + arr[1];
            }
        },
        watch: {
            value(val) {
                this.content = val;
            },
            content(v) {
                this.$emit('input', v);
            }
        },
        computed: {
            editor() {
                return this.$refs.editor.quill;
            }
        }
    };
</script>

<style lang="scss">
    .editor {
        .ql-editor,
        .ql-container.ql-snow {
            min-height: 600px;
            max-height: 100%;
        }

        .ql-container.ql-snow {
            overflow: auto;
        }

        .ql-editor {
            max-height: 100%;
        }

    }
</style>
