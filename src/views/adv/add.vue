<template>
	<div class="shop" v-loading="loading">
		<breadcrumb :options="['广告管理', '添加广告']"/>
		<div class="main-container">
			<my-form v-model="form" @submit="onSubmit" ref="form">
				<el-button type="primary" native-type="submit">保存</el-button>
				<el-button @click="()=>this.$router.go(-1)">返回</el-button>
			</my-form>
		</div>
	</div>
</template>

<script>
	import MyForm from '@/components/form/AdvForm';

	import api from '@/common/apis/adv';
	import {mapGetters} from 'vuex'
	export default {
		components: {MyForm},
		data() {
			return {
				loading: false,
				form: {
					name: undefined, //名称
					note: undefined, //说明
					width: undefined,
					height: undefined,
					displayCount: undefined, //显示数量
					disabled: false
				}
			};
		},
		computed:{
			...mapGetters(['shop'])
		},
		methods: {
			onSubmit() {
				this.loading = true;
				let params = Object.assign({
					storeId:this.shop.id
				}, this.form);
				api.add(params)
					.then((res) => {
						this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
							this.$router.push({name: 'advList'});
						});
					})
					.finally(() => (this.loading = false));
			}
		}
	};
</script>

<style scoped lang="scss">
</style>