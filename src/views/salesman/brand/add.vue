<template>
	<div class="shop" v-loading="loading">
		<breadcrumb :options="['商品管理', '品牌管理', '添加品牌']"/>
		<div class="main-container">
			<brand-form v-model="form" @submit="onSubmit">
				<el-button type="primary" native-type="submit">提交</el-button>
			</brand-form>
		</div>
	</div>
</template>

<script>
	import BrandForm from "../../../components/form/BrandForm";
	import brandApi from '../../../common/apis/brand';
	import {mapGetters} from 'vuex';

	export default {
		components: {BrandForm},
		data() {
			return {
				loading: false,
				form: {
					name: undefined,
					logo: undefined,
					sortId: 0,
					disabled: false
				}
			};
		},
		methods: {
			onSubmit() {
				this.loading = true;
				this.form.storeId = this.shop.id;
				brandApi.add(this.form).then(res => {
					this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
						this.$router.push({name: 'salesmanBrand'})
					})
				}).finally(() => this.loading = false);
			}
		},
		computed: {
			...mapGetters(['shop'])
		}
	};
</script>

<style scoped lang="scss">
</style>