<template>
    <div class="cropper-image" v-loading="loading">
        <div class="cropper-content">
            <kd-cropper class="cropper"
                        :style="{height: height, width: width, flex: '0 0 ' + width}"
                        ref="cropper"
                        :img="defOptions.image"
                        :output-size="defOptions.size"
                        :output-type="defOptions.outputType"
                        :info="defOptions.info"
                        :full="defOptions.full"
                        :can-move="defOptions.canMove"
                        :can-move-box="defOptions.canMoveBox"
                        :fixed-box="defOptions.fixedBox"
                        :original="defOptions.original"
                        :auto-crop="defOptions.autoCrop"
                        :auto-crop-width="defOptions.autoCropWidth"
                        :auto-crop-height="defOptions.autoCropHeight"
                        :center-box="defOptions.centerBox"
                        :high="defOptions.high"
                        :enlarge="defOptions.enlarge"
                        :mode="defOptions.mode"
                        @cropMoving="cropMoving"
                        @realTime="realTime"
                        @imgLoad="imgLoad"/>
            <div class="img-box" v-if="!isSelectFile">
                <img v-if="image" :src="image|imgSrc" alt="" :width="width" :height="height">
            </div>
        </div>
        <div class="select-img-btn">
            <input type="file" hidden ref="image" @change="fileChange" accept=".jpg,.jpeg,.png"/>
            <el-button type="primary" @click="selectFile" :disabled="disabled">选择图片</el-button>
            <el-button type="primary" @click="onCrop" v-if="showCropBtn" :disabled="disabled">{{cropBtn}}</el-button>
        </div>
    </div>
</template>

<script>
    import api from '@/common/apis/oss';
    import request from '@/common/request';
    import KdCropper from '@/components/cropper/KdCropper';

    export default {
        name: "CropperImage",
        components: {KdCropper},
        props: {
            value: {type: String},
            height: {type: String | Number, default: '300px'},
            width: {type: String | Number, default: '300px'},
            disabled: Boolean,
            options: {
                type: Object, default: () => {
                    return {}
                }
            },
            ossType: {
                default: () => {
                    return api.ossType.customize
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
            showCropBtn: {type: Boolean, default: true},
            showPreview: {type: Boolean, default: true},
            cropBtn: {type: String, default: '裁剪并上传图片'}
        },
        data() {
            return {
                loading: false,
                image: this.value,
                isSelectFile: false,
                defOptions: {
                    image: '',
                    size: 1,
                    full: false,
                    outputType: 'png',
                    canMove: true,
                    original: false,
                    canMoveBox: false,
                    autoCrop: true,
                    autoCropWidth: 200,
                    autoCropHeight: 150,
                    centerBox: false,
                    fixedBox: true,
                    canScale: true,
                    high: true,
                    info: true,
                    cropData: {},
                    enlarge: 1,
                    mode: 'cover'
                },
                fileInfo: {
                    name: ''
                }
            }
        },
        methods: {
            cropMoving(data) {
                this.defOptions.cropData = data;
            },
            realTime(data) {
            },
            imgLoad(status) {
            },
            selectFile() {
                this.$refs['image'].click();
            },
            fileChange(e) {
                let el = e.srcElement;
                let file = el.files[0];
                if (file === undefined) return;
                let reader = new FileReader();
                reader.onload = (file) => {
                    this.$set(this.defOptions, 'image', file.srcElement.result);
                };
                this.fileInfo.name = file.name;
                this.isSelectFile = true;
                reader.readAsDataURL(file);
            },
            onCrop() {
                if (this.defOptions.image === '') return this.$message.error('请选择文件');
                this.$refs.cropper.getCropData(data => {
                    let filename = this.fileInfo.name;
                    let file = this.convertBase64UrlToBlob(data, filename);
                    this.loading = true;
                    api.getOssSignature(this.ossType, this.fileId, this.subMod).then(res => {
                        let data = res.data;
                        let formDate = new FormData();
                        formDate.append('key', data.dir + this.fileInfo.name);
                        formDate.append('callback', data.callback);
                        formDate.append('policy', data.policy);
                        formDate.append('OSSAccessKeyId', data.accessid);
                        formDate.append('success_action_status', 200);
                        formDate.append('signature', data.signature);
                        formDate.append('file', file);
                        formDate.append('name', this.fileInfo.name);
                        this.loading = true;
                        request.post(data.host, formDate, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then(res => {
                            if (res.data.status === 200) {
                                this.$message.success('上传成功');
                                this.options.image = '';
                                this.isSelectFile = false;
                                this.image = res.data.url;
                                this.$emit('fileUploaded', this.image);
                            } else {
                                this.$message.error('文件上传失败');
                            }
                        }).finally(() => {
                            this.loading = false
                        })
                    }).finally(() => {
                        this.loading = false
                    })
                });
            },
            convertBase64UrlToBlob(urlData, filename) {
                let arr = urlData.split(',');
                let mime = arr[0].match(/:(.*?);/)[1];
                let bStr = atob(arr[1]);
                let n = bStr.length;
                let u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bStr.charCodeAt(n)
                }
                this.setFileName(mime);
                return new File([u8arr], filename, {type: mime});
            },
            mergeOptions() {
                // this.defOptions.image = this.image;
                this.defOptions = Object.assign({}, this.defOptions, this.options);
            },
            setFileName(mime) {
                let arr = mime.split('/');
                this.fileInfo.name = Math.random().toString(36).slice(4) + '-' + new Date().getTime() + '.' + arr[1];
            }
        },
        mounted() {
            this.mergeOptions();
        },
        watch: {
            image(val) {
                this.$emit('input', val);
            },
            value(val) {
                this.image = val;
            },
            async options() {
                await this.$nextTick();
                this.mergeOptions();
            }
        }
    }
</script>

<style scoped lang="scss">
    .cropper-image {
        position: relative;

        .cropper-content {
            display: flex;
        }

        .img-box {
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
        }

        .select-img-btn {
            margin-top: 10px;
        }
    }
</style>
