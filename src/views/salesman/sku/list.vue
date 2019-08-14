<template>
	<div class="main kd-flex" v-loading="loading">
		<breadcrumb :options="['商品管理','规格列表']"/>
		<div class="container kd-flex-item kd-flex">
			<el-table :data="table.data" border class="kd-flex-item" height="100%">
				<el-table-column prop="specName" label="规格名称" align="center"></el-table-column>
				<el-table-column prop="price" label="售价(元)" align="center">
					<template slot-scope="scope">{{scope.row.price?scope.row.price:'0'}}</template>
				</el-table-column>
				<el-table-column prop="weight" label="重量(g)" align="center">
					<template slot-scope="scope">{{scope.row.weight?scope.row.weight:'0'}}</template>
				</el-table-column>
				<el-table-column prop="wholesalePrice" :label="isStore?'成本价(元)':'批发单价(元)'" align="center">
					<template slot-scope="scope">{{scope.row.wholesalePrice?scope.row.wholesalePrice:'--'}}</template>
				</el-table-column>
				<el-table-column prop="wholesaleUnit" label="批发单位" align="center">
					<template slot-scope="scope">{{scope.row.wholesaleUnit?scope.row.wholesaleUnit:'--'}}</template>
				</el-table-column>
				<el-table-column prop="gs1Code" label="商品国际编码" align="center"></el-table-column>
				<el-table-column prop="stock" label="剩余库存" width="150" align="center">
					<template slot-scope="scope">{{scope.row.stock?scope.row.stock:'0'}}</template>
				</el-table-column>
				<el-table-column fixed="right" v-if="$util.checkPermission('item',['w'])" label="管理" width="80" align="center">
					<template slot-scope="scope">
						<el-button type="text" @click="onEdit(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				background
				@current-change="pageChange"
				style="margin-top: 10px"
				:current-page.sync="query.page"
				:page-size="query.pageSize"
				layout="total, ->, prev, pager, next, jumper"
				:total="table.page.total"
			></el-pagination>
		</div>
		<el-dialog :title="dialog.title" width="700px" center :visible.sync="dialog.show">
			<el-form :model="form" ref="form" class="sku-form" :rules="formRules">
				<el-form-item label="商品名称" label-width="120px">
					<el-input v-model="form.itemName" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="规格名称" label-width="120px">
					<el-input v-model="form.specName" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item prop="price" :label="isGroup?'团购价':'售价'" label-width="120px">
					<el-row :gutter="10">
						<el-col :span="8">
							<el-input type="number" v-model="form.price" ></el-input> 
						</el-col>
						<el-col :span="2">元</el-col>
					</el-row>
				</el-form-item>
				<el-form-item v-if="!isGroup" :label="isStore?'成本价':'批发单价'" label-width="120px">
					<el-row :gutter="10">
						<el-col :span="8">
							<el-input type="number" v-model="form.wholesalePrice" ></el-input> 
						</el-col>
						<el-col :span="2">元</el-col>
					</el-row>
				</el-form-item>
				<!--<el-form-item v-if="!isGroup" label="批发单位" label-width="120px">-->
					<!--<el-row :gutter="10">-->
						<!--<el-col :span="8">-->
							<!--<el-input type="number" v-model="form.wholesaleUnit" ></el-input> -->
						<!--</el-col>-->
						<!--<el-col :span="14">-->
							<!--<small>( 批发的商品数量 )</small>-->
						<!--</el-col>-->
					<!--</el-row>-->
				<!--</el-form-item>-->
				<el-form-item v-if="isGroup" prop="groupLeaderBenefit" label="团长佣金比例" label-width="120px">
					<el-row :gutter="10">
						<el-col :span="3">
							<el-input type="number" v-model="form.groupLeaderBenefit" ></el-input> 
						</el-col>
						<el-col :span="2">%</el-col>
					</el-row>
				</el-form-item>
				<el-form-item prop="weight" label="重量" label-width="120px">
					<!-- <el-input-number :min="0" v-model="form.weight"/> -->
					<el-row :gutter="10">
						<el-col :span="8">
							<el-input type="number" v-model="form.weight" ></el-input>
						</el-col>
						<el-col :span="10"><small>( 单位 : g )</small></el-col>
					</el-row>
				</el-form-item>
				<el-form-item prop label="商品国际编码" label-width="120px">
					<el-input v-model="form.gs1Code"></el-input>
				</el-form-item>
				<el-form-item label="发货平台" label-width="120px">
					<el-radio-group v-model="showPlatForm">
						<el-radio :label="false">赚差价</el-radio>
						<el-radio :label="true">赚返佣</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<el-form
				ref="platform"
				class="plat-container"
				:rules="platform_rules"
				:model="platform"
				v-if="showPlatForm"
				@submit.native.prevent="onSave"
				>
				<input type="submit" style="display:none">
				<el-form-item>
					<el-row :gutter="10" class="plat-item">
						<el-col :span="12">
							<el-form-item label="Lv3(合伙人)的分红比例" prop="lv3.self" label-width="180px">
								<!-- <el-input-number :min="0" :max="100" :precision="2" v-model="platform.lv3.self"/> -->
								<el-input type="number" v-model="platform.lv3.self" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1">%</el-col>
					</el-row>
				</el-form-item>
				<el-form-item>
					<el-row :gutter="10" class="plat-item">
						<el-col :span="12">
							<el-form-item label="Lv2(总监)的分红比例" prop="lv2.self" label-width="180px">
								<!-- <el-input-number :min="0" :max="100" :precision="2" v-model="platform.lv2.self"/> -->
								<el-input type="number" v-model="platform.lv2.self" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1">%</el-col>
						<el-col :span="8">
							<el-form-item label="上级分红比例" prop="lv2.parent" label-width="120px">
								<!-- <el-input-number :min="0" :max="100" :precision="2" v-model="platform.lv2.parent"/> -->
								<el-input type="number" v-model="platform.lv2.parent" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1">%</el-col>
					</el-row>
				</el-form-item>
				<el-form-item>
					<el-row :gutter="10" class="plat-item">
						<el-col :span="12">
							<el-form-item label="Lv1(店主)的分红比例" prop="lv1.self" label-width="180px">
								<!-- <el-input-number :min="0" :max="100" :precision="2" v-model="platform.lv1.self"/> -->
								<el-input type="number" v-model="platform.lv1.self" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1">%</el-col>
						<el-col :span="8">
							<el-form-item label="上级分红比例" prop="lv1.parent" label-width="120px">
								<!-- <el-input-number :min="0" :max="100" :precision="2" v-model="platform.lv1.parent"/> -->
								<el-input type="number" v-model="platform.lv1.parent" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="1">%</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			<span slot="footer">
				<el-button type="primary" @click="onSave">保存</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<style lang="scss">
	.plat-container,.sku-form {
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
<script>
	import tableDataMixins from '@/components/mixins/tableDataMixins';
	import validator from 'el-form-validator';
	import api from '@/common/apis/goods';
	import {mapGetters} from 'vuex'
	export default {
		name: 'GoodsSku',
		mixins: [tableDataMixins],
		data() {
			return {
				isGroup:false,
				dialog: {
					show: false,
					title: '编辑规格'
				},
				loading: false,
				status: undefined,
				table: {
					data: [],
					page: {
						total: 0
					}
				},
				query: {
					itemId: undefined,
					page: 1,
					pageSize: 20,
					sortOrder: 'id',
					sortBy: 'asc',
					disabled: 0,
					deleted: 0,
					column: 'id,specName, price,itemName,gs1Code,weight,stock,allocConfig,groupLeaderBenefit,wholesaleUnit,wholesalePrice'
				},
				form: {},
				formRules: {
					price: { 
              rules:'required|numeric|min:0',
              validator: validator.verification,
              trigger: 'blur'  
          },
					groupLeaderBenefit: { 
              rules:'required|numeric|min:0',
              validator: validator.verification,
              trigger: 'blur'  
          },
					weight: { 
              rules:'required|numeric|min:0',
              validator: validator.verification,
              trigger: 'blur'  
          }
				},
				platform_rules: {
					'lv3.self': { 
                rules:'required|numeric|min:0|max:100',
                validator: validator.verification,
                trigger: 'blur'  
            },
					'lv2.self': { 
                rules:'required|numeric|min:0|max:100',
                validator: validator.verification,
                trigger: 'blur'  
            },
					'lv2.parent': { 
                rules:'required|numeric|min:0|max:100',
                validator: validator.verification,
                trigger: 'blur'  
            },
					'lv1.self': { 
                rules:'required|numeric|min:0|max:100',
                validator: validator.verification,
                trigger: 'blur'  
            },
					'lv1.parent': { 
                rules:'required|numeric|min:0|max:100',
                validator: validator.verification,
                trigger: 'blur'  
            }
				},
				showPlatForm: false,
				platform: {
					lv1: {
						self: 0,
						parent: 0
					},
					lv2: {
						self: 0,
						parent: 0
					},
					lv3: {
						self: 0
					}
				}
			};
		},
		computed:{
			...mapGetters(['role']),
			isStore(){
				const aStoreRoles = ['5','8','9','10']
				console.log(this.role.id)
				console.log(aStoreRoles.indexOf(this.role.roleID))
				return aStoreRoles.indexOf(this.role.roleID) != -1
			}
		},
		created() {
			this.query.itemId = this.$route.params.id;
			if(this.$route.name=='groupGoodsSku'){
				this.isGroup = true
			}

			// const aStoreRoles = ['5','8','9','10']
			// 	console.log(this.role.roleID)
			// 	console.log(aStoreRoles.indexOf(this.role.roleID))


		},
		mounted() {
			this.getData();
		},

		methods: {
			saveData(){
				this.loading = true;
				const parmas = {
					skuId: this.form.id,
					price: this.$util.formatPrice(this.form.price),
					gs1Code: this.form.gs1Code,
					weight: this.form.weight,
				};
				if(this.isGroup){
					parmas.groupLeaderBenefit = this.form.groupLeaderBenefit
				}else{
					parmas.wholesaleUnit = this.form.wholesaleUnit
					parmas.wholesalePrice = this.form.wholesalePrice
				}
				if (this.showPlatForm) {
					parmas.allocConfig = JSON.stringify(this.platform);
				} else {
					parmas.allocConfig = '{}';
				}
				api.editSku(parmas)
					.then((res) => {
						this.$util.handelHttpResponseResult(res).then((data) => {
							this.$message.success('保存成功');
							this.dialog.show = false;
							this.getData();
						});
					})
					.finally(() => (this.loading = false));
			},
			onSave() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						if(this.showPlatForm){
							this.$refs['platform'].validate((valid2) => {
								if (valid2) {
									this.saveData()
								}
							});
						}else{
							this.saveData()
						}
					}
				});
			},
			pageChange() {
				this.getData();
			},
			onEdit(item) {
				this.dialog.title = '规格编辑';
				this.dialog.show = true;
				if (item.allocConfig == '{}') {
					this.showPlatForm = false;
					this.platform = {
						lv1: {
							self: 0,
							parent: 0
						},
						lv2: {
							self: 0,
							parent: 0
						},
						lv3: {
							self: 0
						}
					};
				} else {
					this.showPlatForm = true;
					this.platform = JSON.parse(item.allocConfig);
				}
				this.form = {...item};
			},
			// 获取数据
			getData() {
				this.loading = true;
				const parmas = this.query;
				api.listSku(parmas)
					.then((res) => {
						this.$util.handelHttpResponseResult(res).then((data) => {
							try {
								let oData = data.data.rows.map((item) => {
									if (!!item.price) {
										item.price = this.$util.priceFormat(item.price);
									}
									// item.allocConfig = JSON.parse(item.allocConfig)
									return item;
								});
								this.table.data = oData;
								this.table.page.total = data.data.rowCount;
							} catch (err) {}
						});
					})
					.finally(() => (this.loading = false));
			}
		}
	};
</script>
