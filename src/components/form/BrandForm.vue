<template>
	<el-form
		ref="form"
		:rules="rules"
		:model="form"
		label-width="100px"
		@submit.native.prevent="onSubmit"
	>
		<el-form-item label="品牌名称" prop="name">
			<el-input v-model="form.name"/>
		</el-form-item>
		<el-form-item label="品牌LOGO" prop="logo">
			<!-- <cropper-image
				v-model="form.logo"
				:width="imgOptions.logo.width"
				:height="imgOptions.logo.height"
				:options="imgOptions.logo.options"
				:oss-type="ossType.itemBrand"
				:sub-mod="subMold.item"
				:showPreview="false"
			></cropper-image> -->
			<upload-avatar 
				:oss-type="ossType.itemBrand"
				:sub-mod="subMold.item"
				v-model="form.logo"
				/>
		</el-form-item>
		<el-form-item label="排序ID" prop="sortId">
			<el-popover placement="right" width="200" trigger="hover" content="数值越大越靠前。">
				<el-input-number slot="reference" :step="1" :precision="0" :min="0" v-model="form.sortId"/>
			</el-popover>
		</el-form-item>
		<el-form-item label="状态" prop="disabled">
			<el-select v-model="form.disabled">
				<el-option :value="false" label="正常"/>
				<el-option :value="true" label="禁用"/>
			</el-select>
		</el-form-item>
		<el-form-item>
			<slot/>
		</el-form-item>
	</el-form>
</template>

<script>
	import vModelMixins from '../mixins/vModelMixins';
	// import CropperImage from '../widget/CropperImage';
	import {ossType, subMold} from '@/common/apis/oss';
	import UploadAvatar from "@/components/widget/UploadAvatar";
	export default {
		name: 'BrandForm',
		components: {
			// CropperImage,
			UploadAvatar
		},
		mixins: [vModelMixins],
		data() {
			return {
				ossType,
				subMold,
				imgOptions: {
					logo: {
						width: '200px',
						height: '200px',
						options: {
							autoCropWidth: 200,
							autoCropHeight: 200
						}
					}
				},
				rules: {
					name: {
						required: true,
						message: '请输入品牌名称'
					},
					disabled: {
						required: true,
						message: '请选择状态'
					},
					sortId: [
						{required: true, message: '请输入排序ID', trigger: 'blur'},
					]
				}
			};
		},
		methods: {
			onSubmit(e) {
				e.preventDefault();
				if(!this.form.logo){
					this.$message.error('请上传logo')
					return
				}
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.$emit('submit', e);
					}
				});
			}
		}
	};
</script>

<style scoped>
</style>