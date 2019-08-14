<template>
	<div class="order-wholesale kd-page-master kd-flex" v-loading="loading">
		<!-- <breadcrumb :options="['订单']"/> -->
		<el-row :gutter="20" class="top">
			<el-col :span="12">待发货订单:100</el-col>
			<el-col :span="12">待办事项:100</el-col>
		</el-row>

		<div class="main-container kd-flex-item kd-flex">
			<div class="search">
				<el-form :model="query" @submit.native.prevent="onSearch" inline>
					<el-form-item label="订单ID">
						<el-input v-model="query.orderId"/>
					</el-form-item>
					<el-form-item label="店铺名称" v-if="role.roleScope !== 2">
						<el-input v-model="query.storeName"/>
					</el-form-item>
					<el-form-item label="用户昵称">
						<el-input v-model="query.userName"/>
					</el-form-item>
					<el-form-item label="状态">
						<order-status-selector v-model="query.status" show-all style="width: 100%"/>
					</el-form-item>
					<el-form-item label="有效时间">
						<el-date-picker
							@change="changeDateRange"
							v-model="time"
							type="daterange"
							range-separator="至"
							value-format="timestamp"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="是否导出">
						<el-select v-model="query.exported" :value="query.exported">
							<el-option :value="undefined" label="全部"/>
							<el-option :value="1" label="已导出"/>
							<el-option :value="2" label="未导出"/>
						</el-select>
					</el-form-item>
					<div class="text-right">
						<span>共 ￥{{$util.priceFormat(totalAmount)}} 交易额 共 {{table.page.total}} 条数据源</span>
						<el-form-item>
							<el-button type="primary" native-type="submit">过滤</el-button>
							<el-button type="success" @click="onExport" :disabled="query.status !== 1">导出</el-button>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<br>
			<el-table
				:data="table.data"
				border
				height="100%"
				class="kd-flex-item"
				fit
				ref="table"
				id="table"
			>
				<el-table-column align="center" label="订单ID" prop="id" width="180px"/>
				<el-table-column align="center" label="店铺名称" prop="storeName" v-if="role.roleScope !== 2"/>
				<!--<el-table-column align="center" label="用户昵称" prop="userName"/>-->
				<el-table-column align="center" label="订单状态" width="80px">
					<template slot-scope="scope">{{getOrderStatus(scope.row.status)}}</template>
				</el-table-column>
				<el-table-column align="center" label="是否导出">
					<template slot-scope="scope">{{scope.row.exported ? '已导出' : '未导出'}}</template>
				</el-table-column>
				<el-table-column align="center" label="商品总数" prop="goodsTotal"/>
				<el-table-column align="center" label="订单总金额" width="100px">
					<template slot-scope="scope">￥ {{$util.priceFormat(scope.row.goodsAmount)}}</template>
				</el-table-column>
				<el-table-column label="收件信息" width="180" align="center">
					<template slot-scope="scope">
						<el-popover trigger="hover" placement="top" v-if="scope.row.receiver">
							<p>收件人: {{ scope.row.receiver.name }}</p>
							<p>
								收件地址:
								{{ scope.row.receiver.province }}
								{{ scope.row.receiver.city }}
								{{ scope.row.receiver.county }}
								{{ scope.row.receiver.details }}
							</p>
							<p>联系电话: {{ scope.row.receiver.mobile }} | {{ scope.row.receiver.tel }}</p>
							<p>邮政编码: {{scope.row.receiver.postcode}}</p>
							<div slot="reference" class="name-wrapper">
								<el-tag size="medium">
									{{ scope.row.receiver.province }}
									{{ scope.row.receiver.city }}
									{{ scope.row.receiver.county }}
								</el-tag>
							</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column align="center" label="物流费用">
					<template slot-scope="scope">{{scope.row.shippingFee ? scope.row.shippingFee : '包邮'}}</template>
				</el-table-column>
				<el-table-column align="center" label="下单时间" width="180px">
					<template slot-scope="scope">{{scope.row.createTime | dateFilter}}</template>
				</el-table-column>
				<el-table-column align="center" label="支付方式" width="100px">
					<template slot-scope="scope">{{scope.row.payMethod === 1 ? '线上支付' : '银行卡支付'}}</template>
				</el-table-column>
				<el-table-column align="center" label="支付渠道 / 转账流水单号" width="200px">
					<template slot-scope="scope">
						<span v-if="scope.row.payMethod === 1">{{scope.row.payChannel === 1 ? '微信' : '支付宝'}}</span>
						<span v-if="scope.row.payMethod === 2">{{scope.row.payOrderId}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="支付手续费" width="100px">
					<template slot-scope="scope">￥{{$util.priceFormat(scope.row.poundage)}}</template>
				</el-table-column>
				<el-table-column align="center" label="支付时间" width="180px">
					<template slot-scope="scope">{{scope.row.payTime | dateFilter}}</template>
				</el-table-column>
				<el-table-column align="center" label="发货时间" width="180px">
					<template slot-scope="scope">{{scope.row.sendTime | dateFilter}}</template>
				</el-table-column>
				<el-table-column align="center" label="完成时间" width="180px">
					<template slot-scope="scope">{{scope.row.finishTime | dateFilter}}</template>
				</el-table-column>
				<el-table-column align="center" label="管理" fixed="right" width="250px">
					<template slot-scope="scope">
						<el-button type="text" @click="showGoods(scope.row)">商品</el-button>
						<el-button
							type="text"
							v-if="
                                    scope.row.status >= 1 && scope.row.status < 10 &&
                                    $util.checkRole(['1','4','6','11'])"
							@click="showExpress(scope.row)"
						>物流</el-button>
						<el-button
							type="text"
							v-if="
                                   scope.row.status === 2 &&$util.checkPermission('wholesaleOrder',['w'])"
							@click="confirmExpress(scope.row)"
						>确认收货</el-button>
						<el-button
							type="text"
							v-if="
                                   scope.row.payMethod === 2 &&
                                   !scope.row.status &&
                                   $util.checkPermission('wholesaleOrder',['w'])"
							@click="confirmPay(scope.row)"
						>确认支付</el-button>
						<el-button
							type="text"
							@click="refundOrderApply(scope.row)"
							v-if="[1,3].indexOf(scope.row.status) !== -1&&$util.checkPermission('wholesaleOrder',['w'])"
						>申请退款</el-button>
						<el-button
							type="text"
							@click="refundOrderAgree(scope.row)"
							v-if="scope.row.status === 6&&$util.checkPermission('wholesaleOrder',['w'])"
						>同意退款</el-button>
						<el-button
							type="text"
							@click="refundOrderConfirm(scope.row)"
							v-if="scope.row.status === 7&&$util.checkPermission('wholesaleOrder',['w'])"
						>完成退款</el-button>
						<!-- <el-button type="text" @click="closeOrder(scope.row)">关闭</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				background
				@current-change="onSearch"
				style="margin-top: 10px"
				:current-page.sync="query.page"
				:page-size="query.pageSize"
				layout="total, ->, prev, pager, next, jumper"
				:total="table.page.total"
			></el-pagination>
		</div>
		<el-dialog title="订单商品信息" :visible.sync="dialog.status.goods" width="50%">
			<div class="dialog-goods">
				<div class="order-info">
					<span>订单ID</span>
					<span>{{dialog.data.goods.id}}</span>
				</div>
				<div class="order-info">
					<span>店铺名称</span>
					<span>{{dialog.data.goods.storeName}}</span>
				</div>
				<div class="order-info">
					<span>订单状态</span>
					<span>{{getOrderStatus(dialog.data.goods.status)}}</span>
				</div>
				<h5 class="title">商品列表</h5>
				<div class="goods-list">
					<div class="goods-item" v-for="(item, i) in dialog.data.items" :key="i">
						<img :src="item.thumbnail|imgSrc" alt>
						<div class="goods-name">
							<p>{{item.itemName}}</p>
							<p>{{item.spuName}}</p>
							<p>单件售价 ￥{{$util.priceFormat(item.singlePrice)}}</p>
						</div>
						<div class="goods-number">
							<p>购买数量 x{{item.count}}</p>
							<p>总售价 ￥{{$util.priceFormat(item.totalPrice)}}</p>
						</div>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialog.status.goods = false">关 闭</el-button>
			</div>
		</el-dialog>
		<el-dialog title="物流详情" :visible.sync="dialog.status.express" width="50%">
			<div>
				<div class="order-info">
					<span>订单ID</span>
					<span>{{dialog.data.express.id}}</span>
				</div>
				<div class="order-info">
					<span>店铺名称</span>
					<span>{{dialog.data.express.storeName}}</span>
				</div>
				<div class="order-info">
					<span>订单状态</span>
					<span>{{getOrderStatus(dialog.data.express.status)}}</span>
				</div>
			</div>
			<div class="add-express-info">
				<h2 class="title">物流信息</h2>
				<el-button
					type="primary"
					v-if="$util.checkPermission('wholesaleOrder',['w'])"
					@click="showAddExpress"
				>添加物流信息</el-button>
			</div>
			<div class="express-list">
				<div class="express-list-item" v-for="(l, i) in dialog.data.expressList" :key="i">
					<div class="info-list">
						<span>物流公司</span>
						<span>{{l.expressCode}}</span>
					</div>
					<div class="info-list">
						<span>物流单号</span>
						<span>{{l.expressId}}</span>
					</div>
					<div class="info-list">
						<span>发货时间</span>
						<span>{{l.sendTime | dateFilter}}</span>
					</div>
					<div class="info-list">
						<span>快递成本</span>
						<span>{{$util.priceFormat(l.amount)}}元</span>
					</div>
					<div class="info-list" style="display: none">
						<span>物流状态</span>
						<div>
							<p>年-月-日 时:分:秒 上海分拨中心/装件入车扫描</p>
							<p>年-月-日 时:分:秒 上海分拨中心/下车扫描</p>
						</div>
					</div>
					<el-button
						v-if="$util.checkPermission('wholesaleOrder',['w'])"
						type="text"
						@click="deleteExpress(l)"
						class="del-btn"
					>删除</el-button>
				</div>
			</div>
			<el-dialog width="40%" title="添加快递" :visible.sync="dialog.status.expressForm" append-to-body>
				<el-form label-width="80px" @submit.native.prevent="addExpress">
					<el-form-item label="物流公司">
						<el-select
							v-model="dialog.data.expressForm.expressCode"
							filterable
							:value="dialog.data.expressForm.expressCode"
						>
							<el-option v-for="(item ,i) in company" :key="i" :value="item.code" :label="item.name"/>
						</el-select>
					</el-form-item>
					<el-form-item label="快递单号">
						<el-input v-model="dialog.data.expressForm.expressId"/>
					</el-form-item>
					<el-form-item label="快递价格">
						<el-input v-model="dialog.data.expressForm.amount"/>
					</el-form-item>
					<el-form-item label="联系电话">
						<el-input v-model="dialog.data.expressForm.mobile"/>
					</el-form-item>
					<el-form-item>
						<el-button
							type="primary"
							v-if="$util.checkPermission('wholesaleOrder',['w'])"
							native-type="submit"
						>添加</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</el-dialog>
		<el-dialog title="通知" width="400px" :visible.sync="dialog.status.refund">
			<div>是否同意退款?</div>
			<div slot="footer">
				<el-button @click="dialog.status.refund = false">关闭</el-button>
				<el-button type="primary" @click="onAgree(false)">拒绝</el-button>
				<el-button type="success" @click="onAgree(true)">同意</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import tableDataMixins from '../../components/mixins/tableDataMixins';
	import OrderStatusSelector from '../../components/selector/OrderStatusSelector';
	import orderApi from '@/common/apis/restockOrder';
	import {mapGetters} from 'vuex';
	import refundOrderApi from '@/common/apis/refundOrder';
	import expressApi from '@/common/apis/express';

	export default {
		components: {OrderStatusSelector},
		mixins: [tableDataMixins],
		data() {
			return {
				loading: false,
				time: undefined,
				query: {
					orderId: undefined,
					storeName: undefined,
					status: undefined,
					userName: undefined,
					startTime: undefined,
					endTime: undefined,
					exported: undefined,
					page: 1,
					pageSize: 20,
					column:
						'id,status,goodsAmount,goodsTotal,shippingFee,createTime,payMethod,payChannel,payTime,sendTime,finishTime,shippingAmount,storeName,receiver,exported,payOrderId,poundage'
				},
				dialog: {
					status: {
						goods: false,
						express: false,
						expressForm: false,
						refund: false
					},
					data: {
						goods: {},
						items: [],
						express: {},
						expressList: [],
						expressForm: {
							orderId: undefined,
							expressCode: undefined,
							expressId: undefined,
							amount: 0,
							method: 0,
							mobile: ''
						},
						refund: {}
					}
				},
				exportQuery: {},
				exportData: [],
				company: [],
				totalAmount: 0
			};
		},
		methods: {
			getData() {
				this.loading = true;
				this.query.storeId = this.shop.id;
				orderApi
					.list(this.query)
					.then((res) => {
						this.$util.handelHttpResponseResult(res, false).then(({data}) => {
							this.table.data = data.rows;
							this.table.page.total = data.rowCount;
							this.totalAmount = data.totalAmount;
						});
					})
					.finally(() => (this.loading = false));
			},
			onSearch() {
				this.getData();
			},
			closeOrder(item) {
				this.$prompt('', '基本信息', {
					confirmButtonText: '确认关闭订单',
					cancelButtonText: '取消',
					dangerouslyUseHTMLString: true,
					inputValidator: (val) => {
						return !!val;
					},
					inputErrorMessage: '不能为空',
					message:
						'<p>订单ID ' +
						item.orderId +
						'</p>' +
						'<p>店铺名称 ' +
						item.storeName +
						'</p>' +
						'<p>订单ID ' +
						this.getOrderStatus(item.status) +
						'</p>' +
						'<h3>关闭原因</h3>'
				}).then(({value}) => {
					// TODO
				});
			},
			showGoods(order) {
				this.loading = true;
				let column = 'id,itemName,spuName,thumbnail,singlePrice,totalPrice,count';
				orderApi
					.itemList({orderId: order.id, column})
					.then((res) => {
						this.$util.handelHttpResponseResult(res, false).then(({data}) => {
							console.info(data);
							this.dialog.status.goods = true;
							this.dialog.data.goods = order;
							this.dialog.data.items = data;
						});
					})
					.finally(() => (this.loading = false));
			},
			showExpress(order) {
				this.loading = true;
				let column = 'id,orderId,expressCode,expressId,amount,sendTime';
				orderApi
					.expressList({orderId: order.id, column})
					.then((res) => {
						this.$util.handelHttpResponseResult(res, false).then(({data}) => {
							this.dialog.status.express = true;
							this.dialog.data.express = order;
							this.dialog.data.expressForm.orderId = order.id;
							if (data !== null) {
								this.dialog.data.expressList = data;
							} else {
								this.dialog.data.expressList = [];
							}
						});
					})
					.finally(() => (this.loading = false));
			},
			showAddExpress() {
				this.dialog.status.expressForm = true;
			},
			addExpress() {
				this.loading = true;
				orderApi
					.expressAdd(this.dialog.data.expressForm)
					.then((res) => {
						this.$util.handelHttpResponseResult(res, true, '添加成功').then(() => {
							this.dialog.status.expressForm = false;
							this.showExpress(this.dialog.data.express);
						});
					})
					.finally(() => (this.loading = false));
			},
			deleteExpress(express) {
				this.loading = true;
				orderApi.expressDelete({expressId: express.id}).then((res) => {
					this.$util.handelHttpResponseResult(res).then(() => {
						this.showExpress(this.dialog.data.express);
					});
				});
			},
			confirmExpress(order) {
				this.$util.actionConfirm(`是否确认收货?`).then(() => {
					this.loading = true;
					orderApi
						.expressConfirm({orderId: order.id})
						.then((res) => {
							this.$util.handelHttpResponseResult(res).then(() => {
								this.getData();
							});
						})
						.finally(() => (this.loading = false));
				});
			},
			confirmPay(order) {
				if (order.payMethod === 2) {
					this.$prompt('请输入转账流水单号', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						inputValidator: (val) => {
							return !!val;
						},
						inputErrorMessage: '必须输入'
					}).then(({value}) => {
						this.requestPayConfirm({orderId: order.id, payOrderId: value});
					});
					return;
				}
				this.$util.actionConfirm(`是否确认支付?`).then(() => {
					this.requestPayConfirm({orderId: order.id});
				});
			},
			requestPayConfirm(params) {
				this.loading = true;
				orderApi
					.payConfirm(params)
					.then((res) => {
						this.$util.handelHttpResponseResult(res).then(() => {
							this.getData();
						});
					})
					.finally(() => (this.loading = false));
			},
			getOrderStatus(v) {
				switch (v) {
					case 0:
						return '待付款';
					case 1:
						return '待发货';
					case 2:
						return '已发货';
					case 3:
						return '已收货';
					case 5:
						return '已关闭';
					case 6:
						return '申请退款';
					case 7:
						return '同意退款';
					case 8:
						return '退款完成';
					case 9:
						return '拒绝退款';
					case 10:
						return '订单完成';
					default:
						return '待付款';
				}
			},
			onExport() {
				this.exportData = [];
				this.exportQuery = Object.assign({}, this.query);
				this.getExportData();
			},
			formatCsvData(data) {
				let list = [];
				data.forEach((orderData) => {
					let order = orderData.order;
					let items = orderData.items;
					let index = 0;
					items.forEach((item) => {
						if (index === 0) {
							list.push({
								id: order.id + '\t',
								storeName: order.storeName,
								status: this.getOrderStatus(order.status),
								goodsTotal: order.goodsTotal,
								goodsAmount: this.$util.priceFormat(order.goodsAmount),
								itemName: item.itemName,
								specName: item.specName,
								count: item.count
							});
						} else {
							list.push({
								id: order.id + '\t',
								storeName: '',
								status: '',
								goodsTotal: '',
								goodsAmount: '',
								itemName: item.itemName,
								specName: item.specName,
								count: item.count
							});
						}
						index++;
					});
				});
				return list;
			},
			getExportData() {
				this.loading = true;
				orderApi
					.exported(this.query)
					.then((res) => {
						this.$util.handelHttpResponseResult(res, false).then(({data}) => {
							if (data.rowCount <= 0) {
								return this.$message.warning('没有数据可以被导出');
							}
							this.$util.exportCsv(
								{
									title: ['订单id', '店铺昵称', '订单状态', '商品总数', '订单总金额', '商品名称', '商品规格', '购买数量'],
									titleForKey: ['id', 'storeName', 'status', 'goodsTotal', 'goodsAmount', 'itemName', 'specName', 'count'],
									data: this.formatCsvData(data.rows)
								},
								'order-' + new Date().format('yyyy-MM-dd HH:mm:ss') + '.csv'
							);
							this.getData();
						});
					})
					.finally(() => (this.loading = false));
			},
			refundOrderApply(order) {
				this.$prompt('请输入退款原因', '是否确认退款', {
					confirmButtonText: '申请退款',
					cancelButtonText: '关闭'
				}).then(({value}) => {
					this.loading = true;
					refundOrderApi
						.apply({orderId: order.id, reason: value})
						.then((res) => {
							this.$util.handelHttpResponseResult(res, true, '申请成功').then(() => {
								this.getData();
							});
						})
						.finally(() => (this.loading = false));
				});
			},
			refundOrderAgree(order) {
				this.dialog.status.refund = true;
				this.dialog.data.refund = order;
			},
			onAgree(status) {
				this.dialog.status.refund = false;
				this.loading = true;
				refundOrderApi
					.agree({orderId: this.dialog.data.refund.id, agree: status})
					.then((res) => {
						this.$util.handelHttpResponseResult(res, true, '操作成功').then(() => {
							this.getData();
						});
					})
					.finally(() => (this.loading = false));
			},
			refundOrderConfirm(order) {
				this.$confirm('确认收到货物并退款？', '是否完成退款', {}).then(() => {
					this.loading = true;
					refundOrderApi
						.confirm({orderId: order.id})
						.then((res) => {
							this.$util.handelHttpResponseResult(res, true, '申请成功').then(() => {
								this.getData();
							});
						})
						.finally(() => (this.loading = false));
				});
			},
			getExpressCompany() {
				expressApi.expressCompany().then((res) => {
					this.$util.handelHttpResponseResult(res, false).then(({data}) => {
						this.company = data;
					});
				});
			}
		},
		filters: {},
		mounted() {
			this.getData();
			this.getExpressCompany();
		},
		computed: {
			...mapGetters({shop: 'shop', role: 'role'})
		}
	};
</script>

<style scoped lang="scss">
	.top {
    margin: 10px;
	}
	.order-wholesale {
		.title {
			line-height: 50px;
			font-size: 20px;
			font-weight: 400;
		}

		.order-info {
			text-align: left;
			line-height: 25px;

			span {
				display: inline-block;
				padding-right: 10px;

				&:first-child {
					width: 80px;
					text-align: right;
				}
			}
		}

		.dialog-goods {
			.goods-list {
				display: flex;
				flex-direction: column;
				max-height: 500px;
				overflow-y: auto;

				.goods-item {
					display: flex;
					border-bottom: 1px solid #909399;
					padding: 0 0 10px 0;

					&:last-child {
						padding-bottom: 0;
						border-bottom: none;
					}

					img {
						flex: 0 0 80px;
						height: 80px;
						background-color: #909399;
						margin-right: 10px;
					}

					.goods-name {
						flex: 1;

						p {
							line-height: 20px;

							&:last-child {
								padding-top: 20px;
							}
						}
					}

					.goods-number {
						flex: 0 0 120px;
						text-align: right;

						p {
							line-height: 40px;
						}
					}
				}
			}
		}

		.express-list {
			max-height: 500px;
			overflow-y: auto;

			.express-list-item {
				border-bottom: 1px solid #e3e3e3;
				padding-bottom: 10px;
				position: relative;

				&:last-child {
					padding-bottom: 0;
					border-bottom: none;
				}

				.info-list {
					line-height: 25px;
					display: flex;

					span:first-child {
						display: inline-block;
						padding-right: 10px;
					}
				}

				.del-btn {
					position: absolute;
					right: 10px;
					top: 10px;
				}
			}
		}
	}

	.text-right {
		position: relative;

		> span {
			position: absolute;
			bottom: 0;
			left: 0;
			line-height: 40px;
		}
	}
</style>