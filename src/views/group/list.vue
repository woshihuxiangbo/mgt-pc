<template>
	<div class="shop-group kd-flex" v-loading="loading">
		<breadcrumb :options="['活动管理', '社区团购', '已上架商品']"/>
		<div class="main-container kd-flex kd-flex-item">
			<el-form inline :model="query" @submit.native.prevent="getData">
				<el-form-item label="商品分类">
					<category-selector v-model="query.categoryId" style="width: 130px"/>
				</el-form-item>
				<el-form-item label="商品名称">
					<el-input v-model="query.itemName"/>
				</el-form-item>
				<el-form-item label="品牌名称">
					<el-input v-model="query.brandName"/>
				</el-form-item>
				<!-- <el-form-item label="厂商名称">
					<el-input v-model="query.producerName"/>
				</el-form-item> -->
				<el-form-item label="状态">
					<el-select style="width: 80px" v-model="status" @change="changeQueryStatus" :value="status">
						<el-option :value="undefined" label="正常"></el-option>
						<el-option :value="1" label="删除"></el-option>
						<el-option :value="2" label="禁用"></el-option>
						<el-option :value="3" label="全部"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="isNew" label="新品:">
					<el-select v-model="query.isNew" style="width: 80px">
						<el-option :value="0" label="全部"></el-option>
						<el-option :value="1" label="是"></el-option>
						<el-option :value="2" label="否"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="isHot" label="热销:">
					<el-select v-model="query.isHot" style="width: 80px">
						<el-option :value="0" label="全部"></el-option>
						<el-option :value="1" label="是"></el-option>
						<el-option :value="2" label="否"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="isHot" label="热销:">
					<el-select v-model="query.isRecommend" style="width: 80px">
						<el-option :value="0" label="全部"></el-option>
						<el-option :value="1" label="是"></el-option>
						<el-option :value="2" label="否"></el-option>
					</el-select>
				</el-form-item>
				<div style="text-align: right">
					<el-form-item>
						<el-button type="primary" native-type="submit">搜索</el-button>
					</el-form-item>
				</div>
			</el-form>
			<el-table :data="table.data" border>
				<el-table-column align="center" label="商品图片"/>
				<el-table-column align="center" label="来源"/>
				<el-table-column align="center" label="分类名称"/>
				<el-table-column align="center" label="商品名称"/>
				<el-table-column align="center" label="市场价格"/>
				<el-table-column align="center" label="库存"/>
				<el-table-column align="center" label="销售次数"/>
				<el-table-column align="center" label="销售金额"/>
				<el-table-column align="center" label="品牌名称"/>
				<el-table-column align="center" label="厂商名称"/>
				<el-table-column align="center" label="状态"/>
				<el-table-column align="center" label="管理"/>
			</el-table>
			<el-pagination background/>
		</div>
	</div>
</template>

<script>
	import tableDataMixins from '@/components/mixins/tableDataMixins';
	import deleteOrDisableConfirmMixins from '@/components/mixins/deleteOrDisableConfirmMixins';
	import CategorySelector from '@/components/selector/CategorySelector';

	export default {
		components: {CategorySelector},
		mixins: [tableDataMixins, deleteOrDisableConfirmMixins],
		data() {
			return {
				loading: false,
				status: undefined,
				query: {
					categoryId: undefined,
					itemName: undefined,
					brandName: undefined,
					// producerName: undefined,
					isNew: undefined,
					isHot: undefined,
					isRecommend: undefined,
					page: 1,
					pageSize: 20,
					sortOrder: 'id',
					sortBy: 'asc',
					disabled: 0,
					deleted: 0,
					column: ''
				}
			};
		},
		methods: {
			getData() {
			}
		},
		mounted() {
			this.getData();
		}
	};
</script>

<style scoped lang="scss">
	.shop-group {
		height: 100%;
	}
</style>