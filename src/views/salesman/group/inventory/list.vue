<template>
	<div class="main kd-flex" v-loading="loading">
		<breadcrumb :options="['商品管理', '库存列表']"/>
		<div class="container kd-flex-item kd-flex">
			<div>
				<p>
					商品名称:
					<small>{{goodsName}}</small>
				</p>
				<p v-if="$util.checkPermission('item',['w'])" class="action">
					<el-button type="primary" @click="onCreate">添加库存</el-button>
				</p>
			</div>
			<div class="action">
				<el-radio-group size="mini" v-model="query.spuId">
					<el-radio-button :label="undefined">全部</el-radio-button>
					<el-radio-button v-for="(item,idx) in spuList" :key="idx" :label="item.id">{{item.spuName}}</el-radio-button>
				</el-radio-group>
			</div>
			<el-table :data="table.data" border class="kd-flex-item" height="100%">
				<el-table-column prop="spuName" label="规格名称" align="center"></el-table-column>
				<el-table-column prop="stockTotal" label="入库总数" align="center"></el-table-column>
				<el-table-column prop="stockRemain" label="剩余库存" align="center"></el-table-column>
				<!-- <el-table-column prop="singleCost" label="单件成本" align="center"></el-table-column> -->
				<el-table-column prop="createTime" label="入库时间" align="center">
					<template slot-scope="scope">{{scope.row.createTime|dateFilter}}</template>
				</el-table-column>

				<el-table-column
					v-if="$util.checkPermission('item',['w'])"
					fixed="right"
					label="管理"
					width="180"
					align="center"
				>
					<template slot-scope="scope">
						<el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
						<el-button type="text" @click="onDelete(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				background
				@current-change="pageChange"
				:current-page.sync="query.page"
				:page-size="query.pageSize"
				layout="total, ->, prev, pager, next, jumper"
				:total="table.page.total"
			></el-pagination>
			<el-dialog :title="dialog.title" :close-on-click-modal="false" :visible.sync="dialog.show">
				<el-form :model="form" ref="form" class="inventory-form" :rules="rules">
					<el-form-item label="商品名称" label-width="80px">
						<el-input v-model="goodsName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="规格名称" prop="spuId" label-width="80px">
						<el-select :disabled="!add" v-model="form.spuId" placeholder="请选择规格">
							<el-option v-for="item in spuList" :key="item.value" :label="item.spuName" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="入库数量" prop="stockTotal" label-width="80px">
						<el-input type="number" v-model="form.stockTotal" placeholder></el-input>
					</el-form-item>
					<!-- <el-form-item label="单件成本" prop="singleCost" label-width="80px">
						<el-row :gutter="5">
							<el-col :span="6">
								<el-input type="number" v-model="form.singleCost" placeholder=""></el-input>
							</el-col>
							<el-col :span="10">元</el-col>
						</el-row>
					</el-form-item>-->
					<el-form-item label="备注说明" label-width="80px">
						<el-input v-model="form.remark" type="textarea"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="onSubmit">保存</el-button>
				</div>
			</el-dialog>
	
		</div>
	</div>
</template>
<style lang="scss">
	.inventory-form {
		.el-input-number__decrease,
		.el-input-number__increase {
			display: none;
		}
		.el-input-number {
			width: auto;
			.el-input__inner {
				padding: 0;
			}
		}
	}
</style>
<style lang="scss" scoped>
	.action {
		margin: 10px 0 20px;
	}
</style>
<script>
	import tableDataMixins from '@/components/mixins/tableDataMixins';
	import api from '@/common/apis/inventory';
	import goodsApi from '@/common/apis/goods';
	import categorySelector from '@/components/selector/CategorySelector';
	import skuApi from '@/common/apis/itemSku';
	import specApi from '@/common/apis/itemSpec';
	import ItemSkuList from '@/components/list/ItemSkuList';
	import validator from 'el-form-validator';
	import {mapGetters} from 'vuex';
	export default {
		name: 'InventoryList',
		components: {
			categorySelector,
			ItemSkuList
		},
		mixins: [tableDataMixins],
		data() {
			return {
				goodsName: '',
				loading: false,
				spuList: [],
				savedData: [],
				table: {
					data: [],
					page: {
						total: 0
					}
				},
				query: {
					spuId:undefined,
					column: 'id,createTime,stockTotal,stockRemain,singleCost,spuName,spuId,remark',
					page: 1,
					pageSize: 20,
					sortOrder: 'id',
					sortBy: 'asc',
					disabled: 0,
					deleted: 0
				},
				goods: {
					name: undefined,
					skuName: undefined,
					specName: undefined
				},
				dialog: {
					show: false,
					title: ''
				},
				add: undefined,
				form: {},
				rules: {
					stockTotal: [
						{
							required: true,
							message: '请输入入库数量',
							trigger: 'blur'
						},
						{
							rules: 'required|numeric|min:0',
							validator: validator.verification,
							trigger: 'blur'
						}
					],
					spuId: {
						required: true,
						message: '请选择规格',
						trigger: 'blur'
					}
				}
			};
		},
		watch: {
			spuId(val) {
				this.getData();
			}
		},
		computed: {
			...mapGetters(['shop']),
			spuId(){
				return this.query.spuId
			}
		},
		created() {
			this.goodsName = this.$route.query.name;
			this.id = this.$route.params.id;
		},
		mounted() {
			this.getData();
			this.getSpuList();
		},

		methods: {
			pageChange() {
				this.getData();
			},
			onEdit(item) {
				this.add = false;
				this.form = {
					id:item.id,
					spuId:item.spuId,
					stockTotal:item.stockTotal,
					remark:item.remark
				};
				this.dialog = {
					show:true,
					title:'编辑库存'
				}
			},
			// 添加
			onCreate() {
				this.add = true;
				this.form = {};
				this.dialog = {
					show:true,
					title:'添加库存'
				}
			},
			onSubmit() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						const parmas = {
							...this.form,
							storeId:this.shop.id
						};
						this.loading = true;
						if (this.add) {
							api.add(parmas)
								.then((res) => {
									this.$util.handelHttpResponseResult(res).then(() => {
										this.dialog.show = false;
										this.$message.success('添加成功');
										this.getData();
									});
								})
								.finally(() => (this.loading = false));
						} else {
							api.edit(parmas)
								.then((res) => {
									this.$util.handelHttpResponseResult(res).then(() => {
										this.dialog.show = false;
										this.$message.success('修改成功');
										this.getData();
									});
								})
								.finally(() => (this.loading = false));
						}
					}
				});
			},
			// 删除
			onDelete(item) {
				this.$util.actionConfirm('是否删除?').then(() => {
					this.loading = true;
					api.deleted({id: item.id})
						.then((res) => {
							this.$util.handelHttpResponseResult(res).then(() => {
								this.getData();
							});
						})
						.finally(() => (this.loading = false));
				});
			},
			getSpuList() {
				const parmas = {
					itemId: this.id,
					storeId: this.shop.id,
					column: 'id,spuName'
				};
				api.getSpu(parmas)
					.then((res) => {
						this.$util.handelHttpResponseResult(res).then((data) => {
							this.spuList = data.data.rows;
						});
					})
					.finally(() => (this.loading = false));
			},
			getData() {
				this.loading=true
				const params = {
					...this.query,
					itemId: this.id,
					storeId: this.shop.id
				};
				api.list(params)
					.then((res) => {
						this.$util.handelHttpResponseResult(res).then((data) => {
							this.table.data = data.data.rows;
							this.table.page.total = data.data.rowCount;
						});
					})
					.finally(() => (this.loading = false));
			}
		}
	};
</script>
