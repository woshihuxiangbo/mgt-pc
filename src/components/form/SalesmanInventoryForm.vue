<template>
	<el-form
		ref="form"
		:rules="rules"
		:model="form"
		label-width="100px"
		@submit.native.prevent="onSubmit"
	>
		<el-form-item label="商品名称" prop="name">
			<el-input v-model="form.name"/>
		</el-form-item>
		<el-form-item label="店铺名称" prop="shopName">
			<el-input v-model="form.shopName"/>
		</el-form-item>
		<el-form-item label="入库数量" prop="total">
			<el-input v-model="form.total"/>
		</el-form-item>
		<el-form-item label="剩余库存" prop="surplus" v-if="form.showSurplus">
			<el-input v-model="form.surplus"/>
		</el-form-item>
		<el-form-item label="单件成本" prop="cost">
			<el-row>
				<el-col :span="4">
					<el-input v-model="form.cost"/>
				</el-col>
				<el-col :span="1" align="center">元</el-col>
			</el-row>
		</el-form-item>
		<el-form-item label="备注说明" prop="desc">
			<el-input type="textarea" v-model="form.desc"/>
		</el-form-item>
		<el-form-item>
			<slot/>
		</el-form-item>
	</el-form>
</template>

<script>
	import vModelMixins from '../mixins/vModelMixins';
	import CropperImage from '../widget/CropperImage';

	export default {
		name: 'SalesmanInventoryForm',
		mixins: [vModelMixins],
		data() {
			return {
				rules: {
					name: {
						required: true,
						message: '请输入品牌名称'
					},
					shopName: {
						required: true,
						message: '请输入品牌名称'
					},
					total: {
						required: true,
						message: '请输入数量'
					},
					cost: {
						required: true,
						message: '请输入数量'
					}
				}
			};
		},
		methods: {
			onSubmit(e) {
				this.$emit('submit', e);
			}
		}
	};
</script>

<style scoped>
</style>