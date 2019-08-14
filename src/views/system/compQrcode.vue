<template>
    <div class="qrcode kd-page-master kd-flex" v-loading="loading">
        <breadcrumb :options="['防伪码', '防伪码列表']"/>
        <div class="main-container kd-flex kd-flex-item">
            <div v-show="isRunning !== undefined" v-loading="isRunning" v-if="
                    $util.checkRole(['1', '11']) &&
                    $util.checkPermission('securityCode', ['c', 'l'])"
                 :element-loading-text="`当前正在生成 批次:${runBatchId} 的防伪码`"
                 element-loading-spinner="el-icon-loading">
                <br>
                <el-button type="primary" @click="gotoCreateQrcode" v-if="$util.checkPermission('securityCode', ['c'])">
                    生成防伪码
                </el-button>
            </div>
            <br>
            <el-table :data="table.data" border height="100%">
                <el-table-column align="center" prop="id" label="批次ID"/>
                <el-table-column align="center" prop="desc" label="商品名称 规格名称"/>
                <el-table-column align="center" label="生成时间">
                    <template slot-scope="scope">
                        {{scope.row.createTime | dateFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="exportData(scope.row)">导出</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    @current-change="getData"
                    style="margin-top: 10px"
                    :current-page.sync="query.page"
                    :page-size="query.pageSize"
                    layout="total, ->, prev, pager, next, jumper"
                    :total="table.page.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import qrcodeApi from '@/common/apis/qrcode';
    import tableDataMixins from '@/components/mixins/tableDataMixins';

    export default {
        mixins: [tableDataMixins],
        data() {
            return {
                loading: false,
                isRunning: undefined,
                runBatchId: '',
                query: {
                    page: 1,
                    pageSize: 20
                }
            };
        },
        methods: {
            getData() {
                this.loading = false;
                qrcodeApi.batch(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        console.info(data);
                        this.table.data = data.rows;
                        this.table.page.total = data.rowCount;
                    });
                });
            },
            gotoCreateQrcode() {
                this.$router.push({name: 'QrcodeCreate'});
            },
            getRunStatus() {
                qrcodeApi.running().then((res) => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        console.info('batchID:', data.batchID, (data.batchID === ''));
                        this.isRunning = (data.batchID === '' ? false : true);
                        this.runBatchId = data.batchID;
                    }).catch(() => this.isRunning = true);
                }).catch(() => this.isRunning = undefined);
            },
            exportData(item) {
                console.info(item);
                this.loading = true;
                qrcodeApi.exportFile({
                    responseType: 'blob',
                    params: {id: item.id}
                }).then(res => {
                    const content = res.data;
                    const blob = new Blob([content]);
                    const fileName = item.id + '.txt';
                    const eLink = document.createElement('a');
                    if ('download' in eLink) { // 非IE下载
                        eLink.download = fileName;
                        eLink.style.display = 'none';
                        eLink.href = URL.createObjectURL(blob);
                        document.body.appendChild(eLink);
                        eLink.click();
                        URL.revokeObjectURL(eLink.href); // 释放URL 对象
                        document.body.removeChild(eLink);
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName);
                    }
                }).finally(() => this.loading = false);
            }
        },
        mounted() {
            this.getRunStatus();
            this.getData();
        }
    };
</script>
<style lang="scss" scoped>

</style>
