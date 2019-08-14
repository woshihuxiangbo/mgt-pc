<template>
	<el-form
		ref="form"
		:model="form"
		:rules="rules"
		label-width="120px"
		class="form adv-form"
		@submit.native.prevent="onSubmit"
	>
		<el-form-item label="广告名称" prop="name">
			<el-input v-model="form.name"/>
		</el-form-item>
		<el-form-item label="广告说明" prop="note">
			<el-input
				type="textarea"
				:autosize="{ minRows: 2, maxRows: 4}"
				placeholder="请输入内容"
				v-model="form.note"
			></el-input>
		</el-form-item>
		<el-row class="text-center">
			<el-col :span="5">
				<el-form-item label="宽度：" prop="width">
					<el-input type="number" v-model="form.width" ></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="5">
				<el-form-item label="高度：" prop="height">
					<el-input type="number" v-model="form.height" ></el-input>
				</el-form-item>
			</el-col>
		</el-row>
		<el-form-item label="展示图片数量" prop="displayCount">
			<el-input type="number" v-model="form.displayCount" ></el-input>
		</el-form-item>
		<el-form-item label="状态">
			<el-select v-model="form.disabled" placeholder>
				<el-option label="启用" :value="false"></el-option>
				<el-option label="禁用" :value="true"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<slot/>
		</el-form-item>
	</el-form>
</template>

<script>
	import vModelMixins from '../mixins/vModelMixins';

	export default {
		name: 'AdvForm',
		mixins: [vModelMixins],
		data() {
			return {
				rules: {
					name: {
						required: true,
						message: '请输入广告名称'
					},
					note: {
						required: true,
						message: '请输入广告说明'
					},
					width: {required: true, message: '请输入图片宽度'},
					height: {required: true, message: '请输入图片高度'},
					displayCount: {required: true, message: '请输入图片数量'}
				}
			};
		},
		methods: {
			onSubmit(e) {
				e.preventDefault();
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.$emit('submit', e);
					}
				});
			}
		}
	};
</script>
<style scoped lang="scss">
	.text-center {
		text-align: center;
	}
</style>