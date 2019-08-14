<template>
	<div class="main kd-flex" v-loading="loading">
		<breadcrumb :options="['商品管理','轮播图列表']"/>
		<div class="container kd-flex-item kd-flex">
			<div class="action" >
				<el-button type="primary" @click="onCreate">上传轮播图</el-button>
			</div>
			<div class="search">
				<el-form :inline="true" :model="query" ref="query">
					<el-form-item label="状态">
						<el-select v-model="status" @change="changeQueryStatus">
							<el-option :value="undefined" label="正常"></el-option>
							<el-option :value="2" label="已禁用"></el-option>
							<el-option :value="3" label="全部"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSearch">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="table.data" border class="kd-flex-item" height="100%">
				<el-table-column prop="picUrl" label="缩略图" width="80" align="center">
					<template slot-scope="scope">
						<img width="50" height="50" :src="scope.row.picUrl|imgSrc" class="img-table" alt>
					</template>
				</el-table-column>
				<el-table-column prop="videoUrl" label="视频地址" align="center">
					<template slot-scope="scope">
						<a :href="scope.row.videoUrl" target="_blank">{{scope.row.videoUrl}}</a>
					</template>
				</el-table-column>
				<el-table-column prop="sortId" label="排序ID" width="150" align="center"></el-table-column>

				<el-table-column label="状态" align="center" width="150">
					<template slot-scope="scope">{{scope.row | statusFilter}}</template>
				</el-table-column>
				<el-table-column  fixed="right" label="管理" width="180" align="center">
					<template slot-scope="scope">
						<el-button type="text"  @click="onEdit(scope.row)">编辑</el-button>
						<el-button
							type="text"
							@click="switchDeleted(scope.row)"
						>{{scope.row.deleteTime ? '恢复' : '删除'}}</el-button>
						<el-button type="text" @click="switchDisabled(scope.row)">{{scope.row.disabled ? '启用' : '禁用'}}</el-button>
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
		<el-dialog width="1050px" :title="dialog.title" center :visible.sync="dialog.show">
			<el-form :model="form" :rules="rules" ref="form">
				<el-form-item label="缩略图" label-width="120px" v-if="dialog.show">
					<upload-avatar
							:oss-type="ossType.item"
							:sub-mod="subMold.slide"
							v-model="form.picUrl"/>
				</el-form-item>
				<el-form-item label="商品名称" label-width="120px">{{goods.name}}</el-form-item>
				<el-form-item label="视频地址" label-width="120px">
					<el-input v-model="form.videoUrl"></el-input>
				</el-form-item>
				<el-form-item label="排序ID" prop="sortId" label-width="120px">
					<el-popover placement="right" width="200" trigger="hover" content="数值越大越靠前。">
						<el-input-number slot="reference" :step="1" :precision="0" :min="0" v-model="form.sortId"/>
					</el-popover>
				</el-form-item>
				<el-form-item label-width="120px">
					<el-button type="primary" @click="onSave">保存</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<style lang="scss" scoped>
	.action {
		margin-bottom: 20px;
	}
</style>
<script>
	import tableDataMixins from '@/components/mixins/tableDataMixins';
	import CropperImage from '@/components/widget/CropperImage';
	import {ossType, subMold} from '@/common/apis/oss';
	import api from '@/common/apis/slider';
	import UploadAvatar from "@/components/widget/UploadAvatar";
	export default {
		name: 'GoodsSlider',
		mixins: [tableDataMixins],
		components: {UploadAvatar, CropperImage},
		data() {
			return {
				ossType,
				subMold,
				dialog: {
					show: false,
					title: '轮播图上传',
					pic: {
						width: '750px',
						height: '750px',
						options: {
							autoCropWidth: 750,
							autoCropHeight: 750
						}
					}
				},
				goods: {},
				form: {},
				loading: false,
				status: undefined,
				table: {
					data: [],
					page: {
						total: 0
					}
				},
				rules: {
					sortId: [
						{required: true, message: '请输入排序ID'}
					]
				},
				query: {
					name: undefined,
					page: 1,
					pageSize: 20,
					sortOrder: 'id',
					sortBy: 'asc',
					disabled: 0,
					deleted: 0,
					itemId: undefined,
					column: 'id,itemId,picUrl,sortId,disabled,createTime,videoUrl'
				},
				query_rules: {}
			};
		},
		created() {
			this.query.itemId = this.$route.params.id;
			this.goods.name = this.$route.query.name;
		},
		mounted() {
			this.getData();
			console.log(this.$data.$imageStaticBaseUrl)
		},

		methods: {
			onSave() {
				if (!this.form.picUrl) {
					this.$message.error('请上传图片');
					return;
				}
				this.$refs['form'].validate((valid) => {
					if (valid) {
						if (this.isAdd) {
							this.form = {...this.form, itemId: this.query.itemId};
							api.add(this.form)
								.then((res) => {
									this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
										this.dialog.show = false;
										this.getData();
									});
								})
								.finally(() => (this.loading = false));
						} else {
							this.form = {...this.form, itemId: this.query.itemId};
							api.edit(this.form)
								.then((res) => {
									this.$util.handelHttpResponseResult(res, true, '创建成功').then(() => {
										this.dialog.show = false;
										this.getData();
									});
								})
								.finally(() => (this.loading = false));
						}
					}
				});
			},
			onSearch() {
				this.getData();
			},
			pageChange() {
				this.getData();
			},
			onEdit(item) {
				this.form = item;
				this.dialog.title = '轮播图编辑';
				this.dialog.show = true;
				this.isAdd = false;
				this.editId = {
					id: item.id,
					itemId: item.itemId
				};
				this.form = {...item};
			},
			// 添加
			onCreate() {
				this.form = {};
				this.dialog.title = '轮播图上传';
				this.dialog.show = true;
				this.isAdd = true;
				this.form = {
					sortId: 0
				};
			},
			// 恢复/删除
			switchDeleted(item) {
				this.$util.actionConfirm('是否' + (item.deleteTime ? '恢复' : '删除')).then(() => {
					this.loading = true;
					api.deleted({id: item.id})
						.then((res) => {
							this.$util.handelHttpResponseResult(res).then(() => {
								this.$message.success('操作成功！');
								this.getData();
							});
						})
						.finally(() => (this.loading = false));
				});
			},
			// 启用/禁用
			switchDisabled(item) {
				this.$util.actionConfirm('是否' + (item.disabled ? '启用' : '禁用')).then(() => {
					this.loading = true;
					api.disabled({id: item.id})
						.then((res) => {
							this.$util.handelHttpResponseResult(res).then(() => {
								this.$message.success('操作成功！');
								this.getData();
							});
						})
						.finally(() => (this.loading = false));
				});
			},
			// 获取数据
			getData() {
				this.loading = true;
				api.list(this.query)
					.then((res) => {
						this.$util.handelHttpResponseResult(res).then((data) => {
							try {
								let oData = data.data.rows.map((item) => {
									if (item.sortId === undefined) {
										item.sortId = 0;
									}
									return item;
								});
								oData.sort((a, b) => b.sortId - a.sortId);
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
